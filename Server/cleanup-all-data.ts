import { PrismaClient } from '@prisma/client';

declare const process: any;

const prisma = new PrismaClient();

async function cleanupAllDataExceptAuth() {
    console.log('🧹 Starting cleanup of all data except authentication info...');
    
    try {
        // Delete in order to respect foreign key constraints
        
        // 1. Delete submissions (depends on problems and users)
        console.log('🗑️ Deleting submissions...');
        const deletedSubmissions = await prisma.submission.deleteMany({});
        console.log(`✅ Deleted ${deletedSubmissions.count} submissions`);
        
        // 2. Delete contest participations (depends on users)
        console.log('🗑️ Deleting contest participations...');
        const deletedContests = await prisma.contestParticipation.deleteMany({});
        console.log(`✅ Deleted ${deletedContests.count} contest participations`);
        
        // 3. Delete problems (independent table)
        console.log('🗑️ Deleting problems...');
        const deletedProblems = await prisma.problem.deleteMany({});
        console.log(`✅ Deleted ${deletedProblems.count} problems`);
        
        // 4. Delete platform profiles (depends on users but not critical auth data)
        console.log('🗑️ Deleting platform profiles...');
        const deletedProfiles = await prisma.platformProfile.deleteMany({});
        console.log(`✅ Deleted ${deletedProfiles.count} platform profiles`);
        
        console.log('🎉 Cleanup completed successfully!');
        console.log('📊 Preserved authentication data (users table)');
        
        // Show remaining data
        const remainingUsers = await prisma.user.count();
        console.log(`👤 Remaining users: ${remainingUsers}`);
        
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the cleanup
cleanupAllDataExceptAuth()
    .then(() => {
        console.log('✅ Cleanup script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Cleanup script failed:', error);
        process.exit(1);
    });

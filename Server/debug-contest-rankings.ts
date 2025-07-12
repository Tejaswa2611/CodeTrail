import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugContestRankings() {
    try {
        console.log('🔍 Debugging contest rankings data...');

        // Check contest participations in database
        const contestParticipations = await prisma.contestParticipation.findMany({
            orderBy: { timestamp: 'desc' },
        });

        console.log(`\n📊 Found ${contestParticipations.length} contest participations:`);
        
        contestParticipations.forEach((contest, index) => {
            console.log(`${index + 1}. ${contest.platform} - Contest: ${contest.contestId}`);
            console.log(`   Rank: ${contest.rank}, Rating: ${contest.oldRating} → ${contest.newRating}`);
            console.log(`   Date: ${contest.timestamp}, Handle: ${contest.handle}`);
            console.log('');
        });

        // Check platform profiles for current ratings
        const platformProfiles = await prisma.platformProfile.findMany();
        
        console.log(`\n📋 Platform Profiles:`);
        platformProfiles.forEach(profile => {
            console.log(`${profile.platform}: ${profile.handle}`);
            console.log(`  Current Rating: ${profile.currentRating}`);
            console.log(`  Max Rating: ${profile.maxRating}`);
            console.log(`  Rank: ${profile.rank}`);
            console.log('');
        });

        // Simulate what calculateContestRankings would return
        const validParticipations = contestParticipations.filter(p => p.rank && p.rank > 0);
        const leetcodeParticipations = validParticipations.filter(p => p.platform === 'leetcode');
        const codeforcesParticipations = validParticipations.filter(p => p.platform === 'codeforces');

        console.log(`\n📈 Contest Rankings Calculation:`);
        console.log(`Valid participations: ${validParticipations.length}`);
        console.log(`LeetCode contests: ${leetcodeParticipations.length}`);
        console.log(`Codeforces contests: ${codeforcesParticipations.length}`);

        const latestLeetcode = leetcodeParticipations[0];
        const latestCodeforces = codeforcesParticipations[0];

        console.log(`\n🏆 Latest Contest Results:`);
        if (latestLeetcode) {
            console.log(`LeetCode: Rank ${latestLeetcode.rank} in ${latestLeetcode.contestId}`);
        } else {
            console.log(`LeetCode: No contest participations found`);
        }

        if (latestCodeforces) {
            console.log(`Codeforces: Rank ${latestCodeforces.rank}, Rating ${latestCodeforces.oldRating} → ${latestCodeforces.newRating}`);
        } else {
            console.log(`Codeforces: No contest participations found`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugContestRankings();

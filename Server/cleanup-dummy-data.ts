import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDummyData() {
    console.log('🧹 Starting cleanup of dummy data...\n');

    try {
        // 1. Delete submissions related to sample problems
        console.log('1. Deleting sample submissions...');
        const deletedSubmissions = await prisma.submission.deleteMany({
            where: {
                OR: [
                    {
                        problem: {
                            externalId: {
                                contains: 'sample'
                            }
                        }
                    },
                    {
                        problem: {
                            name: {
                                in: [
                                    'Two Sum',
                                    'Add Two Numbers', 
                                    'Longest Substring Without Repeating Characters',
                                    'Median of Two Sorted Arrays',
                                    'Longest Palindromic Substring'
                                ]
                            }
                        }
                    }
                ]
            }
        });
        console.log(`✅ Deleted ${deletedSubmissions.count} sample submissions`);

        // 2. Delete sample contest participations
        console.log('\n2. Deleting sample contest participations...');
        const deletedContests = await prisma.contestParticipation.deleteMany({
            where: {
                contestId: {
                    contains: 'contest-'
                }
            }
        });
        console.log(`✅ Deleted ${deletedContests.count} sample contest participations`);

        // 3. Delete sample problems
        console.log('\n3. Deleting sample problems...');
        const deletedProblems = await prisma.problem.deleteMany({
            where: {
                OR: [
                    {
                        externalId: {
                            contains: 'sample'
                        }
                    },
                    {
                        name: {
                            in: [
                                'Two Sum',
                                'Add Two Numbers', 
                                'Longest Substring Without Repeating Characters',
                                'Median of Two Sorted Arrays',
                                'Longest Palindromic Substring'
                            ]
                        }
                    },
                    {
                        externalId: {
                            startsWith: 'leetcode-sample-'
                        }
                    },
                    {
                        externalId: {
                            startsWith: 'codeforces-sample-'
                        }
                    }
                ]
            }
        });
        console.log(`✅ Deleted ${deletedProblems.count} sample problems`);

        // 4. Show remaining data counts
        console.log('\n4. Remaining data summary:');
        const userCount = await prisma.user.count();
        const profileCount = await prisma.platformProfile.count();
        const problemCount = await prisma.problem.count();
        const submissionCount = await prisma.submission.count();
        const contestCount = await prisma.contestParticipation.count();

        console.log(`👥 Users: ${userCount}`);
        console.log(`🔗 Platform Profiles: ${profileCount}`);
        console.log(`📝 Problems: ${problemCount}`);
        console.log(`📊 Submissions: ${submissionCount}`);
        console.log(`🏆 Contest Participations: ${contestCount}`);

        console.log('\n✅ Cleanup completed successfully!');

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupDummyData().catch(console.error);

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testQueries() {
  console.log('🔍 Testing database queries...\n');

  try {
    // 1. Get all users with their platform profiles
    console.log('1. Users with Platform Profiles:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        platformProfiles: {
          select: {
            platform: true,
            handle: true,
            currentRating: true,
            maxRating: true,
            rank: true,
          },
        },
      },
    });
    
    users.forEach(user => {
      console.log(`📧 ${user.email} (${user.firstName} ${user.lastName})`);
      user.platformProfiles.forEach(profile => {
        console.log(`   🔗 ${profile.platform}: ${profile.handle} | Rating: ${profile.currentRating || 'N/A'} | Rank: ${profile.rank || 'N/A'}`);
      });
      console.log('');
    });

    // 2. Get submission statistics
    console.log('2. Submission Statistics:');
    const submissionStats = await prisma.submission.groupBy({
      by: ['platform', 'verdict'],
      _count: {
        id: true,
      },
    });
    
    submissionStats.forEach(stat => {
      console.log(`📊 ${stat.platform} - ${stat.verdict}: ${stat._count.id} submissions`);
    });
    console.log('');

    // 3. Get problems by platform
    console.log('3. Problems by Platform:');
    const problems = await prisma.problem.findMany({
      select: {
        platform: true,
        name: true,
        difficulty: true,
        rating: true,
        tags: true,
      },
      orderBy: [
        { platform: 'asc' },
        { rating: 'asc' },
      ],
    });
    
    let currentPlatform = '';
    problems.forEach(problem => {
      if (problem.platform !== currentPlatform) {
        currentPlatform = problem.platform;
        console.log(`\n🏢 ${currentPlatform.toUpperCase()}:`);
      }
      console.log(`   📝 ${problem.name} | ${problem.difficulty} | Rating: ${problem.rating || 'N/A'} | Tags: ${problem.tags.join(', ')}`);
    });
    console.log('');

    // 4. Get contest participation
    console.log('4. Contest Participation:');
    const participations = await prisma.contestParticipation.findMany({
      select: {
        platform: true,
        handle: true,
        contestId: true,
        rank: true,
        oldRating: true,
        newRating: true,
        user: {
          select: {
            firstName: true,
          },
        },
      },
    });
    
    participations.forEach(p => {
      const ratingChange = p.newRating && p.oldRating ? p.newRating - p.oldRating : 0;
      const changeIcon = ratingChange > 0 ? '📈' : ratingChange < 0 ? '📉' : '➖';
      console.log(`🏆 ${p.user.firstName} | ${p.platform} | Contest: ${p.contestId} | Rank: ${p.rank} | Rating: ${p.oldRating} → ${p.newRating} ${changeIcon}`);
    });

    console.log('\n✅ All queries executed successfully!');

  } catch (error) {
    console.error('❌ Error executing queries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQueries();

const { orchestrateTrackGeneration, classifyDomain } = require('./orchestrator');

async function testAllDomains() {
  console.log('🧪 Starting Multi-Agent Architecture Test...');

  const testCases = [
    { title: 'חקר אסטרונומיה ומערכת השמש', expectedDomain: 'science' },
    { title: 'הקמת סטארטאפ פינטק ותוכנית עסקית', expectedDomain: 'business' },
    { title: 'עיצוב אפליקציית מובייל ומיתוג מותג', expectedDomain: 'design' },
    { title: 'פיתוח בוט AI ב-Python', expectedDomain: 'software' },
    { title: 'בניית זרוע רובוטית עם ג\'ויסטיק', expectedDomain: 'robotics' },
    { title: 'אמנות הדיבייט והרטוריקה הציבורית', expectedDomain: 'polymath' }
  ];

  for (const tc of testCases) {
    const domain = classifyDomain({ title: tc.title });
    console.log(`Checking "${tc.title}": Classified as "${domain}" (Expected: "${tc.expectedDomain}") -> ${domain === tc.expectedDomain ? '✅ PASS' : '❌ FAIL'}`);

    const track = await orchestrateTrackGeneration({
      title: tc.title,
      domain: domain
    });

    console.log(`  -> Generated Track Title: "${track.title}"`);
    console.log(`  -> Domain: ${track.domain}, Icon: ${track.icon}`);
    console.log(`  -> Badges: ${JSON.stringify(track.badges)}`);
    console.log(`  -> Chapters Count: ${track.chapters?.length}`);
    console.log(`  -> First Lesson Title: "${track.chapters?.[0]?.lessons?.[0]?.title}"`);
    console.log(`  -> Flags: Assembly=${track.chapters?.[0]?.lessons?.[0]?.isAssemblyStep}, Experiment=${track.chapters?.[0]?.lessons?.[0]?.isExperimentStep}, Business=${track.chapters?.[0]?.lessons?.[0]?.isBusinessMission}, Design=${track.chapters?.[0]?.lessons?.[0]?.isDesignChallenge}`);
    console.log('--------------------------------------------------');
  }

  console.log('🎉 All Multi-Agent Domain Tests Completed Successfully!');
}

testAllDomains().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

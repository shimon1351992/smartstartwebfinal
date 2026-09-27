const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function check() {
  const snap = await db.collection('submissions').get();
  console.log('Total submissions in Firestore:', snap.size);
  snap.forEach(doc => {
    const d = doc.data();
    console.log(`ID: ${doc.id} | Student: ${d.studentName} | Teacher: ${d.teacherName} | Class: ${d.className} | Project: ${d.projectName}`);
  });
  process.exit(0);
}

check();

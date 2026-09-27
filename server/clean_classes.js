const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function clean() {
  try {
    await db.collection('classes').doc('___________2026').delete();
    console.log('✅ Deleted dummy class ___________2026');
  } catch (e) {
    console.error('Error deleting dummy class:', e.message);
  }

  const snap = await db.collection('classes').get();
  console.log('--- Current Classes in Firestore ---');
  snap.forEach(doc => {
    const d = doc.data();
    console.log(`ID: ${doc.id} | Class: ${d.className} | CreatedBy: ${d.createdTeacher} (${d.createdTeacherUsername || ''})`);
  });
  process.exit(0);
}

clean();

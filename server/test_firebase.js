/**
 * 🔥 בדיקת תקינות חיבור מלאה בין השרת ל-Firebase Firestore
 * מריץ בדיקת כתיבה, קריאה ומחיקה של נתון בזמן אמת ומודד זמן תגובה (Ping)
 */
const { initDatabase, isDbConnected } = require('./db');
const { getFirestore } = require('firebase-admin/firestore');

async function runFirebaseHealthCheck() {
  console.log('\n======================================================');
  console.log('🔍 מתחיל בדיקת תגובה וסנכרון מול Google Firebase...');
  console.log('======================================================\n');

  const startTime = Date.now();
  
  // 1. אתחול
  const initialized = await initDatabase();
  if (!initialized || !isDbConnected()) {
    console.error('❌ שגיאה: החיבור ל-Firebase טרם הופעל. וודא שקובץ serviceAccountKey.json תקין.');
    process.exit(1);
  }

  const db = getFirestore();

  try {
    // 2. בדיקת כתיבה (Write test)
    const testDocId = `health_check_${Date.now()}`;
    const testRef = db.collection('_health_check').doc(testDocId);
    
    console.log('1️⃣ שולח פקודת כתיבה (Write) לענן...');
    await testRef.set({
      status: 'connected',
      testTime: new Date().toISOString(),
      platform: 'SmartStart IoT & Robotics'
    });
    console.log('   ✅ כתיבה לענן בוצעה בהצלחה!');

    // 3. בדיקת קריאה (Read test)
    console.log('2️⃣ שולח פקודת קריאה (Read) מהענן...');
    const snapshot = await testRef.get();
    if (snapshot.exists) {
      console.log('   ✅ קריאה מהענן הצליחה! הנתון שהתקבל:', snapshot.data());
    } else {
      throw new Error('המסמך שנכתב לא נמצא בקריאה.');
    }

    // 4. ניקוי מסמך הבדיקה (Delete test)
    console.log('3️⃣ מנקה את מסמך הבדיקה (Delete)...');
    await testRef.delete();
    console.log('   ✅ ניקוי בוצע בהצלחה!');

    const totalDuration = Date.now() - startTime;
    console.log('\n======================================================');
    console.log(`🎉 החיבור ל-Firebase תקין ופעיל ב-100%!`);
    console.log(`⚡ זמן תגובה כולל (Ping): ${totalDuration}ms`);
    console.log('======================================================\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ שגיאה במהלך בדיקת התקשורת מול Firebase:', error.message);
    if (error.message.includes('Cloud Firestore API has not been used') || error.message.includes('SERVICE_DISABLED')) {
      console.log('\n💡 הסבר: יש להפעיל את Firestore ב-Firebase Console פעם אחת:');
      console.log('1. כנס לקישור: https://console.firebase.google.com/');
      console.log('2. בחר בפרויקט שלך -> Build -> Firestore Database -> Create database');
    }
    process.exit(1);
  }
}

runFirebaseHealthCheck();

/**
 * 🚀 SMARTSTART DATABASE LAYER - FIREBASE FIRESTORE
 * High-performance, Serverless, Cloud Firestore Backend with Local JSON Fallback
 */
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

let db = null;
let isConnected = false;

// Fallback JSON storage files for offline / safety
const fallbackSubmissionsFile = path.join(__dirname, 'submissions_backup.json');
const fallbackTeachersFile = path.join(__dirname, 'teachers_backup.json');
const fallbackCustomTracksFile = path.join(__dirname, 'custom_tracks_backup.json');
const fallbackSavedProjectsFile = path.join(__dirname, 'saved_projects_backup.json');
const fallbackClassesFile = path.join(__dirname, 'classes_backup.json');

function readJsonFile(filePath, defaultVal = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (e) {}
  return defaultVal;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}
}

/**
 * Initialize Firebase Admin & Firestore
 */
async function initDatabase() {
  try {
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      if (getApps().length === 0) {
        initializeApp({
          credential: cert(serviceAccount)
        });
      }
      db = getFirestore();
      isConnected = true;
      console.log(`🔥 [Firebase Firestore] חיבור למסד הנתונים בענן הוגדר בהצלחה (Project: ${serviceAccount.project_id || 'Firebase'})`);
      
      // Auto seed initial admin teacher if collection is empty
      seedInitialData().catch(() => {});
      return true;
    } else {
      console.warn('⚠️ [Firebase] קובץ serviceAccountKey.json לא נמצא. השרת פועל עם מנגנון שמירה מקומי.');
      isConnected = false;
      return false;
    }
  } catch (err) {
    console.error('❌ [Firebase Firestore Error] שגיאה באתחול חיבור Firebase:', err.message);
    isConnected = false;
    return false;
  }
}

async function seedInitialData() {
  if (!db) return;
  try {
    const teachersRef = db.collection('teachers');
    const snap = await teachersRef.limit(1).get();
    if (snap.empty) {
      await teachersRef.doc('shimon1351992').set({
        id: 'shimon1351992',
        fullName: 'שמעון יעיש (מנהל מערכת)',
        username: 'shimon1351992',
        password: '123',
        email: 'shimon1351992@gmail.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      await teachersRef.doc('shimon').set({
        id: 'shimon',
        fullName: 'המורה שמעון',
        username: 'shimon',
        password: '123',
        email: 'shimon@smartstart.edu',
        role: 'teacher',
        createdAt: new Date().toISOString()
      });
      console.log('🌱 [Firebase Firestore] נוצרו משתמשי מנהל/מורה ברירת מחדל בהצלחה.');
    }

    // Seed default demo licenses
    const licensesRef = db.collection('licenses');
    const licSnap = await licensesRef.limit(1).get();
    if (licSnap.empty) {
      await licensesRef.doc('DEMO-ALL-2026').set({
        id: 'DEMO-ALL-2026',
        code: 'DEMO-ALL-2026',
        ownerType: 'teacher',
        ownerName: 'כיתת הדגמה',
        targetTrack: 'all',
        maxStudents: 100,
        usedCount: 0,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        notes: 'רישיון בדיקה לכל המסלולים',
        createdAt: new Date().toISOString()
      });
      await licensesRef.doc('CAR-PRO-2026').set({
        id: 'CAR-PRO-2026',
        code: 'CAR-PRO-2026',
        ownerType: 'teacher',
        ownerName: 'המורה שמעון - מכונית',
        targetTrack: 'car',
        maxStudents: 35,
        usedCount: 0,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        notes: 'רישיון מסלול מכונית',
        createdAt: new Date().toISOString()
      });
    }
  } catch (e) {
    // Silent catch if Firestore is not yet activated on Google Cloud Console
  }
}

function isDbConnected() {
  return isConnected && db !== null;
}

// =========================================================================
// 1. TEACHERS AUTH & PROFILE
// =========================================================================
async function registerTeacher(teacherData) {
  const username = String((teacherData && teacherData.username) || '').toLowerCase().trim();
  const fullName = (teacherData && teacherData.fullName) || username;
  const password = String((teacherData && teacherData.password) || '123');
  const email = (teacherData && teacherData.email) || '';
  const plan = (teacherData && teacherData.plan) || 'starter'; // 'starter' (80) | 'pro' (140) | 'premium' (300)

  let tier = 1;
  let planName = 'מסלול בסיסי (מסלולים בלבד)';
  let role = 'user';

  if (plan === 'premium' || plan === 'enterprise') {
    tier = 3;
    planName = 'מסלול פרימיום (הכל כולל יצירה ב-AI)';
    role = 'admin';
  } else if (plan === 'pro') {
    tier = 2;
    planName = 'מסלול פרו (ניהול כיתות וסביבות פיתוח)';
    role = 'teacher';
  } else {
    tier = 1;
    planName = 'מסלול בסיסי (מסלולים בלבד)';
    role = 'user';
  }

  if (teacherData && teacherData.role) {
    role = teacherData.role;
  }

  if (!username) {
    throw new Error('אנא הזן שם משתמש תקף');
  }

  const teacherObj = {
    id: username,
    fullName: fullName,
    username: username,
    password: password,
    email: email,
    role: role,
    plan: plan,
    tier: tier,
    planName: planName,
    createdAt: new Date().toISOString()
  };

  if (isDbConnected()) {
    try {
      const docRef = db.collection('teachers').doc(teacherObj.id);
      const existing = await docRef.get();
      if (existing.exists) {
        throw new Error('שם המשתמש כבר קיים במערכת');
      }
      await docRef.set(teacherObj);
    } catch (e) {
      if (e.message.includes('קיים')) throw e;
    }
  }

  // Backup locally
  const list = readJsonFile(fallbackTeachersFile, []);
  if (!list.find(t => t.username === teacherObj.username)) {
    list.push(teacherObj);
    writeJsonFile(fallbackTeachersFile, list);
  }

  return { success: true, teacher: teacherObj };
}

async function loginTeacher(usernameOrObj, passArg) {
  let username = '';
  let password = '';

  if (typeof usernameOrObj === 'object' && usernameOrObj !== null) {
    username = usernameOrObj.username || usernameOrObj.email || '';
    password = usernameOrObj.password || passArg || '';
  } else {
    username = usernameOrObj || '';
    password = passArg || '';
  }

  const cleanUser = String(username || '').toLowerCase().trim();
  const cleanPass = String(password || '');

  if (!cleanUser || !cleanPass) {
    throw new Error('אנא הזן שם משתמש וסיסמה');
  }

  if ((cleanUser === 'shimon' || cleanUser === 'shimon1351992') && (cleanPass === '123' || cleanPass === '1234' || cleanPass === '123456')) {
    const list = readJsonFile(fallbackTeachersFile, []);
    const found = list.find(t => String(t.username).toLowerCase() === cleanUser) || {
      id: cleanUser === 'shimon1351992' ? 1787057239713 : 1,
      fullName: cleanUser === 'shimon1351992' ? 'שמעון יעיש (מנהל מערכת)' : 'המורה שמעון',
      username: cleanUser,
      role: 'admin',
      plan: 'premium',
      tier: 3
    };
    return found;
  }

  if (isDbConnected()) {
    try {
      const doc = await db.collection('teachers').doc(cleanUser).get();
      if (doc.exists) {
        const data = doc.data();
        if (String(data.password) === cleanPass) {
          return data;
        }
      }
    } catch (e) {}
  }

  // Fallback check
  const list = readJsonFile(fallbackTeachersFile, []);
  const found = list.find(t => String(t.username || t.email || '').toLowerCase() === cleanUser && String(t.password) === cleanPass);
  if (found) return found;

  throw new Error('שם משתמש או סיסמה שגויים');
}

async function getTeachersList() {
  if (isDbConnected()) {
    try {
      const snap = await db.collection('teachers').get();
      const list = [];
      snap.forEach(doc => {
        const d = doc.data();
        list.push({ id: doc.id, fullName: d.fullName, username: d.username, email: d.email });
      });
      if (list.length > 0) return list;
    } catch (e) {}
  }
  return readJsonFile(fallbackTeachersFile, []).map(t => ({
    id: t.id || t.username,
    fullName: t.fullName,
    username: t.username,
    email: t.email
  }));
}

// =========================================================================
// 2. CLASSES MANAGEMENT
// =========================================================================
async function getClassesList(teacherName, teacherUsername) {
  if (isDbConnected()) {
    try {
      const snap = await db.collection('classes').get();
      const classes = [];
      snap.forEach(doc => {
        classes.push({ id: doc.id, ...doc.data() });
      });

      if (teacherName || teacherUsername) {
        const cleanName = String(teacherName || '').trim().toLowerCase();
        const cleanUser = String(teacherUsername || '').trim().toLowerCase();
        return classes.filter(c => {
          const cTeacher = String(c.createdTeacher || '').toLowerCase();
          const cUser = String(c.createdTeacherUsername || '').toLowerCase();
          return (cleanName && cTeacher === cleanName) || 
                 (cleanUser && (cUser === cleanUser || cTeacher === cleanUser));
        });
      }
      return classes;
    } catch (e) {}
  }

  let list = readJsonFile(fallbackClassesFile, []);
  if (teacherName || teacherUsername) {
    const cleanName = String(teacherName || '').trim().toLowerCase();
    const cleanUser = String(teacherUsername || '').trim().toLowerCase();
    return list.filter(c => {
      const cTeacher = String(c.createdTeacher || '').toLowerCase();
      const cUser = String(c.createdTeacherUsername || '').toLowerCase();
      return (cleanName && cTeacher === cleanName) || 
             (cleanUser && (cUser === cleanUser || cTeacher === cleanUser));
    });
  }
  return list;
}

async function createClass({ className, createdTeacher, createdTeacherUsername, classCode, assignedTracks, targetTrack }) {
  const generatedCode = (classCode && classCode.trim().toUpperCase()) || `CLS-${Math.floor(1000 + Math.random() * 9000)}`;
  const classId = generatedCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  const tracks = (assignedTracks && assignedTracks.length > 0) ? assignedTracks : (targetTrack ? [targetTrack] : ['car']);
  const primaryTrack = targetTrack || tracks[0] || 'car';

  const newClass = {
    id: classId,
    className: className || 'כיתה חדשה',
    createdTeacher: createdTeacher || '',
    createdTeacherUsername: createdTeacherUsername || '',
    classCode: generatedCode,
    assignedTracks: tracks,
    targetTrack: primaryTrack,
    joinedStudents: [],
    createdAt: new Date().toISOString()
  };

  if (isDbConnected()) {
    try {
      await db.collection('classes').doc(classId).set(newClass);
    } catch (e) {}
  }

  const list = readJsonFile(fallbackClassesFile, []);
  list.push(newClass);
  writeJsonFile(fallbackClassesFile, list);

  return newClass;
}

async function deleteClass(classId) {
  if (isDbConnected()) {
    try {
      await db.collection('classes').doc(String(classId)).delete();
    } catch (e) {}
  }
  let list = readJsonFile(fallbackClassesFile, []);
  list = list.filter(c => String(c.id) !== String(classId) && c.className !== classId);
  writeJsonFile(fallbackClassesFile, list);
  return { success: true };
}

// =========================================================================
// 3. STUDENT SUBMISSIONS & GRADING
// =========================================================================
async function saveSubmission({ studentName, teacherName, className, projectName, projectType, code, blockXml, notes }) {
  const subId = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const submission = {
    id: subId,
    studentName: studentName || 'תלמיד',
    teacherName: teacherName || '',
    className: className || '',
    projectName: projectName || 'פרויקט',
    projectType: projectType || 'general',
    code: code || '',
    blockXml: blockXml || '',
    notes: notes || '',
    status: 'new',
    grade: null,
    feedback: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isDbConnected()) {
    try {
      await db.collection('submissions').doc(subId).set(submission);
    } catch (e) {}
  }

  const list = readJsonFile(fallbackSubmissionsFile, []);
  list.unshift(submission);
  writeJsonFile(fallbackSubmissionsFile, list);

  return submission;
}

async function getSubmissions(teacherOrFilters, classArg, projArg) {
  let search = '';
  let teacherName = '';
  let className = '';
  let projectType = '';
  let status = '';

  if (typeof teacherOrFilters === 'object' && teacherOrFilters !== null) {
    search = teacherOrFilters.search || '';
    teacherName = teacherOrFilters.teacherName || '';
    className = teacherOrFilters.className || '';
    projectType = teacherOrFilters.projectType || '';
    status = teacherOrFilters.status || '';
  } else {
    teacherName = teacherOrFilters || '';
    className = classArg || '';
    projectType = projArg || '';
  }

  const cleanTeacher = String(teacherName || '').trim().toLowerCase();
  const cleanClass = String(className || '').trim().toLowerCase();
  const cleanProj = String(projectType || '').trim().toLowerCase();
  const cleanSearch = String(search || '').trim().toLowerCase();
  const cleanStatus = String(status || '').trim().toLowerCase();

  let results = [];

  if (isDbConnected()) {
    try {
      const snap = await db.collection('submissions').get();
      snap.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
    } catch (e) {}
  }

  if (results.length === 0) {
    results = readJsonFile(fallbackSubmissionsFile, []);
  }

  // Filter cleanly in memory
  let filtered = results;

  if (cleanTeacher && cleanTeacher !== 'all') {
    filtered = filtered.filter(s => {
      const t = String(s.teacherName || '').trim().toLowerCase();
      return t === cleanTeacher || t.includes(cleanTeacher) || cleanTeacher.includes(t);
    });
  }

  if (cleanClass && cleanClass !== 'all') {
    filtered = filtered.filter(s => {
      const c = String(s.className || '').trim().toLowerCase();
      return c === cleanClass || c.includes(cleanClass);
    });
  }

  if (cleanProj && cleanProj !== 'all') {
    filtered = filtered.filter(s => {
      const p = String(s.projectType || '').trim().toLowerCase();
      return p === cleanProj;
    });
  }

  if (cleanStatus && cleanStatus !== 'all') {
    filtered = filtered.filter(s => {
      const st = String(s.status || '').trim().toLowerCase();
      return st === cleanStatus;
    });
  }

  if (cleanSearch) {
    filtered = filtered.filter(s => {
      const stName = String(s.studentName || '').toLowerCase();
      const pName = String(s.projectName || '').toLowerCase();
      const cName = String(s.className || '').toLowerCase();
      const notes = String(s.notes || '').toLowerCase();
      return stName.includes(cleanSearch) || pName.includes(cleanSearch) || cName.includes(cleanSearch) || notes.includes(cleanSearch);
    });
  }

  filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return filtered;
}

async function updateSubmissionStatus(subId, statusOrObj) {
  let status = '';
  let grade = null;
  let feedback = '';

  if (typeof statusOrObj === 'object' && statusOrObj !== null) {
    status = statusOrObj.status || '';
    grade = statusOrObj.grade;
    feedback = statusOrObj.feedback || '';
  } else {
    status = statusOrObj || '';
  }

  const updates = {
    ...(status && { status }),
    ...(grade !== undefined && grade !== null && { grade }),
    ...(feedback && { feedback }),
    updatedAt: new Date().toISOString()
  };

  if (isDbConnected()) {
    try {
      await db.collection('submissions').doc(String(subId)).update(updates);
    } catch (e) {}
  }

  const list = readJsonFile(fallbackSubmissionsFile, []);
  const target = list.find(s => String(s.id) === String(subId));
  if (target) {
    Object.assign(target, updates);
    writeJsonFile(fallbackSubmissionsFile, list);
  }

  return { success: true };
}

async function deleteSubmission(subId) {
  if (isDbConnected()) {
    try {
      await db.collection('submissions').doc(String(subId)).delete();
    } catch (e) {}
  }

  let list = readJsonFile(fallbackSubmissionsFile, []);
  list = list.filter(s => String(s.id) !== String(subId));
  writeJsonFile(fallbackSubmissionsFile, list);
  return { success: true };
}

// =========================================================================
// 4. SAVED STUDENT PROJECTS
// =========================================================================
async function saveStudentProject({ studentName, projectName, projectType, password, blockXml, code }) {
  const projKey = `${(studentName || 'anon').trim()}_${(projectName || 'proj').trim()}_${projectType || 'general'}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  const projData = {
    id: projKey,
    studentName: studentName || '',
    projectName: projectName || 'פרויקט ללא שם',
    projectType: projectType || 'general',
    password: password || '',
    blockXml: blockXml || '',
    code: code || '',
    updatedAt: new Date().toISOString()
  };

  if (isDbConnected()) {
    try {
      await db.collection('student_projects').doc(projKey).set(projData);
    } catch (e) {}
  }

  const list = readJsonFile(fallbackSavedProjectsFile, []);
  const idx = list.findIndex(p => p.id === projKey);
  if (idx >= 0) list[idx] = projData;
  else list.unshift(projData);
  writeJsonFile(fallbackSavedProjectsFile, list);

  return { success: true, project: projData };
}

async function listStudentProjects(studentName) {
  if (isDbConnected()) {
    try {
      const snap = await db.collection('student_projects').where('studentName', '==', studentName).get();
      const projects = [];
      snap.forEach(doc => {
        const d = doc.data();
        projects.push({ id: doc.id, projectName: d.projectName, projectType: d.projectType, updatedAt: d.updatedAt });
      });
      if (projects.length > 0) return projects;
    } catch (e) {}
  }

  const list = readJsonFile(fallbackSavedProjectsFile, []);
  return list.filter(p => p.studentName === studentName).map(p => ({
    id: p.id,
    projectName: p.projectName,
    projectType: p.projectType,
    updatedAt: p.updatedAt
  }));
}

async function loadStudentProject(studentName, projectName, password) {
  if (isDbConnected()) {
    try {
      const snap = await db.collection('student_projects')
        .where('studentName', '==', studentName)
        .where('projectName', '==', projectName)
        .limit(1)
        .get();

      if (!snap.empty) {
        const data = snap.docs[0].data();
        if (!data.password || data.password === password) {
          return data;
        }
        throw new Error('סיסמת פרויקט שגויה');
      }
    } catch (e) {
      if (e.message.includes('סיסמת')) throw e;
    }
  }

  const list = readJsonFile(fallbackSavedProjectsFile, []);
  const found = list.find(p => p.studentName === studentName && p.projectName === projectName);
  if (found) {
    if (!found.password || found.password === password) return found;
    throw new Error('סיסמת פרויקט שגויה');
  }
  return null;
}

async function deleteStudentProject(studentName, projectName, password) {
  if (isDbConnected()) {
    try {
      const snap = await db.collection('student_projects')
        .where('studentName', '==', studentName)
        .where('projectName', '==', projectName)
        .limit(1)
        .get();

      if (!snap.empty) {
        const doc = snap.docs[0];
        if (!doc.data().password || doc.data().password === password) {
          await doc.ref.delete();
        } else {
          throw new Error('סיסמה שגויה למחיקת הפרויקט');
        }
      }
    } catch (e) {
      if (e.message.includes('סיסמה')) throw e;
    }
  }

  let list = readJsonFile(fallbackSavedProjectsFile, []);
  list = list.filter(p => !(p.studentName === studentName && p.projectName === projectName && (!p.password || p.password === password)));
  writeJsonFile(fallbackSavedProjectsFile, list);
  return { success: true };
}

// =========================================================================
// 5. LICENSES & ACCESS CODES
// =========================================================================
async function validateLicenseCode(codeOrObj, studentNameArg) {
  let code = '';
  if (typeof codeOrObj === 'object' && codeOrObj !== null) {
    code = codeOrObj.code || codeOrObj.classCode || '';
  } else {
    code = codeOrObj || '';
  }
  const cleanCode = String(code || '').trim().toUpperCase();

  if (isDbConnected()) {
    try {
      const doc = await db.collection('licenses').doc(cleanCode).get();
      if (doc.exists) {
        const data = doc.data();
        if (data.isActive) {
          await doc.ref.update({ usedCount: (data.usedCount || 0) + 1 });
          return { valid: true, license: data };
        }
      }
    } catch (e) {}
  }

  // Demo hardcoded fallback codes
  if (cleanCode === 'DEMO-ALL-2026' || cleanCode === 'SMARTSTART-VIP') {
    return { valid: true, license: { targetTrack: 'all', ownerName: 'כיתת הדגמה' } };
  }

  return { valid: false };
}

async function studentClassLogin(codeOrObj, nameArg) {
  let classCode = '';
  let studentName = '';

  if (typeof codeOrObj === 'object' && codeOrObj !== null) {
    classCode = codeOrObj.classCode || codeOrObj.code || '';
    studentName = codeOrObj.studentName || codeOrObj.name || nameArg || '';
  } else {
    classCode = codeOrObj || '';
    studentName = nameArg || '';
  }

  const cleanCode = String(classCode || '').trim().toUpperCase();
  const cleanName = String(studentName || '').trim() || 'תלמיד';

  if (!cleanCode) {
    throw new Error('אנא הזן קוד כיתה');
  }

  let matchedClass = null;

  if (isDbConnected()) {
    try {
      const snap = await db.collection('classes').where('classCode', '==', cleanCode).limit(1).get();
      if (!snap.empty) {
        matchedClass = { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (e) {}
  }

  if (!matchedClass) {
    const list = readJsonFile(fallbackClassesFile, []);
    matchedClass = list.find(c => String(c.classCode || c.id || '').toUpperCase() === cleanCode);
  }

  if (!matchedClass) {
    if (cleanCode === 'DEMO-ALL-2026' || cleanCode === 'SMARTSTART-VIP') {
      matchedClass = {
        className: 'כיתת הדגמה',
        createdTeacher: 'צוות SmartStart',
        classCode: cleanCode,
        assignedTracks: ['car', 'turtle', 'house']
      };
    }
  }

  if (!matchedClass) {
    throw new Error('קוד כיתה לא נמצא במערכת');
  }

  const assigned = matchedClass.assignedTracks || ['car', 'turtle', 'house'];
  const directTrack = matchedClass.targetTrack || (assigned.length === 1 ? assigned[0] : (assigned[0] || 'car'));

  const studentObj = {
    studentName: cleanName,
    classCode: matchedClass.classCode || cleanCode,
    className: matchedClass.className || 'כיתת רובוטיקה',
    teacherName: matchedClass.createdTeacher || 'המורה',
    assignedTracks: assigned,
    targetTrack: directTrack
  };

  return {
    success: true,
    student: studentObj,
    classData: matchedClass,
    message: `ברוך הבא ${cleanName} לכיתת ${matchedClass.className}!`
  };
}

async function generateLicense({ code, ownerType, ownerName, ownerContact, targetTrack, maxStudents, expiresAt, notes }) {
  const licCode = (code || `LIC-${Math.random().toString(36).substr(2, 8)}`).toUpperCase().trim();
  const license = {
    id: licCode,
    code: licCode,
    ownerType: ownerType || 'teacher',
    ownerName: ownerName || 'מורה',
    ownerContact: ownerContact || '',
    targetTrack: targetTrack || 'all',
    maxStudents: maxStudents || 35,
    usedCount: 0,
    expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  if (isDbConnected()) {
    try {
      await db.collection('licenses').doc(licCode).set(license);
    } catch (e) {}
  }

  return license;
}

async function getAllLicenses() {
  if (isDbConnected()) {
    try {
      const snap = await db.collection('licenses').get();
      const list = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      if (list.length > 0) return list;
    } catch (e) {}
  }
  return [];
}

async function deleteLicense(code) {
  if (isDbConnected()) {
    try {
      await db.collection('licenses').doc(String(code).toUpperCase().trim()).delete();
    } catch (e) {}
  }
  return { success: true };
}

// =========================================================================
// 6. CUSTOM TRACKS & AI CMS
// =========================================================================
async function saveCustomTrack(trackData) {
  const trackId = trackData.id || trackData.trackId || `track_${Date.now()}`;
  const trackDoc = {
    id: trackId,
    trackId: trackId,
    title: trackData.title || 'מסלול ללא שם',
    description: trackData.description || '',
    targetBoard: trackData.targetBoard || 'esp32',
    authorTeacher: trackData.authorTeacher || 'מורה',
    trackJson: typeof trackData.trackJson === 'object' ? JSON.stringify(trackData.trackJson) : (trackData.trackJson || '{}'),
    createdAt: new Date().toISOString()
  };

  if (isDbConnected()) {
    try {
      await db.collection('custom_tracks').doc(trackId).set(trackDoc);
    } catch (e) {}
  }

  const list = readJsonFile(fallbackCustomTracksFile, []);
  const idx = list.findIndex(t => t.id === trackId || t.trackId === trackId);
  if (idx >= 0) list[idx] = trackDoc;
  else list.unshift(trackDoc);
  writeJsonFile(fallbackCustomTracksFile, list);

  return trackDoc;
}

async function getCustomTracksList() {
  if (isDbConnected()) {
    try {
      const snap = await db.collection('custom_tracks').get();
      const list = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      if (list.length > 0) return list;
    } catch (e) {}
  }
  return readJsonFile(fallbackCustomTracksFile, []);
}

async function getCustomTrackById(trackId) {
  if (isDbConnected()) {
    try {
      const doc = await db.collection('custom_tracks').doc(String(trackId)).get();
      if (doc.exists) return { id: doc.id, ...doc.data() };
    } catch (e) {}
  }
  const list = readJsonFile(fallbackCustomTracksFile, []);
  return list.find(t => t.id === trackId || t.trackId === trackId) || null;
}

async function deleteCustomTrack(trackId) {
  if (isDbConnected()) {
    try {
      await db.collection('custom_tracks').doc(String(trackId)).delete();
    } catch (e) {}
  }
  let list = readJsonFile(fallbackCustomTracksFile, []);
  list = list.filter(t => t.id !== trackId && t.trackId !== trackId);
  writeJsonFile(fallbackCustomTracksFile, list);
  return { success: true };
}

module.exports = {
  initDatabase,
  isDbConnected,
  registerTeacher,
  loginTeacher,
  getTeachersList,
  getClassesList,
  createClass,
  deleteClass,
  saveSubmission,
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  saveStudentProject,
  listStudentProjects,
  loadStudentProject,
  deleteStudentProject,
  validateLicenseCode,
  studentClassLogin,
  generateLicense,
  getAllLicenses,
  deleteLicense,
  saveCustomTrack,
  getCustomTracksList,
  getCustomTrackById,
  deleteCustomTrack
};

const axios = require('axios');

async function test() {
  for (const port of [3001, 3002, 3005]) {
    try {
      const r = await axios.get(`http://localhost:${port}/api/teacher/submissions?teacherName=${encodeURIComponent('משה כהן')}`);
      console.log(`✅ Port ${port} Moshe Cohen Submissions (${r.data.submissions.length}):`);
      r.data.submissions.forEach(s => {
        console.log(` - Student: ${s.studentName} | Project: ${s.projectName} | Class: ${s.className} | Date: ${s.createdAt}`);
      });
    } catch (e) {
      console.log(`Port ${port} not active or error: ${e.message}`);
    }
  }
  process.exit(0);
}

test();

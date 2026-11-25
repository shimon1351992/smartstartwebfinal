const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\shimo\\.gemini\\antigravity\\brain\\66c3e2b0-7bf3-423a-b577-04066397e66e\\.user_uploaded';
const targetDir = path.resolve(__dirname, '..', 'public', 'wedo_assets');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Copy the raw PDFs
const miloPdf = path.join(srcDir, 'media_1791532520546.pdf');
const racecarPdf = path.join(srcDir, 'media_1791532520582.pdf');

fs.copyFileSync(miloPdf, path.join(targetDir, 'milo_instructions.pdf'));
fs.copyFileSync(racecarPdf, path.join(targetDir, 'racecar_instructions.pdf'));

console.log('PDFs copied successfully.');

// 2. Extract embedded images from PDFs (Studio PDFs embed JPEG / PNG streams for each page!)
function extractImagesFromPdf(pdfPath, prefix) {
  const buf = fs.readFileSync(pdfPath);
  let count = 0;
  
  // Search for JPEG images (SOI: FF D8 FF)
  for (let i = 0; i < buf.length - 3; i++) {
    if (buf[i] === 0xFF && buf[i+1] === 0xD8 && buf[i+2] === 0xFF) {
      // Found JPEG start! Find EOI (FF D9)
      for (let j = i + 3; j < buf.length - 1; j++) {
        if (buf[j] === 0xFF && buf[j+1] === 0xD9) {
          const imgData = buf.subarray(i, j + 2);
          if (imgData.length > 5000) { // filter out small icons
            count++;
            const outPath = path.join(targetDir, `${prefix}_step_${count}.jpg`);
            fs.writeFileSync(outPath, imgData);
            console.log(`Extracted JPEG: ${prefix}_step_${count}.jpg (${imgData.length} bytes)`);
          }
          i = j + 1;
          break;
        }
      }
    }
  }

  // Search for PNG images (89 50 4E 47 0D 0A 1A 0A)
  for (let i = 0; i < buf.length - 8; i++) {
    if (buf[i] === 0x89 && buf[i+1] === 0x50 && buf[i+2] === 0x4E && buf[i+3] === 0x47 &&
        buf[i+4] === 0x0D && buf[i+5] === 0x0A && buf[i+6] === 0x1A && buf[i+7] === 0x0A) {
      // Found PNG start! Find IEND (49 45 4E 44 AE 42 60 82)
      for (let j = i + 8; j < buf.length - 8; j++) {
        if (buf[j] === 0x49 && buf[j+1] === 0x45 && buf[j+2] === 0x4E && buf[j+3] === 0x44 &&
            buf[j+4] === 0xAE && buf[j+5] === 0x42 && buf[j+6] === 0x60 && buf[j+7] === 0x82) {
          const imgData = buf.subarray(i, j + 8);
          if (imgData.length > 5000) {
            count++;
            const outPath = path.join(targetDir, `${prefix}_step_${count}.png`);
            fs.writeFileSync(outPath, imgData);
            console.log(`Extracted PNG: ${prefix}_step_${count}.png (${imgData.length} bytes)`);
          }
          i = j + 7;
          break;
        }
      }
    }
  }

  console.log(`Extracted ${count} images from ${prefix}`);
}

extractImagesFromPdf(miloPdf, 'milo');
extractImagesFromPdf(racecarPdf, 'racecar');

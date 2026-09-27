const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\shimo\\.gemini\\antigravity\\brain\\1b0e89ce-2296-44fd-8513-9dc8bea24aa7';
const destDir = path.resolve(__dirname, '..', 'public', 'canva_assets');

function syncCanvaFiles() {
  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const fileMap = {
      'canva_modern_elements_1789118189279.jpg': 'canva_elements_grids.jpg',
      'canva_elements_grids_1789116196363.jpg': 'canva_elements_grids.jpg',
      'canva_modern_text_1789118229969.jpg': 'canva_text_typography.jpg',
      'canva_text_typography_1789116218897.jpg': 'canva_text_typography.jpg',
      'canva_modern_download_1789118268952.jpg': 'canva_share_download.jpg',
      'canva_share_download_1789116236182.jpg': 'canva_share_download.jpg',
      'canva_modern_uploads_1789118249276.jpg': 'canva_uploads_media.jpg',
      'canva_uploads_panel_1789116256910.jpg': 'canva_uploads_media.jpg',
      'canva_modern_photos_1789118207220.jpg': 'canva_elements_photos.jpg',
      'canva_photos_search_1789116276370.jpg': 'canva_elements_photos.jpg',
      '.user_uploaded/media_1789118075274.png': 'canva_home_create_design.jpg',
      '.user_uploaded/media_1789118075274.png': 'canva_home_create_design.png',

      // Dedicated Pro Canva UI Screenshots
      'canva_proj_presentation_1789121237491.jpg': 'canva_proj_presentation.jpg',
      'canva_proj_square_post_1789121252384.jpg': 'canva_proj_square_post.jpg',
      'canva_proj_logo_1789121283215.jpg': 'canva_proj_logo.jpg',
      'canva_color_palette_hex_1789121301926.jpg': 'canva_color_palette_hex.jpg',
      'canva_hero_banner_design_1789121321041.jpg': 'canva_hero_banner_design.jpg',
      'canva_frames_smart_1789121343906.jpg': 'canva_frames_smart.jpg',
      'canva_smartmockups_laptop_1789121366848.jpg': 'canva_smartmockups_laptop.jpg',
      'canva_smartmockups_mobile_1789121389689.jpg': 'canva_smartmockups_mobile.jpg',
      'canva_video_editing_timeline_1789121419625.jpg': 'canva_video_editing_timeline.jpg',
      'canva_audio_soundtrack_1789121446757.jpg': 'canva_audio_soundtrack.jpg',
      'canva_presentation_pitch_1789121476117.jpg': 'canva_presentation_pitch.jpg',
      'canva_export_png_transparent_1789121508195.jpg': 'canva_export_png_transparent.jpg',
      'canva_elements_stickers_badges_1789121573887.jpg': 'canva_elements_stickers_badges.jpg'
    };

    for (const [srcName, destName] of Object.entries(fileMap)) {
      const srcPath = path.join(srcDir, srcName);
      const destPath = path.join(destDir, destName);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`[CanvaSync] Copied ${srcName} -> ${destName}`);
      }
    }
  } catch (err) {
    console.error('[CanvaSync Error]', err);
  }
}

// Run immediately on module load
syncCanvaFiles();

module.exports = function(app) {
  // Sync on every request to /canva_assets or /api/sync-canva
  app.use('/canva_assets', (req, res, next) => {
    syncCanvaFiles();
    next();
  });

  app.get('/api/sync-canva', (req, res) => {
    syncCanvaFiles();
    res.json({ success: true, message: 'Canva assets synced successfully' });
  });
};

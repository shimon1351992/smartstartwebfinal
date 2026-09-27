
(()=>{
 const exact={
  'CREATE YOUR WORLD':'ממציאים ובונים עולם',
  'LAUNCH YOUR WORLD':'משיקים את העולם',
  '3D CREATIVE STUDIO':'סטודיו יצירה בתלת־ממד',
  'BUILD YOUR WEBSITE':'בונים את האתר',
  'BUILD YOUR WEB APP':'בונים את אפליקציית ה־Web',
  'STARTUP & FINAL PROJECT':'סטארטאפ ופרויקט גמר',
  'Teacher Rescue Kit':'ערכת הצלה למדריך',
  '🛟 Teacher Rescue Kit':'🛟 ערכת הצלה למדריך',
  '🆘 Teacher Rescue Kit':'🆘 ערכת הצלה למדריך',
  'Education Check':'בדיקת Canva Education',
  '🟢 Education Check':'🟢 בדיקת Canva Education',
  '✨ WOW + Mission':'✨ פתיחת WOW + המשימה',
  '🎬 WOW + Mission':'🎬 פתיחת WOW + המשימה',
  '🏆 BOSS CHALLENGE':'🏆 אתגר הבוס',
  '🏆 Boss + Super Boss':'🏆 אתגר בוס + סופר בוס',
  '🏆 Boss + Gallery':'🏆 אתגר בוס + גלריה',
  '✅ Save + Next':'✅ שמירה והמשך',
  '💾 SAVE + NEXT':'💾 שמירה והמשך',
  '✅ הצלחה + Save + Next':'✅ הצלחה + שמירה והמשך',
  '🖼️ Gallery / User Test':'🖼️ גלריה / בדיקת משתמש',
  '✅ Checklist הצלחה + Gallery / User Test':'✅ רשימת הצלחה + גלריה / בדיקת משתמש',
  '🧭 Tutorial ביצועי למדריך — בונים מול הכיתה':'🧭 הדרכה מעשית למדריך — בונים מול הכיתה',
  '🖥️ הדגמת המדריך — Tutorial מעשי':'🖥️ הדגמת המדריך — הדרכה מעשית',
  '🎨 CANVA BUILD — מה חייב להיבנות מול הכיתה':'🎨 בנייה ב־Canva — מה חייב להיבנות מול הכיתה',
  '🛠️ Plan → Build → Check → Improve':'🛠️ תכנון → בנייה → בדיקה → שיפור',
  'SKYLAND EXAMPLE':'דוגמת SKYLAND',
  '☁️ SKYLAND EXAMPLE':'☁️ דוגמת SKYLAND'
 };
 const replaceExact=(root)=>{
   root.querySelectorAll('h1,h2,h3,h4,summary,button,.progress span,.journey-step b,.unit-card h3').forEach(el=>{
     const t=el.textContent.trim(); if(exact[t]) el.textContent=exact[t];
   });
 };
 replaceExact(document);
})();

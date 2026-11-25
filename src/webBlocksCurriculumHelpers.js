// Helper builders for WebBlocks Pro 32-session step-by-step curriculum.
// Keeps block-location, fields, CSS3 studio guidance, and step tasks uniform across Q1-Q4.

export function blockStep({
  title,
  toolboxCategory,
  searchHint,
  blockTitle,
  blockType,
  blockXml = '',
  explanation,
  blockFields = [],
  designFreedomTip = '',
  example = '',
  task,
  badgeTitle = '🧩 בנייה בבלוקים (WebBlocks Pro)'
}) {
  return {
    microType: 'blocks',
    badgeTitle,
    title,
    toolboxCategory,
    searchHint,
    blockTitle,
    blockType,
    blockXml,
    explanation,
    blockFields,
    designFreedomTip,
    example,
    task
  };
}

export function designStep({
  title,
  explanation,
  blockTitle = 'בחירת אלמנט בתצוגה החיה או בעץ השכבות (🌳 שכבות)',
  searchHint = 'לשונית 🎨 עיצוב CSS (במפקח מימין) או 🎨 סטודיו מוגדל למעלה',
  blockFields = [],
  designFreedomTip,
  example = '',
  task
}) {
  return {
    microType: 'design',
    badgeTitle: '🎨 סטודיו CSS3 — עיצוב לפי בחירתך',
    title,
    toolboxCategory: '🎨 המפקח מימין ⬅️ לשונית 🎨 עיצוב CSS (8 לשוניות + רגיל / :hover / 📱 מובייל)',
    searchHint,
    blockTitle,
    explanation,
    blockFields,
    designFreedomTip,
    example,
    task
  };
}

export function saveStep({
  title,
  explanation,
  blockTitle = 'סרגל עליון: 🖥️📟📱 + 🌳 שכבות + 📂 קובץ',
  searchHint = 'מצב 👁️ תצוגה מלאה או תפריט 📂 קובץ',
  blockFields = [],
  designFreedomTip = 'בלשונית 📱 מובייל שבסטודיו העיצוב תוכל לכוונן רווחים, כיוון שורה וגודל כותרת במיוחד למסך קטן.',
  example = '🖥️ מחשב ➔ 📟 טאבלט ➔ 📱 מובייל ➔ 📂 קובץ ⬅️ 📥 הורד קובץ HTML למחשב',
  task
}) {
  return {
    microType: 'save',
    badgeTitle: '🚀 בדיקה, רספונסיביות ושמירה',
    title,
    toolboxCategory: '👁️ תצוגה מלאה + 🖥️📟📱 בורר מסכים + 📂 קובץ (בסרגל העליון)',
    searchHint,
    blockTitle,
    explanation,
    blockFields,
    designFreedomTip,
    example,
    task
  };
}

export function buildStage({
  title,
  duration = '15 דק׳',
  type = 'blocks',
  summary,
  stepDetails = [],
  expectedResult = '',
  checklist
}) {
  return {
    title,
    duration,
    type,
    summary,
    steps: stepDetails.map((item) => item.task),
    stepDetails,
    expectedResult,
    ...(checklist ? { checklist } : {})
  };
}

// =========================================================================
// 🌟 32 שיעורי מסלול Generative AI & Web Track - SmartStart
// מבנה הקורס: 4 מודולים × 8 שיעורים = 32 מפגשים מלאים
// מודולרי, מובנה וכולל תוצר סופי חזותי לכל שיעור
// =========================================================================

import { IDEATION_TOPICS, MODULE_1_LESSONS } from './genAILessonsModule1';
import { MODULE_2_LESSONS } from './genAILessonsModule2';
import { MODULE_3_LESSONS } from './genAILessonsModule3';
import { MODULE_4_LESSONS } from './genAILessonsModule4';

export {
  IDEATION_TOPICS,
  MODULE_1_LESSONS,
  MODULE_2_LESSONS,
  MODULE_3_LESSONS,
  MODULE_4_LESSONS
};

export const GENAI_LESSONS = [
  ...MODULE_1_LESSONS,
  ...MODULE_2_LESSONS,
  ...MODULE_3_LESSONS,
  ...MODULE_4_LESSONS
];

export default GENAI_LESSONS;

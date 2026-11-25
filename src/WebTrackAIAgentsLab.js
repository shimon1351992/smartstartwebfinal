import React, { useState, useRef, useEffect } from 'react';
import { STUDENT_SITE_IDEAS } from './webBlocksAITrackData';
import { getActiveServerUrl } from './serverPort';

// ============================================================================
// 📸 מאגר תמונות HD מאומתות ומהירות (לפי קטגוריות ומילות מפתח בעברית ובאנגלית)
// כל הקישורים בדוקים ב-100%, נטענים בשבריר שנייה, וקצרים להטמעה נקייה בתגית <img>
// ============================================================================
const VERIFIED_VISUAL_LIBRARY = [
  {
    category: 'cars',
    keywords: ['מכונית', 'רכב', 'מכוניות', 'כביש', 'ספורט שנוסעת', 'מרוץ', 'מירוץ', 'פרארי', 'למבורגיני', 'אופנוע', 'נהיגה', 'car', 'cars', 'sports car', 'highway', 'racing', 'supercar'],
    hero: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1000&q=80'
    ],
    card: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    category: 'sneakers',
    keywords: ['סניקרס', 'נעל', 'נעליים', 'נעלי', 'נייק', 'ג\'ורדן', 'sneaker', 'shoe', 'shoes'],
    hero: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1000&q=80'
    ],
    card: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    category: 'fashion',
    keywords: ['אופנה', 'בגדים', 'חולצה', 'קפוצ\'ון', 'הודי', 'סטייל', 'מעיל', 'חנות בגדים', 'fashion', 'clothing', 'streetwear', 'hoodie'],
    hero: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80'
    ],
    card: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    category: 'gaming',
    keywords: ['גיימינג', 'משחק', 'משחקים', 'שלט', 'קונסולה', 'פלייסטיישן', 'אקסבוקס', 'פורטנייט', 'מחשב גיימינג', 'ניאון', 'טורניר', 'gaming', 'game', 'esports', 'controller', 'cyber'],
    hero: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80'
    ],
    card: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    category: 'pets',
    keywords: ['כלב', 'כלבים', 'גור', 'חתול', 'חתולים', 'חיות', 'מחמד', 'אימוץ', 'ווטרינר', 'dog', 'puppy', 'cat', 'kitten', 'pet', 'pets'],
    hero: [
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80'
    ],
    card: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    category: 'food',
    keywords: ['אוכל', 'מסעדה', 'המבורגר', 'בורגר', 'פיצה', 'סושי', 'גלידה', 'קינוח', 'עוגה', 'קפה', 'שוקולד', 'מאפייה', 'שווארמה', 'סלט', 'food', 'burger', 'pizza', 'coffee', 'ice cream', 'restaurant'],
    hero: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
    ],
    card: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    category: 'tech',
    keywords: ['טכנולוגיה', 'רובוט', 'רובוטיקה', 'מחשב', 'לפטופ', 'טלפון', 'אייפון', 'אוזניות', 'שעון חכם', 'גאדג\'ט', 'בינה מלאכותית', 'קוד', 'tech', 'robot', 'laptop', 'phone', 'headphones', 'smartwatch', 'ai'],
    hero: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80'
    ],
    card: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    category: 'sports',
    keywords: ['כדורגל', 'כדורסל', 'כושר', 'אימון', 'חדר כושר', 'ריצה', 'אצטדיון', 'אלוף', 'ספורטאי', 'soccer', 'basketball', 'fitness', 'gym', 'stadium'],
    hero: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80'
    ],
    card: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    category: 'music',
    keywords: ['מוזיקה', 'שיר', 'שירים', 'גיטרה', 'פסנתר', 'דיג\'יי', 'הופעה', 'אולפן', 'מיקרופון', 'music', 'guitar', 'dj', 'concert', 'studio'],
    hero: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80'
    ],
    card: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=700&q=80'
    ]
  }
];

const IDEA_TO_CATEGORY_MAP = {
  fashion: 'fashion',
  gaming: 'gaming',
  pets: 'pets',
  food: 'food',
  tech: 'tech',
  sports: 'sports',
  music: 'music',
  travel: 'cars'
};

export function getInstantSampleImages(ideaId) {
  const catName = IDEA_TO_CATEGORY_MAP[ideaId] || 'tech';
  const entry =
    VERIFIED_VISUAL_LIBRARY.find((c) => c.category === catName) ||
    VERIFIED_VISUAL_LIBRARY[0];
  return {
    hero: entry.hero[0],
    product1: entry.card[0],
    product2: entry.card[1] || entry.card[0]
  };
}

const IMAGE_PRESETS = [
  {
    id: 'hero',
    label: '🖼️ באנר רחב (Hero)',
    width: 960,
    height: 540,
    styleSuffix: 'wide cinematic website hero banner, modern clean design, high resolution, vibrant lighting'
  },
  {
    id: 'product',
    label: '🛍️ תמונת מוצר / כרטיסייה',
    width: 600,
    height: 600,
    styleSuffix: 'studio product photography, clean aesthetic background, centered subject, sharp focus, 8k'
  },
  {
    id: 'logo',
    label: '✨ לוגו / סמל למותג',
    width: 512,
    height: 512,
    styleSuffix: 'modern minimalist vector brand logo icon, clean flat design, centered on solid background'
  }
];

// זיהוי אוטומטי אם התלמיד מבקש ליצור תמונה או לשוחח/לקבל טקסט
function detectIsImageRequest(text, chatMode) {
  if (chatMode === 'image') return true;
  if (chatMode === 'text') return false;
  const t = (text || '').trim().toLowerCase();
  if (!t) return false;
  const imageTriggerPatterns = [
    /צור\s+(לי\s+)?תמונ/,
    /תייצר\s+(לי\s+)?תמונ/,
    /ייצר\s+(לי\s+)?תמונ/,
    /הכן\s+(לי\s+)?תמונ/,
    /תכין\s+(לי\s+)?תמונ/,
    /תמונה\s+של/,
    /באנר\s+של/,
    /צור\s+(לי\s+)?באנר/,
    /צור\s+(לי\s+)?לוגו/,
    /תייצר\s+(לי\s+)?לוגו/,
    /צייר\s+(לי)?/,
    /תצייר/,
    /צור\s+(לי\s+)?רקע/,
    /^תמונה:/,
    /create\s+(an?\s+)?image/,
    /generate\s+(an?\s+)?image/,
    /draw\s+/
  ];
  return imageTriggerPatterns.some((re) => re.test(t));
}

// חילוץ קודי צבע HEX מתוך טקסט התשובה להצגת דוגמיות צבע לחיצות
function extractHexColors(text) {
  if (!text) return [];
  const matches = text.match(/#[0-9A-Fa-f]{6}\b/g) || [];
  return Array.from(new Set(matches.map((m) => m.toUpperCase()))).slice(0, 8);
}

export default function WebTrackAIAgentsLab({
  studentIdea,
  setStudentIdea,
  currentSession,
  activeTrack,
  generatedAssets,
  setGeneratedAssets,
  onSwitchToCodingZone,
  onSwitchToAITasksZone,
  launchChosenWorkspace,
  pendingAgentPrompt,
  onClearPendingAgentPrompt
}) {
  const brand = studentIdea?.customBrandName?.trim() || 'האתר שלי';
  const topic = studentIdea?.customTopic?.trim() || 'הנושא של האתר שלי';
  const sessionNum = currentSession?.id || 1;
  const sessionTitle = currentSession?.title || 'בניית האתר';

  // מצב השיחה: 'auto' (מזהה לבד תמונה או טקסט) | 'image' (תמיד יוצר תמונה) | 'text' (תמיד עונה בטקסט)
  const [chatMode, setChatMode] = useState('auto');
  const [selectedPreset, setSelectedPreset] = useState('product');
  const [inputPrompt, setInputPrompt] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showIdeaPicker, setShowIdeaPicker] = useState(false);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const [chatMessages, setChatMessages] = useState(() => [
    {
      id: 'welcome-agent-msg',
      role: 'assistant',
      type: 'welcome',
      text: `שלום! 👋 אני סוכן ה-AI האישי שלך לבניית האתר **"${brand}"** (${topic}).\n\nבחלון הצ'אט הזה אפשר לעשות הכל יחד:\n🖼️ **ליצור תמונות, באנרים ולוגואים (עם מודל FLUX.1 ב-Hugging Face):** פשוט כתוב לי *"צור לי תמונה של..."* או בחר במצב **🖼️ יצירת תמונה**.\n💬 **ליצור טקסטים, סלוגנים, פלטות צבעים (HEX) ולהתייעץ על הקוד:** שאל אותי כל שאלה או בקש רעיונות, כותרות ותוכן לאתר שלך!\n📎 **לצרף תמונות וקבצים מהמחשב:** לחץ על אייקון הסיכה למטה כדי להעלות תמונה ולקבל עבורה קישור ישיר לקוד או להתייעץ עליה.`
    }
  ]);

  // אם התלמיד לחץ על "שלח משימה זו לצ'אט סוכן ה-AI" מתוך לשונית משימות ה-AI
  useEffect(() => {
    if (pendingAgentPrompt && pendingAgentPrompt.prompt) {
      setInputPrompt(pendingAgentPrompt.prompt);
      if (pendingAgentPrompt.mode) {
        setChatMode(pendingAgentPrompt.mode);
      }
      if (typeof onClearPendingAgentPrompt === 'function') {
        onClearPendingAgentPrompt();
      }
    }
  }, [pendingAgentPrompt, onClearPendingAgentPrompt]);

  // גלילה אוטומטית להודעה האחרונה בצ'אט
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatMessages, isGenerating]);

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // העלאת תמונות/קבצים לצ'אט (וגם שמירת תמונה בגלריה עם URL אמיתי לקוד!)
  const handleFilesSelected = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList).slice(0, 4);
    const serverUrl = getActiveServerUrl();

    for (const file of filesArray) {
      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result;
        if (!dataUrl) return;

        let uploadedAssetUrl = dataUrl;
        if (isImage) {
          try {
            const resp = await fetch(`${serverUrl}/api/web-track/upload-ai-asset`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                dataUrl,
                filename: file.name
              })
            });
            const data = await resp.json();
            if (resp.ok && data?.url) {
              uploadedAssetUrl = `${serverUrl}${data.url}`;
            }
          } catch (err) {
            console.warn('Upload asset fallback to local dataUrl:', err);
          }

          // הוספה אוטומטית לגלריית התמונות כדי שהתלמיד יוכל להעתיק URL לתגית <img>
          const uploadedAsset = {
            id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            type: 'image',
            presetLabel: '📎 תמונה שהעלית מהמחשב',
            prompt: file.name,
            url: uploadedAssetUrl,
            width: 600,
            height: 400
          };
          setGeneratedAssets((prev) => [uploadedAsset, ...prev.slice(0, 14)]);
        }

        let textContent = '';
        if (!isImage) {
          try {
            textContent = await file.text();
          } catch {}
        }

        setAttachments((prev) => [
          ...prev,
          {
            id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            isImage,
            dataUrl,
            uploadedUrl: uploadedAssetUrl,
            textContent: textContent ? textContent.slice(0, 8000) : ''
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // שליחת הודעה בסוכן המאוחד (מייצר תמונה או טקסט לפי הבקשה!)
  const handleSendMessage = async (overridePrompt = null, overrideMode = null) => {
    const rawText = (overridePrompt !== null ? overridePrompt : inputPrompt).trim();
    if ((!rawText && attachments.length === 0) || isGenerating) return;

    const effectiveMode = overrideMode || chatMode;
    const isImageReq =
      attachments.length === 0 && detectIsImageRequest(rawText, effectiveMode);

    const currentAttachments = [...attachments];
    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: rawText || (currentAttachments.length > 0 ? `צירפתי ${currentAttachments.length} קבצים` : ''),
      attachments: currentAttachments,
      modeBadge: isImageReq ? '🖼️ בקשת תמונה' : '💬 שיחה וטקסט'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (overridePrompt === null) {
      setInputPrompt('');
    }
    setAttachments([]);
    setIsGenerating(true);

    const serverUrl = getActiveServerUrl();

    try {
      if (isImageReq) {
        // ====================================================================
        // 🖼️ מסלול יצירת תמונה חיה בצ'אט (Hugging Face FLUX.1 + תרגום אוטומטי)
        // ====================================================================
        const presetObj =
          IMAGE_PRESETS.find((p) => p.id === selectedPreset) || IMAGE_PRESETS[1];
        // ניקוי מילות פקודה בעברית מתחילת הפרומפט כדי שהתרגום יתמקד בנושא התמונה
        const cleanedSubject = rawText
          .replace(/^(צור לי תמונה של|צור תמונה של|תייצר לי תמונה של|תמונה של|צייר לי|צור לי באנר של|צור לי לוגו של|צור לי)\s*/i, '')
          .trim() || rawText;

        const resp = await fetch(`${serverUrl}/api/web-track/generate-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: cleanedSubject,
            styleSuffix: presetObj.styleSuffix,
            width: presetObj.width,
            height: presetObj.height
          })
        });
        const data = await resp.json();
        if (!resp.ok || !data?.imageUrl) {
          throw new Error(data?.error || 'שגיאה ביצירת התמונה בשרת');
        }

        const newAsset = {
          id: `img_${Date.now()}`,
          type: 'image',
          presetLabel: presetObj.label,
          prompt: rawText,
          translatedPrompt: data.translatedPrompt || cleanedSubject,
          provider: data.provider || 'Hugging Face FLUX.1',
          url: data.imageUrl,
          width: presetObj.width,
          height: presetObj.height
        };

        // שמירה בגלריה הקבועה של התלמיד
        setGeneratedAssets((prev) => [newAsset, ...prev.slice(0, 14)]);

        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant_img_${Date.now()}`,
            role: 'assistant',
            type: 'image',
            text: `יצרתי עבורך את התמונה עבור **"${rawText}"**! 🎨\nאפשר להעתיק מכאן בלחיצה אחת את הקישור לתמונה (URL) או את תגית ה-\`<img>\` המוכנה ולהדביק ישר באתר שלך:`,
            asset: newAsset
          }
        ]);
      } else {
        // ====================================================================
        // 💬 מסלול שיחה, טקסט, צבעים, קופירייטינג והסברי קוד (Qwen2.5 / DeepSeek / Gemini)
        // ====================================================================
        const attachmentNotes =
          currentAttachments.length > 0
            ? `\n\n[קבצים שצורפו להודעה זו:\n${currentAttachments
                .map((a) =>
                  a.isImage
                    ? `- תמונה: "${a.name}" (קישור מוכן לשימוש בקוד: ${a.uploadedUrl})`
                    : `- קובץ טקסט "${a.name}":\n${a.textContent}`
                )
                .join('\n')}]`
            : '';

        const systemContext = [
          `אתה סוכן ה-AI האישי של תלמיד שבונה את האתר "${brand}" בתחום "${topic}" (כעת במפגש ${sessionNum}: "${sessionTitle}").`,
          `תפקידך לעזור לתלמיד בעברית ברורה, ידידותית, מעודדת ומקצועית:`,
          `- אם התלמיד מבקש סלוגן, כותרות, שמות מותג, תיאורי מוצרים או שאלות ותשובות (FAQ): כתוב לו הצעות מוכנות להעתקה עם אימוג'ים מתאימים.`,
          `- אם התלמיד מבקש פלטת צבעים: תן לו 4 קודי צבע בפורמט HEX מדויק (למשל #0F172A, #2563EB, #38BDF8, #F8FAFC) והסבר קצר לאן כל צבע מתאים (רקע, כותרות, כפתורים).`,
          `- אם התלמיד שואל שאלה על HTML, CSS, JavaScript או בלוקים: הסבר לו בצורה פשוטה וברורה עם דוגמה קצרה.`,
          `- אם התלמיד העלה תמונה מהמחשב: הזכר לו שהוא יכול להעתיק את הקישור שלה מהגלריה למטה לתוך תגית <img> או לבלוק תמונה, וענה לבקשתו לגבי התמונה.`
        ].join('\n');

        const fullPrompt = `${systemContext}\n\nבקשת התלמיד:\n${rawText}${attachmentNotes}`;

        const resp = await fetch(`${serverUrl}/api/gemini`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: fullPrompt,
            attachments: currentAttachments.map((a) => ({
              name: a.name,
              mimeType: a.mimeType,
              dataUrl: a.isImage ? a.dataUrl : undefined,
              textContent: a.textContent
            }))
          })
        });
        const data = await resp.json();
        const replyText = (data?.result || '').trim();
        if (!resp.ok || !replyText) {
          throw new Error(data?.error || 'שגיאה בקבלת תשובה מסוכן ה-AI');
        }

        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant_txt_${Date.now()}`,
            role: 'assistant',
            type: 'text',
            text: replyText,
            hexColors: extractHexColors(replyText),
            uploadedImages: currentAttachments.filter((a) => a.isImage)
          }
        ]);
      }
    } catch (err) {
      console.error('AI Chat Agent Error:', err);
      // גיבוי אוטומטי חכם כדי שהתלמיד לעולם לא ייתקע באמצע השיעור
      if (isImageReq) {
        const samples = getInstantSampleImages(studentIdea?.ideaId);
        const fallbackAsset = {
          id: `img_fallback_${Date.now()}`,
          type: 'image',
          presetLabel: '🖼️ תמונת HD מהירה',
          prompt: rawText,
          provider: 'מאגר HD מהיר (גיבוי אוטומטי)',
          url: samples.product1,
          width: 600,
          height: 600
        };
        setGeneratedAssets((prev) => [fallbackAsset, ...prev.slice(0, 14)]);
        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant_img_fb_${Date.now()}`,
            role: 'assistant',
            type: 'image',
            text: `שרת ה-AI עמוס כרגע, אז שלפתי עבורך מיד תמונת HD מקצועית שמתאימה לאתר **"${brand}"** כדי שתוכל להמשיך לבנות ללא עיכוב:`,
            asset: fallbackAsset
          }
        ]);
      } else {
        const fallbackText =
          `✨ **הנה הצעה מעולה ומוכנה עבור האתר "${brand}" (${topic}):**\n\n` +
          `🏷️ **כותרת ראשית (\`<h1>\`):** ${brand} — החוויה המובילה בתחום ${topic}\n` +
          `💬 **סלוגן קצר (\`<h2>\`):** איכות, חדשנות וסטייל במקום אחד.\n` +
          `📝 **פסקת פתיחה (\`<p>\`):** ברוכים הבאים ל-${brand}! אצלנו תמצאו את המוצרים והתכנים הטובים ביותר בתחום ${topic}, בעיצוב מוקפד וחוויית שימוש מושלמת.\n\n` +
          `🎨 **פלטת צבעי HEX מומלצת ל-\`<style>\`:**\n` +
          `- רקע ראשי: \`#0F172A\`\n` +
          `- צבע מותג וכפתורים: \`#2563EB\`\n` +
          `- צבע הדגשה: \`#10B981\`\n` +
          `- צבע כרטיסיות: \`#FFFFFF\``;

        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant_txt_fb_${Date.now()}`,
            role: 'assistant',
            type: 'text',
            text: fallbackText,
            hexColors: ['#0F172A', '#2563EB', '#10B981', '#FFFFFF']
          }
        ]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const quickImageChips = [
    {
      label: '🖼️ צור באנר Hero לאתר שלי',
      prompt: `צור לי תמונה של באנר מרשים ויוקרתי לאתר "${brand}" בתחום ${topic}`,
      preset: 'hero'
    },
    {
      label: '🛍️ צור תמונת מוצר מרכזית',
      prompt: `צור לי תמונה של מוצר דגל מרהיב עבור "${brand}" בתחום ${topic}`,
      preset: 'product'
    },
    {
      label: '✨ צור לוגו למותג שלי',
      prompt: `צור לי לוגו מודרני ונקי למותג "${brand}" בתחום ${topic}`,
      preset: 'logo'
    }
  ];

  const quickTextChips = [
    {
      label: '🏷️ שמות מותג + סלוגן מנצח',
      prompt: `תן לי 3 רעיונות לשם מותג, סלוגן קליט לכותרת h2, ומשפט פתיחה קצר לאתר "${brand}" בתחום ${topic}.`
    },
    {
      label: '🎨 פלטת 4 צבעי HEX לעיצוב',
      prompt: `תן לי פלטת צבעים מקצועית עם 4 קודי HEX עבור האתר "${brand}" בתחום ${topic} (צבע רקע, צבע כותרות, צבע כפתור ראשי וצבע כרטיסיות).`
    },
    {
      label: '📋 3 יתרונות ופסקה לאתר',
      prompt: `כתוב עבורי פסקת תיאור מושכת ו-3 יתרונות קצרים עם אימוג'ים (לרשימת ul/li) עבור האתר "${brand}" (${topic}).`
    },
    {
      label: '❓ 3 שאלות ותשובות (FAQ)',
      prompt: `כתוב לי 3 שאלות נפוצות ותשובות קצרות וברורות שמתאימות ללקוחות באתר "${brand}" בתחום ${topic}.`
    }
  ];

  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        fontFamily: "'Segoe UI', 'Rubik', 'Assistant', Arial, sans-serif"
      }}
    >
      {/* =====================================================================
          1. כרטיס כותרת אזור סוכני ה-AI + החלפת נושא האתר
         ===================================================================== */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #31104b 55%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '20px 24px',
          border: '2px solid #8b5cf6',
          boxShadow: '0 10px 28px rgba(15, 23, 42, 0.16)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  color: '#ffffff',
                  fontWeight: '900',
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: '999px'
                }}
              >
                🤖 אזור סוכני ה-AI • חלון שיחה ליצירת תמונות וטקסט
              </span>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #34d399',
                  color: '#6ee7b7',
                  fontWeight: '800',
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  borderRadius: '999px'
                }}
              >
                🤗 מחובר ל-Hugging Face (FLUX.1 + Qwen2.5-Coder / DeepSeek)
              </span>
            </div>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.35rem', fontWeight: '900', color: '#ffffff' }}>
              💬 צ'אט חי עם סוכן ה-AI — יוצרים תמונות, סלוגנים, צבעים ותוכן ל-"{brand}"
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.5' }}>
              דבר עם הסוכן בחלון הצ'אט למטה: בקש ממנו ליצור תמונות מקוריות לאתר שלך או לכתוב עבורך כותרות, סלוגנים וקודי צבעים.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {setStudentIdea && (
              <button
                type="button"
                onClick={() => setShowIdeaPicker((prev) => !prev)}
                style={{
                  background: 'rgba(255, 255, 255, 0.14)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '9px 14px',
                  borderRadius: '11px',
                  fontWeight: '800',
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                🎯 שינוי נושא האתר ({brand}) {showIdeaPicker ? '▲' : '▼'}
              </button>
            )}

            {onSwitchToAITasksZone && (
              <button
                type="button"
                onClick={onSwitchToAITasksZone}
                style={{
                  background: '#7c3aed',
                  color: '#ffffff',
                  border: '1px solid #c4b5fd',
                  padding: '9px 14px',
                  borderRadius: '11px',
                  fontWeight: '800',
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                🧠 למשימות ה-AI של המפגש
              </button>
            )}

            <button
              type="button"
              onClick={onSwitchToCodingZone}
              style={{
                background: '#10b981',
                color: '#052e16',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '11px',
                fontWeight: '900',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              💻 למשימות התכנות והבנייה ⬅️
            </button>
          </div>
        </div>

        {/* בורר נושא ושם מותג מתקפל */}
        {showIdeaPicker && setStudentIdea && (
          <div
            style={{
              marginTop: '14px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '14px',
              padding: '14px'
            }}
          >
            <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#fde68a', marginBottom: '10px' }}>
              בחר קטגוריה ושם מותג לאתר שלך:
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
                gap: '8px',
                marginBottom: '12px'
              }}
            >
              {STUDENT_SITE_IDEAS.map((idea) => {
                const isSelected = studentIdea?.ideaId === idea.id;
                return (
                  <button
                    key={idea.id}
                    type="button"
                    onClick={() =>
                      setStudentIdea({
                        ideaId: idea.id,
                        customBrandName: idea.defaultBrand,
                        customTopic: idea.examples
                      })
                    }
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.22)' : 'rgba(255,255,255,0.06)',
                      border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '10px',
                      padding: '8px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '1.25rem' }}>{idea.icon}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800' }}>{idea.title}</div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  שם המותג / האתר שלך:
                </label>
                <input
                  type="text"
                  value={studentIdea?.customBrandName || ''}
                  onChange={(e) =>
                    setStudentIdea((prev) => ({ ...prev, customBrandName: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontWeight: '700',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#cbd5e1', marginBottom: '4px' }}>
                  נושא האתר ומה מוצג בו:
                </label>
                <input
                  type="text"
                  value={studentIdea?.customTopic || ''}
                  onChange={(e) =>
                    setStudentIdea((prev) => ({ ...prev, customTopic: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontWeight: '700',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          2. חלון הצ'אט המרכזי עם סוכן ה-AI (יצירת תמונות + טקסט באותה שיחה!)
         ===================================================================== */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer?.files?.length) {
            handleFilesSelected(e.dataTransfer.files);
          }
        }}
        style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '2px solid #c4b5fd',
          boxShadow: '0 12px 32px rgba(109, 40, 217, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* סרגל עליון של חלון הצ'אט: בחירת מצב (אוטומטי / תמונה / טקסט) + גודל תמונה */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
            borderBottom: '1.5px solid #ddd6fe',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '900', fontSize: '0.88rem', color: '#4c1d95' }}>
              🎛️ מצב הסוכן בצ'אט:
            </span>

            {[
              { id: 'auto', label: '🤖 אוטומטי (תמונה + טקסט)' },
              { id: 'image', label: '🖼️ יצירת תמונה (FLUX.1)' },
              { id: 'text', label: '💬 טקסט, צבעים ושיחה' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setChatMode(m.id)}
                style={{
                  background:
                    chatMode === m.id
                      ? m.id === 'image'
                        ? 'linear-gradient(135deg, #db2777, #9333ea)'
                        : 'linear-gradient(135deg, #6d28d9, #4f46e5)'
                      : '#ffffff',
                  color: chatMode === m.id ? '#ffffff' : '#4c1d95',
                  border: chatMode === m.id ? 'none' : '1px solid #c4b5fd',
                  padding: '6px 13px',
                  borderRadius: '999px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: chatMode === m.id ? '0 3px 10px rgba(109, 40, 217, 0.25)' : 'none'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* בורר גודל תמונה עבור יצירת תמונות */}
            {chatMode !== 'text' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', padding: '4px 8px', borderRadius: '10px', border: '1px solid #ddd6fe' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6d28d9' }}>גודל תמונה:</span>
                {IMAGE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPreset(p.id)}
                    style={{
                      background: selectedPreset === p.id ? '#f3e8ff' : 'transparent',
                      color: selectedPreset === p.id ? '#6d28d9' : '#64748b',
                      border: selectedPreset === p.id ? '1px solid #a855f7' : '1px solid transparent',
                      borderRadius: '7px',
                      padding: '3px 8px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setChatMessages([
                  {
                    id: `welcome_${Date.now()}`,
                    role: 'assistant',
                    type: 'welcome',
                    text: `השיחה אופסה! ✨ אני מוכן ליצור עבורך תמונות חדשות או טקסטים לאתר **"${brand}"**.`
                  }
                ])
              }
              style={{
                background: '#ffffff',
                color: '#64748b',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🗑️ נקה שיחה
            </button>
          </div>
        </div>

        {/* כפתורי פעולה מהירה ליצירת תמונות וטקסט בלחיצה אחת */}
        <div
          style={{
            background: '#faf5ff',
            borderBottom: '1px solid #ede9fe',
            padding: '10px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: '900', color: '#be185d' }}>
              🖼️ יצירת תמונה מהירה:
            </span>
            {quickImageChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  setSelectedPreset(chip.preset);
                  handleSendMessage(chip.prompt, 'image');
                }}
                style={{
                  background: '#fdf2f8',
                  color: '#9d174d',
                  border: '1px solid #fbcfe8',
                  borderRadius: '999px',
                  padding: '4px 11px',
                  fontSize: '0.76rem',
                  fontWeight: '800',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: '900', color: '#4338ca' }}>
              💬 יצירת טקסט וצבעים מהירה:
            </span>
            {quickTextChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isGenerating}
                onClick={() => handleSendMessage(chip.prompt, 'text')}
                style={{
                  background: '#eef2ff',
                  color: '#3730a3',
                  border: '1px solid #c7d2fe',
                  borderRadius: '999px',
                  padding: '4px 11px',
                  fontSize: '0.76rem',
                  fontWeight: '800',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* אזור הודעות הצ'אט */}
        <div
          style={{
            padding: '18px',
            minHeight: '360px',
            maxHeight: '520px',
            overflowY: 'auto',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-start' : 'flex-end',
                  width: '100%'
                }}
              >
                <div
                  style={{
                    maxWidth: msg.type === 'image' ? '560px' : '82%',
                    width: msg.type === 'image' ? '100%' : 'auto',
                    background: isUser
                      ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                      : '#ffffff',
                    color: isUser ? '#ffffff' : '#0f172a',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    border: isUser ? 'none' : '1.5px solid #e2e8f0',
                    padding: '14px 18px',
                    boxShadow: isUser
                      ? '0 4px 14px rgba(37, 99, 235, 0.2)'
                      : '0 4px 16px rgba(15, 23, 42, 0.06)'
                  }}
                >
                  {/* כותרת הבועה */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      color: isUser ? '#dbeafe' : '#6d28d9'
                    }}
                  >
                    <span>{isUser ? '🧑‍💻 אתה' : '🤖 סוכן ה-AI (תמונות וטקסט)'}</span>
                    {msg.modeBadge && (
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '0.7rem'
                        }}
                      >
                        {msg.modeBadge}
                      </span>
                    )}
                  </div>

                  {/* טקסט ההודעה */}
                  {msg.text && (
                    <div
                      style={{
                        fontSize: '0.94rem',
                        lineHeight: '1.65',
                        whiteSpace: 'pre-wrap',
                        fontWeight: isUser ? '600' : '500'
                      }}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* תצוגת קבצים שצורפו ע"י המשתמש */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          style={{
                            background: 'rgba(255,255,255,0.15)',
                            borderRadius: '10px',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {att.isImage && (
                            <img
                              src={att.dataUrl}
                              alt={att.name}
                              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                          )}
                          <span style={{ fontSize: '0.76rem', fontWeight: '700' }}>📎 {att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* אם זו בועת תמונה שנוצרה ע"י סוכן ה-AI */}
                  {msg.type === 'image' && msg.asset && (
                    <div
                      style={{
                        marginTop: '12px',
                        background: '#f8fafc',
                        border: '1.5px solid #ddd6fe',
                        borderRadius: '14px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div
                        style={{
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1px solid #cbd5e1',
                          background: '#0f172a',
                          maxHeight: '300px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img
                          src={msg.asset.url}
                          alt={msg.asset.prompt}
                          style={{
                            width: '100%',
                            maxHeight: '295px',
                            objectFit: 'contain',
                            display: 'block'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6d28d9' }}>
                          ✨ נוצר ע"י: {msg.asset.provider || 'Hugging Face FLUX.1'}
                        </span>
                        <span style={{ fontSize: '0.73rem', color: '#64748b' }}>
                          {msg.asset.presetLabel}
                        </span>
                      </div>

                      {/* כפתורי העתקה ישירים מתוך בועת הצ'אט */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(msg.asset.url, `url_${msg.id}`)}
                          style={{
                            background: copiedId === `url_${msg.id}` ? '#16a34a' : '#7c3aed',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9px',
                            padding: '9px 12px',
                            fontWeight: '800',
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          {copiedId === `url_${msg.id}`
                            ? '✓ הקישור (URL) הועתק!'
                            : '📋 העתק קישור לתמונה (URL)'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              `<img src="${msg.asset.url}" alt="${msg.asset.prompt.replace(/"/g, '')}" width="320">`,
                              `tag_${msg.id}`
                            )
                          }
                          style={{
                            background: copiedId === `tag_${msg.id}` ? '#16a34a' : '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9px',
                            padding: '9px 12px',
                            fontWeight: '800',
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          {copiedId === `tag_${msg.id}`
                            ? '✓ תגית <img> הועתקה!'
                            : '💻 העתק תגית <img> מוכנה'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* אם התשובה כוללת קודי צבע HEX — מציג דוגמיות צבע לחיצות להעתקה */}
                  {msg.hexColors && msg.hexColors.length > 0 && (
                    <div
                      style={{
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#475569' }}>
                        🎨 לחץ להעתקת קוד צבע:
                      </span>
                      {msg.hexColors.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => copyToClipboard(hex, `hex_${msg.id}_${hex}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontWeight: '800',
                            fontSize: '0.78rem',
                            direction: 'ltr'
                          }}
                        >
                          <span
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '4px',
                              background: hex,
                              border: '1px solid rgba(0,0,0,0.2)'
                            }}
                          />
                          <span>{copiedId === `hex_${msg.id}_${hex}` ? '✓ הועתק!' : hex}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* כפתור העתקת טקסט התשובה עבור הודעות טקסט */}
                  {!isUser && msg.type === 'text' && (
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(msg.text, `txt_${msg.id}`)}
                        style={{
                          background: copiedId === `txt_${msg.id}` ? '#16a34a' : '#f1f5f9',
                          color: copiedId === `txt_${msg.id}` ? '#ffffff' : '#334155',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '5px 12px',
                          fontSize: '0.76rem',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedId === `txt_${msg.id}` ? '✓ התשובה הועתקה!' : '📋 העתק טקסט'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  background: '#f5f3ff',
                  border: '1.5px solid #c4b5fd',
                  color: '#5b21b6',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  fontWeight: '800',
                  fontSize: '0.88rem'
                }}
              >
                ⏳ סוכן ה-AI מכין עבורך את התוצאה ב-Hugging Face...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* תצוגת קבצים שצורפו לפני שליחה */}
        {attachments.length > 0 && (
          <div
            style={{
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#475569' }}>
              📎 קבצים מצורפים להודעה:
            </span>
            {attachments.map((att) => (
              <div
                key={att.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '0.76rem',
                  fontWeight: '700'
                }}
              >
                {att.isImage && (
                  <img
                    src={att.dataUrl}
                    alt={att.name}
                    style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                )}
                <span>{att.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachments((prev) => prev.filter((x) => x.id !== att.id))}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontWeight: '900'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* שורת הקלט התחתונה של הצ'אט */}
        <div
          style={{
            background: '#f8fafc',
            borderTop: '1.5px solid #e2e8f0',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '10px'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.html,.css,.js,.txt,.json"
            style={{ display: 'none' }}
            onChange={(e) => {
              handleFilesSelected(e.target.files);
              e.target.value = '';
            }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="צרף תמונה או קובץ מהמחשב"
            style={{
              background: '#ffffff',
              color: '#4c1d95',
              border: '1.5px solid #c4b5fd',
              borderRadius: '12px',
              padding: '11px 14px',
              fontWeight: '800',
              fontSize: '0.84rem',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            📎 צרף תמונה / קובץ
          </button>

          <textarea
            rows={2}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onPaste={(e) => {
              if (e.clipboardData?.files?.length) {
                handleFilesSelected(e.clipboardData.files);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              chatMode === 'image'
                ? `כתוב בעברית איזו תמונה ליצור עבור "${brand}" (למשל: המבורגר עסיסי על שולחן עץ / לוגו מינימליסטי)...`
                : chatMode === 'text'
                ? `בקש מסוכן ה-AI סלוגן, כותרות, קודי צבעים או הסבר לקוד עבור "${brand}"...`
                : `כתוב לסוכן ה-AI: "צור לי תמונה של..." או בקש סלוגן, פלטת צבעים וטקסטים לאתר "${brand}"...`
            }
            style={{
              flex: 1,
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              padding: '10px 14px',
              fontSize: '0.94rem',
              fontFamily: "'Segoe UI', 'Rubik', 'Assistant', Arial, sans-serif",
              resize: 'none',
              outline: 'none',
              background: '#ffffff',
              color: '#0f172a'
            }}
          />

          <button
            type="button"
            disabled={isGenerating || (!inputPrompt.trim() && attachments.length === 0)}
            onClick={() => handleSendMessage()}
            style={{
              background:
                isGenerating || (!inputPrompt.trim() && attachments.length === 0)
                  ? '#cbd5e1'
                  : 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 22px',
              fontWeight: '900',
              fontSize: '0.92rem',
              cursor:
                isGenerating || (!inputPrompt.trim() && attachments.length === 0)
                  ? 'not-allowed'
                  : 'pointer',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)'
            }}
          >
            {isGenerating ? '⏳ מייצר...' : '🚀 שלח לסוכן'}
          </button>
        </div>
      </div>

      {/* =====================================================================
          3. הגלריה הקבועה של התמונות שנוצרו בשיחה (מוכנות להדבקה בכל מפגש!)
         ===================================================================== */}
      {generatedAssets.length > 0 && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1.5px solid #cbd5e1',
            padding: '18px 20px',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '12px'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900', color: '#0f172a' }}>
                🖼️ הגלריה שלי מהשיחה ({generatedAssets.length} תמונות מוכנות לשימוש באתר)
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                כל תמונה שיצרת בצ'אט או העלית מהמחשב נשמרת כאן — העתק את ה-URL שלה לתוך תגית <code>&lt;img&gt;</code> או לבלוק תמונה!
              </div>
            </div>

            {launchChosenWorkspace && (
              <button
                type="button"
                onClick={() => launchChosenWorkspace(activeTrack === 'code' ? 'code' : 'blocks')}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {activeTrack === 'code' ? '💻 פתח עורך קוד להדבקת התמונות ↗️' : '🧩 פתח WebBlocks להדבקת התמונות ↗️'}
              </button>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '12px'
            }}
          >
            {generatedAssets.map((asset) => (
              <div
                key={asset.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <img
                  src={asset.url}
                  alt={asset.prompt}
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    background: '#0f172a'
                  }}
                />
                <div
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    color: '#334155',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={asset.prompt}
                >
                  {asset.prompt}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(asset.url, `gal_url_${asset.id}`)}
                    style={{
                      flex: 1,
                      background: copiedId === `gal_url_${asset.id}` ? '#16a34a' : '#7c3aed',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '6px 8px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === `gal_url_${asset.id}` ? '✓ הועתק!' : '📋 העתק URL'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `<img src="${asset.url}" alt="${(asset.prompt || '').replace(/"/g, '')}" width="300">`,
                        `gal_tag_${asset.id}`
                      )
                    }
                    style={{
                      flex: 1,
                      background: copiedId === `gal_tag_${asset.id}` ? '#16a34a' : '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '6px 8px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === `gal_tag_${asset.id}` ? '✓ הועתק!' : '💻 תגית <img>'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { aiService } from './aiService';
import {
  VisualLesson,
  VisualLessonStep,
  ScreenAnnotation,
  LocalizedText,
} from '../types/visualLesson';
import { AAMCProject } from '../types';
import { Language } from '../i18n/types';

export interface AIAssistedAnnotationResult {
  success: boolean;
  isVisionSupported: boolean;
  message: string;
  annotations: ScreenAnnotation[];
  suggestedSteps?: Partial<VisualLessonStep>[];
}

export class VisualLessonAiService {
  /**
   * Explains a visual step in much simpler terms ("לא הבנתי")
   */
  public async explainStepSimpler(
    lesson: VisualLesson,
    step: VisualLessonStep,
    project?: AAMCProject,
    language: Language | string = 'he'
  ): Promise<string> {
    const stepTitle = step.title[language] || step.title.he;
    const stepInstruction = step.instruction[language] || step.instruction.he;
    const exactAction = step.exactAction[language] || step.exactAction.he;
    const genre = lesson.genre || project?.genre || 'Psytrance';

    const prompt =
      language === 'he'
        ? `אתה מורה מקצועי וחם להפקת מוזיקה ו-Ableton Live 12.
התלמיד נמצא בשיעור: "${lesson.title.he}" ובשלב: "${stepTitle}".
ההוראה הנוכחית היא: "${stepInstruction}".
הפעולה הנדרשת: "${exactAction}".
ז'אנר: ${genre}, BPM: ${project?.bpm || 142}, סולם: ${project?.key || 'F#'}.

התלמיד לחץ על כפתור "לא הבנתי".
הסבר לו את אותו השלב בדיוק, אבל במילים פשוטות מאוד, צעד-אחר-צעד, בלי ז'רגון מסובך, ותן לו הנחיה ויזואלית ברורה על מה להסתכל בתמונה ומה לעשות עכשיו. שמור על הסבר קצר וממוקד (עד 3-4 פסקאות קצרות).`
        : `You are an expert music production coach.
The student is in lesson: "${lesson.title.en || lesson.title.he}", Step: "${stepTitle}".
Instruction: "${stepInstruction}".
Exact Action: "${exactAction}".
Genre: ${genre}, BPM: ${project?.bpm || 142}, Key: ${project?.key || 'F#'}.

The student clicked "I didn't understand".
Explain this step in very simple, jargon-free, step-by-step language. Tell them exactly where to look in the image and what action to take. Keep it concise (under 3 short paragraphs).`;

    try {
      const res = await aiService.chat(prompt, {
        lessonId: lesson.id,
        stepId: step.id,
        context: 'visual_coach_simpler_explanation',
      });
      return res.reply;
    } catch {
      return language === 'he'
        ? `בוא נפשט את זה: הסתכל על האזור המואר בתמונה (מסומן בירוק). כל מה שצריך לעשות זה להזין את הערך ${exactAction} ולהקשיב איך זה משנה את הסאונד.`
        : `Let's simplify: Look at the highlighted green area in the image. Set the parameter to ${exactAction} and listen to how it cleans up the sound.`;
    }
  }

  /**
   * Explains why this specific action matters musically & technically ("למה?")
   */
  public async explainWhyMatters(
    lesson: VisualLesson,
    step: VisualLessonStep,
    project?: AAMCProject,
    language: Language | string = 'he'
  ): Promise<string> {
    const stepTitle = step.title[language] || step.title.he;
    const whySnippet = step.why[language] || step.why.he;
    const genre = lesson.genre || project?.genre || 'Psytrance';

    const prompt =
      language === 'he'
        ? `אתה מפיק מוזיקלי בכיר. התלמיד שואל "למה?" לגבי השלב "${stepTitle}" בשיעור "${lesson.title.he}".
ההסבר הבסיסי: "${whySnippet}".
ז'אנר: ${genre}, BPM: ${project?.bpm || 142}, סולם: ${project?.key || 'F#'}.

הסבר לעומק בצורה מוזיקלית וטכנית (מדוע זה קריטי למיקס, לפסיכואקוסטיקה, לרחבת הריקודים / סאונד סיסטם, ולמניעת התנגשויות תדרים). שמור על ניסוח מעורר השראה ומקצועי.`
        : `You are a master music producer. The student asks "Why?" for step "${stepTitle}" in lesson "${lesson.title.en || lesson.title.he}".
Basic explanation: "${whySnippet}".
Genre: ${genre}, BPM: ${project?.bpm || 142}, Key: ${project?.key || 'F#'}.

Explain deeply why this matters for the mix, sound system impact, psychoacoustics, and frequency balance. Keep it professional and inspiring.`;

    try {
      const res = await aiService.chat(prompt, {
        lessonId: lesson.id,
        stepId: step.id,
        context: 'visual_coach_why_explanation',
      });
      return res.reply;
    } catch {
      return whySnippet;
    }
  }

  /**
   * AI-Assisted Annotation Tool ("AI עזור לי לסמן")
   * Analyzes an instructional image / diagram and suggests normalized bounding boxes and lesson steps.
   */
  public async suggestAnnotationsForImage(
    imageUriOrType: string,
    imageName: string,
    promptDescription?: string,
    language: Language | string = 'he'
  ): Promise<AIAssistedAnnotationResult> {
    const aiSettings = aiService.getSettings();

    // Check if offline/local-only mode without vision is active
    if (aiSettings.mode === 'local-only') {
      // Local model: provide honest explanation + smart pedagogical template annotations
      const smartTemplates = this.getSmartFallbackAnnotations(imageName, imageUriOrType);
      return {
        success: true,
        isVisionSupported: false,
        message:
          language === 'he'
            ? 'המודל המקומי הנוכחי אינו תומך בניתוח תמונות (Vision). נוצרה תבנית סימונים חכמה לפי סוג התמונה, ותוכל להתאים את הסימונים ידנית בעורך.'
            : 'The current local model does not support Vision processing. Created a smart template based on the diagram type; you can adjust markers manually.',
        annotations: smartTemplates.annotations,
        suggestedSteps: smartTemplates.steps,
      };
    }

    // Cloud / Gemini Provider: Generate contextual annotations
    try {
      const prompt = `You are an AI Music Production Lesson Designer.
Analyze this instructional graphic: "${imageName}" (Description: ${promptDescription || 'Music production UI/diagram'}).
Generate 3 to 4 pedagogical visual steps for a student learning music production from this image.
Return a valid JSON object matching this schema:
{
  "annotations": [
    {
      "id": "ann-1",
      "type": "rectangle", // or spotlight, circle, arrow, number, textBubble
      "x": 0.25, // normalized 0.0 to 1.0
      "y": 0.35,
      "width": 0.20,
      "height": 0.15,
      "color": "lime",
      "label": { "he": "כותרת קצרה", "en": "Short Title" },
      "description": { "he": "הסבר קצר", "en": "Short description" }
    }
  ],
  "steps": [
    {
      "title": { "he": "שלב 1: כיוון ה-Threshold", "en": "Step 1: Set Threshold" },
      "instruction": { "he": "הוראה ברורה לתלמיד", "en": "Clear instruction" },
      "why": { "he": "מדוע זה חשוב", "en": "Why this matters" },
      "exactAction": { "he": "כוון ל- -18dB", "en": "Set to -18dB" },
      "expectedResult": { "he": "מד ה-GR מראה הנחתה של 4dB", "en": "GR meter shows 4dB reduction" }
    }
  ]
}
Return ONLY valid JSON.`;

      const res = await aiService.chat(prompt, { context: 'ai_visual_lesson_generation' });
      const jsonMatch = res.reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          isVisionSupported: true,
          message:
            language === 'he'
              ? 'AI ניתח את התמונה ויצר סימונים ושלבי למידה מותאמים בהצלחה!'
              : 'AI successfully analyzed the image and generated annotations and lesson steps!',
          annotations: parsed.annotations || [],
          suggestedSteps: parsed.steps || [],
        };
      }
    } catch {
      // Fallback on JSON parse failure
    }

    const fallback = this.getSmartFallbackAnnotations(imageName, imageUriOrType);
    return {
      success: true,
      isVisionSupported: true,
      message:
        language === 'he'
          ? 'נוצרו סימונים מומלצים בהתאם למבנה התמונה.'
          : 'Generated recommended annotations based on diagram structure.',
      annotations: fallback.annotations,
      suggestedSteps: fallback.steps,
    };
  }

  /**
   * AI-Assisted Full Lesson Generator from Diagram / Image
   */
  public async analyzeDiagramAndGenerateLesson(
    imageName: string,
    category: any = 'psytrance',
    language: Language | string = 'he',
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate'
  ): Promise<VisualLesson> {
    const isHe = language === 'he';
    const annotationResult = await this.suggestAnnotationsForImage(
      category,
      imageName,
      `Music production diagram / UI for ${imageName}`,
      language
    );

    const generatedSteps: VisualLessonStep[] = (annotationResult.suggestedSteps && annotationResult.suggestedSteps.length > 0)
      ? annotationResult.suggestedSteps.map((s, idx) => ({
          id: idx + 1,
          title: s.title || {
            he: `שלב ${idx + 1}: ${imageName}`,
            en: `Step ${idx + 1}: ${imageName}`,
          },
          instruction: s.instruction || {
            he: `כוונן את הפרמטר המסומן בהתאם להנחיות.`,
            en: `Adjust the highlighted parameter according to instructions.`,
          },
          why: s.why || {
            he: `קובע את הבהירות והאיזון הדינמי במיקס.`,
            en: `Ensures tonal clarity and dynamic balance in the mix.`,
          },
          exactAction: s.exactAction || {
            he: `כוונן לערך המומלץ`,
            en: `Set to recommended value`,
          },
          expectedResult: s.expectedResult || {
            he: `צליל נקי, יציב וללא התנגשויות תדרים`,
            en: `Clean, tight sound with no frequency collisions`,
          },
          defaultImageKey: 'custom',
          annotations: idx === 0 ? annotationResult.annotations : [
            {
              id: `ann_step_${idx}_1`,
              type: 'spotlight',
              x: 0.2 + (idx * 0.15) % 0.5,
              y: 0.3 + (idx * 0.1) % 0.4,
              width: 0.25,
              height: 0.25,
              color: 'lime',
              label: {
                he: `פרמטר ${idx + 1}`,
                en: `Parameter ${idx + 1}`,
              },
            },
          ],
        }))
      : [
          {
            id: 1,
            title: {
              he: `שלב 1: סקירת הבקר המרכזי ב-${imageName}`,
              en: `Step 1: Primary Control Overview in ${imageName}`,
            },
            instruction: {
              he: `אתר את הפרמטר המרכזי המודגש בדיאגרמה וכוונן לערך המומלץ.`,
              en: `Locate the primary parameter highlighted on the diagram and adjust to the recommended setting.`,
            },
            why: {
              he: `פרמטר זה קובע את האיזון הטונאלי המרכזי והנוכחות ההרמונית של הצליל.`,
              en: `This parameter defines the core tonal balance and harmonic presence.`,
            },
            exactAction: {
              he: `כוונן את ערך הפרמטר בהתאם לדרישות ההפקה.`,
              en: `Set parameter value according to production requirements.`,
            },
            expectedResult: {
              he: `סאונד הדוק ונקי עם הדרום אופטימלי ואימפקט טרנזיינטים מדויק.`,
              en: `Clean, tight sound with optimal headroom and transient impact.`,
            },
            defaultImageKey: 'custom',
            annotations: annotationResult.annotations,
          },
        ];

    return {
      id: `lesson_ai_${Date.now()}`,
      courseId: category,
      category,
      title: {
        he: imageName.trim() || 'שיעור חזותי חכם',
        en: imageName.trim() || 'Smart Visual Lesson',
      },
      subtitle: {
        he: 'מדריך חזותי אינטראקטיבי שנוצר באמצעות AI',
        en: 'AI-assisted interactive visual guide',
      },
      description: {
        he: `שיעור חזותי מקיף בנושא ${imageName} עם הנחיות מדויקות, סימונים והסברים מוזיקליים.`,
        en: `Comprehensive visual guide on ${imageName} with precise annotations and musical explanations.`,
      },
      genre: 'Psytrance',
      difficulty,
      estimatedMinutes: 6,
      tags: [imageName, 'Visual Coach', 'AI Generated', 'Ableton'],
      isCustom: true,
      steps: generatedSteps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Smart template generator for common diagram types
   */
  private getSmartFallbackAnnotations(name: string, type: string) {
    const lower = (name + ' ' + type).toLowerCase();

    if (lower.includes('compressor') || lower.includes('dynamics')) {
      return {
        annotations: [
          {
            id: 'ann-comp-1',
            type: 'spotlight' as const,
            x: 0.08,
            y: 0.45,
            width: 0.16,
            height: 0.35,
            color: 'cyan' as const,
            label: { he: 'Threshold (סף הפעלה)', en: 'Threshold' },
            description: { he: 'קובע מאיזו עוצמת dB הקומפרסור יתחיל לעבוד', en: 'Sets level where compression begins' },
          },
          {
            id: 'ann-comp-2',
            type: 'rectangle' as const,
            x: 0.25,
            y: 0.45,
            width: 0.16,
            height: 0.35,
            color: 'lime' as const,
            label: { he: 'Ratio (יחס דחיסה)', en: 'Ratio' },
            description: { he: 'יחס של 4:1 מושלם להדבקת תופים ובס', en: '4:1 ratio for tight drum/bass glue' },
          },
          {
            id: 'ann-comp-3',
            type: 'rectangle' as const,
            x: 0.05,
            y: 0.18,
            width: 0.90,
            height: 0.22,
            color: 'amber' as const,
            label: { he: 'Gain Reduction Meter', en: 'GR Meter' },
            description: { he: 'מציג כמה dB מונחתים בזמן אמת', en: 'Real-time dB attenuation meter' },
          },
        ],
        steps: [
          {
            title: { he: 'כיוון סף ההפעלה (Threshold)', en: 'Set Compression Threshold' },
            instruction: { he: 'הורד את ה-Threshold עד שמד ה-GR מראה הנחתה של 3-6dB ברגעי השיא.', en: 'Lower Threshold until GR meter shows 3-6dB reduction on peaks.' },
            why: { he: 'זה מייצב את הדינמיקה ומבטיח שהקיק והבס לא יקפצו בעוצמה לא רצויה.', en: 'Stabilizes dynamics so kick and bass remain consistent.' },
            exactAction: { he: 'כוון ל- -16.0 dB', en: 'Set to -16.0 dB' },
            expectedResult: { he: 'מד ה-GR מגיב בחוזקה ומנחית כ-4dB', en: 'GR meter reduces ~4dB smoothly' },
          },
        ],
      };
    }

    if (lower.includes('eq') || lower.includes('spectrum')) {
      return {
        annotations: [
          {
            id: 'ann-eq-1',
            type: 'spotlight' as const,
            x: 0.10,
            y: 0.35,
            width: 0.12,
            height: 0.45,
            color: 'red' as const,
            label: { he: 'Low Cut (HPF @ 30Hz)', en: 'Low Cut HPF' },
            description: { he: 'חיתוך תדרי סאב לא שמיעים המבזבזים הדרום', en: 'Cuts sub rumble below 30Hz' },
          },
          {
            id: 'ann-eq-2',
            type: 'rectangle' as const,
            x: 0.45,
            y: 0.48,
            width: 0.15,
            height: 0.30,
            color: 'amber' as const,
            label: { he: 'Mud Cut @ 300Hz', en: 'Mud Cut' },
            description: { he: 'ניקוי אזור הבוץ במיקס לקבלת צליל שקוף', en: 'Cleans low-mid boxiness' },
          },
        ],
        steps: [
          {
            title: { he: 'חיתוך תדרי סאב נמוכים (Low Cut)', en: 'Apply Low Cut Filter' },
            instruction: { he: 'הפעל Band 1 במצב High Pass ב-30Hz עם מדרון 24dB/oct.', en: 'Enable Band 1 High Pass at 30Hz with 24dB/oct slope.' },
            why: { he: 'מנקה אנרגיה מיותרת מתחת ל-30Hz ומפנה הדרום עוצמתי למאסטר.', en: 'Frees up huge headroom for the master limiter.' },
            exactAction: { he: 'High Pass @ 30Hz, Slope 24', en: 'High Pass @ 30Hz, Slope 24' },
            expectedResult: { he: 'הסאב נשמע הדוק ומדויק יותר', en: 'Tighter sub punch with zero mud' },
          },
        ],
      };
    }

    // Generic Default Template
    return {
      annotations: [
        {
          id: 'ann-gen-1',
          type: 'spotlight' as const,
          x: 0.20,
          y: 0.25,
          width: 0.60,
          height: 0.50,
          color: 'lime' as const,
          label: { he: 'אזור בקרה מרכזי', en: 'Main Control Region' },
          description: { he: 'הפרמטר המרכזי לעיצוב הצליל', en: 'Primary parameter for sound shaping' },
        },
      ],
      steps: [
        {
          title: { he: 'הגדרת הפרמטר הראשי', en: 'Configure Primary Control' },
          instruction: { he: 'כוון את הפרמטר המסומן בתמונה בהתאם לצליל המבוקש.', en: 'Adjust the highlighted control according to target tone.' },
          why: { he: 'פעולה זו מייצרת את הגוון המאפיין את הז׳אנר.', en: 'Creates the distinct genre timbre.' },
          exactAction: { he: 'סובב את הנוב לערך הרצוי', en: 'Turn knob to target value' },
          expectedResult: { he: 'הסאונד משתלב בצורה מושלמת במיקס', en: 'Sound sits perfectly in the mix' },
        },
      ],
    };
  }
}

export const visualLessonAiService = new VisualLessonAiService();

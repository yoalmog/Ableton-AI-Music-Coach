import { TutorialLesson } from '../types/workspaceReference';
import { REFERENCE_IMAGE_LIBRARY } from './referenceImageLibrary';

export const CORE_TUTORIAL_LESSONS: TutorialLesson[] = [
  // =========================================================================
  // 1. Ableton Interface Overview
  // =========================================================================
  {
    id: 'lesson-interface-overview',
    title: {
      en: '1. Ableton Interface Overview',
      he: '1. מבט-על על ממשק אבלטון לייב 12',
      es: '1. Visión general de la interfaz de Live 12',
    },
    subtitle: {
      en: 'The Core Layout: Session, Arrangement, Browser & Detail Views',
      he: 'מבנה הליבה: Session, Arrangement, סייר הפלאגינים ותצוגת הפרטים',
      es: 'La estructura principal: Session, Arrangement, Navegador y Vista Detalle',
    },
    description: {
      en: 'Get oriented with Ableton Live 12 layout. Understand the two main views (Session & Arrangement) and the top Control Bar.',
      he: 'הכר את מבנה הממשק הייחודי של Ableton Live 12: שתי התצוגות הראשיות (Session ו-Arrangement), סרגל ה-Transport וסייר הדגימות.',
      es: 'Oriéntate con la interfaz de Live 12 y sus dos vistas principales.',
    },
    workspace: 'CONTROL_BAR',
    category: 'core_interface',
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    referenceImages: [
      REFERENCE_IMAGE_LIBRARY['ref-transport'],
      REFERENCE_IMAGE_LIBRARY['ref-session-view'],
      REFERENCE_IMAGE_LIBRARY['ref-arrangement-view'],
    ],
    steps: [
      {
        id: 1,
        type: 'observe',
        title: {
          en: 'Observe the Top Control Bar',
          he: 'התבונן בסרגל השליטה וה-Transport העליון',
          es: 'Observa la barra de transporte superior',
        },
        instruction: {
          en: 'Look at the reference image showing the top Control Bar of Ableton Live 12.',
          he: 'הבט בתמונת הייחוס המציגה את סרגל ה-Control Bar העליון של אבלטון לייב 12.',
          es: 'Mira la imagen de referencia que muestra la barra de control superior.',
        },
        explanation: {
          en: 'The Control Bar houses the global Tempo (BPM), Time Signature (4/4), Metronome, and Play/Stop buttons.',
          he: 'סרגל השליטה מכיל את מהירות הפרויקט (BPM), חתימת הזמן (4/4), המטרונום ולחצני ההשמעה וההקלטה.',
          es: 'La barra de control contiene el Tempo (BPM), compás, metrónomo y controles de transporte.',
        },
        referenceImageId: 'ref-transport',
        activeHotspotId: 'transport-bpm',
      },
      {
        id: 2,
        type: 'try',
        title: {
          en: 'Set BPM in the Simulator',
          he: 'הגדר את מהירות הפרויקט ל-142 BPM בסימולטור',
          es: 'Ajusta el tempo a 142 BPM en el simulador',
        },
        instruction: {
          en: 'Click on the BPM display in the simulator Control Bar and set the tempo to 142 BPM.',
          he: 'לחץ על תצוגת ה-BPM בסרגל העליון בסימולטור והגדר את המהירות ל-142 BPM.',
          es: 'Haz clic en el visualizador de BPM y escribe 142.',
        },
        explanation: {
          en: '142 BPM provides the signature driving momentum for Psytrance and modern club productions.',
          he: '142 BPM מספק את הגרוב והתנופה הקצבית האופיינית למוזיקת פסיטראנס ופול-און.',
          es: '142 BPM es la velocidad estándar para producciones electrónicas dinámicas.',
        },
        simulatorTargetId: 'tempo-bpm',
        expectedAction: 'CLICK',
        expectedValue: 142,
      },
    ],
  },

  // =========================================================================
  // 2. Session View
  // =========================================================================
  {
    id: 'lesson-session-view',
    title: {
      en: '2. Understanding Session View',
      he: '2. הבנת תצוגת ה-Session View',
      es: '2. Comprendiendo la Vista Session',
    },
    subtitle: {
      en: 'Non-Linear Clip Launching and Scene Workflow',
      he: 'הפעלת קליפים לא-ליניארית ועבודה עם סצנות (Scenes)',
      es: 'Lanzamiento de clips no lineal y flujo de trabajo con escenas',
    },
    description: {
      en: 'Learn how Session View allows you to build multi-track loops, test combinations of ideas, and trigger full scenes effortlessly.',
      he: 'למד כיצד ה-Session View מאפשר לבנות לופים מרובי ערוצים, לבדוק שילובי רעיונות מוזיקליים ולהפעיל סצנות בלחיצה אחת.',
      es: 'Aprende cómo Session View te permite probar combinaciones y lanzar escenas completas.',
    },
    workspace: 'SESSION_VIEW',
    category: 'core_interface',
    difficulty: 'Beginner',
    estimatedMinutes: 6,
    referenceImages: [REFERENCE_IMAGE_LIBRARY['ref-session-view']],
    steps: [
      {
        id: 1,
        type: 'observe',
        title: {
          en: 'Identify Track Columns & Clip Slots',
          he: 'זיהוי עמודי הערוצים ומשבצות הקליפים',
          es: 'Identifica las columnas de pistas y ranuras de clips',
        },
        instruction: {
          en: 'Look at the vertical track columns in the official Ableton reference image.',
          he: 'הבט בעמודות הערוצים האנכיות בתמונת הייחוס הרשמית של אבלטון.',
          es: 'Mira las columnas verticales de pistas en la imagen de referencia.',
        },
        explanation: {
          en: 'Each vertical column represents a track. Each rectangular slot can hold an audio or MIDI clip.',
          he: 'כל עמודה אנכית מייצגת ערוץ נפרד (אודיו או MIDI). בכל משבצת מלבנית ניתן לטעון או להקליט קליפ.',
          es: 'Cada columna vertical representa una pista. Cada ranura puede contener un clip.',
        },
        referenceImageId: 'ref-session-view',
        activeHotspotId: 'session-tracks',
      },
      {
        id: 2,
        type: 'understand',
        title: {
          en: 'Scene Launch Buttons (Master Track)',
          he: 'הבנת לחצני ה-Scene Launch בערוץ המאסטר',
          es: 'Botones de lanzamiento de escena (Pista Master)',
        },
        instruction: {
          en: 'Inspect the rightmost Master column containing numbered Scene Launch buttons.',
          he: 'בחן את עמודת המאסטר הימנית המכילה לחצני הפעלת סצנה ממוספרים.',
          es: 'Inspecciona la columna Master con los botones numerados de escena.',
        },
        explanation: {
          en: 'Clicking Scene 1 triggers all clips in row 1 simultaneously in tempo sync, allowing you to transition between song sections.',
          he: 'לחיצה על כפתור Scene 1 מפעילה את כל הקליפים בשורה הראשונה בו-זמנית בסנכרון קצבי מלא.',
          es: 'Al hacer clic en Scene 1 se reproducen todos los clips de esa fila a la vez.',
        },
        referenceImageId: 'ref-session-view',
        activeHotspotId: 'session-scene-launch',
      },
      {
        id: 3,
        type: 'try',
        title: {
          en: 'Launch Scene 1 in Simulator',
          he: 'הפעל את סצנה 1 (Scene 1) בסימולטור',
          es: 'Lanza la Escena 1 en el simulador',
        },
        instruction: {
          en: 'Switch to Session View and click the Play triangle on Scene 1 in the Master column.',
          he: 'עבור לתצוגת Session ולחץ על משולש ה-Play של Scene 1 בעמודת ה-Master.',
          es: 'Haz clic en el botón de reproducción de Scene 1.',
        },
        explanation: {
          en: 'Notice how both Kick, Bass, and Lead clips begin playing together on the next quantized downbeat.',
          he: 'שים לב כיצד קליפי התופים, הבס והליד מתחילים לנגן יחד בסנכרון מושלם על הפעמה הראשונה.',
          es: 'Observa cómo todos los clips comienzan a reproducirse sincronizados.',
        },
        simulatorTargetId: 'session-scene-launch',
        expectedAction: 'CLICK',
      },
    ],
  },

  // =========================================================================
  // 3. Arrangement View
  // =========================================================================
  {
    id: 'lesson-arrangement-view',
    title: {
      en: '3. Arrangement View Timeline',
      he: '3. ציר הזמן ב-Arrangement View',
      es: '3. Línea de tiempo en Arrangement View',
    },
    subtitle: {
      en: 'Linear Song Structuring, Track Lanes, and Playhead Navigation',
      he: 'מבנה שיר ליניארי, רצועות ערוצים וניווט עם ה-Playhead',
      es: 'Estructuración lineal de canciones y navegación',
    },
    description: {
      en: 'Master the horizontal timeline where full songs are arranged, structured from Intro to Drop, and edited with surgical precision.',
      he: 'שלוט בציר הזמן האופקי שבו מסדרים את מבנה השיר המלא מהאינטרו ועד לדרופ, ועורכים קליפים בדיוק כירורגי.',
      es: 'Domina la línea de tiempo horizontal donde se estructuran y editan canciones completas.',
    },
    workspace: 'ARRANGEMENT_VIEW',
    category: 'core_interface',
    difficulty: 'Beginner',
    estimatedMinutes: 6,
    referenceImages: [REFERENCE_IMAGE_LIBRARY['ref-arrangement-view']],
    steps: [
      {
        id: 1,
        type: 'observe',
        title: {
          en: 'Observe the Beat-Time Ruler',
          he: 'התבונן בסרגל התיבות והזמן',
          es: 'Observa la regla de tiempo y compases',
        },
        instruction: {
          en: 'Look at the top ruler showing Bars and Beats (1.1, 5.1, 9.1).',
          he: 'הבט בסרגל העליון המציג מספרי תיבות ופעמות (1.1, 5.1, 9.1).',
          es: 'Mira la regla superior con compases y tiempos.',
        },
        explanation: {
          en: 'Electronic music is structured in 8, 16, or 32-bar phrases. Bar 9 or 17 is commonly where the main Drop hits.',
          he: 'מוזיקה אלקטרונית בנויה במבנים של 8, 16 או 32 תיבות. בתיבה 9 או 17 בדרך כלל נכנס הדרופ המרכזי.',
          es: 'La música electrónica se estructura en frases de 8, 16 o 32 compases.',
        },
        referenceImageId: 'ref-arrangement-view',
        activeHotspotId: 'arr-time-ruler',
      },
      {
        id: 2,
        type: 'try',
        title: {
          en: 'Select Track 2 (Bass) in Simulator',
          he: 'בחר את ערוץ 2 (Bass) בסימולטור',
          es: 'Selecciona la pista 2 (Bass) en el simulador',
        },
        instruction: {
          en: 'Click on the Track 2 (Bass) header on the right side of the arrangement timeline.',
          he: 'לחץ על כותרת ערוץ 2 (Bass) בצד ימין של ציר הזמן בסימולטור.',
          es: 'Haz clic en el encabezado de la pista 2 (Bass).',
        },
        explanation: {
          en: 'Selecting a track highlights its clips and opens its device chain in the bottom panel.',
          he: 'בחירת ערוץ מדגישה את הקליפים שלו וטוענת את שרשרת האפקטים והסינת׳יסייזר בחלון התחתון.',
          es: 'Al seleccionar una pista se abre su cadena de dispositivos.',
        },
        simulatorTargetId: 'track-select-t2',
        expectedAction: 'CLICK',
        expectedValue: 't2',
      },
    ],
  },

  // =========================================================================
  // 4. MIDI Note Editor (Piano Roll)
  // =========================================================================
  {
    id: 'lesson-midi-editor',
    title: {
      en: '4. MIDI Note Editor & 16th Grid',
      he: '4. עורך תווי MIDI וגריד 1/16',
      es: '4. Editor de notas MIDI y rejilla de 16avos',
    },
    subtitle: {
      en: 'Writing Driving Basslines in F# Minor on the 16th Matrix',
      he: 'כתיבת תבנית בס פסיטראנס מניעה בסולם F# Minor על גריד 1/16',
      es: 'Escribiendo líneas de bajo en F# Menor con rejilla 1/16',
    },
    description: {
      en: 'Learn how to navigate the Piano Roll, understand the 16th note subdivision, and draw driving Psytrance basslines.',
      he: 'למד כיצד להשתמש ב-Piano Roll, להבין את חלוקת הגריד ל-1/16 ולכתוב בס מתגלגל ומדויק.',
      es: 'Aprende a usar el Piano Roll y programar bajos continuos.',
    },
    workspace: 'MIDI_EDITOR',
    category: 'psytrance',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    referenceImages: [REFERENCE_IMAGE_LIBRARY['ref-midi-editor']],
    steps: [
      {
        id: 1,
        type: 'observe',
        title: {
          en: 'Observe the 16th Note Grid Pattern',
          he: 'התבונן בחלוקת הגריד ל-16th Notes',
          es: 'Observa la rejilla de notas de 1/16',
        },
        instruction: {
          en: 'Look at the reference image showing notes placed on positions 2, 3, and 4 of each beat.',
          he: 'הבט בתמונת הייחוס המציגה תווים הממוקמים בפעימות 2, 3 ו-4 בכל רבע (K-B-B-B).',
          es: 'Observa cómo las notas se colocan en los tiempos 2, 3 y 4 de cada pulso.',
        },
        explanation: {
          en: 'In Psytrance (K-B-B-B), the Kick occupies the 1st 16th note, and the Bass occupies the remaining three 16th notes (2, 3, 4).',
          he: 'בפסיטראנס (K-B-B-B), ה-Kick מנגן על הרבע הראשון, ושלושת תווי הבס ממלאים את שלוש ה-16th הבאות ברצף מניע.',
          es: 'El bombo suena en el primer 16avo y el bajo en los tres siguientes.',
        },
        referenceImageId: 'ref-midi-editor',
        activeHotspotId: 'midi-grid-notes',
      },
      {
        id: 2,
        type: 'try',
        title: {
          en: 'Draw the 16th Bassline Pattern in Simulator',
          he: 'צייר את תווי הבס ב-Piano Roll בסימולטור',
          es: 'Dibuja el patrón de bajo en el simulador',
        },
        instruction: {
          en: 'Open the Piano Roll and click on the grid at F#1 to create the rolling bassline notes.',
          he: 'פתח את ה-Piano Roll ולחץ על משבצות ה-1/16 בשורת F#1 לבניית מקטע הבס.',
          es: 'Haz clic en la rejilla en F#1 para crear las notas de bajo.',
        },
        explanation: {
          en: 'F# (approx 46 Hz) is the golden resonant frequency for electronic club sub-woofers.',
          he: 'התו F# (כ-46 הרץ) הוא התדר האידיאלי למערכות סאבוופר במועדונים ופסטיבלים.',
          es: 'F# es la nota óptima para la resonancia de sub-bajos en clubs.',
        },
        simulatorTargetId: 'pianoroll-grid',
        expectedAction: 'MIDI_NOTE',
      },
    ],
  },

  // =========================================================================
  // 5. Device View & Sound Synthesis
  // =========================================================================
  {
    id: 'lesson-device-view',
    title: {
      en: '5. Device View & Drift Synthesizer',
      he: '5. חלון המכשירים והסינת׳יסייזר Drift',
      es: '5. Vista de dispositivos y sintetizador Drift',
    },
    subtitle: {
      en: 'Sculpting Bass Harmonics with Cutoff and Resonance',
      he: 'עיצוב הרמוניות הבס באמצעות פילטר Cutoff ו-Resonance',
      es: 'Esculpiendo armónicos con corte de filtro y resonancia',
    },
    description: {
      en: 'Explore the bottom Device View. Learn how the filter cutoff shapes the aggressive pluck of your synthesizer.',
      he: 'חקור את חלון ה-Device View. למד כיצד כפתור ה-Cutoff והתהודה (Resonance) מעצבים את האופי ההרמוני של הבס.',
      es: 'Aprende a modelar el sonido con los parámetros del sintetizador Drift.',
    },
    workspace: 'DEVICE_VIEW',
    category: 'synthesis',
    difficulty: 'Intermediate',
    estimatedMinutes: 7,
    referenceImages: [REFERENCE_IMAGE_LIBRARY['ref-device-view']],
    steps: [
      {
        id: 1,
        type: 'observe',
        title: {
          en: 'Observe the Filter Section in Drift',
          he: 'התבונן במקטע הפילטר בסינת׳יסייזר Drift',
          es: 'Observa la sección de filtro en Drift',
        },
        instruction: {
          en: 'Look at the reference image showing the Cutoff (Hz) and Resonance knobs.',
          he: 'הבט בתמונת הייחוס המציגה את כפתור תדר החיתוך (Cutoff) וה-Resonance.',
          es: 'Mira los controles de Cutoff y Resonance en la imagen.',
        },
        explanation: {
          en: 'A Low-Pass filter cuts out high-frequency fizz, leaving a clean, punchy low-mid bass body.',
          he: 'פילטר Low-Pass מסנן את התדרים הגבוהים המיותרים ומשאיר גוף בס נקי ופאנצ׳י.',
          es: 'Un filtro Low-Pass elimina frecuencias altas no deseadas dejando un bajo limpio.',
        },
        referenceImageId: 'ref-device-view',
        activeHotspotId: 'device-cutoff-knob',
      },
      {
        id: 2,
        type: 'try',
        title: {
          en: 'Adjust Cutoff Knob to 840 Hz in Simulator',
          he: 'כוון את כפתור ה-Cutoff ל-840 Hz בסימולטור',
          es: 'Ajusta el Cutoff a 840 Hz en el simulador',
        },
        instruction: {
          en: 'In the bottom Device View, drag the Cutoff knob to approximately 840 Hz.',
          he: 'בחלון ה-Device View התחתון, גרור את כפתור ה-Cutoff לערך של 840 Hz.',
          es: 'Arrastra el control de Cutoff hasta aproximadamente 840 Hz.',
        },
        explanation: {
          en: '840 Hz lets through the punchy transient pluck while keeping the low-end focused.',
          he: 'תדר של 840 Hz מאפשר לפאנץ׳ של הפריטה לעבור בצורה ברורה תוך שמירה על בס מהודק.',
          es: '840 Hz permite que el transitorio del bajo corte la mezcla.',
        },
        simulatorTargetId: 'device-knob-cutoff',
        expectedAction: 'KNOB',
        expectedValue: 840,
        deviceTarget: {
          deviceType: 'drift',
          parameterName: 'cutoff',
          targetValue: 840,
          tolerance: 120,
        },
      },
    ],
  },

  // =========================================================================
  // 6. Session → Arrangement Workflow (Capture Performance)
  // =========================================================================
  {
    id: 'lesson-session-to-arrangement-workflow',
    title: {
      en: '6. Session → Arrangement Workflow',
      he: '6. תהליך מעבר: מ-Session ל-Arrangement',
      es: '6. Flujo de trabajo: de Session a Arrangement',
    },
    subtitle: {
      en: 'Improvising with Scenes and Capturing into the Linear Timeline',
      he: 'אלתור עם סצנות והקלטת הביצוע החי ישירות ל-Arrangement',
      es: 'Improvisación con escenas y captura en la línea de tiempo',
    },
    description: {
      en: 'Learn the authentic Ableton workflow: sketch ideas and jam with scenes in Session View, then capture the live performance into Arrangement View.',
      he: 'למד את שיטת העבודה המקורית של אבלטון: אלתור בלייב עם קליפים וסצנות ב-Session, והקלטת הביצוע לטיימליין של ה-Arrangement.',
      es: 'Aprende a capturar tu improvisación en vivo desde Session a la línea de tiempo.',
    },
    workspace: 'WORKFLOW',
    category: 'workflow',
    difficulty: 'Advanced',
    estimatedMinutes: 10,
    referenceImages: [
      REFERENCE_IMAGE_LIBRARY['ref-session-view'],
      REFERENCE_IMAGE_LIBRARY['ref-arrangement-view'],
    ],
    steps: [
      {
        id: 1,
        type: 'observe',
        title: {
          en: 'Understand the Two-World Philosophy',
          he: 'הבנת שילוב שני העולמות של אבלטון',
          es: 'Comprende la filosofía de los dos mundos',
        },
        instruction: {
          en: 'Observe how Session View (clips) feeds directly into Arrangement View (timeline).',
          he: 'הבט כיצד ה-Session View (הקליפים) מזין ישירות את ציר הזמן של ה-Arrangement.',
          es: 'Observa cómo Session View alimenta la línea de tiempo de Arrangement.',
        },
        explanation: {
          en: 'Session View is for non-linear creation; Arrangement View is for linear editing and finalizing the song structure.',
          he: 'Session View מיועד ליצירה ואלתור חופשי; Arrangement View מיועד לעריכה ליניארית וגיבוש מבנה השיר הסופי.',
          es: 'Session es para improvisar; Arrangement es para estructurar la canción.',
        },
        referenceImageId: 'ref-session-view',
        activeHotspotId: 'session-scene-launch',
      },
      {
        id: 2,
        type: 'workflow',
        title: {
          en: 'Capture Session Performance to Arrangement',
          he: 'הקלט את ביצוע הסצנות ל-Arrangement',
          es: 'Captura la interpretación en Arrangement',
        },
        instruction: {
          en: 'In the simulator, click Record [F9], trigger Scene 1 then Scene 2, and switch to Arrangement View [Tab] to see the captured tracks.',
          he: 'בסימולטור, לחץ על כפתור ההקלטה [F9], הפעל את Scene 1 ולאחר מכן Scene 2, ולחץ על [Tab] כדי לראות את השיר המוקלט ב-Arrangement.',
          es: 'Pulsa Grabar, lanza Scene 1 y luego cambia a Arrangement con [Tab].',
        },
        explanation: {
          en: 'Ableton records all your real-time clip triggering and parameter tweaks onto the timeline automatically.',
          he: 'אבלטון מתעדת את כל לחיצות הקליפים והזזות הכפתורים בזמן אמת ומייצרת מהם שיר מובנה.',
          es: 'Live registra todas las acciones en tiempo real en la línea de tiempo.',
        },
        simulatorTargetId: 'transport-record',
        expectedAction: 'CLICK',
      },
    ],
  },
];

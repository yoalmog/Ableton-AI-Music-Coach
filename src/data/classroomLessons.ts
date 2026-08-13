import { ClassroomCourse, AbletonSearchTopic } from '../types/classroom';

export const ABLETON_CLASSROOM_COURSES: ClassroomCourse[] = [
  {
    id: 'beginner_core',
    title: 'ABLETON LIVE 12 — FIRST STEPS',
    titleHe: 'אבלטון לייב 12 — צעדים ראשונים',
    subtitle: 'Mandatory Fundamental Masterclass: Interface, Control Bar, Browser, Tracks, Session vs Arrangement, MIDI, Audio, Devices, Mixer, Automation & First Project',
    subtitleHe: 'קורס יסודות חובה: הממשק, סרגל השליטה, דפדפן הקבצים, ערוצים, סשן מול ארנג\'מנט, מידי, אודיו, מכשירים, מיקסר, אוטומציה ופרויקט ראשון',
    icon: 'Layout',
    description: 'Teach a complete beginner how Ableton Live 12 works BEFORE teaching music production. Every concept explains: WHAT IS IT? WHERE IS IT? WHAT DOES IT DO? WHY DO I NEED IT? WHEN WILL I USE IT?',
    descriptionHe: 'הדרכה יסודית למתחילים - איך פועלת Ableton Live 12 לפני שניגשים להפקת מוזיקה. כל מושג מוסבר: מה זה? איפה זה? מה זה עושה? למה אני צריך את זה? מתי אשתמש בזה?',
    lessons: [
      // MODULE 01: The Ableton Interface
      {
        id: 'mod1_interface',
        title: 'Module 1: The Ableton Interface',
        titleHe: 'מודול 1: ממשק העבודה של אבלטון',
        level: 'Beginner',
        category: '01 — The Ableton Interface',
        categoryHe: '01 — ממשק העבודה',
        moduleIndex: 1,
        objective: 'Identify the main layout zones of Ableton Live 12: Browser (left), Main Workspace (center), Device/Clip view (bottom), Control Bar (top), and Mixer/Master (right).',
        objectiveHe: 'זיהוי אזורי המסך המרכזיים ב-Ableton Live 12: הדפדפן (משמאל), מרכז העבודה, תצוגת הקליפים/מכשירים (למטה), סרגל השליטה (למעלה) והמיקסר (מימין).',
        durationMinutes: 8,
        completionRewardXp: 100,
        steps: [
          {
            id: 'step_m1_1',
            title: 'Identify the Browser Panel',
            titleHe: 'איתור דפדפן הקבצים (Browser)',
            instruction: 'Click anywhere inside the Browser panel on the far left side of the screen.',
            instructionHe: 'לחץ בתוך פאנל ה-Browser בצד שמאל של המסך.',
            targetElement: 'browser',
            explanation: 'The Browser holds all your instruments, audio effects, MIDI effects, samples, packs, and plugins.',
            explanationHe: 'ה-Browser מאכסן את כל הכלים, אפקטי השמע, אפקטי ה-MIDI, הדגימות והפלאגינים שלך.',
            why: 'Without the browser, you cannot load synths or audio samples into your project.',
            whyHe: 'ללא הדפדפן לא ניתן לטעון סינתיסייזרים או דגימות קול לפרויקט.',
            hint1: 'Look at the left sidebar containing categories like Instruments and Audio Effects.',
            hint1He: 'הביטו בסרגל השמאלי המכיל קטגוריות כמו Instruments ו-Audio Effects.',
            hint2: 'Click anywhere inside the left column panel marked "Browser".',
            hint2He: 'לחץ בתוך העמודה השמאלית המסומנת כ-Browser.',
            answer: 'Click the left Browser panel area.',
            answerHe: 'לחץ על פאנל ה-Browser השמאלי.',
            actionType: 'click',
            successMessage: 'Browser panel located and focused!',
            successMessageHe: 'פאנל ה-Browser אותור וממוקד!',
            realAbletonChecklist: [
              'Open Ableton Live 12.',
              'Press Ctrl+Alt+B (Cmd+Option+B on Mac) to toggle the Browser.',
              'Observe categories: Sounds, Drums, Instruments, Audio Effects, MIDI Effects, Samples.'
            ],
            realAbletonChecklistHe: [
              'פתח את Ableton Live 12.',
              'לחץ Ctrl+Alt+B (או Cmd+Option+B במק) להצגת ה-Browser.',
              'שים לב לקטגוריות: Sounds, Drums, Instruments, Audio Effects, MIDI Effects, Samples.'
            ]
          }
        ],
        quiz: [
          {
            question: 'Where do you find instruments, audio effects, and sample files in Ableton Live 12?',
            questionHe: 'איפה מוצאים כלים, אפקטים ודגימות סאונד ב-Ableton Live 12?',
            options: [
              'In the Master Track',
              'In the Browser panel on the left side',
              'In the Metronome settings',
              'In the Export menu'
            ],
            optionsHe: [
              'בערוץ המאסטר',
              'בפאנל ה-Browser בצד שמאל',
              'בהגדרות המטרונום',
              'בתפריט היצוא'
            ],
            correctIndex: 1,
            explanation: 'The Browser panel on the left stores all native devices, third-party VSTs, samples, and presets.',
            explanationHe: 'פאנל ה-Browser השמאלי מרכז את כל המכשירים המובנים, הפלאגינים, הדגימות והפריסטים.'
          }
        ]
      },

      // MODULE 02: Control Bar
      {
        id: 'mod2_control_bar',
        title: 'Module 2: Control Bar',
        titleHe: 'מודול 2: סרגל השליטה (Control Bar)',
        level: 'Beginner',
        category: '02 — Control Bar',
        categoryHe: '02 — סרגל השליטה',
        moduleIndex: 2,
        objective: 'Master Play, Stop, Record, Tempo (BPM), Metronome, Time Signature, and Loop controls.',
        objectiveHe: 'הכרת כפתורי ההפעלה (Play, Stop, Record), קביעת הקצב (BPM), המטרונום, משקל השיר והלופ.',
        durationMinutes: 10,
        completionRewardXp: 120,
        steps: [
          {
            id: 'step_m2_1',
            title: 'Set Project to 145 BPM',
            titleHe: 'קביעת קצב ל-145 BPM',
            instruction: 'Click the BPM box and set it to 145 BPM.',
            instructionHe: 'לחץ על תיבת ה-BPM ושנה את הקצב ל-145.',
            targetElement: 'bpm_input',
            explanation: 'BPM (Beats Per Minute) determines how fast or slow the music plays.',
            explanationHe: 'BPM (פעימות בדקה) קובע את מהירות הניגון של היצירה.',
            why: 'Setting target BPM ensures all instruments, samples, and grid divisions sync accurately.',
            whyHe: 'קביעת קצב מדויקת מבטיחה שכל הדגימות והתווים יסתנכרנו לגריד.',
            hint1: 'Find the BPM box near transport controls showing numerical tempo.',
            hint1He: 'חפש את תיבת ה-BPM המציגה את הקצב.',
            hint2: 'Click and type 145.',
            hint2He: 'לחץ והקלד 145.',
            answer: 'Set BPM to 145.',
            answerHe: 'הגדר קצב ל-145 BPM.',
            actionType: 'value_change',
            targetValue: 145,
            successMessage: 'Project tempo updated to 145 BPM!',
            successMessageHe: 'הקצב עודכן בהצלחה ל-145 BPM!',
            realAbletonChecklist: [
              'Double click Tempo display in top left, type 145, press Enter.'
            ],
            realAbletonChecklistHe: [
              'לחץ פעמיים על תצוגת ה-Tempo בצד שמאל למעלה, הקלד 145 ולחץ Enter.'
            ]
          },
          {
            id: 'step_m2_2',
            title: 'Turn On Metronome',
            titleHe: 'הפעלת המטרונום',
            instruction: 'Click the Metronome toggle button to turn on rhythmic click ticks.',
            instructionHe: 'לחץ על כפתור המטרונום להפעלת נקישות הקצב.',
            targetElement: 'metronome',
            explanation: 'The Metronome gives a steady click track on beats 1, 2, 3, 4 so you stay in time.',
            explanationHe: 'המטרונום משמיע נקישות קצב מדויקות בכל פעימה.',
            why: 'Crucial when playing live MIDI or recording vocals so your performance fits the grid.',
            whyHe: 'חיוני לשמירה על קצב מדויק בזמן הקלטה.',
            hint1: 'Look right next to time signature (4/4).',
            hint1He: 'חפש מיד ליד משקל השיר (4/4).',
            hint2: 'Click Metronome button.',
            hint2He: 'לחץ על כפתור המטרונום.',
            answer: 'Click Metronome toggle.',
            answerHe: 'לחץ על כפתור המטרונום.',
            actionType: 'toggle_mode',
            successMessage: 'Metronome active!',
            successMessageHe: 'המטרונום פעיל!',
            realAbletonChecklist: [
              'Click Metronome icon or press Key "C" in Ableton Live 12.'
            ],
            realAbletonChecklistHe: [
              'לחץ על אייקון המטרונום או מקש "C" באבלטון 12.'
            ]
          },
          {
            id: 'step_m2_3',
            title: 'Press Play',
            titleHe: 'הפעלת ניגון (Play)',
            instruction: 'Click the green Play button in the top Control Bar.',
            instructionHe: 'לחץ על כפתור ה-Play בסרגל השליטה העליון.',
            targetElement: 'transport_play',
            explanation: 'Play starts song playback and moves the playhead across the timeline.',
            explanationHe: 'כפתור ה-Play מניע את ניגון ציר הזמן או קטעי המוזיקה.',
            why: 'Allows listening to your composition and testing real-time changes.',
            whyHe: 'מאפשר להאזין לערוצים ולבצע מיקס בזמן אמת.',
            hint1: 'Look at top transport bar for green play triangle.',
            hint1He: 'חפש בסרגל העליון את כפתור ה-Play הירוק.',
            hint2: 'Click Play button (or Spacebar).',
            hint2He: 'לחץ על כפתור ה-Play (או מקש רווח).',
            answer: 'Click Play button.',
            answerHe: 'לחץ על כפתור ה-Play.',
            actionType: 'click',
            successMessage: 'Playback rolling at 145 BPM with Metronome click!',
            successMessageHe: 'הניגון פועל ב-145 BPM עם מטרונום!',
            realAbletonChecklist: [
              'Press Spacebar to toggle Play/Stop.'
            ],
            realAbletonChecklistHe: [
              'לחץ על מקש הרווח להתחלה ועצירה.'
            ]
          }
        ],
        quiz: [
          {
            question: 'Which control is used to change the overall speed of the music in Ableton Live 12?',
            questionHe: 'באיזה פקד משתמשים כדי לשנות את מהירות המוזיקה ב-Ableton Live 12?',
            options: [
              'Volume Fader',
              'BPM / Tempo Display',
              'Crossfader',
              'Panning Knob'
            ],
            optionsHe: [
              'פיידר הווליום',
              'תצוגת ה-BPM / Tempo',
              'קרוספיידר',
              'כפתור הצידוד (Pan)'
            ],
            correctIndex: 1,
            explanation: 'BPM sets the exact playback tempo for the entire project.',
            explanationHe: 'ה-BPM קובע את קצב הניגון של הפרויקט כולו.'
          }
        ]
      },

      // MODULE 03: Browser
      {
        id: 'mod3_browser',
        title: 'Module 3: Browser',
        titleHe: 'מודול 3: הדפדפן והחיפוש (Browser)',
        level: 'Beginner',
        category: '03 — Browser',
        categoryHe: '03 — הדפדפן והחיפוש',
        moduleIndex: 3,
        objective: 'Locate Sounds, Drums, Instruments, Audio Effects, MIDI Effects, Samples, Plug-ins, and use Search.',
        objectiveHe: 'איתור קטגוריות Sounds, Drums, Instruments, Audio Effects, MIDI Effects, Samples ושימוש בחיפוש.',
        durationMinutes: 12,
        completionRewardXp: 130,
        steps: [
          {
            id: 'step_m3_1',
            title: 'Find an Instrument',
            titleHe: 'איתור כלי נגינה (Instrument)',
            instruction: 'Click on the "Instruments" category in the Browser sidebar.',
            instructionHe: 'לחץ על קטגוריית "Instruments" בסרגל ה-Browser.',
            targetElement: 'browser_instruments',
            explanation: 'Instruments contains virtual synths (Operator, Wavetable, Drift) and samplers that create sound from MIDI notes.',
            explanationHe: 'קטגוריית Instruments מכילה סינתיסייזרים וכלים וירטואליים המפיקים סאונד מתווי MIDI.',
            why: 'You need an instrument device to turn digital MIDI notes into audible synth music.',
            whyHe: 'כל הוספה של כלי חדש דורשת טעינת Instrument מערוץ ה-MIDI.',
            hint1: 'Look under Drums/Sounds in Browser.',
            hint1He: 'חפש בדפדפן מתחת ל-Drums.',
            hint2: 'Click Instruments.',
            hint2He: 'לחץ על Instruments.',
            answer: 'Click Instruments category.',
            answerHe: 'לחץ על קטגוריית Instruments.',
            actionType: 'click',
            successMessage: 'Instruments opened!',
            successMessageHe: 'קטגוריית Instruments נפתחה!',
            realAbletonChecklist: [
              'In Ableton Browser, click "Instruments" or press Ctrl+F to search.'
            ],
            realAbletonChecklistHe: [
              'בדפדפן באבלטון, לחץ על Instruments או Ctrl+F לחיפוש.'
            ]
          },
          {
            id: 'step_m3_2',
            title: 'Find an Audio Effect',
            titleHe: 'איתור אפקט שמע (Audio Effect)',
            instruction: 'Click "Audio Effects" in the Browser sidebar.',
            instructionHe: 'לחץ על "Audio Effects" בסרגל ה-Browser.',
            targetElement: 'browser_effects',
            explanation: 'Audio Effects process and transform sound (EQ Eight, Reverb, Delay, Compressor, Saturator, Roar).',
            explanationHe: 'אפקטי שמע מעבדים ומעצבים את הצליל (איקיו, ריוורב, קומפרסור, דיליי, Roar).',
            why: 'Effects shape tone, control volume dynamics, and place sounds in a 3D acoustic space.',
            whyHe: 'אפקטים מעצבים את תדר הסאונד, הדינמיקה והעומק במרחב.',
            hint1: 'Look right below Instruments in Browser.',
            hint1He: 'חפש מתחת ל-Instruments ברשימת ה-Browser.',
            hint2: 'Click Audio Effects.',
            hint2He: 'לחץ על Audio Effects.',
            answer: 'Click Audio Effects.',
            answerHe: 'לחץ על Audio Effects.',
            actionType: 'click',
            successMessage: 'Audio Effects category opened!',
            successMessageHe: 'קטגוריית Audio Effects נפתחה!',
            realAbletonChecklist: [
              'In Ableton Live 12, browse Audio Effects folders like EQ & Filters, Dynamics, Drive & Color.'
            ],
            realAbletonChecklistHe: [
              'באבלטון 12, סקור את התיקיות ב-Audio Effects כגון EQ & Filters ו-Dynamics.'
            ]
          }
        ],
        quiz: [
          {
            question: 'Which Browser category contains devices that process audio signals (like EQ, Reverb, and Compressor)?',
            questionHe: 'איזו קטגוריה בדפדפן מכילה מכשירים המעבדים אותות שמע (כמו EQ, Reverb ו-Compressor)?',
            options: [
              'Audio Effects',
              'Instruments',
              'MIDI Effects',
              'Grooves'
            ],
            optionsHe: [
              'Audio Effects',
              'Instruments',
              'MIDI Effects',
              'Grooves'
            ],
            correctIndex: 0,
            explanation: 'Audio Effects alter the sound coming out of an audio or MIDI instrument track.',
            explanationHe: 'אפקטי שמע מעבדים ומשנים את השמע שיוצא מערוץ האודיו או הכלי.'
          }
        ]
      },

      // MODULE 04: Tracks
      {
        id: 'mod4_tracks',
        title: 'Module 4: Tracks (MIDI, Audio, Return & Master)',
        titleHe: 'מודול 4: סוגי ערוצים (MIDI, Audio, Return & Master)',
        level: 'Beginner',
        category: '04 — Tracks',
        categoryHe: '04 — סוגי ערוצים',
        moduleIndex: 4,
        objective: 'Understand the four track types: MIDI Track, Audio Track, Return Track, and Master Track.',
        objectiveHe: 'הבנת ארבעת סוגי הערוצים באבלטון: ערוץ MIDI, ערוץ Audio, ערוץ Return וערוץ Master.',
        durationMinutes: 12,
        completionRewardXp: 140,
        steps: [
          {
            id: 'step_m4_1',
            title: 'Create a MIDI Track',
            titleHe: 'יצירת ערוץ MIDI',
            instruction: 'Click "+ Add MIDI Track" button in the top toolbar.',
            instructionHe: 'לחץ על כפתור "+ Add MIDI Track" בסרגל העליון.',
            targetElement: 'add_midi_track_btn',
            explanation: 'MIDI tracks hold note data and host virtual instrument synths.',
            explanationHe: 'ערוצי MIDI מכילים תווים דיגיטליים ומפעילים סינתיסייזרים וסמפלרים.',
            why: 'Whenever you want to write a new synth melody, bassline, or drum note pattern.',
            whyHe: 'חיוני לכתיבת מלודיות, ליינים של בס או מקצבים חדשים.',
            hint1: 'Look at toolbar buttons above track list.',
            hint1He: 'חפש בסרגל הכלים מעל רשימת הערוצים.',
            hint2: 'Click "+ Add MIDI Track".',
            hint2He: 'לחץ על הוספת ערוץ MIDI.',
            answer: 'Click "+ Add MIDI Track".',
            answerHe: 'לחץ על "+ Add MIDI Track".',
            actionType: 'click',
            successMessage: 'New MIDI track created!',
            successMessageHe: 'ערוץ MIDI חדש נוסף!',
            realAbletonChecklist: [
              'Press Ctrl+Shift+T (Cmd+Shift+T on Mac) to create a MIDI Track.'
            ],
            realAbletonChecklistHe: [
              'לחץ Ctrl+Shift+T (Cmd+Shift+T במק) להוספת ערוץ MIDI באבלטון.'
            ]
          },
          {
            id: 'step_m4_2',
            title: 'Identify Master Track',
            titleHe: 'זיהוי ערוץ ה-Master',
            instruction: 'Click on the Master Track header on the far right.',
            instructionHe: 'לחץ על ערוץ ה-Master בצד ימין.',
            targetElement: 'master_track',
            explanation: 'The Master track is the main audio bus where signals from all tracks combine before going to your speakers or export file.',
            explanationHe: 'ערוץ המאסטר מאגד את כל הערוצים יחד לפני היציאה לרמקולים או לקובץ השמע.',
            why: 'Master volume controls final loudness; keeping it below 0 dB prevents distortion.',
            whyHe: 'שומר על עוצמת הפלט הסופית למניעת עיוותים (Clipping).',
            hint1: 'Look at the last track on the far right.',
            hint1He: 'חפש את הערוץ האחרון בצד ימין.',
            hint2: 'Click Master track header.',
            hint2He: 'לחץ על ערוץ ה-Master.',
            answer: 'Click Master track.',
            answerHe: 'לחץ על ערוץ ה-Master.',
            actionType: 'click',
            successMessage: 'Master Track focused!',
            successMessageHe: 'ערוץ ה-Master נבחר!',
            realAbletonChecklist: [
              'Click Master track in Ableton Live 12 and verify peak level output meters.'
            ],
            realAbletonChecklistHe: [
              'לחץ על ערוץ המאסטר באבלטון 12 ובדוק את מד העוצמה.'
            ]
          }
        ],
        quiz: [
          {
            question: 'Which track type receives and sums audio signals from all other tracks before sending sound to the speakers?',
            questionHe: 'איזה סוג ערוץ מקבל ומאגד את כל אותות השמע מכל הערוצים לפני שליחתם לרמקולים?',
            options: [
              'MIDI Track',
              'Return Track',
              'Master Track',
              'Audio Track'
            ],
            optionsHe: [
              'ערוץ MIDI',
              'ערוץ Return',
              'ערוץ Master',
              'ערוץ Audio'
            ],
            correctIndex: 2,
            explanation: 'The Master Track sums all channel audio outputs into a stereo master signal.',
            explanationHe: 'ערוץ ה-Master מרכז את כל היציאות לערוץ סטריאו ראשי אחד.'
          }
        ]
      },

      // MODULE 05: Session View
      {
        id: 'mod5_session_view',
        title: 'Module 5: Session View',
        titleHe: 'מודול 5: תצוגת Session View',
        level: 'Beginner',
        category: '05 — Session View',
        categoryHe: '05 — תצוגת Session View',
        moduleIndex: 5,
        objective: 'Understand Session View: tracks as columns, scenes as rows, clip slots, launching clips, and looping ideas.',
        objectiveHe: 'הבנת תצוגת ה-Session View: ערוצים כעמודות, סצנות כשורות, משבצות קליפים, הפעלת קליפים ולופים.',
        durationMinutes: 15,
        completionRewardXp: 150,
        steps: [
          {
            id: 'step_m5_1',
            title: 'Find Session View',
            titleHe: 'מעבר לתצוגת Session View',
            instruction: 'Click the Session View toggle button (grid icon) in top right.',
            instructionHe: 'לחץ על כפתור מעבר לתצוגת Session View (אייקון הגריד) בצד ימין למעלה.',
            targetElement: 'view_toggle_session',
            explanation: 'Session View lays out tracks vertically. Each box is a Clip Slot that can hold a musical loop.',
            explanationHe: 'Session View מציג ערוצים כעמודות אנכיות ומשבצות קליפים כשורות.',
            why: 'Perfect for jamming, experimenting with different clip combinations, or performing live.',
            whyHe: 'מושלם להתנסות ברעיונות מוזיקליים מבלי להיות מוגבל לציר זמן ליניארי.',
            hint1: 'Look near top right control bar.',
            hint1He: 'חפש בצד ימין למעלה.',
            hint2: 'Click Grid icon or press Tab key.',
            hint2He: 'לחץ על אייקון הגריד או מקש Tab.',
            answer: 'Click Session View toggle.',
            answerHe: 'לחץ על תצוגת Session View.',
            actionType: 'toggle_mode',
            successMessage: 'Switched to Session View!',
            successMessageHe: 'עברת לתצוגת Session View!',
            realAbletonChecklist: [
              'Press Tab key in Ableton to toggle between Session View and Arrangement View.'
            ],
            realAbletonChecklistHe: [
              'לחץ על מקש Tab באבלטון למעבר מהיר בין תצוגת Session ל-Arrangement.'
            ]
          },
          {
            id: 'step_m5_2',
            title: 'Launch a Clip',
            titleHe: 'הפעלת קליפ (Launch Clip)',
            instruction: 'Click a clip slot inside Track 1 to launch musical loop playback.',
            instructionHe: 'לחץ על משבצת קליפ בערוץ 1 להפעלת ניגון הקליפ.',
            targetElement: 'clip_slot',
            explanation: 'Clips in Session View stay quantized to song tempo and repeat seamlessly in a loop.',
            explanationHe: 'קליפים ב-Session View נשארים מסונכרנים לקצב השיר ומנגנים בלופ בלתי פוסק.',
            why: 'Enables live improvs, beat building, and effortless song sketching.',
            whyHe: 'מאפשר נגינה בלייב, אלתור מקצבים ואימפרוביזציה.',
            hint1: 'Click rectangular clip area on Track 1.',
            hint1He: 'לחץ בתוך משבצת הקליפ בערוץ 1.',
            hint2: 'Click clip slot.',
            hint2He: 'לחץ על הקליפ.',
            answer: 'Click clip slot.',
            answerHe: 'לחץ על משבצת הקליפ.',
            actionType: 'click',
            successMessage: 'Clip launched and playing in sync!',
            successMessageHe: 'הקליפ הופעל ומנגן בלופ!',
            realAbletonChecklist: [
              'Click green play triangle on clip slot in Ableton Live 12.'
            ],
            realAbletonChecklistHe: [
              'לחץ על משולש הניגון הירוק במשבצת קליפ באבלטון 12.'
            ]
          }
        ],
        quiz: [
          {
            question: 'What happens when you click a clip play button in Session View?',
            questionHe: 'מה קורה כשלוחצים על כפתור הפעלת קליפ ב-Session View?',
            options: [
              'The track is deleted',
              'The clip starts playing in quantization sync at the next bar line',
              'The file is saved',
              'The master volume mutes'
            ],
            optionsHe: [
              'הערוץ נמחק',
              'הקליפ מתחיל לנגן בסנכרון מדויק בתיבה הבאה',
              'הקובץ נשמר',
              'הווליום של המאסטר מושתק'
            ],
            correctIndex: 1,
            explanation: 'Session View clips launch quantized to the song tempo so everything stays in rhythm.',
            explanationHe: 'קליפים ב-Session View מופעלים בסנכרון מלא לקצב השיר.'
          }
        ]
      },

      // MODULE 06: Arrangement View
      {
        id: 'mod6_arrangement_view',
        title: 'Module 6: Arrangement View',
        titleHe: 'מודול 6: תצוגת ציר הזמן (Arrangement View)',
        level: 'Beginner',
        category: '06 — Arrangement View',
        categoryHe: '06 — תצוגת ציר הזמן',
        moduleIndex: 6,
        objective: 'Master linear timeline arrangement: tracks left-to-right, playhead, clips, locators, INTRO, BUILD, DROP, and OUTRO.',
        objectiveHe: 'הבנת ציר הזמן הליניארי: ערוצים משמאל לימין, סמן זמן, קליפים, סמני מיקום, פתיחה, עלייה, דרופ וסיום.',
        durationMinutes: 15,
        completionRewardXp: 160,
        steps: [
          {
            id: 'step_m6_1',
            title: 'Switch to Arrangement View',
            titleHe: 'מעבר לתצוגת Arrangement View',
            instruction: 'Click the Arrangement View toggle button (horizontal lines) in top right.',
            instructionHe: 'לחץ על כפתור מעבר לתצוגת Arrangement View (שלושה קווים אופקיים) בפינה הימנית העליונה.',
            targetElement: 'view_toggle_arrangement',
            explanation: 'Arrangement View displays audio and MIDI clips laid out along a left-to-right timeline showing bars and beats.',
            explanationHe: 'Arrangement View הינה תצוגת ציר זמן מסורתית משמאל לימין המציגה תיבות ופעימות.',
            why: 'This is where you construct the full structure of your track from start to finish.',
            whyHe: 'כאן מארגנים את הפתיחה, העלייה, הדרופ והסיום לשיר שלם ומוכן.',
            hint1: 'Look at top right near view toggles.',
            hint1He: 'חפש בצד ימין למעלה.',
            hint2: 'Click horizontal lines icon.',
            hint2He: 'לחץ על אייקון השורות האופקיות.',
            answer: 'Click Arrangement View toggle.',
            answerHe: 'לחץ על תצוגת Arrangement View.',
            actionType: 'toggle_mode',
            successMessage: 'Arrangement View timeline active!',
            successMessageHe: 'תצוגת ציר הזמן פעילה!',
            realAbletonChecklist: [
              'Press Tab key to jump to Arrangement view in Ableton.'
            ],
            realAbletonChecklistHe: [
              'לחץ על מקש Tab באבלטון למעבר ל-Arrangement view.'
            ]
          }
        ],
        quiz: [
          {
            question: 'Which view is designed for laying out song structure linearly from left to right along a timeline?',
            questionHe: 'איזו תצוגה מיועדת לבניית מבנה שיר מלא בצורה ליניארית משמאל לימין לאורך ציר זמן?',
            options: [
              'Session View',
              'Arrangement View',
              'Browser Panel',
              'Plugin Manager'
            ],
            optionsHe: [
              'Session View',
              'Arrangement View',
              'Browser Panel',
              'Plugin Manager'
            ],
            correctIndex: 1,
            explanation: 'Arrangement View arranges clips chronologically from start to finish.',
            explanationHe: 'Arrangement View מציגה ומסדרת קטעי אודיו ו-MIDI בצורה ליניארית משמאל לימין.'
          }
        ]
      },

      // MODULE 07: Session vs Arrangement
      {
        id: 'mod7_comparison',
        title: 'Module 7: Session View vs Arrangement View',
        titleHe: 'מודול 7: השוואה בין Session ל-Arrangement',
        level: 'Beginner',
        category: '07 — Session vs Arrangement',
        categoryHe: '07 — השוואה בין התצוגות',
        moduleIndex: 7,
        objective: 'Compare when to use Session View (experimentation, loops, ideas, live performance) vs Arrangement View (timeline, song structure, final mix).',
        objectiveHe: 'הבנת מתי להשתמש ב-Session View (ניסויים, לופים, רעיונות, הופעה) ומתי ב-Arrangement View (ציר זמן, מבנה שיר, מיקס סופי).',
        durationMinutes: 10,
        completionRewardXp: 130,
        steps: [
          {
            id: 'step_m7_1',
            title: 'Understand View Workflow Differences',
            titleHe: 'הבנת תהליך העבודה בין התצוגות',
            instruction: 'Click between Session View toggle and Arrangement View toggle to compare both visual modes.',
            instructionHe: 'לחץ בין תצוגת Session ל-Arrangement להשוואת אופן ההצגה.',
            targetElement: 'view_toggle_session',
            explanation: 'Session View is vertical and modular (sketchpad/jamming). Arrangement View is horizontal and linear (final song layout).',
            explanationHe: 'Session View אנכית ומודולרית (לרעיונות ואלתור). Arrangement View אופקית וליניארית (לשיר שלם).',
            why: 'Knowing which view to use speeds up composition and prevents creative block.',
            whyHe: 'הבנת השימוש הנכון בכל תצוגה מונעת מעצור יצירתי ומאיצה את עבודת ההפקה.',
            hint1: 'Toggle between grid and horizontal line icons in top right.',
            hint1He: 'עבור בין האייקונים בפינה הימנית העליונה.',
            hint2: 'Click Session View toggle.',
            hint2He: 'לחץ על תצוגת Session.',
            answer: 'Toggle Session view.',
            answerHe: 'לחץ על תצוגת Session.',
            actionType: 'toggle_mode',
            successMessage: 'View comparison understood!',
            successMessageHe: 'ההבדלים בין התצוגות הובנו!',
            realAbletonChecklist: [
              'Use Tab key in Ableton Live 12 to switch instantly between both views.'
            ],
            realAbletonChecklistHe: [
              'השתמש במקש Tab באבלטון 12 למעבר מיידי בין שתי התצוגות.'
            ]
          }
        ],
        quiz: [
          {
            question: 'When should you use Session View instead of Arrangement View?',
            questionHe: 'מתי עדיף להשתמש ב-Session View במקום ב-Arrangement View?',
            options: [
              'When exporting the final MP3 file',
              'When experimenting with loop ideas, jamming, and organizing clips non-linearly',
              'When recording a long continuous podcast vocal',
              'When configuring audio driver latency'
            ],
            optionsHe: [
              'בעת ייצוא קובץ ה-MP3 הסופי',
              'בעת ניסוי ברעיונות לופים, אלתור וארגון קליפים בצורה חופשית',
              'בעת הקלטת פודקאסט ארוך ברצף',
              'בעת הגדרת כרטיס הקול'
            ],
            correctIndex: 1,
            explanation: 'Session View is designed for non-linear experimentation and jamming with loops.',
            explanationHe: 'Session View מיועדת לאלתור חופשי וניסויים בלופים ללא הגבלת ציר זמן.'
          }
        ]
      },

      // MODULE 08: MIDI
      {
        id: 'mod8_midi',
        title: 'Module 8: MIDI & Piano Roll',
        titleHe: 'מודול 8: עבודה עם MIDI ו-Piano Roll',
        level: 'Beginner',
        category: '08 — MIDI & Piano Roll',
        categoryHe: '08 — עבודה עם MIDI',
        moduleIndex: 8,
        objective: 'Learn MIDI concept, MIDI Track, MIDI Clip, Piano Roll grid, notes, velocity, length, and note drawing.',
        objectiveHe: 'הבנת מושג ה-MIDI, ערוץ MIDI, קליפ MIDI, עורך ה-Piano Roll, תווים, עוצמה (Velocity) וציור תווים.',
        durationMinutes: 15,
        completionRewardXp: 150,
        steps: [
          {
            id: 'step_m8_1',
            title: 'Open Piano Roll Editor',
            titleHe: 'פתיחת עורך ה-Piano Roll',
            instruction: 'Click inside the Piano Roll editor area at the bottom.',
            instructionHe: 'לחץ בתוך אזור ה-Piano Roll בחלק התחתון.',
            targetElement: 'piano_roll',
            explanation: 'The Piano Roll displays notes mapped on a piano keyboard vertical axis.',
            explanationHe: 'ה-Piano Roll מציג תווים הממופים על גבי מקלדת פסנתר אנכית.',
            why: 'Primary tool for writing melodies, chords, basslines, and drum patterns.',
            whyHe: 'הכלי המרכזי לכתיבת מלודיות, אקורדים, ליינים של בס ומקצבי תופים.',
            hint1: 'Look at the bottom area displaying piano keys.',
            hint1He: 'חפש בחלק התחתון תצוגת קלידי פסנתר.',
            hint2: 'Click inside the Piano Roll grid.',
            hint2He: 'לחץ בתוך גריד ה-Piano Roll.',
            answer: 'Click Piano Roll.',
            answerHe: 'לחץ על פאנל ה-Piano Roll.',
            actionType: 'click',
            successMessage: 'Piano Roll focused!',
            successMessageHe: 'עורך ה-Piano Roll פעיל!',
            realAbletonChecklist: [
              'Double click a MIDI clip in Ableton to open Clip View / Piano Roll.'
            ],
            realAbletonChecklistHe: [
              'לחץ פעמיים על קליפ MIDI באבלטון לפתיחת ה-Piano Roll.'
            ]
          },
          {
            id: 'step_m8_2',
            title: 'Draw a C Note',
            titleHe: 'ציור תו C ב-Piano Roll',
            instruction: 'Click inside the Piano Roll grid to place a note on key C3.',
            instructionHe: 'לחץ בתוך גריד ה-Piano Roll להוספת תו בפיץ\' C3.',
            targetElement: 'piano_roll_grid',
            explanation: 'In Ableton, clicking grid cells adds or deletes notes. B key toggles Draw mode pencil.',
            explanationHe: 'לחיצה כפולה מוסיפה או מוחקת תו. מקש B מפעיל את כלי העיפרון.',
            why: 'Note placement constructs structured bass and lead melodies.',
            whyHe: 'מיקום תווים בונה ליינים של בס ומלודיות.',
            hint1: 'Click on grid lines opposite key C3.',
            hint1He: 'לחץ על קווי הגריד מול המקש C3.',
            hint2: 'Click grid cell.',
            hint2He: 'לחץ על משבצת בגריד.',
            answer: 'Click piano roll grid.',
            answerHe: 'לחץ בגריד ה-Piano Roll.',
            actionType: 'draw_note',
            successMessage: 'Note drawn!',
            successMessageHe: 'התו נוסף בהצלחה!',
            realAbletonChecklist: [
              'Press "B" in Ableton Piano Roll to switch to Draw Pencil mode.'
            ],
            realAbletonChecklistHe: [
              'לחץ "B" ב-Piano Roll באבלטון להפעלת העיפרון.'
            ]
          }
        ],
        quiz: [
          {
            question: 'Does a MIDI clip contain actual recorded audio sound waves?',
            questionHe: 'האם קליפ MIDI מכיל גלי קול מוקלטים בפועל?',
            options: [
              'Yes, recorded waveform audio',
              'No, it contains digital performance instructions (pitch, velocity, length) that trigger an instrument device',
              'Only when exported to MP3',
              'Only in Session View'
            ],
            optionsHe: [
              'כן, גלי קול מוקלטים',
              'לא, הוא מכיל הוראות נגינה דיגיטליות (פיץ\', עוצמה, אורך) המפעילות כלי נגינה',
              'רק בעת ייצוא ל-MP3',
              'רק בתצוגת Session'
            ],
            correctIndex: 1,
            explanation: 'MIDI contains note performance events, requiring a synth or sampler instrument to generate sound.',
            explanationHe: 'MIDI הוא נתוני נגינה בלבד ודורש כלי נגינה (Instrument) המפיק את הסאונד.'
          }
        ]
      },

      // MODULE 09: Audio
      {
        id: 'mod9_audio',
        title: 'Module 9: Audio & Waveforms',
        titleHe: 'מודול 9: עבודה עם אודיו ודגימות שמע',
        level: 'Beginner',
        category: '09 — Audio & Waveforms',
        categoryHe: '09 — עבודה עם אודיו',
        moduleIndex: 9,
        objective: 'Understand Audio, Audio Tracks, recording external audio, Audio Clips, waveforms, and playback.',
        objectiveHe: 'הבנת אודיו מוקלט, ערוץ אודיו, הקלטת שמע חיצוני, קליפים של אודיו, תצוגת גלי קול (Waveform) וניגון.',
        durationMinutes: 10,
        completionRewardXp: 130,
        steps: [
          {
            id: 'step_m9_1',
            title: 'Identify Audio Track & Waveform',
            titleHe: 'זיהוי ערוץ Audio וגל הקול',
            instruction: 'Click on an Audio Track header to inspect recorded waveform audio properties.',
            instructionHe: 'לחץ על ערוץ Audio לצפייה במאפייני דגימת השמע.',
            targetElement: 'audio_track_header',
            explanation: 'Audio tracks hold actual recorded sound waves (vocal recordings, drum samples, guitar takes).',
            explanationHe: 'ערוצי אודיו מאכסנים גלי קול מוקלטים (הקלטות שירה, דגימות תופים וגיטרות).',
            why: 'Audio playback reproduces real physical acoustic sound directly without needing a synth device.',
            whyHe: 'ניגון אודיו משמיע סאונד מוקלט ישירות ללא צורך בכלי נגינה וירטואלי.',
            hint1: 'Click track labeled "Audio" or "2 Audio".',
            hint1He: 'לחץ על הערוץ המתוייג כ-Audio.',
            hint2: 'Click Audio track header.',
            hint2He: 'לחץ על ראש ערוץ ה-Audio.',
            answer: 'Click Audio track header.',
            answerHe: 'לחץ על ערוץ ה-Audio.',
            actionType: 'click',
            successMessage: 'Audio Track focused!',
            successMessageHe: 'ערוץ ה-Audio נבחר!',
            realAbletonChecklist: [
              'Inspect an Audio clip in Ableton Sample View vs a MIDI clip in Piano Roll.'
            ],
            realAbletonChecklistHe: [
              'השווה בין קליפ אודיו ב-Sample View לקליפ MIDI ב-Piano Roll באבלטון.'
            ]
          }
        ],
        quiz: [
          {
            question: 'What is displayed inside an Audio clip in Ableton Live 12?',
            questionHe: 'מה מוצג בתוך קליפ Audio ב-Ableton Live 12?',
            options: [
              'Piano keys and MIDI notes',
              'A sound waveform showing amplitude over time',
              'Code scripts',
              'Video frames'
            ],
            optionsHe: [
              'קלידי פסנתר ותווי MIDI',
              'צורת גל קול (Waveform) המציגה עוצמה לאורך זמן',
              'קוד תכנות',
              'תמונות וידאו'
            ],
            correctIndex: 1,
            explanation: 'Audio clips display the visual sound waveform representation of recorded audio.',
            explanationHe: 'קליפי אודיו מציגים את גל הקול (Waveform) של השמע המוקלט.'
          }
        ]
      },

      // MODULE 10: Devices
      {
        id: 'mod10_devices',
        title: 'Module 10: Devices & Device Chain',
        titleHe: 'מודול 10: מכשירים ושרשרת המכשירים (Device Chain)',
        level: 'Intermediate',
        category: '10 — Devices',
        categoryHe: '10 — מכשירים ושרשרת המכשירים',
        moduleIndex: 10,
        objective: 'Understand Instruments, MIDI Effects, Audio Effects, and left-to-right signal flow in the Device Chain (Operator, Wavetable, Audio Effect).',
        objectiveHe: 'הבנת כלי נגינה, אפקטי MIDI, אפקטי שמע וזרימת הטרנזיט משמאל לימין בשרשרת המכשירים.',
        durationMinutes: 15,
        completionRewardXp: 180,
        steps: [
          {
            id: 'step_m10_1',
            title: 'Inspect Operator Synth Device',
            titleHe: 'בדיקת המכשיר Operator',
            instruction: 'Click on the Operator instrument tab in the lower device chain area.',
            instructionHe: 'לחץ על לשונית Operator בשרשרת המכשירים התחתונה.',
            targetElement: 'operator_osc',
            explanation: 'Operator is a powerful built-in synth device that generates sound oscillators.',
            explanationHe: 'Operator הינו סינתיסייזר מובנה רב עוצמה המפיק צלילים באוסילטורים.',
            why: 'Devices process or generate audio; they sit inside the bottom panel Device Chain.',
            whyHe: 'מכשירים מייצרים או מעבדים סאונד בשרשרת התחתונה.',
            hint1: 'Look at the bottom panel device tabs.',
            hint1He: 'הסתכל בתחתית המסך בלשוניות ה-Device.',
            hint2: 'Click Operator.',
            hint2He: 'לחץ על Operator.',
            answer: 'Click Operator tab.',
            answerHe: 'לחץ על לשונית Operator.',
            actionType: 'click',
            successMessage: 'Operator synth device focused!',
            successMessageHe: 'המכשיר Operator נבחר!',
            realAbletonChecklist: [
              'Drag Operator from Browser -> Instruments onto a MIDI track in Ableton.'
            ],
            realAbletonChecklistHe: [
              'גורר את Operator מהדפדפן לערוץ MIDI באבלטון.'
            ]
          }
        ],
        quiz: [
          {
            question: 'In which direction does audio flow through devices in Ableton Live 12 Device Chain?',
            questionHe: 'באיזה כיוון זורם השמע בשרשרת המכשירים (Device Chain) ב-Ableton Live 12?',
            options: [
              'Right to left',
              'Left to right (Instrument first, then audio effects in series)',
              'Top to bottom only',
              'Random'
            ],
            optionsHe: [
              'מימין לשמאל',
              'משמאל לימין (קודם כלי הנגינה ולאחריו אפקטי השמע בטור)',
              'מלמעלה למטה בלבד',
              'באופן אקראי'
            ],
            correctIndex: 1,
            explanation: 'Audio signal flows from left to right through each device in the chain.',
            explanationHe: 'אות השמע זורם משמאל לימין דרך כל מכשיר בשרשרת.'
          }
        ]
      },

      // MODULE 11: Mixer
      {
        id: 'mod11_mixer',
        title: 'Module 11: Mixer',
        titleHe: 'מודול 11: המיקסר (Volume, Pan, Mute, Solo, Sends & Master)',
        level: 'Intermediate',
        category: '11 — Mixer',
        categoryHe: '11 — המיקסר',
        moduleIndex: 11,
        objective: 'Master Volume faders, Panning (L/R), Mute, Solo, Send levels, Return tracks, and the Master bus.',
        objectiveHe: 'שליטה בפיידרים של ווליום, צידוד (Pan), השתקה (Mute), סולו (Solo), שליחות (Sends) וערוץ המאסטר.',
        durationMinutes: 14,
        completionRewardXp: 170,
        steps: [
          {
            id: 'step_m11_1',
            title: 'Mute Track 1',
            titleHe: 'השתקת ערוץ 1 (Mute)',
            instruction: 'Click the Mute button ("M") on Track 1.',
            instructionHe: 'לחץ על כפתור ה-Mute ("M") בערוץ 1.',
            targetElement: 'track_mute',
            explanation: 'Mute silences the track output temporarily without deleting or removing anything.',
            explanationHe: 'Mute מכבה את יציאת השמע של הערוץ הנבחר.',
            why: 'Useful for isolating other tracks or comparing arrangement versions.',
            whyHe: 'שימושי להשוואת גרסאות או להשתקת חלקים זמנית.',
            hint1: 'Find Track 1 header.',
            hint1He: 'חפש את ראש ערוץ 1.',
            hint2: 'Click Mute button.',
            hint2He: 'לחץ על כפתור Mute.',
            answer: 'Click Mute button on Track 1.',
            answerHe: 'לחץ על Mute בערוץ 1.',
            actionType: 'click',
            successMessage: 'Track 1 muted!',
            successMessageHe: 'ערוץ 1 הושתק!',
            realAbletonChecklist: [
              'Click track number activator box in Ableton to Mute/Unmute.'
            ],
            realAbletonChecklistHe: [
              'לחץ על מספר הערוץ באבלטון להשתקה/הפעלה.'
            ]
          },
          {
            id: 'step_m11_2',
            title: 'Solo Track 1',
            titleHe: 'סולו לערוץ 1 (Solo)',
            instruction: 'Click the Solo button ("S") on Track 1.',
            instructionHe: 'לחץ על כפתור ה-Solo ("S") בערוץ 1.',
            targetElement: 'track_solo',
            explanation: 'Solo silences ALL other tracks so you only hear the selected track.',
            explanationHe: 'Solo משתיק את כל הערוצים האחרים ומשמיע רק את הערוץ הנבחר.',
            why: 'Essential when critically tuning or EQing a single element in isolation.',
            whyHe: 'חיוני להאזנה ממוקדת וכיוונון עדין של כלי בודד.',
            hint1: 'Look right next to Mute button for "S".',
            hint1He: 'חפש ליד כפתור ה-Mute את האות "S".',
            hint2: 'Click Solo button.',
            hint2He: 'לחץ על כפתור Solo.',
            answer: 'Click Solo button.',
            answerHe: 'לחץ על כפתור Solo.',
            actionType: 'click',
            successMessage: 'Track 1 soloed!',
            successMessageHe: 'מצב סולו הופעל בערוץ 1!',
            realAbletonChecklist: [
              'Click "S" button on track header in Ableton Live 12.'
            ],
            realAbletonChecklistHe: [
              'לחץ על המקש "S" בערוץ באבלטון 12.'
            ]
          }
        ],
        quiz: [
          {
            question: 'What is the function of the Solo button ("S") on a track header in Ableton Live 12?',
            questionHe: 'מה התפקיד של כפתור ה-Solo ("S") בראש הערוץ ב-Ableton Live 12?',
            options: [
              'Deletes all notes',
              'Silences all other tracks so only the soloed track plays',
              'Doubles the tempo',
              'Exports the track'
            ],
            optionsHe: [
              'מוחק את כל התווים',
              'משתיק את כל הערוצים האחרים ומשמיע רק את הערוץ שנבחר',
              'מכפיל את הטמפו',
              'מייצא את הערוץ'
            ],
            correctIndex: 1,
            explanation: 'Solo isolates the selected track for critical auditioning.',
            explanationHe: 'סולו מבודד את הערוץ הנבחר להאזנה ממוקדת.'
          }
        ]
      },

      // MODULE 12: Automation
      {
        id: 'mod12_automation',
        title: 'Module 12: Automation',
        titleHe: 'מודול 12: אוטומציה ותנועת פרמטרים',
        level: 'Intermediate',
        category: '12 — Automation',
        categoryHe: '12 — אוטומציה ותנועת פרמטרים',
        moduleIndex: 12,
        objective: 'Learn automation: volume fades, filter frequency sweep curves over time.',
        objectiveHe: 'הבנת אוטומציה: שינויי עוצמה (Fades) ועקומות סינון (Filter Sweeps) לאורך ציר הזמן.',
        durationMinutes: 12,
        completionRewardXp: 160,
        steps: [
          {
            id: 'step_m12_1',
            title: 'Enable Automation Mode',
            titleHe: 'הפעלת מצב אוטומציה',
            instruction: 'Click the Automation Mode button (or press Key "A").',
            instructionHe: 'לחץ על כפתור האוטומציה (או מקש "A" במקלדת).',
            targetElement: 'automation_btn',
            explanation: 'Automation mode overlays colored parameter envelope lines over timeline tracks.',
            explanationHe: 'מצב אוטומציה מציג קווים צבעוניים לבקרת פרמטרים לאורך הזמן.',
            why: 'Creates energetic builds, filter sweeps, and volume transitions over time.',
            whyHe: 'מייצר עליות מותחות, עליות פילטר ושינויי עוצמה.',
            hint1: 'Look near top right view toggles.',
            hint1He: 'חפש ליד כפתורי התצוגה בצד ימין למעלה.',
            hint2: 'Click Automation icon.',
            hint2He: 'לחץ על כפתור האוטומציה.',
            answer: 'Click Automation button.',
            answerHe: 'לחץ על כפתור האוטומציה.',
            actionType: 'toggle_mode',
            successMessage: 'Automation mode active!',
            successMessageHe: 'מצב אוטומציה פעיל!',
            realAbletonChecklist: [
              'Press Key "A" in Ableton Live 12 to toggle Automation view on/off.'
            ],
            realAbletonChecklistHe: [
              'לחץ על המקש "A" באבלטון 12 להפעלה/כיבוי של מצב האוטומציה.'
            ]
          }
        ],
        quiz: [
          {
            question: 'Which key shortcut toggles Automation mode on and off in Ableton Live 12?',
            questionHe: 'איזה מקש קיצור מפעיל ומכבה את מצב האוטומציה ב-Ableton Live 12?',
            options: [
              'Key "A"',
              'Key "B"',
              'Spacebar',
              'Shift+Tab'
            ],
            optionsHe: [
              'המקש "A"',
              'המקש "B"',
              'מקש רווח',
              'Shift+Tab'
            ],
            correctIndex: 0,
            explanation: 'Pressing Key A displays automation envelope lanes across timeline tracks.',
            explanationHe: 'לחיצה על המקש A מציגה ומסתירה את קווי האוטומציה בערוצים.'
          }
        ]
      },

      // MODULE 13: Your First Mini Project
      {
        id: 'mod13_mini_project',
        title: 'Module 13: Your First Mini Project',
        titleHe: 'מודול 13: הפרויקט הקטן הראשון שלך',
        level: 'Intermediate',
        category: '13 — Your First Mini Project',
        categoryHe: '13 — פרויקט ראשון',
        moduleIndex: 13,
        objective: 'Construct a simple electronic loop: 1 MIDI Track, 1 Instrument device, 1 MIDI Clip with Kick, Hi-Hat, Bass/notes, and basic volume adjustment.',
        objectiveHe: 'בניית לופ אלקטרוני פשוט: ערוץ MIDI אחד, כלי נגינה, קליפ MIDI עם תוף רגל (Kick), הי-האט, בס/תווים ואיזון ווליום.',
        durationMinutes: 20,
        completionRewardXp: 250,
        steps: [
          {
            id: 'step_m13_1',
            title: 'Verify Master Output & Play Mini Loop',
            titleHe: 'בדיקת יציאת המאסטר וניגון הלופ הראשון',
            instruction: 'Click Play button to audition your combined MIDI track loop and volume mix.',
            instructionHe: 'לחץ על כפתור ה-Play להשמעת לופ ה-MIDI המלא עם איזון הווליום.',
            targetElement: 'transport_play',
            explanation: 'Playing your first loop confirms that the MIDI clip, synth instrument, and track volume connect properly.',
            explanationHe: 'ניגון הלופ הראשון מאשר שקליפ ה-MIDI, ה-Instrument ואיזון הווליום עובדים יחד בהצלחה.',
            why: 'Final verification ensures you understand how all Ableton Live 12 building blocks fit together.',
            whyHe: 'בדיקה סופית המאשרת את הבנת חיבור כל החלקים באבלטון.',
            hint1: 'Click Play button in top control bar.',
            hint1He: 'לחץ על כפתור ה-Play בסרגל העליון.',
            hint2: 'Click Play.',
            hint2He: 'לחץ על Play.',
            answer: 'Click Play button.',
            answerHe: 'לחץ על כפתור ה-Play.',
            actionType: 'click',
            successMessage: 'Mini project loop playing! Great job assembling your first music block!',
            successMessageHe: 'הלופ הראשון מנגן בהצלחה! כל הכבוד על חיבור חלקי המוזיקה!',
            realAbletonChecklist: [
              'In Ableton Live 12: File -> Export Audio/Video (Ctrl+Shift+R) to bounce WAV file.'
            ],
            realAbletonChecklistHe: [
              'באבלטון 12: File -> Export Audio/Video (או Ctrl+Shift+R) לייצוא קובץ WAV.'
            ]
          }
        ],
        quiz: [
          {
            question: 'What shortcut exports the final master audio in Ableton Live 12?',
            questionHe: 'איזה מקש קיצור מייצא את קובץ האודיו הסופי ב-Ableton Live 12?',
            options: [
              'Ctrl+Shift+R (Cmd+Shift+R on Mac)',
              'Ctrl+S',
              'Spacebar',
              'Key "A"'
            ],
            optionsHe: [
              'Ctrl+Shift+R (Cmd+Shift+R במק)',
              'Ctrl+S',
              'מקש רווח',
              'המקש "A"'
            ],
            correctIndex: 0,
            explanation: 'Ctrl+Shift+R opens the Export Audio/Video window in Ableton Live 12.',
            explanationHe: 'לחץ Ctrl+Shift+R לפתיחת חלון יצוא השמע באבלטון 12.'
          }
        ]
      },

      // MODULE 14: Final Practical Test
      {
        id: 'mod14_final_test',
        title: 'Module 14: Final Practical Test',
        titleHe: 'מודול 14: המבחן המעשי המסכם (Class #1 Final Test)',
        level: 'Advanced',
        category: '14 — Final Practical Test',
        categoryHe: '14 — מבחן מעשי מסכם',
        moduleIndex: 14,
        objective: 'Complete a practical test without step-by-step instructions: 1. Create MIDI Track, 2. Load instrument, 3. Create MIDI Clip, 4. Create notes, 5. Add drum track, 6. Set BPM, 7. Play project, 8. Find mixer, 9. Adjust volume, 10. Switch between Session & Arrangement. Achieve 80%+ to unlock Class #2!',
        objectiveHe: 'ביצוע מבחן מעשי מסכם ללא הנחיות מפורטות: 1. יצירת ערוץ MIDI, 2. טעינת Instrument, 3. יצירת קליפ, 4. כתיבת תווים, 5. הוספת תופים, 6. קביעת קצב, 7. ניגון, 8. איתור מיקסר, 9. כיוון ווליום, 10. מעבר תצוגות. נדרש ציון 80%+ לפתיחת כיתה #2!',
        durationMinutes: 15,
        completionRewardXp: 300,
        steps: [
          {
            id: 'step_m14_1',
            title: 'Practical Test Step 1: Set BPM to 142',
            titleHe: 'שלב 1 במבחן: קביעת BPM ל-142',
            instruction: 'Set project BPM to 142.',
            instructionHe: 'הגדר את קצב הפרויקט ל-142 BPM.',
            targetElement: 'bpm_input',
            explanation: 'Practical evaluation verifies you can operate tempo controls without assistance.',
            explanationHe: 'המבחן המעשי בודק שליטה עצמאית בקביעת הקצב.',
            why: 'Tests speed adjustment skills.',
            whyHe: 'בוחן מיומנות שינוי קצב.',
            hint1: 'Click BPM display.',
            hint1He: 'לחץ על תצוגת ה-BPM.',
            hint2: 'Type 142.',
            hint2He: 'הקלד 142.',
            answer: 'Set BPM to 142.',
            answerHe: 'הגדר BPM ל-142.',
            actionType: 'value_change',
            targetValue: 142,
            successMessage: 'BPM 142 confirmed!',
            successMessageHe: 'הגדרת BPM 142 אושרה!',
            realAbletonChecklist: ['Set Tempo to 142 in Ableton Live 12.'],
            realAbletonChecklistHe: ['הגדר קצב ל-142 באבלטון 12.']
          },
          {
            id: 'step_m14_2',
            title: 'Practical Test Step 2: Create a MIDI Track',
            titleHe: 'שלב 2 במבחן: יצירת ערוץ MIDI',
            instruction: 'Add a new MIDI Track.',
            instructionHe: 'הוסף ערוץ MIDI חדש.',
            targetElement: 'add_midi_track_btn',
            explanation: 'Verifies ability to create MIDI tracks independently.',
            explanationHe: 'בוחן יצירה עצמאית של ערוץ MIDI.',
            why: 'Track management is foundational.',
            whyHe: 'ניהול ערוצים הוא יסוד הפעולה.',
            hint1: 'Click "+ Add MIDI Track".',
            hint1He: 'לחץ על "+ Add MIDI Track".',
            hint2: 'Click Add MIDI Track button.',
            hint2He: 'לחץ על הוספת ערוץ MIDI.',
            answer: 'Click "+ Add MIDI Track".',
            answerHe: 'לחץ על "+ Add MIDI Track".',
            actionType: 'click',
            successMessage: 'MIDI track created!',
            successMessageHe: 'ערוץ MIDI נוצר!',
            realAbletonChecklist: ['Press Ctrl+Shift+T in Ableton.'],
            realAbletonChecklistHe: ['לחץ Ctrl+Shift+T באבלטון.']
          },
          {
            id: 'step_m14_3',
            title: 'Practical Test Step 3: Switch Views',
            titleHe: 'שלב 3 במבחן: מעבר בין Session ו-Arrangement',
            instruction: 'Switch to Arrangement View.',
            instructionHe: 'עבור לתצוגת Arrangement View.',
            targetElement: 'view_toggle_arrangement',
            explanation: 'Verifies navigation between Session and Arrangement views.',
            explanationHe: 'בוחן ניווט עצמאי בין התצוגות.',
            why: 'Crucial for timeline editing.',
            whyHe: 'חיוני לעריכה בציר הזמן.',
            hint1: 'Click top right horizontal bars icon.',
            hint1He: 'לחץ בפינה הימנית העליונה.',
            hint2: 'Click Arrangement view toggle.',
            hint2He: 'לחץ על תצוגת Arrangement.',
            answer: 'Click Arrangement View toggle.',
            answerHe: 'לחץ על תצוגת Arrangement.',
            actionType: 'toggle_mode',
            successMessage: 'View toggle confirmed! Final test completed with 100% score!',
            successMessageHe: 'מעבר התצוגה אושר! סיימת בהצלחה את המבחן המסכם ב-100%!',
            realAbletonChecklist: ['Press Tab in Ableton Live 12.'],
            realAbletonChecklistHe: ['לחץ Tab באבלטון 12.']
          }
        ],
        quiz: [
          {
            question: 'What score is required on Class #1 Final Practical Test to complete Ableton Live 12 — First Steps and unlock Class #2?',
            questionHe: 'איזה ציון נדרש במבחן המסכם של כיתה #1 להשלמת צעדים ראשונים ופתיחת כיתה #2?',
            options: [
              '50%',
              '80% or higher',
              '100% only',
              'No test is required'
            ],
            optionsHe: [
              '50%',
              '80% ומעלה',
              '100% בלבד',
              'אין צורך במבחן'
            ],
            correctIndex: 1,
            explanation: 'An 80% or higher score is required to verify core mastery before unlocking Class 2.',
            explanationHe: 'ציון של 80% ומעלה מבטיח שליטה מלאה ביסודות לפני מעבר לכיתה הבאה.'
          }
        ]
      }
    ]
  },

  // SPECIALIZED COURSE: Psytrance Production
  {
    id: 'psytrance_specialist',
    title: 'Psytrance Production Specialist (145 BPM)',
    titleHe: 'התמחות בהפקת פסיטראנס (145 BPM)',
    genre: 'Psytrance',
    subtitle: 'Rolling KB, Filter Envelopes, Psy Leads, Acid & Driving Energy',
    subtitleHe: 'בס מתגלגל (Rolling KB), מעטפות פילטר, סינתי ליד חמוץ ואנרגיה כפולה',
    icon: 'Zap',
    description: 'Learn the exact production steps for punchy kicks, 16th rolling basslines, acid stabs, and hypnotic atmospheres.',
    descriptionHe: 'למד את הצעדים המדויקים להפקת תוף רגל חד, בס מתגלגל ב-1/16, צלילי אסיד ואווירות היפנוטיות.',
    lessons: [
      {
        id: 'psy_1_rolling_bass',
        title: 'Lesson 1: Psytrance 145 BPM Kick & Rolling Bass Setup',
        titleHe: 'שיעור 1: הגדרת תוף רגל ובס מתגלגל ב-145 BPM',
        level: 'Intermediate',
        category: 'Psytrance',
        categoryHe: 'פסיטראנס',
        moduleIndex: 1,
        objective: 'Set BPM to 145 and construct a precise 1/16th note rolling KBBB pattern.',
        objectiveHe: 'קביעת קצב ל-145 BPM ובניית תבנית בס מתגלגלת ב-1/16 (KBBB).',
        durationMinutes: 15,
        completionRewardXp: 200,
        steps: [
          {
            id: 'step_psy_1',
            title: 'Set Psytrance Tempo to 145 BPM',
            titleHe: 'קביעת טמפו פסיטראנס ל-145 BPM',
            instruction: 'Click BPM input box and set tempo to 145.',
            instructionHe: 'לחץ על תיבת ה-BPM והגדר את הקצב ל-145.',
            targetElement: 'bpm_input',
            explanation: '145 BPM provides the driving momentum standard in Full-On and Progressive Psytrance.',
            explanationHe: 'קצב 145 BPM מניע את האנרגיה הדרושה לסגנונות פול-און ופרוגרסיב פסיטראנס.',
            why: 'Too slow feels dragged; too fast blurs the rolling bass notes.',
            whyHe: 'קצב איטי מדי מרגיש כבד, וקצב מהיר מדי מטשטש את צלילי הבס המתגלגל.',
            hint1: 'Click top left BPM box.',
            hint1He: 'לחץ על תיבת ה-BPM למעלה.',
            hint2: 'Type 145.',
            hint2He: 'הקלד 145.',
            answer: 'Set BPM to 145.',
            answerHe: 'הגדר BPM ל-145.',
            actionType: 'value_change',
            targetValue: 145,
            successMessage: 'BPM set to 145!',
            successMessageHe: 'הקצב עודכן ל-145 BPM!',
            realAbletonChecklist: [
              'Set Ableton Tempo to 145 BPM.',
              'Create MIDI track for Psy Bass.'
            ],
            realAbletonChecklistHe: [
              'קבע קצב 145 באבלטון.',
              'צור ערוץ MIDI עבור ה-Psy Bass.'
            ]
          }
        ]
      }
    ]
  },

  // SPECIALIZED COURSE: Techno Production
  {
    id: 'techno_specialist',
    title: 'Peak-Time & Raw Techno Production (128 BPM)',
    titleHe: 'התמחות בהפקת טכנו Peak-Time (128 BPM)',
    genre: 'Techno',
    subtitle: 'Industrial Kicks, Sub-Rumble, Percussive Grooves & Filter Sweeps',
    subtitleHe: 'תוף רגל תעשייתי, סאב-ראמבל עמוק, גרוב פרקשן ואוטומציית פילטרים',
    icon: 'Disc',
    description: 'Master low-end kick rumble generation, hypnotic synth stabs, tension automation, and dark atmosphere design.',
    descriptionHe: 'שליטה ביצירת סאב-ראמבל תחתון, דקירות סינתי היפנוטיות, עליות מתח ואווירה אפלה.',
    lessons: [
      {
        id: 'tech_1_rumble',
        title: 'Lesson 1: Techno Sub-Rumble & Kick Setup',
        titleHe: 'שיעור 1: בניית תוף רגל וסאב-ראמבל בטכנו',
        level: 'Intermediate',
        category: 'Techno',
        categoryHe: 'טכנו',
        moduleIndex: 1,
        objective: 'Setup 128 BPM and construct a reverbed sub-rumble kick chain.',
        objectiveHe: 'קביעת 128 BPM ובניית שרשרת סאב-ראמבל מבוססת ריוורב וסיידצ\'יין.',
        durationMinutes: 15,
        completionRewardXp: 200,
        steps: [
          {
            id: 'step_tech_1',
            title: 'Set Techno Tempo to 128 BPM',
            titleHe: 'קביעת קצב טכנו ל-128 BPM',
            instruction: 'Click BPM box and set to 128.',
            instructionHe: 'לחץ על תיבת ה-BPM והגדר ל-128.',
            targetElement: 'bpm_input',
            explanation: '128 BPM is the golden tempo for Peak-Time, Driving, and Industrial Techno.',
            explanationHe: '128 BPM הוא קצב הזהב לקטעי Peak-Time וטכנו תעשייתי למועדונים.',
            why: 'It balances heavy sub weight with energetic groove velocity.',
            whyHe: 'הוא משלב את הכובד של התדרים הנמוכים יחד עם קצב זורם ורוקד.',
            hint1: 'Click BPM display.',
            hint1He: 'לחץ על תצוגת ה-BPM.',
            hint2: 'Type 128.',
            hint2He: 'הקלד 128.',
            answer: 'Set BPM to 128.',
            answerHe: 'הגדר BPM ל-128.',
            actionType: 'value_change',
            targetValue: 128,
            successMessage: 'BPM set to 128!',
            successMessageHe: 'הקצב עודכן ל-128 BPM!',
            realAbletonChecklist: [
              'Set Ableton Tempo to 128 BPM.'
            ],
            realAbletonChecklistHe: [
              'קבע קצב 128 באבלטון.'
            ]
          }
        ]
      }
    ]
  }
];

export const ABLETON_SEARCH_TOPICS: AbletonSearchTopic[] = [
  {
    id: 'topic_browser',
    name: 'Browser',
    nameHe: 'דפדפן הקבצים (Browser)',
    targetElement: 'browser',
    category: 'Interface',
    categoryHe: 'ממשק',
    whatItDoes: 'Stores all instruments, audio effects, MIDI effects, samples, packs, and plugins.',
    whatItDoesHe: 'מרכז את כל הכלים, אפקטי השמע, אפקטי ה-MIDI, הדגימות והפלאגינים.',
    whyItMatters: 'Essential for loading synths, samples, and processing effects into tracks.',
    whyItMattersHe: 'חיוני לטעינת סינתיסייזרים, דגימות סאונד ואפקטים מעבדים.',
    whenToUse: 'Whenever you need to add new sounds or effects to your project.',
    whenToUseHe: 'בכל פעם שברצונך להוסיף סאונד או אפקט חדש לפרויקט.',
    howToUse: 'Click category, select device/sample, and drag onto track or double click.',
    howToUseHe: 'לחץ על קטגוריה, בחר מכשיר/דגימה וגורר אל הערוץ או לחץ פעמיים.',
    beginnerMistake: 'Forgetting where samples are stored; use the Search bar at top of Browser.',
    beginnerMistakeHe: 'שכחת המיקום של דגימות; השתמש בשורת החיפוש בראש ה-Browser.'
  },
  {
    id: 'topic_transport',
    name: 'Transport (Play / Stop / Record)',
    nameHe: 'סרגל ההפעלה (Transport)',
    targetElement: 'transport_play',
    category: 'Control Bar',
    categoryHe: 'סרגל השליטה',
    whatItDoes: 'Controls song play, stop, arrangement recording, and playhead position.',
    whatItDoesHe: 'שולט על הניגון, העצירה, ההקלטה ומיקום סמן הזמן.',
    whyItMatters: 'Drives timeline movement for auditioning and tracking.',
    whyItMattersHe: 'מניע את ציר הזמן להאזנה והקלטה.',
    whenToUse: 'Whenever starting or stopping playback.',
    whenToUseHe: 'בכל התחלה או עצירה של הניגון.',
    howToUse: 'Click Play (or press Spacebar). Click Stop to halt.',
    howToUseHe: 'לחץ Play (או מקש רווח). לחץ Stop לעצירה.',
    beginnerMistake: 'Leaving record active while editing clips accidentally overwriting notes.',
    beginnerMistakeHe: 'השארת מצב הקלטה פעיל בזמן עריכה הגורמת לדריסת תווים.'
  },
  {
    id: 'topic_tempo',
    name: 'Tempo / BPM',
    nameHe: 'מהירות / טמפו (BPM)',
    targetElement: 'bpm_input',
    category: 'Control Bar',
    categoryHe: 'סרגל השליטה',
    whatItDoes: 'Sets project speed in Beats Per Minute.',
    whatItDoesHe: 'קובע את מהירות הפרויקט בפעימות בדקה.',
    whyItMatters: 'Determines genre momentum (e.g. Techno 128 BPM, Psytrance 145 BPM).',
    whyItMattersHe: 'קובע את קצב הז\'אנר (למשל טכנו 128 BPM, פסיטראנס 145 BPM).',
    whenToUse: 'At the start of every new song or when adjusting groove feel.',
    whenToUseHe: 'בתחילת כל שיר חדש או בעת כיוונון הגרוב.',
    howToUse: 'Double-click tempo display, type desired number, press Enter.',
    howToUseHe: 'לחץ פעמיים על תצוגת הטמפו, הקלד את המספר ולחץ Enter.',
    beginnerMistake: 'Changing BPM late in production without warp checking audio samples.',
    beginnerMistakeHe: 'שינוי BPM בשלב מאוחר מבלי לבדוק את ה-Warp של דגימות השמע.'
  },
  {
    id: 'topic_metronome',
    name: 'Metronome',
    nameHe: 'מטרונום',
    targetElement: 'metronome',
    category: 'Control Bar',
    categoryHe: 'סרגל השליטה',
    whatItDoes: 'Generates audible click ticks on beat divisions.',
    whatItDoesHe: 'משמיע נקישות קצב לפי חלוקת הפעימות.',
    whyItMatters: 'Guides human timing when playing MIDI keys or recording vocals/instruments.',
    whyItMattersHe: 'מנחה את הנגינה והשירה בדיוק בזמן הקצב.',
    whenToUse: 'During live recording or note drawing auditioning.',
    whenToUseHe: 'בזמן הקלטה בלייב או בדיקת תווים.',
    howToUse: 'Click Metronome button or press Key "C".',
    howToUseHe: 'לחץ על כפתור המטרונום או מקש "C".',
    beginnerMistake: 'Leaving metronome on during final audio export.',
    beginnerMistakeHe: 'השארת המטרונום פעיל בזמן יצוא סופי.'
  },
  {
    id: 'topic_session',
    name: 'Session View',
    nameHe: 'תצוגת Session View',
    targetElement: 'view_toggle_session',
    category: 'Views',
    categoryHe: 'תצוגות',
    whatItDoes: 'Clip grid matrix for non-linear jamming, looping, and performance.',
    whatItDoesHe: 'מטריצת קליפים לאלתור, ניתוח לופים והופעה בלייב.',
    whyItMatters: 'Allows exploring musical ideas without timeline restrictions.',
    whyItMattersHe: 'מאפשר בדיקת רעיונות מוזיקליים ללא מגבלת ציר זמן.',
    whenToUse: 'In early sketch stages or live DJ sets.',
    whenToUseHe: 'בשלבי הרעיון הראשוניים או בהופעה בלייב.',
    howToUse: 'Press Tab or click Grid icon in top right.',
    howToUseHe: 'לחץ Tab או לחץ על אייקון הגריד בצד ימין למעלה.',
    beginnerMistake: 'Confusing Session View clip slots with Arrangement View timeline.',
    beginnerMistakeHe: 'בלבול בין משבצות Session View לבין ציר הזמן ב-Arrangement View.'
  },
  {
    id: 'topic_arrangement',
    name: 'Arrangement View',
    nameHe: 'תצוגת Arrangement View',
    targetElement: 'view_toggle_arrangement',
    category: 'Views',
    categoryHe: 'תצוגות',
    whatItDoes: 'Horizontal left-to-right timeline for full song structuring.',
    whatItDoesHe: 'ציר זמן אופקי משמאל לימין לבניית שיר מלא.',
    whyItMatters: 'Where full electronic compositions are assembled from intro to outro.',
    whyItMattersHe: 'התרשים שבו מורכבות יצירות אלקטרוניות מפתיחה ועד סיום.',
    whenToUse: 'When building song structure and final mixdown.',
    whenToUseHe: 'בעת בניית מבנה השיר והמיקס הסופי.',
    howToUse: 'Press Tab to switch between Session and Arrangement views.',
    howToUseHe: 'לחץ Tab למעבר מהיר בין התצוגות.',
    beginnerMistake: 'Not using locators to mark Intro, Build, Drop, and Outro sections.',
    beginnerMistakeHe: 'אי-שימוש בסמני מיקום (Locators) לסימון הפתיחה והדרופ.'
  },
  {
    id: 'topic_piano_roll',
    name: 'Piano Roll / MIDI Editor',
    nameHe: 'עורך ה-MIDI / Piano Roll',
    targetElement: 'piano_roll',
    category: 'Editors',
    categoryHe: 'עורכים',
    whatItDoes: 'Displays pitch keys and time grid for drawing and editing MIDI notes.',
    whatItDoesHe: 'מציג קלידי פסנתר וגריד זמן לציור ועריכת תווים.',
    whyItMatters: 'Primary canvas for composing melodies, chord progressions, and basslines.',
    whyItMattersHe: 'הקנבס המרכזי לכתיבת מלודיות, אקורדים וליינים של בס.',
    whenToUse: 'Whenever editing MIDI clip contents.',
    whenToUseHe: 'בכל פעם שעורכים קליפ MIDI.',
    howToUse: 'Double-click a MIDI clip or press Shift+Tab.',
    howToUseHe: 'לחץ פעמיים על קליפ MIDI או Shift+Tab.',
    beginnerMistake: 'Forgetting to quantize off-beat notes with Ctrl+U.',
    beginnerMistakeHe: 'אי-ביצוע קואנטיזציה לתווים שיצאו מהקצב עם Ctrl+U.'
  },
  {
    id: 'topic_automation',
    name: 'Automation Mode',
    nameHe: 'מצב אוטומציה (Automation Mode)',
    targetElement: 'automation_btn',
    category: 'Editing',
    categoryHe: 'עריכה',
    whatItDoes: 'Overlays parameter envelope lines over timeline tracks.',
    whatItDoesHe: 'מציג קווי מעטפת פרמטרים על גבי הערוצים בציר הזמן.',
    whyItMatters: 'Creates motion, filter sweeps, volume fades, and tension builds.',
    whyItMattersHe: 'יוצר תנועה, עליות פילטר, מעברי ווליום ומתח מוזיקלי.',
    whenToUse: 'When adding expression and movement to instruments and effects.',
    whenToUseHe: 'כשרוצים להוסיף הבעה ותנועה לכלים ולחקוטים.',
    howToUse: 'Press Key "A" to toggle automation lanes on and off.',
    howToUseHe: 'לחץ על המקש "A" להצגה והסתרה של קווי האוטומציה.',
    beginnerMistake: 'Drawing too many erratic points causing harsh audio pops; keep curves smooth.',
    beginnerMistakeHe: 'ציור נקודות חדות מדי הגורמות לקליקים; שמור על קווים חלקים.'
  }
];

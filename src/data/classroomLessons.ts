import { ClassroomCourse, AbletonSearchTopic } from '../types/classroom';

export const ABLETON_CLASSROOM_COURSES: ClassroomCourse[] = [
  {
    id: 'beginner_core',
    title: 'Getting Started with Ableton Live 12',
    titleHe: 'צעדים ראשונים ב-Ableton Live 12',
    subtitle: '12-Module Masterclass: Interface, Session & Arrangement Views, MIDI, Audio, Devices, Mixer & Workflow',
    subtitleHe: 'קורס מקיף בן 12 מודולים: הממשק, תצוגות Session ו-Arrangement, ערוצי MIDI ו-Audio, אפקטים, מיקסר ותהליך עבודה',
    icon: 'Layout',
    description: 'Learn where things are, what they do, why they are used, and how to operate Ableton Live 12.',
    descriptionHe: 'למד איפה כל דבר נמצא, מה הוא עושה, למה משתמשים בו ואיך להשתמש בזה באבלטון.',
    lessons: [
      // MODULE 01: Getting Around Live
      {
        id: 'mod1_getting_around',
        title: 'Module 01: Getting Around Live',
        titleHe: 'מודול 01: היכרות ומבנה המסך',
        level: 'Beginner',
        category: '01 — Getting Around Live',
        categoryHe: '01 — היכרות ומבנה המסך',
        moduleIndex: 1,
        objective: 'Understand the main layout of Ableton Live 12: Browser on the left, Main View in the center, Device/Clip view at the bottom, and Transport at the top.',
        objectiveHe: 'הבנת המבנה הכללי של Ableton Live 12: הדפדפן משמאל, המסך המרכזי במרכז, תצוגת הקליפ/מכשירים למטה וסרגל ההפעלה למעלה.',
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
        title: 'Module 02: Control Bar',
        titleHe: 'מודול 02: סרגל השליטה העליון (Control Bar)',
        level: 'Beginner',
        category: '02 — Control Bar',
        categoryHe: '02 — סרגל השליטה העליון',
        moduleIndex: 2,
        objective: 'Master Play, Stop, Record, Tempo (BPM), and Metronome timing controls.',
        objectiveHe: 'הכרת כפתורי ההפעלה (Play, Stop, Record), קביעת הקצב (BPM) והפעלת המטרונום.',
        durationMinutes: 10,
        completionRewardXp: 120,
        steps: [
          {
            id: 'step_m2_1',
            title: 'Start Playback',
            titleHe: 'הפעלת ניגון (Play)',
            instruction: 'Click the green Play button in the top Control Bar.',
            instructionHe: 'לחץ על כפתור ה-Play בסרגל השליטה העליון.',
            targetElement: 'transport_play',
            explanation: 'The Play button starts playback of the timeline or session clips.',
            explanationHe: 'כפתור ה-Play מניע את ניגון ציר הזמן או קטעי המוזיקה.',
            why: 'Playback lets you audition your arrangement and live mix.',
            whyHe: 'הניגון מאפשר להאזין לערוצים ולבצע מיקס בזמן אמת.',
            hint1: 'Look at the top left area for the play icon triangle.',
            hint1He: 'חפש בסרגל העליון מצד שמאל את כפתור ה-Play.',
            hint2: 'Click the Play button (or press Space in real Ableton).',
            hint2He: 'לחץ על כפתור ה-Play (או מקש רווח באבלטון האמיתי).',
            answer: 'Click the Play button.',
            answerHe: 'לחץ על כפתור ה-Play.',
            actionType: 'click',
            successMessage: 'Playback rolling!',
            successMessageHe: 'הניגון פועל!',
            realAbletonChecklist: [
              'Press Spacebar to toggle Play/Stop in Ableton Live 12.'
            ],
            realAbletonChecklistHe: [
              'לחץ על מקש הרווח באבלטון 12 להתחלה ועצירה.'
            ]
          },
          {
            id: 'step_m2_2',
            title: 'Adjust Project BPM',
            titleHe: 'שינוי קצב הפרויקט (BPM)',
            instruction: 'Click the BPM box and set it to 140 BPM.',
            instructionHe: 'לחץ על תיבת ה-BPM ושנה את הקצב ל-140.',
            targetElement: 'bpm_input',
            explanation: 'BPM (Beats Per Minute) determines how fast or slow the music plays.',
            explanationHe: 'BPM (פעימות בדקה) קובע את מהירות הניגון של היצירה.',
            why: 'Matching target BPM ensures loop samples and MIDI notes sync cleanly to the grid.',
            whyHe: 'קביעת קצב מדויקת מבטיחה שכל הדגימות והתווים יסתנכרנו לגריד.',
            hint1: 'Find the BPM box near the transport controls reading "120.00".',
            hint1He: 'חפש את תיבת ה-BPM המציגה "120.00".',
            hint2: 'Click and change value to 140.',
            hint2He: 'לחץ ושנה את הערך ל-140.',
            answer: 'Set BPM to 140.',
            answerHe: 'הגדר קצב ל-140 BPM.',
            actionType: 'value_change',
            targetValue: 140,
            successMessage: 'BPM set to 140!',
            successMessageHe: 'הקצב עודכן ל-140 BPM!',
            realAbletonChecklist: [
              'Double click Tempo display in Ableton top-left, type 140, press Enter.'
            ],
            realAbletonChecklistHe: [
              'לחץ פעמיים על תצוגת ה-Tempo בצד שמאל למעלה באבלטון, הקלד 140 ולחץ Enter.'
            ]
          },
          {
            id: 'step_m2_3',
            title: 'Activate Metronome Click',
            titleHe: 'הפעלת המטרונום',
            instruction: 'Click the Metronome button to enable rhythmic click ticks.',
            instructionHe: 'לחץ על כפתור המטרונום להפעלת נקישות הקצב.',
            targetElement: 'metronome',
            explanation: 'The Metronome provides precise audible clicks on every beat (1, 2, 3, 4).',
            explanationHe: 'המטרונום משמיע נקישות קצב מדויקות בכל פעימה.',
            why: 'Crucial for keeping perfect time when recording MIDI or audio.',
            whyHe: 'חיוני לשמירה על קצב מדויק בזמן הקלטה.',
            hint1: 'Look right next to the time signature (4/4).',
            hint1He: 'חפש מיד ליד משקל השיר (4/4).',
            hint2: 'Click Metronome button.',
            hint2He: 'לחץ על כפתור המטרונום.',
            answer: 'Click the Metronome toggle.',
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
          }
        ],
        quiz: [
          {
            question: 'What happens when you increase the BPM value in Ableton Live 12?',
            questionHe: 'מה קורה כשמעלים את ערך ה-BPM ב-Ableton Live 12?',
            options: [
              'The volume increases',
              'The tempo speeds up',
              'The song shifts key',
              'New tracks are created'
            ],
            optionsHe: [
              'הווליום עולה',
              'קצב המוזיקה מואץ',
              'סולם השיר משתנה',
              'נוצרים ערוצים חדשים'
            ],
            correctIndex: 1,
            explanation: 'Higher BPM accelerates the playback tempo of the entire project.',
            explanationHe: 'ערך BPM גבוה יותר מאיץ את קצב הניגון של הפרויקט כולו.'
          }
        ]
      },

      // MODULE 03: Browser
      {
        id: 'mod3_browser',
        title: 'Module 03: Browser',
        titleHe: 'מודול 03: הדפדפן והחיפוש (Browser)',
        level: 'Beginner',
        category: '03 — Browser',
        categoryHe: '03 — הדפדפן והחיפוש',
        moduleIndex: 3,
        objective: 'Navigate Browser categories, search for instruments/effects/samples, and load sounds.',
        objectiveHe: 'ניווט בקטגוריות הדפדפן, חיפוש כלי נגינה, אפקטים ודגימות, וטעינת סאונד לערוצים.',
        durationMinutes: 12,
        completionRewardXp: 130,
        steps: [
          {
            id: 'step_m3_1',
            title: 'Explore Instruments Category',
            titleHe: 'סקירת קטגוריית Instruments',
            instruction: 'Click on the "Instruments" category in the Browser sidebar.',
            instructionHe: 'לחץ על קטגוריית "Instruments" בסרגל ה-Browser.',
            targetElement: 'browser_instruments',
            explanation: 'Instruments contains synthesizers (Operator, Wavetable, Drift) and samplers.',
            explanationHe: 'קטגוריית Instruments מכילה סינתיסייזרים ודגמים וירטואליים.',
            why: 'Loading an instrument onto a MIDI track turns raw MIDI notes into rich synth audio.',
            whyHe: 'טעינת כלי לערוץ MIDI הופכת תווים דיגיטליים לסאונד עשיר.',
            hint1: 'Look at Browser panel under Drums/Sounds.',
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
            title: 'Explore Audio Effects Category',
            titleHe: 'סקירת קטגוריית Audio Effects',
            instruction: 'Click "Audio Effects" in the Browser sidebar.',
            instructionHe: 'לחץ על "Audio Effects" בסרגל ה-Browser.',
            targetElement: 'browser_effects',
            explanation: 'Audio Effects transform and polish audio (EQ Eight, Reverb, Compressor, Delay, Saturator, Roar).',
            explanationHe: 'אפקטי שמע מעבדים ומעצבים את הצליל (איקיו, ריוורב, קומפרסור, דיליי, Roar).',
            why: 'Effects shape tone, control volume dynamics, and add spatial depth.',
            whyHe: 'אפקטים מעצבים את תדר הסאונד, הדינמיקה והעומק במרחב.',
            hint1: 'Look right below Instruments in the Browser list.',
            hint1He: 'חפש מתחת ל-Instruments ברשימת ה-Browser.',
            hint2: 'Click Audio Effects.',
            hint2He: 'לחץ על Audio Effects.',
            answer: 'Click Audio Effects.',
            answerHe: 'לחץ על Audio Effects.',
            actionType: 'click',
            successMessage: 'Audio Effects opened!',
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
            question: 'Which category in the Browser contains synthesizers like Operator and Wavetable?',
            questionHe: 'איזו קטגוריה בדפדפן מכילה סינתיסייזרים כמו Operator ו-Wavetable?',
            options: [
              'Audio Effects',
              'Instruments',
              'Samples',
              'Plug-ins'
            ],
            optionsHe: [
              'Audio Effects',
              'Instruments',
              'Samples',
              'Plug-ins'
            ],
            correctIndex: 1,
            explanation: 'Built-in Ableton synths are located under the Instruments category.',
            explanationHe: 'הסינתיסייזרים המובנים של אבלטון נמצאים תחת קטגוריית Instruments.'
          }
        ]
      },

      // MODULE 04: Session View
      {
        id: 'mod4_session_view',
        title: 'Module 04: Session View',
        titleHe: 'מודול 04: תצוגת Session View',
        level: 'Beginner',
        category: '04 — Session View',
        categoryHe: '04 — תצוגת Session View',
        moduleIndex: 4,
        objective: 'Understand Session View for clip launching, jamming, looping, and scenes.',
        objectiveHe: 'הבנת תצוגת ה-Session View לניגון קליפים, ניסויים בלופים והפעלת סצנות (Scenes).',
        durationMinutes: 15,
        completionRewardXp: 150,
        steps: [
          {
            id: 'step_m4_1',
            title: 'Switch to Session View',
            titleHe: 'מעבר לתצוגת Session View',
            instruction: 'Click the Session View toggle button (grid icon) in the top right.',
            instructionHe: 'לחץ על כפתור מעבר לתצוגת Session View (אייקון הגריד) בצד ימין למעלה.',
            targetElement: 'view_toggle_session',
            explanation: 'Session View lays out tracks vertically as columns and clip slots as rows.',
            explanationHe: 'Session View מציג ערוצים כעמודות אנכיות ומשבצות קליפים כשורות.',
            why: 'Ideal for trying out musical ideas without committing to a linear arrangement timeline.',
            whyHe: 'מושלם להתנסות ברעיונות מוזיקליים מבלי להיות מוגבל לציר זמן ליניארי.',
            hint1: 'Look at top right near automation toggle.',
            hint1He: 'חפש בצד ימין למעלה ליד כפתור האוטומציה.',
            hint2: 'Click the Grid icon or press Tab key.',
            hint2He: 'לחץ על אייקון הגריד או מקש Tab.',
            answer: 'Click Session View toggle.',
            answerHe: 'לחץ על תצוגת Session View.',
            actionType: 'toggle_mode',
            successMessage: 'Switched to Session View grid!',
            successMessageHe: 'עברת לתצוגת Session View!',
            realAbletonChecklist: [
              'Press Tab key in Ableton to toggle between Session View and Arrangement View.'
            ],
            realAbletonChecklistHe: [
              'לחץ על מקש Tab באבלטון למעבר מהיר בין תצוגת Session ל-Arrangement.'
            ]
          },
          {
            id: 'step_m4_2',
            title: 'Launch a Clip Slot',
            titleHe: 'הפעלת קליפ (Clip Slot)',
            instruction: 'Click a clip slot inside Track 1 to trigger musical playback.',
            instructionHe: 'לחץ על משבצת קליפ בערוץ 1 להפעלת ניגון הקליפ.',
            targetElement: 'clip_slot',
            explanation: 'Clips in Session View stay quantized to the song tempo and play indefinitely in a loop.',
            explanationHe: 'קליפים ב-Session View נשארים מסונכרנים לקצב השיר ומנגנים בלופ בלתי פוסק.',
            why: 'Allows live DJing, beat improvisation, and jam sessions.',
            whyHe: 'מאפשר נגינה בלייב, אלתור מקצבים ואימפרוביזציה.',
            hint1: 'Click inside the rectangular clip area on Track 1.',
            hint1He: 'לחץ בתוך משבצת הקליפ בערוץ 1.',
            hint2: 'Click clip slot.',
            hint2He: 'לחץ על הקליפ.',
            answer: 'Click clip slot.',
            answerHe: 'לחץ על משבצת הקליפ.',
            actionType: 'click',
            successMessage: 'Clip launched and playing in loop!',
            successMessageHe: 'הקליפ הופעל ומנגן בלופ!',
            realAbletonChecklist: [
              'Click the green play triangle on any clip slot in Ableton Live 12.'
            ],
            realAbletonChecklistHe: [
              'לחץ על משולש הניגון הירוק במשבצת קליפ באבלטון 12.'
            ]
          }
        ],
        quiz: [
          {
            question: 'What is Session View primarily used for in Ableton Live 12?',
            questionHe: 'למה משמשת בעיקר תצוגת Session View ב-Ableton Live 12?',
            options: [
              'Final song mastering',
              'Non-linear clip launching, jamming, and experimenting with loops',
              'Setting up audio hardware drivers',
              'Editing video tracks'
            ],
            optionsHe: [
              'מאסטרינג סופי לשיר',
              'ניגון קליפים לא-ליניארי, אלתור וניסוי בלופים',
              'הגדרת דרייברים של כרטיס הקול',
              'עריכת וידאו'
            ],
            correctIndex: 1,
            explanation: 'Session View provides a clip matrix for non-linear live performance and composition.',
            explanationHe: 'Session View מספקת מטריצת קליפים להפעלת לופים ואלתור חופשי.'
          }
        ]
      },

      // MODULE 05: Arrangement View
      {
        id: 'mod5_arrangement_view',
        title: 'Module 05: Arrangement View',
        titleHe: 'מודול 05: תצוגת ציר הזמן (Arrangement View)',
        level: 'Beginner',
        category: '05 — Arrangement View',
        categoryHe: '05 — תצוגת ציר הזמן',
        moduleIndex: 5,
        objective: 'Master linear timeline arrangement: tracks, playhead cursor, locators, and song structure.',
        objectiveHe: 'הבנת ציר הזמן הליניארי: ערוצים, סמן זמן (Playhead), סמני מיקום ומבנה השיר.',
        durationMinutes: 15,
        completionRewardXp: 160,
        steps: [
          {
            id: 'step_m5_1',
            title: 'Switch to Arrangement View',
            titleHe: 'מעבר לתצוגת Arrangement View',
            instruction: 'Click the Arrangement View toggle button (three horizontal bars) in top right.',
            instructionHe: 'לחץ על כפתור מעבר לתצוגת Arrangement View (שלושה קווים אופקיים) בפינה הימנית העליונה.',
            targetElement: 'view_toggle_arrangement',
            explanation: 'Arrangement View is a traditional left-to-right timeline showing bars and beats from 0:00 to the end.',
            explanationHe: 'Arrangement View הינה תצוגת ציר זמן מסורתית משמאל לימין המציגה תיבות ופעימות.',
            why: 'Where you organize intro, build, drop, breakdown, and outro into a finished track.',
            whyHe: 'כאן מארגנים את הפתיחה, העלייה, הדרופ והסיום לשיר שלם ומוכן.',
            hint1: 'Look near top right control bar.',
            hint1He: 'חפש בצד ימין למעלה.',
            hint2: 'Click horizontal bars icon.',
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
            question: 'Which view is used to build a complete song structure from start to finish along a timeline?',
            questionHe: 'איזו תצוגה מיועדת לבניית מבנה שיר מלא מתחילה ועד סוף לאורך ציר זמן?',
            options: [
              'Session View',
              'Arrangement View',
              'Browser Panel',
              'Preferences Window'
            ],
            optionsHe: [
              'Session View',
              'Arrangement View',
              'Browser Panel',
              'Preferences Window'
            ],
            correctIndex: 1,
            explanation: 'Arrangement View structures audio and MIDI clips linearly from left to right.',
            explanationHe: 'Arrangement View מציגה ומסדרת קטעי אודיו ו-MIDI בצורה ליניארית משמאל לימין.'
          }
        ]
      },

      // MODULE 06: Tracks
      {
        id: 'mod6_tracks',
        title: 'Module 06: Tracks (MIDI, Audio, Return & Master)',
        titleHe: 'מודול 06: סוגי ערוצים (MIDI, Audio, Return & Master)',
        level: 'Beginner',
        category: '06 — Tracks',
        categoryHe: '06 — סוגי ערוצים',
        moduleIndex: 6,
        objective: 'Learn the four types of tracks in Ableton Live 12 and how to manage Mute, Solo, and Arm.',
        objectiveHe: 'הכרת ארבעת סוגי הערוצים באבלטון ושימוש בפקדי Mute, Solo ו-Arm.',
        durationMinutes: 14,
        completionRewardXp: 140,
        steps: [
          {
            id: 'step_m6_1',
            title: 'Add a new MIDI Track',
            titleHe: 'הוספת ערוץ MIDI',
            instruction: 'Click "+ Add MIDI Track" button.',
            instructionHe: 'לחץ על כפתור "+ Add MIDI Track".',
            targetElement: 'add_midi_track_btn',
            explanation: 'MIDI tracks contain note data and drive software synthesizers or samplers.',
            explanationHe: 'ערוצי MIDI מכילים תווים דיגיטליים ומפעילים סינתיסייזרים וסמפלרים.',
            why: 'New instruments require dedicated MIDI tracks to receive and play notes.',
            whyHe: 'כל כלי נגינה וירטואלי חדש דורש ערוץ MIDI ייעודי.',
            hint1: 'Look at top toolbar above track list.',
            hint1He: 'חפש בסרגל מעל רשימת הערוצים.',
            hint2: 'Click "+ Add MIDI Track".',
            hint2He: 'לחץ על הוספת ערוץ MIDI.',
            answer: 'Click "+ Add MIDI Track".',
            answerHe: 'לחץ על "+ Add MIDI Track".',
            actionType: 'click',
            successMessage: 'New MIDI Track added!',
            successMessageHe: 'ערוץ MIDI חדש נוסף!',
            realAbletonChecklist: [
              'Press Ctrl+Shift+T (Cmd+Shift+T) to add a MIDI Track in Ableton.'
            ],
            realAbletonChecklistHe: [
              'לחץ Ctrl+Shift+T (Cmd+Shift+T) להוספת ערוץ MIDI באבלטון.'
            ]
          },
          {
            id: 'step_m6_2',
            title: 'Mute Track',
            titleHe: 'השתקת ערוץ (Mute)',
            instruction: 'Click the Mute button ("M") on Track 1.',
            instructionHe: 'לחץ על כפתור ה-Mute ("M") בערוץ 1.',
            targetElement: 'track_mute',
            explanation: 'Mute turns off audio output for that specific track.',
            explanationHe: 'Mute מכבה את יציאת השמע של הערוץ הנבחר.',
            why: 'Useful for comparing arrangements or silencing unwanted parts temporarily.',
            whyHe: 'שימושי להשוואת גרסאות או להשתקת חלקים זמנית.',
            hint1: 'Find Track 1 header.',
            hint1He: 'חפש את ראש ערוץ 1.',
            hint2: 'Click Mute button.',
            hint2He: 'לחץ על כפתור Mute.',
            answer: 'Click Mute button on Track 1.',
            answerHe: 'לחץ על Mute בערוץ 1.',
            actionType: 'click',
            successMessage: 'Track muted!',
            successMessageHe: 'הערוץ הושתק!',
            realAbletonChecklist: [
              'Click track number activator box in Ableton to Mute/Unmute.'
            ],
            realAbletonChecklistHe: [
              'לחץ על מספר הערוץ באבלטון להשתקה/הפעלה.'
            ]
          },
          {
            id: 'step_m6_3',
            title: 'Arm Track for Recording',
            titleHe: 'דריכת ערוץ להקלטה (Arm Record)',
            instruction: 'Click the red Arm button (record circle) on Track 1.',
            instructionHe: 'לחץ על כפתור ה-Arm האדום (עיגול הקלטה) בערוץ 1.',
            targetElement: 'track_arm',
            explanation: 'Arming routes incoming MIDI keys or audio input into that track.',
            explanationHe: 'דריכת ערוץ מנתבת צלילים ממקלדת ה-MIDI או המיקרופון ישירות לערוץ הזה.',
            why: 'If not armed, pressing MIDI keys produces no sound.',
            whyHe: 'ללא דריכת ערוץ, לחיצה על המקלדת לא תפיק צליל.',
            hint1: 'Look at track controls for red circle icon.',
            hint1He: 'חפש בפקדי הערוץ אייקון עיגול אדום.',
            hint2: 'Click Arm Record button.',
            hint2He: 'לחץ על כפתור ה-Arm.',
            answer: 'Click Arm button.',
            answerHe: 'לחץ על כפתור ה-Arm.',
            actionType: 'arm_track',
            successMessage: 'Track armed and ready to record!',
            successMessageHe: 'הערוץ דרוך ומוכן להקלטה!',
            realAbletonChecklist: [
              'Click the red Arm button at bottom of track header in Ableton.'
            ],
            realAbletonChecklistHe: [
              'לחץ על כפתור ה-Arm האדום בתחתית הערוץ באבלטון.'
            ]
          }
        ],
        quiz: [
          {
            question: 'What is the purpose of Arming a track in Ableton Live 12?',
            questionHe: 'מה המטרה של דריכת ערוץ (Arm) ב-Ableton Live 12?',
            options: [
              'To delete the track',
              'To route MIDI or microphone input into that track for auditioning and recording',
              'To export the track to MP3',
              'To double the track volume'
            ],
            optionsHe: [
              'למחוק את הערוץ',
              'לנתב את המקלדת או המיקרופון לערוץ זה להשמעה והקלטה',
              'לייצא את הערוץ ל-MP3',
              'להכפיל את עוצמת הערוץ'
            ],
            correctIndex: 1,
            explanation: 'Arming tells Ableton which track should listen to your controller inputs.',
            explanationHe: 'דריכת ערוץ מגדירה לאבלטון לאיזה ערוץ לנתב את מקלדת השליטה.'
          }
        ]
      },

      // MODULE 07: Audio vs MIDI
      {
        id: 'mod7_audio_vs_midi',
        title: 'Module 07: Audio vs MIDI',
        titleHe: 'מודול 07: הבדלים בין Audio ל-MIDI',
        level: 'Beginner',
        category: '07 — Audio vs MIDI',
        categoryHe: '07 — הבדלים בין Audio ל-MIDI',
        moduleIndex: 7,
        objective: 'Understand the fundamental difference between recorded audio waveforms and flexible MIDI note data.',
        objectiveHe: 'הבנת ההבדלים היסודיים בין דגימות קול (Audio) לבין תווים דיגיטליים (MIDI).',
        durationMinutes: 10,
        completionRewardXp: 130,
        steps: [
          {
            id: 'step_m7_1',
            title: 'Understand MIDI Data',
            titleHe: 'הבנת נתוני MIDI',
            instruction: 'Click on a MIDI Track header to inspect its MIDI input.',
            instructionHe: 'לחץ על ערוץ MIDI לצפייה בהגדרות ה-MIDI.',
            targetElement: 'midi_track_header',
            explanation: 'MIDI contains NO actual audio sound—only instructions: Note Pitch, Velocity (volume), and Duration.',
            explanationHe: 'MIDI אינו מכיל סאונד מוקלט אלא רק הוראות נגינה: פיץ\', עוצמת לחיצה (Velocity) ומשך התו.',
            why: 'Allows changing synths, notes, tempo, and pitch at any time without sound degradation.',
            whyHe: 'מאפשר לשנות סינתיסייזר, תווים וסולם בכל רגע מבלי לפגוע באיכות הסאונד.',
            hint1: 'Click on the track labeled "1 Psy Bass" or "MIDI".',
            hint1He: 'לחץ על הערוץ המתוייג כ-MIDI.',
            hint2: 'Click MIDI track header.',
            hint2He: 'לחץ על ראש ערוץ ה-MIDI.',
            answer: 'Click MIDI track header.',
            answerHe: 'לחץ על ערוץ ה-MIDI.',
            actionType: 'click',
            successMessage: 'MIDI track selected! MIDI triggers synths.',
            successMessageHe: 'ערוץ ה-MIDI נבחר! MIDI מפעיל סינתיסייזרים.',
            realAbletonChecklist: [
              'Inspect a MIDI clip in Ableton Piano Roll vs an Audio clip waveform.'
            ],
            realAbletonChecklistHe: [
              'השווה בין קליפ MIDI ב-Piano Roll לקליפ Audio של דגימת סאונד באבלטון.'
            ]
          }
        ],
        quiz: [
          {
            question: 'Does a MIDI file contain actual recorded audio sound?',
            questionHe: 'האם קובץ MIDI מכיל סאונד מוקלט בפועל?',
            options: [
              'Yes, always',
              'No, it only contains note pitch, velocity, and duration data that triggers a synth',
              'Only when using audio effects',
              'Only in Arrangement View'
            ],
            optionsHe: [
              'כן, תמיד',
              'לא, הוא מכיל רק הוראות לגובה התו, עוצמתו ומשכו המפעילות סינתיסייזר',
              'רק כאשר משתמשים באפקטים',
              'רק בתצוגת Arrangement'
            ],
            correctIndex: 1,
            explanation: 'MIDI is digital note performance data; it requires an instrument device to produce audio.',
            explanationHe: 'MIDI הוא נתוני הנגנה בלבד ודורש כלי נגינה (Instrument) המפיק את הסאונד.'
          }
        ]
      },

      // MODULE 08: Clips
      {
        id: 'mod8_clips',
        title: 'Module 08: Clips',
        titleHe: 'מודול 08: עבודה עם קליפים (Clips)',
        level: 'Beginner',
        category: '08 — Clips',
        categoryHe: '08 — עבודה עם קליפים',
        moduleIndex: 8,
        objective: 'Learn clip looping, length adjustments, clip view editing, and Piano Roll drawing.',
        objectiveHe: 'עריכת קליפים, הגדרת לופ, שינוי אורך הקליפ וציור תווים ב-Piano Roll.',
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
            title: 'Draw a MIDI Note',
            titleHe: 'ציור תו ב-Piano Roll',
            instruction: 'Click inside the Piano Roll grid to place a note at pitch C3.',
            instructionHe: 'לחץ בתוך גריד ה-Piano Roll להוספת תו בפיץ\' C3.',
            targetElement: 'piano_roll_grid',
            explanation: 'In Ableton, double-clicking grid cells adds or deletes notes. B toggles Draw tool.',
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
            question: 'What shortcut toggles the Draw Pencil tool inside Ableton Piano Roll?',
            questionHe: 'איזה מקש קיצור מפעיל את כלי העיפרון ב-Piano Roll ב-Ableton Live 12?',
            options: [
              'Spacebar',
              'Key "B"',
              'Key "Tab"',
              'Ctrl+Z'
            ],
            optionsHe: [
              'מקש רווח',
              'המקש "B"',
              'מקש Tab',
              'Ctrl+Z'
            ],
            correctIndex: 1,
            explanation: 'Pressing B toggles Draw Mode on and off in Ableton Live 12.',
            explanationHe: 'לחיצה על המקש B מפעילה ומכבה את מצב העיפרון באבלטון 12.'
          }
        ]
      },

      // MODULE 09: Devices
      {
        id: 'mod9_devices',
        title: 'Module 09: Devices',
        titleHe: 'מודול 09: מכשירים ושרשרת אפקטים (Devices & Chain)',
        level: 'Intermediate',
        category: '09 — Devices',
        categoryHe: '09 — מכשירים ושרשרת אפקטים',
        moduleIndex: 9,
        objective: 'Understand Instruments, Audio Effects, MIDI Effects, and how audio flows left-to-right through the Device Chain.',
        objectiveHe: 'הבנת כלי נגינה, אפקטים, והזרימה של השמע משמאל לימין בשרשרת המכשירים.',
        durationMinutes: 15,
        completionRewardXp: 180,
        steps: [
          {
            id: 'step_m9_1',
            title: 'Inspect Operator FM Synth',
            titleHe: 'בדיקת הסינתיסייזר Operator',
            instruction: 'Click on the Operator instrument tab in the lower device chain area.',
            instructionHe: 'לחץ על לשונית Operator בשרשרת המכשירים התחתונה.',
            targetElement: 'operator_osc',
            explanation: 'Operator is a classic 4-oscillator FM synth used for punchy basslines and crisp leads.',
            explanationHe: 'Operator הינו סינתיסייזר FM בעל 4 אוסילטורים ליצירת בסים חדים ומלודיות.',
            why: 'Understanding synth controls lets you craft original electronic sounds.',
            whyHe: 'הבנת הפרמטרים מאפשרת לעצב צלילים ייחודיים.',
            hint1: 'Look at the bottom panel device tabs.',
            hint1He: 'סתכל בתחתית המסך בלשוניות ה-Device.',
            hint2: 'Click Operator.',
            hint2He: 'לחץ על Operator.',
            answer: 'Click Operator tab.',
            answerHe: 'לחץ על לשונית Operator.',
            actionType: 'click',
            successMessage: 'Operator parameters displayed!',
            successMessageHe: 'פרמטרי Operator מוצגים!',
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
            question: 'In which direction does audio flow through Ableton Live 12 Device Chain?',
            questionHe: 'באיזה כיוון זורם השמע בשרשרת המכשירים (Device Chain) ב-Ableton Live 12?',
            options: [
              'Right to left',
              'Left to right (Instrument first, then audio effects in series)',
              'Top to bottom only',
              'Randomly'
            ],
            optionsHe: [
              'מימין לשמאל',
              'משמאל לימין (קודם כלי הנגינה ולאחריו אפקטי השמע בטור)',
              'מלמעלה למטה בלבד',
              'באופן אקראי'
            ],
            correctIndex: 1,
            explanation: 'Signal flows left-to-right from the source instrument through processing effects.',
            explanationHe: 'האות זורם משמאל לימין מכל הנגינה דרך האפקטים המעבדים.'
          }
        ]
      },

      // MODULE 10: Mixer
      {
        id: 'mod10_mixer',
        title: 'Module 10: Mixer',
        titleHe: 'מודול 10: המיקסר (Volume, Pan, Sends & Master)',
        level: 'Intermediate',
        category: '10 — Mixer',
        categoryHe: '10 — המיקסר',
        moduleIndex: 10,
        objective: 'Master Volume faders, Panning, Sends to Reverb/Delay return tracks, and the Master bus.',
        objectiveHe: 'שליטה בפיידרים של ווליום, צידוד (Pan), שליחות אפקטים (Sends) וערוץ המאסטר.',
        durationMinutes: 14,
        completionRewardXp: 170,
        steps: [
          {
            id: 'step_m10_1',
            title: 'Inspect Master Track Header',
            titleHe: 'בדיקת ערוץ ה-Master',
            instruction: 'Click on the Master Track header on the far right.',
            instructionHe: 'לחץ על ערוץ ה-Master בצד ימין.',
            targetElement: 'master_track',
            explanation: 'The Master track sums all audio tracks together before sending signal to speakers or WAV file.',
            explanationHe: 'ערוץ המאסטר מאגד את כל הערוצים יחד לפני היציאה לרמקולים או לקובץ השמע.',
            why: 'Ensure Master level stays below 0 dBFS to avoid digital clipping distortion.',
            whyHe: 'שמור על עוצמת ערוץ המאסטר מתחת ל-0 dBFS למניעת עיוותים.',
            hint1: 'Look at the last track on the far right.',
            hint1He: 'חפש את הערוץ האחרון בצד ימין.',
            hint2: 'Click Master track.',
            hint2He: 'לחץ על ערוץ ה-Master.',
            answer: 'Click Master track.',
            answerHe: 'לחץ על ערוץ ה-Master.',
            actionType: 'click',
            successMessage: 'Master track selected!',
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
            question: 'What is the maximum output peak level you should allow on the Master track to avoid clipping?',
            questionHe: 'מהי עוצמת השיא המרבית המותרת בערוץ ה-Master למניעת עיוותים (Clipping)?',
            options: [
              '+12 dBFS',
              '0 dBFS (keep around -3 dBFS before mastering)',
              '+6 dBFS',
              '-48 dBFS'
            ],
            optionsHe: [
              '+12 dBFS',
              '0 dBFS (רצוי להישאר באזור 3dB- לפני מאסטרינג)',
              '+6 dBFS',
              '-48 dBFS'
            ],
            correctIndex: 1,
            explanation: 'Exceeding 0 dBFS on digital master output causes harsh clipping distortion.',
            explanationHe: 'חריגה מעל 0 dBFS ביציאת המאסטר גורמת לעיוות דיגיטלי חריף.'
          }
        ]
      },

      // MODULE 11: Automation
      {
        id: 'mod11_automation',
        title: 'Module 11: Automation',
        titleHe: 'מודול 11: אוטומציה ותנועת פרמטרים',
        level: 'Intermediate',
        category: '11 — Automation',
        categoryHe: '11 — אוטומציה ותנועת פרמטרים',
        moduleIndex: 11,
        objective: 'Draw volume fades and filter frequency sweep automation lines over time.',
        objectiveHe: 'ציור קווי אוטומציה לשינויי ווליום ופילטרים (Filter Sweeps) לאורך ציר הזמן.',
        durationMinutes: 12,
        completionRewardXp: 160,
        steps: [
          {
            id: 'step_m11_1',
            title: 'Enable Automation Mode',
            titleHe: 'הפעלת מצב אוטומציה',
            instruction: 'Click the Automation Mode toggle button (or press Key "A").',
            instructionHe: 'לחץ על כפתור האוטומציה (או מקש "A" במקלדת).',
            targetElement: 'automation_btn',
            explanation: 'Automation mode overlays colored parameter envelopes over tracks on the timeline.',
            explanationHe: 'מצב אוטומציה מציג קווים צבעוניים לבקרת פרמטרים לאורך הזמן.',
            why: 'Creates energetic builds, filter sweeps, and volume transitions.',
            whyHe: 'מייצר עליות מותחות, עליות פילטר ושינויי עוצמה.',
            hint1: 'Look near view toggles in top right.',
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
            explanation: 'Pressing Key A toggles Automation envelope lane display across all tracks.',
            explanationHe: 'לחיצה על המקש A מציגה ומסתירה את קווי האוטומציה בערוצים.'
          }
        ]
      },

      // MODULE 12: Basic Workflow
      {
        id: 'mod12_workflow',
        title: 'Module 12: Basic Workflow (Creating a Song)',
        titleHe: 'מודול 12: תהליך עבודה מלא ליצירת שיר',
        level: 'Advanced',
        category: '12 — Basic Workflow',
        categoryHe: '12 — תהליך עבודה מלא ליצירת שיר',
        moduleIndex: 12,
        objective: 'Combine Kick, Bass, Lead, Intro, Build, Drop, and Outro into a complete electronic song.',
        objectiveHe: 'שילוב תוף רגל (Kick), בס, מלודיה, פתיחה, עלייה, דרופ וסיום ליצירת קטע אלקטרוני שלם.',
        durationMinutes: 20,
        completionRewardXp: 250,
        steps: [
          {
            id: 'step_m12_1',
            title: 'Verify Master Output & Final Playback',
            titleHe: 'בדיקת יציאת המאסטר וניגון סופי',
            instruction: 'Click Play button for final full-track playback audition.',
            instructionHe: 'לחץ על כפתור ה-Play להשמעת הקטע השלם.',
            targetElement: 'transport_play',
            explanation: 'Auditioning the arrangement checks balance between Intro, Drop, and Outro transitions.',
            explanationHe: 'השמעת היצירה בודקת את האיזון בין המעברים השונים בשיר.',
            why: 'Final verification ensures your track is ready for WAV export.',
            whyHe: 'בדיקה סופית מבטיחה שהקטע מוכן ליצוא לקובץ WAV.',
            hint1: 'Click Play button in top bar.',
            hint1He: 'לחץ על כפתור ה-Play בסרגל העליון.',
            hint2: 'Click Play.',
            hint2He: 'לחץ על Play.',
            answer: 'Click Play button.',
            answerHe: 'לחץ על כפתור ה-Play.',
            actionType: 'click',
            successMessage: 'Full track playback active! Course completed!',
            successMessageHe: 'ניגון הקטע המלא פעיל! סיימת בהצלחה את הקורס!',
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

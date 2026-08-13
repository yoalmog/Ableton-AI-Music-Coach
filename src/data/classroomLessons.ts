import { ClassroomCourse, AbletonSearchTopic } from '../types/classroom';

export const ABLETON_CLASSROOM_COURSES: ClassroomCourse[] = [
  {
    id: 'beginner_core',
    title: 'Ableton Live 12 Beginner Masterclass',
    titleHe: 'קורס היכרות ויסודות Ableton Live 12',
    subtitle: 'From zero knowledge to completing your first electronic track',
    subtitleHe: 'ממאפס ניסיון לביצוע והפקה מלאה של הקטע הראשון שלך',
    icon: 'Layout',
    description: 'Learn where things are, what they do, why they are used, and how to operate Ableton Live 12.',
    descriptionHe: 'למד איפה כל דבר נמצא, מה הוא עושה, למה משתמשים בו ואיך להשתמש בזה באבלטון.',
    lessons: [
      // MODULE 1: Getting Started
      {
        id: 'mod1_1_overview',
        title: 'Module 1: What is Ableton Live 12 & Interface Overview',
        titleHe: 'מודול 1: מה זה Ableton Live 12 ומבנה הממשק',
        level: 'Beginner',
        category: 'Getting Started',
        categoryHe: 'צעדים ראשונים',
        moduleIndex: 1,
        objective: 'Master the top transport bar, browser panel, arrangement view, and master bus.',
        objectiveHe: 'הכרת סרגל התחבורה העליון, דפדפן הקבצים, ציר הזמן וערוץ המאסטר.',
        durationMinutes: 10,
        completionRewardXp: 100,
        steps: [
          {
            id: 'step_m1_1',
            title: 'Locate the Browser Panel',
            titleHe: 'איתור דפדפן הקבצים (Browser)',
            instruction: 'Click on the Browser panel on the far left side of the screen.',
            instructionHe: 'לחץ על פאנל ה-Browser בצד שמאל של המסך.',
            targetElement: 'browser',
            explanation: 'The Browser is where all instruments, audio effects, MIDI effects, samples, and presets live.',
            explanationHe: 'ה-Browser הוא המקום שבו נמצאים כל הכלים (Instruments), האפקטים והדגימות שלך.',
            why: 'Without the browser, you cannot load synths or audio samples into your project.',
            whyHe: 'ללא הדפדפן לא ניתן לטעון סינתיסייזרים או דגימות קול לפרויקט.',
            hint1: 'Look at the left sidebar containing categories like Instruments and Audio Effects.',
            hint1He: 'הביטו בסרגל השמאלי המכיל קטגוריות כמו Instruments ו-Audio Effects.',
            hint2: 'Click anywhere inside the left column panel marked "Browser".',
            hint2He: 'לחץ בתוך העמודה השמאלית המסומנת כ-Browser.',
            answer: 'Click the left Browser panel area.',
            answerHe: 'לחץ על פאנל ה-Browser השמאלי.',
            actionType: 'click',
            successMessage: 'Great job! The Browser panel is open and ready.',
            successMessageHe: 'כל הכבוד! פאנל ה-Browser פתוח ומוכן.',
            realAbletonChecklist: [
              'Open Ableton Live 12.',
              'Press Ctrl+Alt+B (or Cmd+Option+B) to toggle the Browser.',
              'Observe categories: Instruments, Audio Effects, MIDI Effects, Samples.'
            ],
            realAbletonChecklistHe: [
              'פתח את Ableton Live 12.',
              'לחץ Ctrl+Alt+B (או Cmd+Option+B במק) להצגת ה-Browser.',
              'שים לב לקטגוריות: Instruments, Audio Effects, MIDI Effects, Samples.'
            ]
          },
          {
            id: 'step_m1_2',
            title: 'Understand the Transport Control Bar',
            titleHe: 'הכרת סרגל ההפעלה (Transport)',
            instruction: 'Click the Play button in the top Transport bar.',
            instructionHe: 'לחץ על כפתור ה-Play בסרגל ההפעלה העליון.',
            targetElement: 'transport_play',
            explanation: 'The Transport bar controls playback, recording, tempo (BPM), and time signatures.',
            explanationHe: 'סרגל ה-Transport שולט על הניגון, ההקלטה, המהירות (BPM) ומשקל השיר.',
            why: 'Play and Stop control the movement of the arrangement timeline.',
            whyHe: 'כפתורי Play ו-Stop מניעים ועוצרים את ציר הזמן בפרויקט.',
            hint1: 'Look at the top center-left bar for the triangular play icon.',
            hint1He: 'חפש בסרגל העליון מצד שמאל את כפתור המשולש הירוק.',
            hint2: 'Click the Play button (or press Space in real Ableton).',
            hint2He: 'לחץ על כפתור ה-Play (או מקש רווח באבלטון האמיתי).',
            answer: 'Click the green Play triangle in the transport bar.',
            answerHe: 'לחץ על המשולש הירוק בסרגל ההפעלה.',
            actionType: 'click',
            successMessage: 'Playback active! The song timeline is now rolling.',
            successMessageHe: 'הניגון פעיל! ציר הזמן בפרויקט נע עכשיו.',
            realAbletonChecklist: [
              'Press Spacebar to Start and Stop playback in Ableton Live 12.',
              'Watch the arrangement playhead cursor move across tracks.'
            ],
            realAbletonChecklistHe: [
              'לחץ על מקש הרווח להתחלה ועצירה של הניגון באבלטון 12.',
              'עקוב אחר סמן הזמן הזז לרוחב הערוצים.'
            ]
          },
          {
            id: 'step_m1_3',
            title: 'Set the Project BPM (Tempo)',
            titleHe: 'קביעת מהירות הפרויקט (BPM)',
            instruction: 'Click on the BPM value box in the top left and set it to 140.',
            instructionHe: 'לחץ על תיבת ה-BPM בפינה השמאלית העליונה ושנה ל-140.',
            targetElement: 'bpm_input',
            explanation: 'BPM stands for Beats Per Minute. Electronic genres use specific BPM ranges (e.g. Psytrance 138-148, Techno 125-132).',
            explanationHe: 'BPM מציג את פעימות הדקה. ז\'אנרים שונים דורשים קצב מדויק (למשל פסיטראנס 138-148, טכנו 125-132).',
            why: 'Setting correct BPM ensures drums and samples sync to the grid.',
            whyHe: 'הגדרת קצב נכון מבטיחה סנכרון של התופים והדגימות לגריד המוזיקלי.',
            hint1: 'Find the number reading "120.00" near the Play/Stop controls.',
            hint1He: 'חפש את המספר "120.00" ליד כפתורי ה-Play/Stop.',
            hint2: 'Click on the BPM display box.',
            hint2He: 'לחץ על תיבת הצגת ה-BPM.',
            answer: 'Click the BPM box.',
            answerHe: 'לחץ על תיבת ה-BPM.',
            actionType: 'value_change',
            targetValue: 140,
            successMessage: 'BPM set to 140! Perfect for fast electronic genres.',
            successMessageHe: 'הקצב עודכן ל-140 BPM! מושלם לז\'אנרים אלקטרוניים קצביים.',
            realAbletonChecklist: [
              'Double-click the Tempo display in top-left of Ableton.',
              'Type 140 and press Enter.'
            ],
            realAbletonChecklistHe: [
              'לחץ פעמיים על תיבת הטמפו בצד שמאל למעלה באבלטון.',
              'הקלד 140 ולחץ Enter.'
            ]
          },
          {
            id: 'step_m1_4',
            title: 'Toggle the Metronome',
            titleHe: 'הפעלת המטרונום (Metronome)',
            instruction: 'Click the Metronome toggle button (two small overlapping circles).',
            instructionHe: 'לחץ על כפתור המטרונום (אייקון של שני עיגולים חופפים).',
            targetElement: 'metronome',
            explanation: 'The Metronome plays click ticks on every beat (1, 2, 3, 4) to help you record in time.',
            explanationHe: 'המטרונום משמיע נקישות קצב לפי הפעימות (1, 2, 3, 4) כדי לנגן ולהקליט בזמן.',
            why: 'Recording without a metronome causes MIDI notes and audio to drift off beat.',
            whyHe: 'הקלטה ללא מטרונום גורמת לתווים ולשירה לצאת מקצב השיר.',
            hint1: 'Look just to the right of the BPM display.',
            hint1He: 'חפש מיד מימין לתצוגת ה-BPM.',
            hint2: 'Click the Metronome icon button.',
            hint2He: 'לחץ על אייקון המטרונום.',
            answer: 'Click the Metronome button.',
            answerHe: 'לחץ על כפתור המטרונום.',
            actionType: 'toggle_mode',
            successMessage: 'Metronome active! Click ticks will guide rhythm.',
            successMessageHe: 'המטרונום פעיל! נקישות הקצב ינחו אותך בזמן ההקלטה.',
            realAbletonChecklist: [
              'Click the Metronome button (or press Key "C" if Keyboard Shortcuts enabled).',
              'Play the track to hear click timing.'
            ],
            realAbletonChecklistHe: [
              'לחץ על כפתור המטרונום באבלטון.',
              'הפעל את השיר לשמיעת נקישות הקצב.'
            ]
          }
        ],
        quiz: [
          {
            question: 'What is the primary function of the Browser in Ableton Live 12?',
            questionHe: 'מהו התפקיד המרכזי של ה-Browser ב-Ableton Live 12?',
            options: [
              'Export finished WAV files',
              'Access instruments, effects, audio samples, and presets',
              'Adjust master volume output',
              'Change song key signature'
            ],
            optionsHe: [
              'ייצוא קבצי WAV סופיים',
              'גישה לכלים, אפקטים, דגימות סאונד ופריסטים',
              'כיוון ווליום ערוץ המאסטר',
              'שינוי סולם השיר'
            ],
            correctIndex: 1,
            explanation: 'The Browser stores all devices, samples, instruments, and third-party VSTs.',
            explanationHe: 'ה-Browser מרכז את כל הכלים, הדגימות, האפקטים והפלאגינים בפרויקט.'
          }
        ]
      },

      // MODULE 2: Tracks & Mixer Controls
      {
        id: 'mod2_tracks',
        title: 'Module 2: Managing Audio & MIDI Tracks',
        titleHe: 'מודול 2: ניהול ערוצי MIDI ו-Audio',
        level: 'Beginner',
        category: 'Tracks',
        categoryHe: 'ערוצים ומיקסר',
        moduleIndex: 2,
        objective: 'Learn how to create MIDI and Audio tracks, Mute, Solo, Arm, and adjust Volume/Pan.',
        objectiveHe: 'למד ליצור ערוצי MIDI ו-Audio, להשתמש ב-Mute/Solo/Arm ולכוונן ווליום וצידוד.',
        durationMinutes: 12,
        completionRewardXp: 120,
        steps: [
          {
            id: 'step_m2_1',
            title: 'Create a MIDI Track',
            titleHe: 'יצירת ערוץ MIDI חדש',
            instruction: 'Click the "+ Add MIDI Track" button at the top of the track section.',
            instructionHe: 'לחץ על כפתור "+ Add MIDI Track" בראש אזור הערוצים.',
            targetElement: 'add_midi_track_btn',
            explanation: 'MIDI tracks hold virtual software instruments (synths, samplers) and MIDI notes.',
            explanationHe: 'ערוצי MIDI מכילים כלי נגינה וירטואליים ותווים דיגיטליים.',
            why: 'MIDI tracks contain no sound on their own—they trigger synths like Operator or Wavetable.',
            whyHe: 'ערוץ MIDI לא מייצר סאונד בעצמו אלא מפעיל סינתיסייזר שמפיק את הצליל.',
            hint1: 'Look at the control bar above the track headers.',
            hint1He: 'חפש בסרגל השליטה שמעל ראשי הערוצים.',
            hint2: 'Click "+ Add MIDI".',
            hint2He: 'לחץ על כפתור הוספת ערוץ MIDI.',
            answer: 'Click "+ Add MIDI Track".',
            answerHe: 'לחץ על "+ Add MIDI Track".',
            actionType: 'click',
            successMessage: 'MIDI Track created!',
            successMessageHe: 'ערוץ MIDI חדש נוצר בהצלחה!',
            realAbletonChecklist: [
              'Press Ctrl+Shift+T (Cmd+Shift+T on Mac) in Ableton Live 12.',
              'Observe a new empty MIDI track created.'
            ],
            realAbletonChecklistHe: [
              'לחץ Ctrl+Shift+T (או Cmd+Shift+T במק) באבלטון 12.',
              'שים לב לערוץ MIDI החדש שנוצר.'
            ]
          },
          {
            id: 'step_m2_2',
            title: 'Mute and Solo Tracks',
            titleHe: 'שימוש בכפתורי Mute ו-Solo',
            instruction: 'Click the Mute button (number box "1") on Track 1.',
            instructionHe: 'לחץ על כפתור ה-Mute (מספר הערוץ "1") בערוץ ראשון.',
            targetElement: 'track_mute',
            explanation: 'Mute silences a track. Solo (S button) silences every track EXCEPT the selected one.',
            explanationHe: 'Mute משתיק ערוץ. Solo (כפתור S) משתיק את כל הערוצים חוץ מהערוץ הנבחר.',
            why: 'Soloing lets you focus on sound design for a single instrument without distraction.',
            whyHe: 'Solo מאפשר לך להתרכז בעיצוב הסאונד של כלי יחיד ללא התנגשויות.',
            hint1: 'Find the track header for Track 1.',
            hint1He: 'חפש את ראש ערוץ 1.',
            hint2: 'Click the track number box to Mute.',
            hint2He: 'לחץ על תיבת מספר הערוץ להשתקה.',
            answer: 'Click the Mute button on Track 1.',
            answerHe: 'לחץ על כפתור ההשתקה בערוץ 1.',
            actionType: 'click',
            successMessage: 'Track muted! Yellow highlight turns off.',
            successMessageHe: 'הערוץ הושתק! ההארה הצהובה כבתה.',
            realAbletonChecklist: [
              'Click yellow Track Activator box (number 1, 2, 3) in Ableton to Mute.',
              'Click blue S button to Solo.'
            ],
            realAbletonChecklistHe: [
              'לחץ על המספר הצהוב בערוץ באבלטון להשתקה (Mute).',
              'לחץ על הכפתור הכחול S להשמעה בודדת (Solo).'
            ]
          },
          {
            id: 'step_m2_3',
            title: 'Arm Track for Recording',
            titleHe: 'דריכת ערוץ להקלטה (Arm Track)',
            instruction: 'Click the red Arm button (record circle) on the MIDI track.',
            instructionHe: 'לחץ על כפתור ה-Arm האדום (עיגול הקלטה) בערוץ ה-MIDI.',
            targetElement: 'track_arm',
            explanation: 'Arming a track route incoming MIDI keyboard notes or microphone audio into that specific track.',
            explanationHe: 'דריכת ערוץ (Arm) מנתבת צלילים מקלדת ה-MIDI או המיקרופון ישירות לערוץ הזה.',
            why: 'If a track is not armed, pressing your MIDI keyboard will make no sound.',
            whyHe: 'אם ערוץ לא דרוך (Armed), לחיצה על מקלדת השליטה לא תפיק שום צליל.',
            hint1: 'Look at the bottom of the track controls for a small record circle icon.',
            hint1He: 'חפש בתחתית פקדי הערוץ אייקון עיגול אדום.',
            hint2: 'Click the Arm Record button.',
            hint2He: 'לחץ על כפתור ה-Arm האדום.',
            answer: 'Click the Arm button on the track.',
            answerHe: 'לחץ על כפתור ה-Arm בערוץ.',
            actionType: 'arm_track',
            successMessage: 'Track Armed! Ready to receive MIDI input.',
            successMessageHe: 'הערוץ דרוך להקלטה! מוכן לקבל התווים מהמקלדת.',
            realAbletonChecklist: [
              'Click the Arm button (red circle) at bottom of track header in Ableton.',
              'Play keys on computer keyboard or MIDI controller.'
            ],
            realAbletonChecklistHe: [
              'לחץ על כפתור ה-Arm האדום בתחתית הערוץ באבלטון.',
              'נגן במקלדת המחשב או במקלדת השליטה.'
            ]
          }
        ]
      },

      // MODULE 3: MIDI Clips & Piano Roll
      {
        id: 'mod3_midi',
        title: 'Module 3: MIDI Clips, Drawing Notes & Quantization',
        titleHe: 'מודול 3: קטעי MIDI, ציור תווים וקואנטיזציה',
        level: 'Beginner',
        category: 'MIDI',
        categoryHe: 'מלודיה ו-MIDI',
        moduleIndex: 3,
        objective: 'Learn how to create MIDI clips, open the Piano Roll, draw notes, and quantize to the grid.',
        objectiveHe: 'למד ליצור קטעי MIDI, לפתוח את ה-Piano Roll, לצייר תווים ולבצע קואנטיזציה לגריד.',
        durationMinutes: 15,
        completionRewardXp: 150,
        steps: [
          {
            id: 'step_m3_1',
            title: 'Open the Interactive Piano Roll',
            titleHe: 'פתיחת עורך ה-Piano Roll',
            instruction: 'Click on the Piano Roll editor area in the lower section of the screen.',
            instructionHe: 'לחץ על אזור עורך ה-Piano Roll בחלק התחתון של המסך.',
            targetElement: 'piano_roll',
            explanation: 'The Piano Roll displays pitch keys on the vertical Y-axis and time grid beats on the horizontal X-axis.',
            explanationHe: 'ה-Piano Roll מציג את גובה התווים (פיץ\') בציר ה-Y ואת הזמן בציר ה-X.',
            why: 'Piano Roll is the primary tool for composing melodies, chord progressions, and drum patterns.',
            whyHe: 'ה-Piano Roll הוא הכלי המרכזי לכתיבת מלודיות, אקורדים ומקצבי תופים באבלטון.',
            hint1: 'Look at the bottom editor window showing piano keys.',
            hint1He: 'חפש בחלק התחתון של המסך תצוגה של קלידי פסנתר.',
            hint2: 'Click inside the grid area of the Piano Roll.',
            hint2He: 'לחץ בתוך רשת התווים ב-Piano Roll.',
            answer: 'Click the Piano Roll panel.',
            answerHe: 'לחץ על פאנל ה-Piano Roll.',
            actionType: 'click',
            successMessage: 'Piano Roll focused!',
            successMessageHe: 'עורך ה-Piano Roll ממוקד ופעיל!',
            realAbletonChecklist: [
              'Double-click an empty clip slot in Session view or drag a selection in Arrangement.',
              'Press Shift+Tab to toggle between Device View and Clip/Piano Roll View.'
            ],
            realAbletonChecklistHe: [
              'לחץ פעמיים על קליפ ריק באבלטון.',
              'לחץ Shift+Tab למעבר בין תצוגת האפקטים לתצוגת ה-Piano Roll.'
            ]
          },
          {
            id: 'step_m3_2',
            title: 'Draw MIDI Notes',
            titleHe: 'ציור תווים על הגריד',
            instruction: 'Click inside the grid to place a note at pitch C3.',
            instructionHe: 'לחץ בתוך הגריד כדי להוסיף תו בפיץ\' C3.',
            targetElement: 'piano_roll_grid',
            explanation: 'In Ableton, double-clicking grid cells adds or deletes notes. B toggles Draw Pencil mode.',
            explanationHe: 'באבלטון, לחיצה כפולה מוסיפה או מוחקת תו. מקש B מפעיל את מצב העיפרון.',
            why: 'Precision note placement builds structured melodic lines and basslines.',
            whyHe: 'מיקום מדויק של תווים בונה ליין מלודי ובס יציב ומהודק.',
            hint1: 'Click anywhere on the blue grid lines opposite note key C3.',
            hint1He: 'לחץ בתוך המשבצות מול הקליד C3.',
            hint2: 'Place a note on Beat 1.',
            hint2He: 'מקם תו על פעימה 1.',
            answer: 'Click the piano roll grid.',
            answerHe: 'לחץ בתוך גריד ה-Piano Roll.',
            actionType: 'draw_note',
            successMessage: 'Note C3 drawn onto the time grid!',
            successMessageHe: 'התו C3 צוין בהצלחה על גבי ציר הזמן!',
            realAbletonChecklist: [
              'In Ableton Piano Roll, press "B" to enable Pencil tool.',
              'Click grid cell to draw note.',
              'Press "B" again to switch back to Arrow selection tool.'
            ],
            realAbletonChecklistHe: [
              'ב-Piano Roll באבלטון, לחץ "B" להפעלת העיפרון.',
              'לחץ על הגריד לציור תו.',
              'לחץ שוב "B" לחזרה לחץ הבחירה הרגיל.'
            ]
          },
          {
            id: 'step_m3_3',
            title: 'Quantize Notes to Grid',
            titleHe: 'ביצוע קואנטיזציה (Quantize)',
            instruction: 'Click the "Quantize 1/16" button to snap notes tightly to 16th note timing.',
            instructionHe: 'לחץ על כפתור "Quantize 1/16" ליישור התווים במדויק לחלוקת 1/16.',
            targetElement: 'piano_roll_quantize',
            explanation: 'Quantization snaps played/recorded notes to the nearest musical grid division (e.g. 1/16 notes).',
            explanationHe: 'קואנטיזציה מיישרת תווים שהוקלטו בצורה לא מדויקת בול על קווי הקצב והגריד.',
            why: 'Electronic music requires tight, mathematical timing alignment for kicks, drums, and bass.',
            whyHe: 'מוזיקה אלקטרונית דורשת דיוק מתמטי של התופים והבס לקצב השיר.',
            hint1: 'Find the Quantize control in the Piano Roll header bar.',
            hint1He: 'חפש את כפתור Quantize בסרגל של ה-Piano Roll.',
            hint2: 'Click "Quantize".',
            hint2He: 'לחץ על Quantize.',
            answer: 'Click Quantize button.',
            answerHe: 'לחץ על כפתור ה-Quantize.',
            actionType: 'click',
            successMessage: 'Notes quantized to 16th grid!',
            successMessageHe: 'התווים יושרו במדויק לגריד של 1/16!',
            realAbletonChecklist: [
              'Select all notes with Ctrl+A (Cmd+A on Mac).',
              'Press Ctrl+U (Cmd+U) to execute instant Quantize in Ableton Live 12.'
            ],
            realAbletonChecklistHe: [
              'בחר את כל התווים עם Ctrl+A.',
              'לחץ Ctrl+U באבלטון 12 לביצוע קואנטיזציה מיידית.'
            ]
          }
        ]
      },

      // MODULE 4: Instruments (Operator, Wavetable, Drift)
      {
        id: 'mod4_instruments',
        title: 'Module 4: Ableton Instruments (Operator, Wavetable, Drift)',
        titleHe: 'מודול 4: כלי נגינה באבלטון (Operator, Wavetable, Drift)',
        level: 'Intermediate',
        category: 'Instruments',
        categoryHe: 'סינתיסייזרים וכלים',
        moduleIndex: 4,
        objective: 'Explore Ableton native synths including Operator (FM), Wavetable, and Drift.',
        objectiveHe: 'הכרת הסינתיסייזרים המובנים של אבלטון: Operator (FM), Wavetable ו-Drift.',
        durationMinutes: 15,
        completionRewardXp: 180,
        steps: [
          {
            id: 'step_m4_1',
            title: 'Load Operator FM Synthesizer',
            titleHe: 'טעינת סינתיסייזר Operator',
            instruction: 'Click "Instruments" in Browser and select Operator.',
            instructionHe: 'לחץ על קטגוריית "Instruments" ב-Browser ובחר ב-Operator.',
            targetElement: 'browser_instruments',
            explanation: 'Operator is Ableton legendary 4-oscillator Frequency Modulation (FM) synthesizer, famous for crisp psy basslines and FM stabs.',
            explanationHe: 'Operator הוא סינתיסייזר FM מפורסם בעל 4 אוסילטורים, מושלם ליצירת בסים חדים ודקירות סאונד.',
            why: 'FM synthesis shapes harmonics by modulating one sine wave with another.',
            whyHe: 'סינתזת FM מעצבת את ההרמוניות על ידי מודולציה של גל סינוס אחד עם גל סינוס שני.',
            hint1: 'Look at the Browser categories column under "Instruments".',
            hint1He: 'חפש בתוך קטגוריית Instruments בדפדפן.',
            hint2: 'Click Instruments category.',
            hint2He: 'לחץ על קטגוריית Instruments.',
            answer: 'Click Instruments in Browser.',
            answerHe: 'לחץ על Instruments ב-Browser.',
            actionType: 'load_device',
            successMessage: 'Operator loaded into Track Device Chain!',
            successMessageHe: 'Operator נטען בהצלחה לשרשרת האפקטים של הערוץ!',
            realAbletonChecklist: [
              'In Ableton Browser -> Instruments -> Operator.',
              'Drag Operator onto a MIDI track.'
            ],
            realAbletonChecklistHe: [
              'בדפדפן באבלטון -> Instruments -> Operator.',
              'גורר את Operator אל ערוץ ה-MIDI.'
            ]
          },
          {
            id: 'step_m4_2',
            title: 'Adjust Operator Oscillator A Envelope',
            titleHe: 'כיוון מעטפת האוסילטור (Oscillator A Envelope)',
            instruction: 'Click on the Operator Oscillator section in the Device Chain below.',
            instructionHe: 'לחץ על אזור האוסילטור ב-Operator במעבד התחתון.',
            targetElement: 'operator_osc',
            explanation: 'Oscillator A produces the main waveform. Shortening Decay time creates tight, punchy bass plucks.',
            explanationHe: 'Oscillator A מייצר את גל הסאונד המרכזי. קיצור זמן ה-Decay מייצר מכות בס קצרות והדוקות.',
            why: 'Basslines require short decay so low frequencies do not muddy into the next beat.',
            whyHe: 'בס מוזיקלי דורש Decay קצר כדי שתדרים נמוכים לא יתנגשו במכה הבאה של התופים.',
            hint1: 'Look at the device chain area at the bottom.',
            hint1He: 'סתכל בשרשרת המכשירים בתחתית המסך.',
            hint2: 'Click Oscillator A box in Operator UI.',
            hint2He: 'לחץ על משבצת Oscillator A בסינתיסייזר.',
            answer: 'Click Operator Oscillator section.',
            answerHe: 'לחץ על אזור האוסילטור ב-Operator.',
            actionType: 'click',
            successMessage: 'Oscillator parameters focused! Decay set to short pluck duration.',
            successMessageHe: 'פרמטרי האוסילטור מוצגים! זמן ה-Decay קוצר לתו הדיוק המבוקש.',
            realAbletonChecklist: [
              'In Operator UI, click Osc A tab.',
              'Drag Decay parameter down to ~150 ms.',
              'Set Sustained level to -inf dB for tight bass pluck.'
            ],
            realAbletonChecklistHe: [
              'בממשק Operator באבלטון, לחץ על לונית Osc A.',
              'הורד את ערך ה-Decay לאזור ה-150 מילישניות.',
              'אפס את ה-Sustain ל-inf- dB לקבלת מכת בס קצרה.'
            ]
          }
        ]
      },

      // MODULE 5: Audio Effects
      {
        id: 'mod5_effects',
        title: 'Module 5: Mixing Audio Effects (EQ Eight, Compressor, Saturator, Roar)',
        titleHe: 'מודול 5: אפקטי אודיו ומיקס (EQ Eight, Compressor, Saturator, Roar)',
        level: 'Intermediate',
        category: 'Audio Effects',
        categoryHe: 'אפקטי אודיו',
        moduleIndex: 5,
        objective: 'Master EQ Eight frequency carving, compression dynamics, saturation warmth, and Live 12 Roar saturation.',
        objectiveHe: 'שליטה ב-EQ Eight לחיתוך תדרים, קומפרסור לדינמיקה, וסאטורציה עם אפקט Roar ב-Live 12.',
        durationMinutes: 18,
        completionRewardXp: 200,
        steps: [
          {
            id: 'step_m5_1',
            title: 'Open Audio Effects in Browser',
            titleHe: 'פתיחת אפקטי האודיו ב-Browser',
            instruction: 'Click "Audio Effects" in the Browser sidebar.',
            instructionHe: 'לחץ על "Audio Effects" בסרגל ה-Browser.',
            targetElement: 'browser_effects',
            explanation: 'Audio Effects process and transform sound coming out of audio and synth tracks.',
            explanationHe: 'אפקטי אודיו מעבדים ומשנים את הסאונד היוצא מערוצי השמע והסינתזה.',
            why: 'Effects shape frequency balance, dynamic volume range, space reverb, and distortion harmonics.',
            whyHe: 'אפקטים מעצבים את תדר הצליל, הדינמיקה, המרחב בחלל והרמוניות הדיסטורשן.',
            hint1: 'Look at Browser panel under Instruments.',
            hint1He: 'חפש ב-Browser מתחת ל-Instruments.',
            hint2: 'Click Audio Effects.',
            hint2He: 'לחץ על Audio Effects.',
            answer: 'Click Audio Effects.',
            answerHe: 'לחץ על Audio Effects.',
            actionType: 'click',
            successMessage: 'Audio Effects category opened!',
            successMessageHe: 'קטגוריית Audio Effects נפתחה!',
            realAbletonChecklist: [
              'Click Audio Effects in Ableton Browser.',
              'Browse folders: EQ & Filters, Dynamics, Drive & Color.'
            ],
            realAbletonChecklistHe: [
              'לחץ על Audio Effects בדפדפן של אבלטון.',
              'סקור את התיקיות: EQ & Filters, Dynamics, Drive & Color.'
            ]
          }
        ]
      },

      // MODULE 6: Automation
      {
        id: 'mod6_automation',
        title: 'Module 6: Automation & Parameter Movement',
        titleHe: 'מודול 6: אוטומציה ותנועת פרמטרים בזמן',
        level: 'Intermediate',
        category: 'Automation',
        categoryHe: 'אוטומציה',
        moduleIndex: 6,
        objective: 'Learn to draw parameter automation lines for filter sweeps, volume fades, and send builds.',
        objectiveHe: 'למד לצייר קווי אוטומציה לפילטרים (Filter Sweeps), עליות ווליום ואפקטים.',
        durationMinutes: 12,
        completionRewardXp: 160,
        steps: [
          {
            id: 'step_m6_1',
            title: 'Enable Automation Mode',
            titleHe: 'הפעלת מצב אוטומציה (Automation Mode)',
            instruction: 'Click the Automation Mode toggle button (or press A).',
            instructionHe: 'לחץ על כפתור הפעלת מצב האוטומציה (או מקש A במקלדת).',
            targetElement: 'automation_btn',
            explanation: 'Automation mode overlays pink line envelopes over tracks on the arrangement timeline.',
            explanationHe: 'מצב אוטומציה מציג קווים צבעוניים על גבי הערוצים לבקרת פרמטרים לאורך הזמן.',
            why: 'Automation creates movement, tension, builds, and expressive changes throughout the song.',
            whyHe: 'אוטומציה מייצרת התפתחות, מתח, עליות ושינויים מעניינים לאורך היצירה.',
            hint1: 'Look near top right view toggles for the small pink automation line icon.',
            hint1He: 'חפש ליד כפתורי התצוגה למעלה אייקון של קו אלכסוני.',
            hint2: 'Click Automation toggle.',
            hint2He: 'לחץ על כפתור האוטומציה.',
            answer: 'Click Automation button.',
            answerHe: 'לחץ על כפתור האוטומציה.',
            actionType: 'toggle_mode',
            successMessage: 'Automation lines visible on tracks!',
            successMessageHe: 'קווי האוטומציה מוצגים כעת על הערוצים!',
            realAbletonChecklist: [
              'Press key "A" in Ableton Live 12 to toggle Automation mode on/off.',
              'Click any knob (e.g. Filter Cutoff) to select its automation lane.'
            ],
            realAbletonChecklistHe: [
              'לחץ על המקש "A" באבלטון 12 להפעלת/כיבוי מצב אוטומציה.',
              'לחץ על כפתור סיבוב (כמו פילטר Cutoff) לבחירת קו האוטומציה שלו.'
            ]
          }
        ]
      },

      // MODULE 7: Arrangement
      {
        id: 'mod7_arrangement',
        title: 'Module 7: Song Structure & Arrangement View',
        titleHe: 'מודול 7: מבנה השיר וסדר הערוצים (Arrangement)',
        level: 'Advanced',
        category: 'Arrangement',
        categoryHe: 'מבנה וסדר',
        moduleIndex: 7,
        objective: 'Structure Intro, Build-up, Breakdown, Drop, and Outro sections on the timeline.',
        objectiveHe: 'בניית פתיחה (Intro), עלייה (Build), פירוק (Breakdown), דרופ (Drop) וסיום (Outro).',
        durationMinutes: 15,
        completionRewardXp: 220,
        steps: [
          {
            id: 'step_m7_1',
            title: 'Switch to Arrangement View',
            titleHe: 'מעבר לתצוגת ציר הזמן (Arrangement View)',
            instruction: 'Click the Arrangement View toggle icon (three horizontal bars) in top right.',
            instructionHe: 'לחץ על אייקון תצוגת ציר הזמן (שלושה קווים אופקיים) בפינה הימנית העליונה.',
            targetElement: 'view_toggle_arrangement',
            explanation: 'Arrangement View lays out your track timeline horizontally from 0:00 to the end of the song.',
            explanationHe: 'תצוגת ה-Arrangement מציגה את ציר הזמן האופקי של השיר מתחילתו ועד סופו.',
            why: 'Session View is great for jamming clips; Arrangement View is where full songs are finished.',
            whyHe: 'Session View מצוין לרעיונות ראשוניים; Arrangement View מיועד לסיום והפקת שיר מלא.',
            hint1: 'Look at the top right corner near the BPM and key indicators.',
            hint1He: 'סתכל בפינה הימנית העליונה ליד כפתור ה-BPM.',
            hint2: 'Click horizontal bars icon (or press Tab).',
            hint2He: 'לחץ על אייקון השורות האופקיות (או מקש Tab).',
            answer: 'Click Arrangement View toggle.',
            answerHe: 'לחץ על תצוגת Arrangement View.',
            actionType: 'toggle_mode',
            successMessage: 'Switched to Arrangement View timeline!',
            successMessageHe: 'עברת בהצלחה לתצוגת ציר הזמן Arrangement View!',
            realAbletonChecklist: [
              'Press Tab key in Ableton to switch between Session and Arrangement views.',
              'Set arrangement locators for Intro, Drop, Breakdown.'
            ],
            realAbletonChecklistHe: [
              'לחץ על מקש ה-Tab באבלטון למעבר מהיר בין התצוגות.',
              'הוסף סמני מיקום (Locators) עבור Intro, Drop, Breakdown.'
            ]
          }
        ]
      },

      // MODULE 8: Electronic Music Production
      {
        id: 'mod8_electronic',
        title: 'Module 8: Electronic Music Production & Finishing Tracks',
        titleHe: 'מודול 8: הפקת מוזיקה אלקטרונית וסיום קטע',
        level: 'Advanced',
        category: 'Electronic Production',
        categoryHe: 'הפקה אלקטרונית',
        moduleIndex: 8,
        objective: 'Integrate Kick, Bass, Percussion, Leads, Sidechaining, and Master Bus processing.',
        objectiveHe: 'חיבור תוף רגל (Kick), בס, פרקשן, סינת ליד, סיידצ\'יין ועיבוד ערוץ המאסטר.',
        durationMinutes: 20,
        completionRewardXp: 250,
        steps: [
          {
            id: 'step_m8_1',
            title: 'Master Track Final Checks',
            titleHe: 'בדיקת ערוץ ה-Master הסופי',
            instruction: 'Click on the Master Track header on the far right.',
            instructionHe: 'לחץ על ראש ערוץ ה-Master בצד ימין קיצוני.',
            targetElement: 'master_track',
            explanation: 'The Master track is where all audio tracks combine before outputting to your speakers or WAV export.',
            explanationHe: 'ערוץ ה-Master מאגד את כל הערוצים יחד לפני היציאה לרמקולים או לקובץ הסופי.',
            why: 'Always ensure Master headroom does not exceed 0 dBFS to prevent harsh digital clipping distortion.',
            whyHe: 'שמור על עוצמת Master מתחת ל-0 dBFS למניעת עיוותים דיגיטליים בדיסקורד או ברמקולים.',
            hint1: 'Look at the last track on the far right of the mixer.',
            hint1He: 'חפש את הערוץ האחרון בצד ימין של המיקסר.',
            hint2: 'Click Master track header.',
            hint2He: 'לחץ על ערוץ המאסטר.',
            answer: 'Click Master track.',
            answerHe: 'לחץ על ערוץ ה-Master.',
            actionType: 'click',
            successMessage: 'Master Track selected! Limiter & Utility verified.',
            successMessageHe: 'ערוץ המאסטר נבחר! הלימיטר וה-Utility מאומתים.',
            realAbletonChecklist: [
              'Click Master track in Ableton Live 12.',
              'Insert Utility and Limiter onto Master bus.',
              'Ensure peak level stays around -3 dB before mastering.'
            ],
            realAbletonChecklistHe: [
              'לחץ על ערוץ ה-Master באבלטון 12.',
              'הוסף פלאגין Utility ו-Limiter בערוץ ה-Master.',
              'וודא שהעוצמה המירבית נשארת באזור 3dB- לפני מאסטרינג.'
            ]
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
            successMessage: 'Techno BPM 128 active!',
            successMessageHe: 'קצב הטכנו 128 BPM הופעל!',
            realAbletonChecklist: [
              'Set Tempo to 128 BPM in Ableton.',
              'Add Reverb to Kick return track and compress with Sidechain.'
            ],
            realAbletonChecklistHe: [
              'הגדר קצב 128 באבלטון.',
              'הוסף Reverb בערוץ Return וחבר קומפרסור בסיידצ\'יין מתוף הרגל.'
            ]
          }
        ]
      }
    ]
  }
];

// Searchable Topics for "WHERE IS IT?" & "WHAT DOES THIS DO?"
export const ABLETON_SEARCH_TOPICS: AbletonSearchTopic[] = [
  {
    id: 'topic_browser',
    name: 'Browser',
    nameHe: 'דפדפן הקבצים (Browser)',
    targetElement: 'browser',
    category: 'Interface',
    categoryHe: 'ממשק',
    whatItDoes: 'Stores all instruments, audio effects, MIDI effects, samples, packs, and plugins.',
    whatItDoesHe: 'מאחסן את כל הכלים, האפקטים, הדגימות והפלאגינים בפרויקט.',
    whyItMatters: 'It is the central library where all musical building blocks are retrieved.',
    whyItMattersHe: 'זו הספרייה המרכזית ממנה שולפים את כל רכיבי היצירה.',
    whenToUse: 'When starting a project or adding a new instrument or effect.',
    whenToUseHe: 'כשמתחילים פרויקט חדש או רוצים להוסיף כלי או אפקט חדש.',
    howToUse: 'Click items or press Ctrl+Alt+B (Cmd+Option+B on Mac) to toggle.',
    howToUseHe: 'לחץ על הפריטים או לחץ Ctrl+Alt+B להצגה והסתרה.',
    beginnerMistake: 'Searching for audio clips inside the Instruments tab instead of Samples.',
    beginnerMistakeHe: 'חיפוש דגימות אודיו בלשונית Instruments במקום בלשונית Samples.'
  },
  {
    id: 'topic_piano_roll',
    name: 'Piano Roll & MIDI Editor',
    nameHe: 'עורך התווים (Piano Roll)',
    targetElement: 'piano_roll',
    category: 'MIDI',
    categoryHe: 'מלודיה ו-MIDI',
    whatItDoes: 'Allows drawing, moving, editing, and quantizing MIDI notes.',
    whatItDoesHe: 'מאפשר ציור, הזזה, עריכה ויישור תווים על ציר הזמן.',
    whyItMatters: 'Essential for writing melodies, chords, basslines, and drum beats.',
    whyItMattersHe: 'חיוני לכתיבת מלודיות, אקורדים, ליין בס ומקצבי תופים.',
    whenToUse: 'When composing musical ideas or editing recorded MIDI performances.',
    whenToUseHe: 'ככותבים רעיונות מוזיקליים או עורכים הקלטת מקלדת שליטה.',
    howToUse: 'Double click clips or press Shift+Tab to view.',
    howToUseHe: 'לחץ פעמיים על קליפ או Shift+Tab לצפייה בעורך.',
    beginnerMistake: 'Drawing notes off-grid without quantizing, causing rhythmic clutter.',
    beginnerMistakeHe: 'ציור תווים מחוץ לגריד ללא קואנטיזציה, המייצר חוסר דיוק בקצב.'
  },
  {
    id: 'topic_operator',
    name: 'Operator FM Synthesizer',
    nameHe: 'סינתיסייזר Operator',
    targetElement: 'operator_osc',
    category: 'Instruments',
    categoryHe: 'כלי נגינה',
    whatItDoes: 'Hybrid FM synthesizer featuring 4 customizable oscillators, envelopes, and filters.',
    whatItDoesHe: 'סינתיסייזר FM היברידי בעל 4 אוסילטורים, מעטפות ופילטרים.',
    whyItMatters: 'Famous for creating signature Psytrance punchy basslines and crisp metallic sounds.',
    whyItMattersHe: 'מפורסם ביצירת בסים חדים ומהירים לפסיטראנס וצלילים מתכתיים.',
    whenToUse: 'When designing basslines, FM stabs, subs, or leads.',
    whenToUseHe: 'כשמעצבים בס, דקירות FM, תדרי סאב או סינתי ליד מוביל.',
    howToUse: 'Drag Operator from Instruments into a MIDI track.',
    howToUseHe: 'גרור את Operator מקטגוריית Instruments אל ערוץ MIDI.',
    beginnerMistake: 'Leaving Decay time too long on bass sounds, causing muddy overlap.',
    beginnerMistakeHe: 'השארת Decay ארוך מדי בצלילי בס, הגורמת לעומס ובוץ בתדרים הנמוכים.'
  },
  {
    id: 'topic_metronome',
    name: 'Metronome & Tempo',
    nameHe: 'מטרונום וטמפו (Metronome)',
    targetElement: 'metronome',
    category: 'Transport',
    categoryHe: 'הפעלה וקצב',
    whatItDoes: 'Plays click sounds at the specified BPM grid frequency.',
    whatItDoesHe: 'משמיע נקישות קצב לפי ה-BPM המוגדר בפרויקט.',
    whyItMatters: 'Helps keep live keyboard playing and vocal recording in tempo.',
    whyItMattersHe: 'עוזר לשמור על הקלטת שירה ונגינה במקלדת בדיוק לפי הקצב.',
    whenToUse: 'Before recording any live instrument or MIDI clip.',
    whenToUseHe: 'לפני הקלטת כלי נגינה חי או קטע MIDI.',
    howToUse: 'Click the Metronome icon in top bar or press C.',
    howToUseHe: 'לחץ על אייקון המטרונום בסרגל העליון או על המקש C.',
    beginnerMistake: 'Recording without a metronome and trying to fix erratic timing manually later.',
    beginnerMistakeHe: 'הקלטה ללא מטרונום וניסיון לתקן נגינה לא יציבה ידנית לאחר מכן.'
  }
];

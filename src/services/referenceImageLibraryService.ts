import {
  ReferenceImageItem,
  ReferenceHotspot,
  ReferenceSourceInfo,
  WorkspaceType
} from '../types/workspaceReference';

/**
 * Generate a self-contained, high-fidelity SVG data URI of the Ableton Live workspace
 */
function createWorkspaceSvgDataUri(
  title: string,
  color: string,
  secondaryColor: string,
  details: { label: string; x: number; y: number; w: number; h: number }[]
): string {
  const detailRects = details
    .map(
      (d) =>
        `<rect x="${d.x}" y="${d.y}" width="${d.w}" height="${d.h}" rx="3" fill="#242424" stroke="#383838" stroke-width="1.5"/>
         <text x="${d.x + 8}" y="${d.y + 16}" fill="#999" font-family="monospace" font-size="10">${d.label}</text>`
    )
    .join('');

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <rect width="800" height="500" fill="#141414"/>
    <!-- Top Bar -->
    <rect width="800" height="34" fill="#222222" stroke="#2D2D2D" stroke-width="1"/>
    <circle cx="20" cy="17" r="5" fill="#FFE853"/>
    <text x="34" y="21" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold">ABLETON LIVE 12 - ${title.toUpperCase()}</text>
    <rect x="680" y="7" width="100" height="20" rx="3" fill="#2E2E2E"/>
    <text x="696" y="21" fill="${color}" font-family="monospace" font-size="10" font-weight="bold">WORKSPACE</text>
    
    <!-- Workspace body container -->
    <rect x="12" y="46" width="776" height="442" rx="4" fill="#1A1A1A" stroke="#333333" stroke-width="1.5"/>
    ${detailRects}
    
    <!-- Accent Line -->
    <line x1="12" y1="46" x2="788" y2="46" stroke="${secondaryColor}" stroke-width="2"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

/**
 * Structured Reference Metadata for all required Ableton Live 12 Workspaces
 */
const WORKSPACE_REFERENCES: ReferenceImageItem[] = [
  // 1. Session View
  {
    id: 'ref-session-view',
    title: {
      en: 'Ableton Live Session View',
      he: 'תצוגת ה-Session ב-Ableton Live',
      es: 'Vista Session de Ableton Live',
    },
    workspace: 'SESSION_VIEW',
    description: {
      en: 'The non-linear, clip-based grid for sketching musical ideas, launching multi-track scenes, and live improvisation without chronological constraints.',
      he: 'רשת הקליפים הלא-ליניארית של אבלטון ליצירת רעיונות מוזיקליים, הפעלת סצנות ואלתור בזמן אמת ללא תלות בציר הזמן.',
      es: 'La cuadrícula no lineal basada en clips para bocetar ideas musicales y lanzar escenas en vivo.',
    },
    imageSource: createWorkspaceSvgDataUri('Session View Grid', '#FFE853', '#00E5FF', [
      { label: 'Browser (Left)', x: 24, y: 58, w: 140, h: 418 },
      { label: 'Track 1 (Kick)', x: 174, y: 58, w: 90, h: 280 },
      { label: 'Track 2 (Bass)', x: 272, y: 58, w: 90, h: 280 },
      { label: 'Track 3 (Lead)', x: 370, y: 58, w: 90, h: 280 },
      { label: 'Track 4 (FX)', x: 468, y: 58, w: 90, h: 280 },
      { label: 'Master / Scene Launch', x: 566, y: 58, w: 100, h: 280 },
      { label: 'Session Mixer Strips', x: 174, y: 348, w: 492, h: 128 },
      { label: 'Clip / Device Detail View', x: 676, y: 58, w: 100, h: 418 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Session View Grid', '#FFE853', '#00E5FF', [
      { label: 'Browser (Left)', x: 24, y: 58, w: 140, h: 418 },
      { label: 'Track 1 (Kick)', x: 174, y: 58, w: 90, h: 280 },
      { label: 'Track 2 (Bass)', x: 272, y: 58, w: 90, h: 280 },
      { label: 'Track 3 (Lead)', x: 370, y: 58, w: 90, h: 280 },
      { label: 'Track 4 (FX)', x: 468, y: 58, w: 90, h: 280 },
      { label: 'Master / Scene Launch', x: 566, y: 58, w: 100, h: 280 },
      { label: 'Session Mixer Strips', x: 174, y: 348, w: 492, h: 128 },
      { label: 'Clip / Device Detail View', x: 676, y: 58, w: 100, h: 418 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Session View)',
      url: 'https://www.ableton.com/en/manual/session-view/',
      section: 'Chapter 7: Session View & Clip Slots',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'session-tracks',
        title: { en: 'Track Columns', he: 'עמודי הערוצים (Tracks)', es: 'Columnas de pistas' },
        description: {
          en: 'Vertical columns represent individual audio, MIDI, return, or master tracks. Each track can play one clip at a time.',
          he: 'כל עמודה אנכית מייצגת ערוץ נפרד (אודיו או MIDI). בכל ערוץ ניתן להשמיע קליפ אחד בכל רגע נתון.',
          es: 'Las columnas verticales representan pistas individuales de audio o MIDI.',
        },
        rect: { x: 0.18, y: 0.12, width: 0.58, height: 0.48 },
        category: 'audio',
        mappedSimulatorTarget: 'track-select-t2',
      },
      {
        id: 'session-clip-slots',
        title: { en: 'Clip Slots & Launch Buttons', he: 'משבצות קליפים וכפתורי השמעה', es: 'Ranuras de clips' },
        description: {
          en: 'Rectangular clip slots contain loop variations. Clicking Play launches the clip quantized to the global tempo grid.',
          he: 'משבצות קליפים המכילות לופים. לחיצה מפעילה את הקליפ בסנכרון קוונטיזציה מושלם לקצב.',
          es: 'Ranuras para almacenar clips musicales sincronizados al tempo.',
        },
        rect: { x: 0.22, y: 0.16, width: 0.45, height: 0.35 },
        category: 'audio',
        mappedSimulatorTarget: 'session-clip-launch',
      },
      {
        id: 'session-scene-launch',
        title: { en: 'Scene Launch Buttons (Master Column)', he: 'כפתורי הפעלת סצנה (Scene Launch)', es: 'Lanzamiento de escenas' },
        description: {
          en: 'Horizontal rows are Scenes. Clicking a Scene number triggers all clips in that row simultaneously.',
          he: 'השורות האופקיות נקראות סצנות (Scenes). לחיצה מפעילה את כל הקליפים באותה שורה בו-זמנית.',
          es: 'Filas horizontales que disparan clips simultáneos.',
        },
        rect: { x: 0.77, y: 0.16, width: 0.15, height: 0.38 },
        category: 'control',
        mappedSimulatorTarget: 'session-scene-launch',
      },
      {
        id: 'session-mixer-section',
        title: { en: 'Integrated Session Mixer', he: 'מיקסר מובנה בתחתית ה-Session', es: 'Mezclador de Session' },
        description: {
          en: 'Volume faders, pan knobs, track activator (mute), solo, and record arm switches.',
          he: 'זחלני עוצמה (Faders), צידוד (Pan), השתקה (Mute), סולו (Solo) ודריכת הקלטה (Arm).',
          es: 'Faders de volumen, paneo, mute, solo y armado de pista.',
        },
        rect: { x: 0.18, y: 0.62, width: 0.74, height: 0.32 },
        category: 'audio',
        mappedSimulatorTarget: 'mixer-fader-t2',
      },
      {
        id: 'session-stop-clips',
        title: { en: 'Stop All Clips Button', he: 'כפתור עצירת כל הקליפים', es: 'Detener clips' },
        description: {
          en: 'Located at the bottom of the Master track. Halts all playing Session clips immediately at the next quantize interval.',
          he: 'נמצא בתחתית ערוץ ה-Master. עוצר את כל הקליפים הפעילים ב-Session בסיום תיבת הקוונטיזציה הנוכחית.',
          es: 'Detiene todos los clips activos en la vista Session.',
        },
        rect: { x: 0.78, y: 0.88, width: 0.14, height: 0.08 },
        category: 'control',
        mappedSimulatorTarget: 'session-stop-all',
      },
    ],
  },

  // 2. Arrangement View
  {
    id: 'ref-arrangement-view',
    title: {
      en: 'Ableton Live Arrangement View',
      he: 'תצוגת ה-Arrangement ב-Ableton Live',
      es: 'Vista Arrangement de Ableton Live',
    },
    workspace: 'ARRANGEMENT_VIEW',
    description: {
      en: 'The linear, horizontal musical timeline where tracks are arranged from left to right across musical bars, ideal for final track structure, automation, and recording.',
      he: 'ציר הזמן הליניארי האופקי שבו ערוצי השיר מסודרים משמאל לימין לאורך תיבות מוזיקליות, מיועד למבנה הסופי של היצירה, אוטומציות והקלטות.',
      es: 'La línea de tiempo musical horizontal para estructurar canciones completas y dibujar automatizaciones.',
    },
    imageSource: createWorkspaceSvgDataUri('Arrangement Timeline', '#90FF00', '#FFE853', [
      { label: 'Beat Time Ruler (Bars & Beats)', x: 180, y: 58, w: 596, h: 26 },
      { label: 'Track Headers (Kick, Bass, Lead, FX)', x: 24, y: 88, w: 150, h: 388 },
      { label: 'Audio / MIDI Clips Timeline Grid', x: 180, y: 88, w: 596, h: 280 },
      { label: 'Automation Envelopes Sub-lane', x: 180, y: 374, w: 596, h: 102 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Arrangement Timeline', '#90FF00', '#FFE853', [
      { label: 'Beat Time Ruler (Bars & Beats)', x: 180, y: 58, w: 596, h: 26 },
      { label: 'Track Headers (Kick, Bass, Lead, FX)', x: 24, y: 88, w: 150, h: 388 },
      { label: 'Audio / MIDI Clips Timeline Grid', x: 180, y: 88, w: 596, h: 280 },
      { label: 'Automation Envelopes Sub-lane', x: 180, y: 374, w: 596, h: 102 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Arrangement View)',
      url: 'https://www.ableton.com/en/manual/arrangement-view/',
      section: 'Chapter 6: Arrangement View & Navigation',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'arr-time-ruler',
        title: { en: 'Beat Time Ruler', he: 'סרגל הזמן והתיבות (Beat Time Ruler)', es: 'Regla de tiempo' },
        description: {
          en: 'Shows bars and beats (e.g. 1.1, 1.2, 2.1). Clicking and dragging navigates or sets the song insertion marker.',
          he: 'מציג את תיבות השיר (למשל 1.1, 5.1, 17.1). גרירה בסרגל משנה את מיקום הסמן ומאפשרת זום.',
          es: 'Muestra los compases musicales y permite hacer zoom y situar el cursor.',
        },
        rect: { x: 0.15, y: 0.08, width: 0.82, height: 0.07 },
        category: 'navigation',
        mappedSimulatorTarget: 'arr-time-ruler',
      },
      {
        id: 'arr-loop-brace',
        title: { en: 'Arrangement Loop Brace', he: 'סוגר הלופ (Loop Brace)', es: 'Llave de bucle' },
        description: {
          en: 'A dark horizontal bar defining the looped playback region. Pressing Cmd+L toggles loop playback on and off.',
          he: 'הסוגר האופקי מעל ציר הזמן המגדיר את אזור הלופ. קיצור Cmd+L מדליק ומכבה את הלופ.',
          es: 'Define la sección de compases que se reproducirá en bucle.',
        },
        rect: { x: 0.25, y: 0.08, width: 0.35, height: 0.07 },
        category: 'control',
        mappedSimulatorTarget: 'transport-loop-btn',
      },
      {
        id: 'arr-track-headers',
        title: { en: 'Track Headers & Mute/Solo Controls', he: 'כותרות הערוצים וכפתורי השתקה/סולו', es: 'Cabeceras de pista' },
        description: {
          en: 'Right or left of the timeline, containing track name, color, activator button (number), solo button (S), and record arm.',
          he: 'כותרות הערוצים המכילות את שם הערוץ, צבעו, כפתור ההפעלה/השתקה (מספר), כפתור סולו (S) ודריכת הקלטה.',
          es: 'Controles de pista con nombre, color, mute, solo y armado.',
        },
        rect: { x: 0.02, y: 0.15, width: 0.14, height: 0.8 },
        category: 'audio',
        mappedSimulatorTarget: 'arr-track-header',
      },
      {
        id: 'arr-back-to-arr',
        title: { en: 'Back to Arrangement Button', he: 'כפתור חזרה ל-Arrangement (הכפתור הכתום)', es: 'Volver a Arrangement' },
        description: {
          en: 'Illuminates orange when a clip was triggered in Session View while in Arrangement. Clicking it restores timeline playback.',
          he: 'נדלק בצבע כתום כאשר הופעל קליפ ב-Session בזמן השמעת Arrangement. לחיצה עליו מחזירה את השליטה המלאה לציר הזמן.',
          es: 'Se ilumina en naranja al desincronizar la vista. Al pulsarlo restaura el timeline.',
        },
        rect: { x: 0.88, y: 0.02, width: 0.08, height: 0.06 },
        category: 'control',
        mappedSimulatorTarget: 'back-to-arr-btn',
      },
    ],
  },

  // 3. Mixer View
  {
    id: 'ref-mixer',
    title: {
      en: 'Ableton Live 12 Mixer View',
      he: 'תצוגת המיקסר ב-Ableton Live 12',
      es: 'Vista del Mezclador en Ableton Live 12',
    },
    workspace: 'MIXER',
    description: {
      en: 'The comprehensive multi-track mixing console featuring precision decibel peak/RMS metering, long-throw faders, stereo panning, auxiliary send busses, and master bus processing.',
      he: 'קונסולת המיקס הרב-ערוצית הכוללת מדידת דציבלים מדויקת (Peak/RMS), זחלנים ארוכים, צידוד סטריאו, ערוצי Return וניהול המאסטר.',
      es: 'Consola de mezcla completa con faders de alta resolución, medidores Peak/RMS y envíos auxiliares.',
    },
    imageSource: createWorkspaceSvgDataUri('Mixer Console', '#00E5FF', '#90FF00', [
      { label: 'Peak / RMS Meter Bridge', x: 24, y: 58, w: 752, h: 80 },
      { label: 'Send A (Reverb) & Send B (Delay)', x: 24, y: 144, w: 752, h: 70 },
      { label: 'Stereo Pan Controls (Split / Balance)', x: 24, y: 220, w: 752, h: 50 },
      { label: 'Track Activator & Solo / Cue', x: 24, y: 276, w: 752, h: 44 },
      { label: 'Long-Throw Precision Volume Faders', x: 24, y: 326, w: 752, h: 150 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Mixer Console', '#00E5FF', '#90FF00', [
      { label: 'Peak / RMS Meter Bridge', x: 24, y: 58, w: 752, h: 80 },
      { label: 'Send A (Reverb) & Send B (Delay)', x: 24, y: 144, w: 752, h: 70 },
      { label: 'Stereo Pan Controls (Split / Balance)', x: 24, y: 220, w: 752, h: 50 },
      { label: 'Track Activator & Solo / Cue', x: 24, y: 276, w: 752, h: 44 },
      { label: 'Long-Throw Precision Volume Faders', x: 24, y: 326, w: 752, h: 150 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Mixing & Routing)',
      url: 'https://www.ableton.com/en/manual/mixing/',
      section: 'Chapter 16: The Live Mixer',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'mixer-metering',
        title: { en: 'Peak & RMS Meter Bridge', he: 'מדי עוצמת Peak ו-RMS', es: 'Medidores de señal' },
        description: {
          en: 'High-resolution green, orange, and red meters showing instantaneous peak and average perceived loudness in dBFS.',
          he: 'מדים בעלי רזולוציה גבוהה המציגים שיאי עוצמה וערך RMS בדציבלים לניטור מניעת עיוות (Clipping).',
          es: 'Medidores de nivel de señal para evitar distorsión digital.',
        },
        rect: { x: 0.1, y: 0.12, width: 0.8, height: 0.18 },
        category: 'audio',
        mappedSimulatorTarget: 'mixer-meter',
      },
      {
        id: 'mixer-faders',
        title: { en: 'Volume Faders (dB Scale)', he: 'זחלני עוצמת קול (Faders)', es: 'Faders de volumen' },
        description: {
          en: 'Calibrated logarithmic volume sliders. Default is 0.0 dB unity gain. Double-clicking resets to 0 dB.',
          he: 'זחלני עוצמה לוגריתמיים מכוילים. ברירת המחדל היא 0.0dB. לחיצה כפולה מאפסת את הזחלן.',
          es: 'Controles deslizantes de volumen calibrados en decibelios.',
        },
        rect: { x: 0.1, y: 0.65, width: 0.8, height: 0.3 },
        category: 'audio',
        mappedSimulatorTarget: 'mixer-fader-t2',
      },
      {
        id: 'mixer-sends',
        title: { en: 'Auxiliary Send Knobs', he: 'שליחות אפקטים (Sends A/B)', es: 'Mandos de envío' },
        description: {
          en: 'Rotary knobs feeding audio to Return tracks (e.g. Return A Reverb, Return B Echo delay).',
          he: 'כפתורים סיבוביים המנתבים עותק של הסיגנל לערוצי ה-Return עבור ריוורב ודיליי משותפים.',
          es: 'Envían señal hacia las pistas de retorno auxiliares.',
        },
        rect: { x: 0.1, y: 0.32, width: 0.8, height: 0.15 },
        category: 'routing',
        mappedSimulatorTarget: 'mixer-send-a',
      },
    ],
  },

  // 4. Browser
  {
    id: 'ref-browser',
    title: {
      en: 'Ableton Live 12 Browser & Search',
      he: 'דפדפן הקבצים והסאונדים (Browser)',
      es: 'Navegador de sonidos y dispositivos',
    },
    workspace: 'BROWSER',
    description: {
      en: 'The asset management hub organizing Instruments, Audio Effects, MIDI Tools, VST plugins, user samples, sound libraries, and Live 12 sound tagging filters.',
      he: 'מרכז ניהול הסאונדים של אבלטון המארגן כלים, אפקטים, פלאגינים, דגימות אודיו ומערכת תגיות הסאונד החדשה של Live 12.',
      es: 'El centro de gestión de sonidos, sintetizadores, efectos y librerías de samples.',
    },
    imageSource: createWorkspaceSvgDataUri('Device & Sound Browser', '#A855F7', '#00E5FF', [
      { label: 'Search Bar (Cmd+F) with Auto-Complete', x: 24, y: 58, w: 260, h: 32 },
      { label: 'Collections (Color Tags)', x: 24, y: 96, w: 260, h: 100 },
      { label: 'Categories (Sounds, Drums, Instruments, Audio FX)', x: 24, y: 202, w: 260, h: 140 },
      { label: 'Places (Packs, User Library, Current Project)', x: 24, y: 348, w: 260, h: 128 },
      { label: 'Content Results & Preset List', x: 292, y: 58, w: 484, h: 380 },
      { label: 'Sound Similarity Search Filter (Live 12)', x: 292, y: 444, w: 484, h: 32 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Device & Sound Browser', '#A855F7', '#00E5FF', [
      { label: 'Search Bar (Cmd+F) with Auto-Complete', x: 24, y: 58, w: 260, h: 32 },
      { label: 'Collections (Color Tags)', x: 24, y: 96, w: 260, h: 100 },
      { label: 'Categories (Sounds, Drums, Instruments, Audio FX)', x: 24, y: 202, w: 260, h: 140 },
      { label: 'Places (Packs, User Library, Current Project)', x: 24, y: 348, w: 260, h: 128 },
      { label: 'Content Results & Preset List', x: 292, y: 58, w: 484, h: 380 },
      { label: 'Sound Similarity Search Filter (Live 12)', x: 292, y: 444, w: 484, h: 32 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Browser)',
      url: 'https://www.ableton.com/en/manual/browser/',
      section: 'Chapter 5: Managing Files and Sets',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'browser-search',
        title: { en: 'Instant Search Bar (Cmd+F)', he: 'שורת החיפוש המהיר (Cmd+F)', es: 'Barra de búsqueda' },
        description: {
          en: 'Type any instrument name (e.g. "Wavetable", "Operator") or preset to filter instantaneously.',
          he: 'הקלד שם כלי או אפקט (למשל Operator או Roar) לסינון מיידי של תוצאות.',
          es: 'Permite buscar cualquier preset o dispositivo de inmediato con Cmd+F.',
        },
        rect: { x: 0.03, y: 0.12, width: 0.35, height: 0.08 },
        category: 'navigation',
        mappedSimulatorTarget: 'browser-search-input',
      },
      {
        id: 'browser-categories',
        title: { en: 'Categories Sidebar', he: 'רשימת הקטגוריות', es: 'Categorías del navegador' },
        description: {
          en: 'Separates Sounds, Drums, Instruments, Audio Effects, MIDI Effects, Modulators, and Max for Live.',
          he: 'מפריד בין סאונדים, תופים, כלי נגינה, אפקטים קוליים, אפקטי MIDI ומודולטורים.',
          es: 'Organiza instrumentos, efectos de audio y librerías.',
        },
        rect: { x: 0.03, y: 0.22, width: 0.35, height: 0.4 },
        category: 'navigation',
        mappedSimulatorTarget: 'browser-category-instruments',
      },
    ],
  },

  // 5. Clip View
  {
    id: 'ref-clip-view',
    title: {
      en: 'Ableton Live 12 Clip View & Warp',
      he: 'תצוגת הקליפ וה-Warp ב-Ableton Live 12',
      es: 'Vista de Clip y Modos Warp',
    },
    workspace: 'CLIP_VIEW',
    description: {
      en: 'The detailed bottom panel for configuring audio and MIDI clips, setting loop points, transposition, gain, and Ableton’s advanced real-time time-stretching Warp engines.',
      he: 'הפאנל התחתון להגדרת קליפים, קביעת נקודות לופ, טרנספוזיציה של סולם, עוצמה ומנועי מתיחת הזמן (Warp).',
      es: 'Panel inferior para configurar transposición, bucles y algoritmos de time-stretching Warp.',
    },
    imageSource: createWorkspaceSvgDataUri('Clip View & Warp Engine', '#EC4899', '#FFE853', [
      { label: 'Clip Launch Quantization & Follow Actions', x: 24, y: 58, w: 220, h: 180 },
      { label: 'Warp Controls (Beats, Complex, Repitch)', x: 250, y: 58, w: 220, h: 180 },
      { label: 'Pitch Transpose (+/- 48 st) & Detune', x: 476, y: 58, w: 150, h: 180 },
      { label: 'Sample Gain & Reverse Button', x: 632, y: 58, w: 144, h: 180 },
      { label: 'Detailed Sample Waveform & Warp Markers', x: 24, y: 244, w: 752, h: 232 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Clip View & Warp Engine', '#EC4899', '#FFE853', [
      { label: 'Clip Launch Quantization & Follow Actions', x: 24, y: 58, w: 220, h: 180 },
      { label: 'Warp Controls (Beats, Complex, Repitch)', x: 250, y: 58, w: 220, h: 180 },
      { label: 'Pitch Transpose (+/- 48 st) & Detune', x: 476, y: 58, w: 150, h: 180 },
      { label: 'Sample Gain & Reverse Button', x: 632, y: 58, w: 144, h: 180 },
      { label: 'Detailed Sample Waveform & Warp Markers', x: 24, y: 244, w: 752, h: 232 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Clip View & Warp)',
      url: 'https://www.ableton.com/en/manual/clip-view/',
      section: 'Chapter 8: Clip View & Audio Clips',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'clip-warp-modes',
        title: { en: 'Warp Mode Selector', he: 'בורר מצבי ה-Warp', es: 'Selector de modo Warp' },
        description: {
          en: 'Choose between Beats (percussion), Tones (monophonic bass), Texture (ambient), Re-Pitch (tape style), and Complex Pro (polyphonic mix).',
          he: 'בחירה בין מצב Beats לתופים, Tones לבס מונופוני, ו-Complex Pro לקטעים פוליפוניים.',
          es: 'Permite seleccionar el algoritmo de time-stretch óptimo según el material sonoro.',
        },
        rect: { x: 0.32, y: 0.12, width: 0.3, height: 0.35 },
        category: 'audio',
        mappedSimulatorTarget: 'clip-warp-mode',
      },
      {
        id: 'clip-transpose',
        title: { en: 'Pitch Transpose Knob', he: 'כפתור טרנספוזיציה (חצאי טונים)', es: 'Transposición de tono' },
        description: {
          en: 'Shift pitch up or down by semitones (st) and fine-tuning in cents without altering tempo when Warp is active.',
          he: 'שינוי גובה הצליל בחצאי טונים ללא שינוי מהירות השמעת הלופ כאשר Warp פועל.',
          es: 'Modifica el tono en semitonos sin afectar la duración.',
        },
        rect: { x: 0.62, y: 0.12, width: 0.2, height: 0.35 },
        category: 'audio',
        mappedSimulatorTarget: 'clip-transpose-knob',
      },
    ],
  },

  // 6. MIDI Note Editor (Piano Roll)
  {
    id: 'ref-midi-editor',
    title: {
      en: 'Ableton Live 12 MIDI Note Editor (Piano Roll)',
      he: 'עורך תווי ה-MIDI (פיאנו רול)',
      es: 'Editor de notas MIDI (Piano Roll)',
    },
    workspace: 'MIDI_EDITOR',
    description: {
      en: 'The melodic and rhythmic grid for drawing musical notes, adjusting velocity dynamics, setting note probabilities, and locking to musical scales in Live 12.',
      he: 'רשת התווים לכתיבת מלודיות, מקצבים, שליטה בדינמיקת Velocity, הגדרת הסתברות תווים ונעילה לסולמות מוזיקליים ב-Live 12.',
      es: 'La cuadrícula para componer notas MIDI, ajustar velocidades y bloquear escalas musicales.',
    },
    imageSource: createWorkspaceSvgDataUri('MIDI Note Piano Roll', '#3B82F6', '#90FF00', [
      { label: 'Scale Mode & Key Selector (F# Minor)', x: 24, y: 58, w: 200, h: 40 },
      { label: 'Piano Roll Keys (C1 to C5)', x: 24, y: 104, w: 70, h: 270 },
      { label: '16th Note MIDI Grid Canvas', x: 98, y: 104, w: 678, h: 270 },
      { label: 'Velocity Dynamics Lane (0-127)', x: 24, y: 380, w: 752, h: 96 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('MIDI Note Piano Roll', '#3B82F6', '#90FF00', [
      { label: 'Scale Mode & Key Selector (F# Minor)', x: 24, y: 58, w: 200, h: 40 },
      { label: 'Piano Roll Keys (C1 to C5)', x: 24, y: 104, w: 70, h: 270 },
      { label: '16th Note MIDI Grid Canvas', x: 98, y: 104, w: 678, h: 270 },
      { label: 'Velocity Dynamics Lane (0-127)', x: 24, y: 380, w: 752, h: 96 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Editing MIDI Notes)',
      url: 'https://www.ableton.com/en/manual/editing-midi-notes/',
      section: 'Chapter 10: Editing MIDI Notes and Velocities',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'midi-scale-mode',
        title: { en: 'Scale Mode & Scale Lock (Live 12)', he: 'מצב סולם מוזיקלי ונעילת סולם', es: 'Modo de escala' },
        description: {
          en: 'Highlights in-key notes and hides out-of-scale notes, preventing dissonance in Psytrance and Techno basslines.',
          he: 'מדגיש את התווים השייכים לסולם ומסתיר תווים מזויפים למניעת דיסוננס בבסים ולידים.',
          es: 'Destaca únicamente las notas de la escala musical seleccionada.',
        },
        rect: { x: 0.03, y: 0.12, width: 0.28, height: 0.1 },
        category: 'midi',
        mappedSimulatorTarget: 'midi-scale-toggle',
      },
      {
        id: 'midi-grid-notes',
        title: { en: '16th Note Grid Matrix', he: 'רשת חלוקת השש-עשריות', es: 'Matriz de notas' },
        description: {
          en: 'Notes placed on the grid trigger synthesizers. Double-clicking creates or removes a note.',
          he: 'מיקום תווים על הרשת. לחיצה כפולה יוצרת או מוחקת תו מוזיקלי.',
          es: 'Área donde se dibujan y editan las notas MIDI con doble clic.',
        },
        rect: { x: 0.15, y: 0.22, width: 0.82, height: 0.52 },
        category: 'midi',
        mappedSimulatorTarget: 'midi-note-event',
      },
      {
        id: 'midi-velocity-lane',
        title: { en: 'Velocity Stems Lane', he: 'שורת ה-Velocity (עוצמת פגיעה)', es: 'Línea de velocity' },
        description: {
          en: 'Vertical stems at the bottom controlling the velocity (0-127) of each individual note.',
          he: 'עמודים אנכיים בתחתית הקובעים את עוצמת הנגינה והדינמיקה של כל תו בנפרד.',
          es: 'Controla la intensidad y articulación de cada nota.',
        },
        rect: { x: 0.03, y: 0.76, width: 0.94, height: 0.22 },
        category: 'midi',
        mappedSimulatorTarget: 'midi-velocity-slider',
      },
    ],
  },

  // 7. Device View
  {
    id: 'ref-device-view',
    title: {
      en: 'Ableton Live 12 Device View & Chain',
      he: 'תצוגת שרשרת המכשירים (Device View)',
      es: 'Vista de Dispositivos y Cadenas',
    },
    workspace: 'DEVICE_VIEW',
    description: {
      en: 'The horizontal serial processing chain at the bottom of the screen where Instruments, Audio Effects, and MIDI Tools are chained from left to right.',
      he: 'שרשרת המכשירים האופקית בתחתית המסך שבה כלי נגינה, אפקטים ומודולטורים מעבדים את הצליל משמאל לימין.',
      es: 'Cadena de procesamiento donde se insertan sintetizadores y efectos en serie.',
    },
    imageSource: createWorkspaceSvgDataUri('Device Chain View', '#F59E0B', '#00E5FF', [
      { label: 'Instrument Device (Operator / Wavetable)', x: 24, y: 58, w: 260, h: 418 },
      { label: 'Audio Effect 1 (Auto Filter)', x: 290, y: 58, w: 150, h: 418 },
      { label: 'Audio Effect 2 (Roar Saturation)', x: 446, y: 58, w: 160, h: 418 },
      { label: 'Audio Effect 3 (Echo Delay)', x: 612, y: 58, w: 164, h: 418 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Device Chain View', '#F59E0B', '#00E5FF', [
      { label: 'Instrument Device (Operator / Wavetable)', x: 24, y: 58, w: 260, h: 418 },
      { label: 'Audio Effect 1 (Auto Filter)', x: 290, y: 58, w: 150, h: 418 },
      { label: 'Audio Effect 2 (Roar Saturation)', x: 446, y: 58, w: 160, h: 418 },
      { label: 'Audio Effect 3 (Echo Delay)', x: 612, y: 58, w: 164, h: 418 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Working with Devices)',
      url: 'https://www.ableton.com/en/manual/working-with-instruments-and-effects/',
      section: 'Chapter 17: Working with Instruments and Effects',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'device-power-switch',
        title: { en: 'Device Activator (On/Off Toggle)', he: 'מתג הפעלת מכשיר (On/Off)', es: 'Interruptor de encendido' },
        description: {
          en: 'The circular button in the device title bar. Disables device DSP to save CPU or audition dry bypass.',
          he: 'הלחצן העגול בכותרת המכשיר. מכבה את המכשיר לחסכון במשאבים או לבדיקת A/B.',
          es: 'Apaga el dispositivo temporalmente para comparar el sonido procesado.',
        },
        rect: { x: 0.04, y: 0.12, width: 0.06, height: 0.08 },
        category: 'device',
        mappedSimulatorTarget: 'device-power-btn',
      },
      {
        id: 'device-macro-controls',
        title: { en: 'Macro Controls Rack', he: 'כפתורי מאקרו (Macro Controls)', es: 'Mandos Macro' },
        description: {
          en: 'Map multiple device parameters to a single knob for dramatic live performance sweeps.',
          he: 'מאפשר למפות מספר פרמטרים שונים לכפתור סיבובי אחד לביצוע מודולציות מורכבות.',
          es: 'Permite mapear múltiples parámetros a un único potenciómetro.',
        },
        rect: { x: 0.75, y: 0.14, width: 0.22, height: 0.7 },
        category: 'device',
        mappedSimulatorTarget: 'device-macro-knob',
      },
    ],
  },

  // 8. Audio Editor
  {
    id: 'ref-audio-editor',
    title: {
      en: 'Ableton Live 12 Audio Editor & Transients',
      he: 'עורך האודיו וטרנזיינטים (Audio Editor)',
      es: 'Editor de Audio y Transitorios',
    },
    workspace: 'AUDIO_EDITOR',
    description: {
      en: 'The detailed waveform inspection workspace for editing sample transients, slicing audio loops to MIDI drum racks, reversing audio, and zero-crossing phase alignment.',
      he: 'סביבת העבודה המפורטת לניתוח צורת הגל, זיהוי טרנזיינטים, חיתוך דגימות ל-MIDI Drum Rack ותיאום פאזה בנקודות אפס.',
      es: 'Área de edición de formas de onda, detección de transitorios y troceado a pistas MIDI.',
    },
    imageSource: createWorkspaceSvgDataUri('Audio Sample Editor', '#10B981', '#FFE853', [
      { label: 'Sample Start / End / Loop Markers', x: 24, y: 58, w: 752, h: 40 },
      { label: 'High-Resolution Audio Waveform Display', x: 24, y: 104, w: 752, h: 260 },
      { label: 'Transient Markers (Yellow Flags)', x: 24, y: 370, w: 752, h: 35 },
      { label: 'Slice to MIDI & Reverse Functions', x: 24, y: 412, w: 752, h: 64 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Audio Sample Editor', '#10B981', '#FFE853', [
      { label: 'Sample Start / End / Loop Markers', x: 24, y: 58, w: 752, h: 40 },
      { label: 'High-Resolution Audio Waveform Display', x: 24, y: 104, w: 752, h: 260 },
      { label: 'Transient Markers (Yellow Flags)', x: 24, y: 370, w: 752, h: 35 },
      { label: 'Slice to MIDI & Reverse Functions', x: 24, y: 412, w: 752, h: 64 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Audio Clips & Transients)',
      url: 'https://www.ableton.com/en/manual/audio-clips-tempo-and-warping/',
      section: 'Chapter 9: Audio Clips, Tempo, and Warping',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'audio-transients',
        title: { en: 'Transient Detection Markers', he: 'סמני טרנזיינטים (נקודות פגיעה)', es: 'Marcadores de transitorios' },
        description: {
          en: 'Small yellow markers placed at rhythmic spikes in the sample for accurate quantizing and slicing.',
          he: 'סמנים צהובים קטנים המזהים את התקפות הצליל (Transients) לצורך חיתוך וסנכרון קצבי.',
          es: 'Detectan los picos de ataque para cuantización de audio.',
        },
        rect: { x: 0.1, y: 0.74, width: 0.8, height: 0.1 },
        category: 'audio',
        mappedSimulatorTarget: 'audio-transient-marker',
      },
      {
        id: 'audio-reverse',
        title: { en: 'Reverse Sample Button (Rev)', he: 'כפתור היפוך דגימה (Reverse)', es: 'Invertir audio' },
        description: {
          en: 'Flips audio backwards instantaneously, creating classic Psytrance buildup risers and sweeps.',
          he: 'הופך את כיוון השמעת האודיו באופן מיידי, חיוני לעליות ומעברים בפסייטראנס.',
          es: 'Invierte el archivo de audio de atrás hacia adelante.',
        },
        rect: { x: 0.82, y: 0.82, width: 0.14, height: 0.1 },
        category: 'audio',
        mappedSimulatorTarget: 'audio-reverse-btn',
      },
    ],
  },

  // 9. Automation
  {
    id: 'ref-automation',
    title: {
      en: 'Ableton Live 12 Automation & Modulation Envelopes',
      he: 'עורך האוטומציות והמעטפות (Automation)',
      es: 'Automatización y Envolventes de Modulación',
    },
    workspace: 'AUTOMATION',
    description: {
      en: 'The automation overlay workspace where device parameters, filter sweeps, volume rides, and send effects are drawn across time with bezier curve shaping.',
      he: 'שכבת האוטומציה שבה מציירים שינויים בפרמטרים לאורך הזמן (פילטרים, ווליום, אפקטים) באמצעות נקודות שבירה ועקומות Bezier.',
      es: 'Líneas y curvas de automatización para modular filtros, volúmenes y efectos a lo largo del tiempo.',
    },
    imageSource: createWorkspaceSvgDataUri('Automation & Envelopes', '#EF4444', '#00E5FF', [
      { label: 'Automation Arm & Lock Controls', x: 24, y: 58, w: 752, h: 36 },
      { label: 'Device & Parameter Chooser Menus', x: 24, y: 100, w: 220, h: 50 },
      { label: 'Breakpoints & Curved Automation Lanes', x: 250, y: 100, w: 526, h: 374 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Automation & Envelopes', '#EF4444', '#00E5FF', [
      { label: 'Automation Arm & Lock Controls', x: 24, y: 58, w: 752, h: 36 },
      { label: 'Device & Parameter Chooser Menus', x: 24, y: 100, w: 220, h: 50 },
      { label: 'Breakpoints & Curved Automation Lanes', x: 250, y: 100, w: 526, h: 374 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Automation)',
      url: 'https://www.ableton.com/en/manual/automation-and-editing-envelopes/',
      section: 'Chapter 21: Automation and Editing Envelopes',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'auto-breakpoints',
        title: { en: 'Automation Breakpoints & Bezier Curves', he: 'נקודות שבירה ועקומות Bezier', es: 'Puntos y curvas de automatización' },
        description: {
          en: 'Click to insert nodes. Holding Alt/Option and dragging curves the line for organic transitions.',
          he: 'לחיצה יוצרת נקודה. החזקת Alt וגרירה מעקלת את הקו למעבר חלק ומוזיקלי.',
          es: 'Permite crear transiciones suaves sosteniendo la tecla Alt.',
        },
        rect: { x: 0.35, y: 0.25, width: 0.6, height: 0.65 },
        category: 'control',
        mappedSimulatorTarget: 'automation-curve',
      },
    ],
  },

  // 10. Transport & Control Bar
  {
    id: 'ref-transport',
    title: {
      en: 'Ableton Live 12 Transport & Control Bar',
      he: 'סרגל הבקרה וה-Transport ב-Ableton Live 12',
      es: 'Barra de transporte y control global',
    },
    workspace: 'TRANSPORT',
    description: {
      en: 'The topmost global command center hosting Tempo (BPM), Tap Tempo, Time Signature, Metronome, Play/Stop/Record buttons, MIDI Capture, and Ableton Link synchronization.',
      he: 'סרגל השליטה העליון המרכזי המכיל את מהירות השיר (BPM), טאפ טמפו, משקל, מטרונום, פליי, הקלטה, לכידת MIDI וסנכרון Link.',
      es: 'Centro de control superior con tempo BPM, metrónomo, transporte y grabación MIDI.',
    },
    imageSource: createWorkspaceSvgDataUri('Global Control Bar & Transport', '#FFE853', '#90FF00', [
      { label: 'Ableton Link & Tap Tempo Button', x: 24, y: 58, w: 160, h: 100 },
      { label: 'Tempo Display (142.00 BPM) & Time Sig (4/4)', x: 190, y: 58, w: 180, h: 100 },
      { label: 'Metronome (Count-in & Sound Selection)', x: 376, y: 58, w: 120, h: 100 },
      { label: 'Transport Play, Stop, and Arrangement Record', x: 502, y: 58, w: 180, h: 100 },
      { label: 'MIDI Capture (Capture Button)', x: 688, y: 58, w: 88, h: 100 },
      { label: 'Loop Toggle & Punch-In / Punch-Out Points', x: 24, y: 168, w: 752, h: 306 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Global Control Bar & Transport', '#FFE853', '#90FF00', [
      { label: 'Ableton Link & Tap Tempo Button', x: 24, y: 58, w: 160, h: 100 },
      { label: 'Tempo Display (142.00 BPM) & Time Sig (4/4)', x: 190, y: 58, w: 180, h: 100 },
      { label: 'Metronome (Count-in & Sound Selection)', x: 376, y: 58, w: 120, h: 100 },
      { label: 'Transport Play, Stop, and Arrangement Record', x: 502, y: 58, w: 180, h: 100 },
      { label: 'MIDI Capture (Capture Button)', x: 688, y: 58, w: 88, h: 100 },
      { label: 'Loop Toggle & Punch-In / Punch-Out Points', x: 24, y: 168, w: 752, h: 306 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Transport & Tempo)',
      url: 'https://www.ableton.com/en/manual/live-concepts/',
      section: 'Chapter 4: Live Concepts - The Control Bar',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'transport-bpm',
        title: { en: 'Tempo Display (BPM)', he: 'מהירות הפרויקט (BPM)', es: 'Pantalla de Tempo' },
        description: {
          en: 'Controls song speed. Click and drag vertically or type 142 for Psytrance.',
          he: 'קובע את מהירות הפרויקט בפעימות לדקה (BPM). ניתן לגרור אנכית או להקליד ערך.',
          es: 'Ajusta el tempo global en pulsos por minuto.',
        },
        rect: { x: 0.24, y: 0.12, width: 0.23, height: 0.2 },
        category: 'control',
        mappedSimulatorTarget: 'tempo-bpm',
      },
      {
        id: 'transport-play-stop',
        title: { en: 'Play & Stop Buttons (Spacebar)', he: 'כפתורי נגינה ועצירה (רווח)', es: 'Botones Play y Stop' },
        description: {
          en: 'Green triangle starts playback from the cursor position. Square halts playback. Pressing spacebar toggles play/stop.',
          he: 'המשולש הירוק מפעיל ניגון ממיקום הסמן. הריבוע עוצר את הנגינה. מקש הרווח מפעיל ועוצר.',
          es: 'Inicia y detiene la reproducción del proyecto.',
        },
        rect: { x: 0.63, y: 0.12, width: 0.23, height: 0.2 },
        category: 'control',
        mappedSimulatorTarget: 'transport-play-btn',
      },
      {
        id: 'transport-metronome',
        title: { en: 'Metronome & Count-In', he: 'מטרונום וספירה מקדימה', es: 'Metrónomo' },
        description: {
          en: 'Produces an audible click at the defined tempo. Clicking the small arrow sets 1 or 2-bar count-in recording.',
          he: 'משמיע צליל קליק קבוע בקצב הפרויקט. החץ הקטן מאפשר ספירה מקדימה לפני הקלטה.',
          es: 'Genera un pulso audible para mantener el tempo exacto al grabar.',
        },
        rect: { x: 0.48, y: 0.12, width: 0.14, height: 0.2 },
        category: 'control',
        mappedSimulatorTarget: 'transport-metronome-btn',
      },
    ],
  },

  // 11. Preferences
  {
    id: 'ref-preferences',
    title: {
      en: 'Ableton Live 12 Preferences & Audio Setup',
      he: 'הגדרות המערכת והאודיו (Preferences)',
      es: 'Preferencias y Configuración de Audio',
    },
    workspace: 'PREFERENCES',
    description: {
      en: 'The system configuration dialog (Cmd+,) where Audio Drivers (CoreAudio / ASIO), Sample Rate, Buffer Size latency calibration, and MIDI Controller routing are configured.',
      he: 'חלון הגדרות המערכת (Cmd+,) שבו מגדירים דרייבר סאונד (CoreAudio/ASIO), גודל Buffer למניעת השהייה, וחיבורי מקלדות שליטה.',
      es: 'Ventana de configuración para tarjeta de sonido, tamaño de búfer y latencia.',
    },
    imageSource: createWorkspaceSvgDataUri('Preferences & Audio Setup', '#6366F1', '#FFE853', [
      { label: 'Audio Driver Type (CoreAudio / ASIO)', x: 24, y: 58, w: 752, h: 44 },
      { label: 'Audio Input & Output Device Selection', x: 24, y: 108, w: 752, h: 54 },
      { label: 'Sample Rate (44100 / 48000 / 96000 Hz)', x: 24, y: 168, w: 752, h: 44 },
      { label: 'Buffer Size (128 / 256 / 512 Samples) & Latency', x: 24, y: 218, w: 752, h: 70 },
      { label: 'MIDI Ports & Control Surface Scripts', x: 24, y: 294, w: 752, h: 182 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Preferences & Audio Setup', '#6366F1', '#FFE853', [
      { label: 'Audio Driver Type (CoreAudio / ASIO)', x: 24, y: 58, w: 752, h: 44 },
      { label: 'Audio Input & Output Device Selection', x: 24, y: 108, w: 752, h: 54 },
      { label: 'Sample Rate (44100 / 48000 / 96000 Hz)', x: 24, y: 168, w: 752, h: 44 },
      { label: 'Buffer Size (128 / 256 / 512 Samples) & Latency', x: 24, y: 218, w: 752, h: 70 },
      { label: 'MIDI Ports & Control Surface Scripts', x: 24, y: 294, w: 752, h: 182 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Setting up Audio I/O)',
      url: 'https://www.ableton.com/en/manual/setting-up-audio-io/',
      section: 'Chapter 3: Setting up Audio I/O and MIDI',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'pref-buffer-size',
        title: { en: 'Buffer Size & Latency', he: 'גודל הבאפר והשהיית סאונד (Latency)', es: 'Tamaño de búfer' },
        description: {
          en: 'Set to 128 samples for low-latency recording; set to 512 or 1024 samples for heavy mixing.',
          he: 'קביעת 128 דגימות להקלטה מהירה ללא השהייה; 512 או 1024 דגימות למיקס עמוס פלאגינים.',
          es: 'Ajusta el búfer a 128 para grabar o 512/1024 para mezclar sin sobrecargar la CPU.',
        },
        rect: { x: 0.05, y: 0.44, width: 0.9, height: 0.14 },
        category: 'audio',
        mappedSimulatorTarget: 'pref-buffer-slider',
      },
    ],
  },

  // 12. Workflow
  {
    id: 'ref-workflow-multi',
    title: {
      en: 'Ableton Live 12 Dual-View & Workflow',
      he: 'זרימת עבודה משולבת (Session ו-Arrangement)',
      es: 'Flujo de trabajo y doble pantalla',
    },
    workspace: 'WORKFLOW',
    description: {
      en: 'The interactive workflow bridge linking Session experimentation with linear Arrangement recording, including Live 12 dual-window multi-monitor viewing.',
      he: 'גשר זרימת העבודה המחבר בין פיתוח רעיונות ב-Session להקלטתם ב-Arrangement, כולל תמיכה במסכים מפוצלים.',
      es: 'Conexión de flujo de trabajo entre la experimentación en Session y la grabación en Arrangement.',
    },
    imageSource: createWorkspaceSvgDataUri('Session to Arrangement Workflow', '#06B6D4', '#FFE853', [
      { label: 'Left Window: Session View Clip Launcher', x: 24, y: 58, w: 366, h: 418 },
      { label: 'Right Window: Linear Arrangement Timeline', x: 402, y: 58, w: 374, h: 418 },
    ]),
    imageUrl: createWorkspaceSvgDataUri('Session to Arrangement Workflow', '#06B6D4', '#FFE853', [
      { label: 'Left Window: Session View Clip Launcher', x: 24, y: 58, w: 366, h: 418 },
      { label: 'Right Window: Linear Arrangement Timeline', x: 402, y: 58, w: 374, h: 418 },
    ]),
    source: {
      name: 'Ableton Reference Manual (Recording to Arrangement)',
      url: 'https://www.ableton.com/en/manual/recording-new-clips/',
      section: 'Chapter 18: Recording New Clips and Capturing Audio',
      copyright: '© Ableton AG. Educational Reference',
    },
    badge: 'Official Ableton Reference',
    hotspots: [
      {
        id: 'workflow-record-capture',
        title: { en: 'Session to Arrangement Recording', he: 'הקלטת ה-Session לתוך ה-Arrangement', es: 'Grabación de Session a Timeline' },
        description: {
          en: 'Hit Global Record while jamming clips in Session View to lay down the complete arrangement timeline live.',
          he: 'לחיצה על כפתור ההקלטה הראשי בזמן הפעלת קליפים ב-Session רושמת את כל המהלכים על גבי ציר הזמן.',
          es: 'Graba en tiempo real las escenas activadas directamente en el timeline.',
        },
        rect: { x: 0.1, y: 0.15, width: 0.8, height: 0.7 },
        category: 'control',
        mappedSimulatorTarget: 'workflow-record-btn',
      },
    ],
  },
];

/**
 * ReferenceImageLibrary Service
 * Centralizes structured Ableton workspace reference metadata, image sources,
 * manual attributions, and semantic hotspots to feed WorkspaceReference.
 */
export class ReferenceImageLibrary {
  private references: ReferenceImageItem[] = WORKSPACE_REFERENCES;

  /**
   * Returns all available reference items
   */
  public getAll(): ReferenceImageItem[] {
    return this.references;
  }

  /**
   * Returns all items keyed by their ID
   */
  public asRecord(): Record<string, ReferenceImageItem> {
    return this.references.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, ReferenceImageItem>);
  }

  /**
   * Finds a reference by its unique id
   */
  public getById(id: string): ReferenceImageItem | undefined {
    return this.references.find((ref) => ref.id === id);
  }

  /**
   * Returns all references matching a specific workspace type
   */
  public getByWorkspace(workspace: WorkspaceType): ReferenceImageItem[] {
    return this.references.filter((ref) => ref.workspace === workspace);
  }

  /**
   * Gets the primary/default reference item for a workspace
   */
  public getDefault(workspace: WorkspaceType): ReferenceImageItem {
    const found = this.references.find((ref) => ref.workspace === workspace);
    return found || this.references[0];
  }

  /**
   * Lists all distinct workspaces available in the library
   */
  public getAllWorkspaces(): WorkspaceType[] {
    const set = new Set<WorkspaceType>();
    this.references.forEach((r) => set.add(r.workspace));
    return Array.from(set);
  }

  /**
   * Retrieves all hotspots for a given reference
   */
  public getHotspots(id: string): ReferenceHotspot[] {
    const ref = this.getById(id);
    return ref ? ref.hotspots : [];
  }

  /**
   * Searches references by keyword across title and description
   */
  public search(query: string, lang: string = 'en'): ReferenceImageItem[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.references;

    return this.references.filter((ref) => {
      const titleMatch =
        ref.title.en?.toLowerCase().includes(q) ||
        ref.title.he?.toLowerCase().includes(q) ||
        ref.title.es?.toLowerCase().includes(q);

      const descMatch =
        ref.description.en?.toLowerCase().includes(q) ||
        ref.description.he?.toLowerCase().includes(q) ||
        ref.description.es?.toLowerCase().includes(q);

      const hotspotMatch = ref.hotspots.some(
        (h) =>
          h.title.en?.toLowerCase().includes(q) ||
          h.title.he?.toLowerCase().includes(q) ||
          h.description.en?.toLowerCase().includes(q) ||
          h.description.he?.toLowerCase().includes(q)
      );

      return titleMatch || descMatch || hotspotMatch || ref.workspace.toLowerCase().includes(q);
    });
  }

  /**
   * Finds the reference associated with a simulator target ID
   */
  public findBySimulatorTarget(targetId: string): ReferenceImageItem | undefined {
    return this.references.find((ref) =>
      ref.hotspots.some((h) => h.mappedSimulatorTarget === targetId)
    );
  }
}

// Global singleton instance
export const referenceImageLibrary = new ReferenceImageLibrary();
export const ReferenceImageLibraryService = referenceImageLibrary;

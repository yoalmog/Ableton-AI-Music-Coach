import React, { useState } from 'react';
import {
  Play,
  Square,
  Circle,
  Volume2,
  Search,
  Plus,
  Layers,
  Grid,
  Sliders,
  Music,
  Zap,
  Disc,
  Activity,
  HelpCircle,
  Info,
  Sparkles,
  Bot,
  X,
  RotateCcw
} from 'lucide-react';
import { HotspotTarget } from '../../types/classroom';
import { SubSimulatorPianoRoll } from './SubSimulatorPianoRoll';
import { SubSimulatorOperator } from './SubSimulatorOperator';
import { SubSimulatorWavetable } from './SubSimulatorWavetable';
import { SubSimulatorDrumRack } from './SubSimulatorDrumRack';
import { useLanguage } from '../../context/LanguageContext';
import { ABLETON_SEARCH_TOPICS } from '../../data/classroomLessons';

interface SimulatorUIProps {
  targetHighlight: HotspotTarget | null;
  onUserAction: (target: HotspotTarget, value?: any) => void;
  onOpenWhereIsIt: () => void;
  bpm: number;
  onBpmChange: (newBpm: number) => void;
}

interface ElementInfo {
  title: string;
  titleHe: string;
  whatItDoes: string;
  whatItDoesHe: string;
  whyItMatters: string;
  whyItMattersHe: string;
  tip: string;
  tipHe: string;
}

const ELEMENT_INFO_MAP: Record<string, ElementInfo> = {
  transport_play: {
    title: 'Play Button (Spacebar)',
    titleHe: 'כפתור ניגון (Play)',
    whatItDoes: 'Starts playback of the song from the playhead cursor or current bar.',
    whatItDoesHe: 'מפעיל את הניגון של השיר מסמן הזמן או מהתיבה הנוכחית.',
    whyItMatters: 'Essential for auditioning your arrangement, mix balance, and synth patches.',
    whyItMattersHe: 'חיוני לשמיעת הלחן, איזון המיקס והצלילים המעוצבים.',
    tip: 'Pressing Spacebar in real Ableton toggles Play and Stop instantly.',
    tipHe: 'לחיצה על מקש רווח באבלטון האמיתי מפעילה ועוצרת את הניגון באופן מיידי.'
  },
  transport_stop: {
    title: 'Stop Button (Spacebar)',
    titleHe: 'כפתור עצירה (Stop)',
    whatItDoes: 'Stops playback and resets playhead to start position.',
    whatItDoesHe: 'עוצר את הניגון ומחזיר את סמן הזמן לתחילת השיר.',
    whyItMatters: 'Halts audio processing and prevents sound overlap when editing.',
    whyItMattersHe: 'עוצר את מעבד השמע ומונע התנגשות צלילים בזמן עריכה.',
    tip: 'Double clicking Stop resets the song cursor to Bar 1.1.1.',
    tipHe: 'לחיצה כפולה על Stop מחזירה את הסמן בדיוק לתיבה 1.1.1.'
  },
  transport_record: {
    title: 'Arrangement Record (Key F9)',
    titleHe: 'כפתור הקלטה (Record)',
    whatItDoes: 'Records MIDI performance and audio input onto armed tracks.',
    whatItDoesHe: 'מקליט תווים ממקלדת ה-MIDI ושירה/מיקרופון אל הערוצים הדרוכים.',
    whyItMatters: 'Captures your live playing directly into Arrangement clips.',
    whyItMattersHe: 'לוכד את הנגינה החיה שלך ישירות לקליפים בציר הזמן.',
    tip: 'Ensure the target track is Armed (red circle) before pressing Record.',
    tipHe: 'וודא שהערוץ דרוך להקלטה (עיגול אדום) לפני הלחיצה על מקש ההקלטה.'
  },
  bpm_input: {
    title: 'Tempo / BPM Display',
    titleHe: 'מהירות השיר (BPM / Tempo)',
    whatItDoes: 'Sets project playback speed in Beats Per Minute.',
    whatItDoesHe: 'קובע את מהירות הניגון של הפרויקט בפעימות בדקה.',
    whyItMatters: 'Dictates the musical genre speed (e.g. Techno 128 BPM, Psytrance 145 BPM).',
    whyItMattersHe: 'קובע את קצב הז\'אנר (למשל טכנו 128 BPM, פסיטראנס 145 BPM).',
    tip: 'In real Ableton, double click the Tempo display, type a number, and hit Enter.',
    tipHe: 'באבלטון, לחץ פעמיים על תצוגת הטמפו, הקלד את המספר ולחץ Enter.'
  },
  metronome: {
    title: 'Metronome Click (Key C)',
    titleHe: 'מטרונום (Metronome)',
    whatItDoes: 'Produces audible beat ticks (1, 2, 3, 4) in time with project tempo.',
    whatItDoesHe: 'משמיע נקישות קצב מדויקות (1, 2, 3, 4) בהתאם לטמפו השיר.',
    whyItMatters: 'Keeps human instrumental playing locked to the electronic grid.',
    whyItMattersHe: 'שומר על נגינת הנגן או השירה מסונכרנת בצורה מושלמת לגריד.',
    tip: 'Press Key C in real Ableton to toggle Metronome on or off.',
    tipHe: 'לחץ על המקש C באבלטון האמיתי להפעלה/כיבוי של המטרונום.'
  },
  browser: {
    title: 'Browser Panel (Ctrl+Alt+B)',
    titleHe: 'דפדפן הקבצים (Browser)',
    whatItDoes: 'Stores all instruments, audio effects, MIDI effects, samples, and VST plugins.',
    whatItDoesHe: 'מאכסן את כל הכלים, אפקטי השמע, אפקטי ה-MIDI, הדגימות והפלאגינים.',
    whyItMatters: 'Your central library for building synths, beats, and audio chains.',
    whyItMattersHe: 'הספרייה המרכזית שלך לבניית סינתיסייזרים, מקצבים ושרשראות סאונד.',
    tip: 'Use Ctrl+F (Cmd+F on Mac) to search any instrument or sample instantly.',
    tipHe: 'השתמש ב-Ctrl+F (או Cmd+F במק) לחיפוש מהיר של כל כלי או דגימה.'
  },
  midi_track_header: {
    title: 'MIDI Track Header',
    titleHe: 'ראש ערוץ MIDI',
    whatItDoes: 'Houses virtual synth instruments and MIDI clip note sequence editor.',
    whatItDoesHe: 'מכיל כלי נגינה וירטואליים ועורך תווים דיגיטליים.',
    whyItMatters: 'MIDI tracks hold raw notes that trigger sound generators like Operator.',
    whyItMattersHe: 'ערוץ MIDI מכיל תווים המפעילים סינתיסייזר להפקת סאונד.',
    tip: 'Press Ctrl+Shift+T to create a new MIDI track in Ableton.',
    tipHe: 'לחץ Ctrl+Shift+T ליצירת ערוץ MIDI חדש באבלטון.'
  },
  track_mute: {
    title: 'Track Mute / Activator',
    titleHe: 'השתקת ערוץ (Mute)',
    whatItDoes: 'Silences the audio output of the selected track.',
    whatItDoesHe: 'משתיק את יציאת השמע של הערוץ הנבחר.',
    whyItMatters: 'Allows A/B testing or silencing individual instruments during mixdown.',
    whyItMattersHe: 'מאפשר השוואת גרסאות והשתקת כלים בודדים בזמן המיקס.',
    tip: 'Clicking the yellow track number turns Mute on/off.',
    tipHe: 'לחיצה על מספר הערוץ הצהוב מפעילה/משתיקה את הערוץ.'
  },
  track_arm: {
    title: 'Arm Record Button',
    titleHe: 'דריכת ערוץ להקלטה (Arm)',
    whatItDoes: 'Routes incoming MIDI keyboard or microphone audio into this track.',
    whatItDoesHe: 'מנתב את מקלדת ה-MIDI או המיקרופון ישירות לערוץ זה.',
    whyItMatters: 'Without Arming, pressing MIDI keys will make no sound on this track.',
    whyItMattersHe: 'ללא דריכת ערוץ (Arm), לחיצה על מקלדת השליטה לא תפיק צליל.',
    tip: 'Hold Ctrl while clicking Arm to arm multiple tracks simultaneously.',
    tipHe: 'החזק Ctrl בלחיצה על Arm לדריכת מספר ערוצים במקביל.'
  },
  piano_roll: {
    title: 'Piano Roll / Clip View (Shift+Tab)',
    titleHe: 'עורך ה-Piano Roll',
    whatItDoes: 'Displays pitch rows (piano keys) and time grid columns for drawing notes.',
    whatItDoesHe: 'מציג שורות פיץ\' (קלידי פסנתר) ועמודות זמן לציור ועריכת תווים.',
    whyItMatters: 'Primary canvas for composing basslines, leads, chords, and drum beats.',
    whyItMattersHe: 'הקנבס המרכזי לכתיבת ליינים של בס, מלודיות, אקורדים ומקצבים.',
    tip: 'Press Key B to toggle Draw Pencil mode for placing notes with single clicks.',
    tipHe: 'לחץ B ב-Piano Roll להפעלת העיפרון להוספת תווים בלחיצה אחת.'
  },
  master_track: {
    title: 'Master Bus Track',
    titleHe: 'ערוץ ה-Master',
    whatItDoes: 'Sums all audio tracks into a final stereo signal sent to speakers.',
    whatItDoesHe: 'מאגד את כל הערוצים יחד ליציאת סטריאו סופית לרמקולים.',
    whyItMatters: 'Master metering prevents digital clipping distortion (> 0 dBFS).',
    whyItMattersHe: 'מדידת ערוץ המאסטר מונעת עיוותים דיגיטליים מעל 0 dBFS.',
    tip: 'Keep Master peak levels around -3 dBFS before exporting final WAV files.',
    tipHe: 'שמור על עוצמת המאסטר באזור 3dB- לפני יצוא קובץ השמע הסופי.'
  }
};

export const SimulatorUI: React.FC<SimulatorUIProps> = ({
  targetHighlight,
  onUserAction,
  onOpenWhereIsIt,
  bpm,
  onBpmChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [viewMode, setViewMode] = useState<'arrangement' | 'session'>('arrangement');
  const [activeBottomTab, setActiveBottomTab] = useState<'piano_roll' | 'operator' | 'wavetable' | 'drum_rack'>('piano_roll');
  const [activeCategory, setActiveCategory] = useState<'instruments' | 'effects' | 'samples'>('instruments');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWhatIsThisActive, setIsWhatIsThisActive] = useState(false);
  const [selectedInfoModal, setSelectedInfoModal] = useState<{ target: HotspotTarget; info: ElementInfo } | null>(null);
  const [hoveredElementKey, setHoveredElementKey] = useState<string | null>(null);

  const { language, isRTL, t } = useLanguage();

  const [tracks, setTracks] = useState([
    { id: 't1', name: '1 Psy Bass', type: 'midi', muted: false, solo: false, armed: true, volume: 80, pan: 0 },
    { id: 't2', name: '2 Kick 909', type: 'audio', muted: false, solo: false, armed: false, volume: 90, pan: 0 },
    { id: 't3', name: '3 Lead Synth', type: 'midi', muted: false, solo: false, armed: false, volume: 75, pan: 0 }
  ]);

  const isTarget = (element: HotspotTarget) => targetHighlight === element;

  const getHighlightClass = (element: HotspotTarget) => {
    if (isTarget(element)) {
      return 'ring-4 ring-amber-400 ring-offset-2 ring-offset-black animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.9)] border-amber-400 z-20';
    }
    return '';
  };

  const handleElementClick = (target: HotspotTarget, defaultAction?: () => void) => {
    if (isWhatIsThisActive) {
      const info = ELEMENT_INFO_MAP[target] || {
        title: target.toUpperCase(),
        titleHe: target.toUpperCase(),
        whatItDoes: 'Controls interactive parameters within Ableton Live 12.',
        whatItDoesHe: 'שולט על פרמטרים אינטראקטיביים ב-Ableton Live 12.',
        whyItMatters: 'Helps shape sound design, routing, and track composition.',
        whyItMattersHe: 'עוזר לעצב את הסאונד, הניתוב ומבנה השיר.',
        tip: 'Practice using shortcut keys to navigate faster.',
        tipHe: 'תרגל שימוש במקשי קיצור לניווט מהיר.'
      };
      setSelectedInfoModal({ target, info });
    } else {
      if (defaultAction) defaultAction();
      onUserAction(target);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    onUserAction('transport_play');
  };

  const handleToggleMetronome = () => {
    setIsMetronomeOn(!isMetronomeOn);
    onUserAction('metronome');
  };

  const handleAddMidiTrack = () => {
    const trackLabel = t('simulator.midiTrack') || (language === 'he' ? 'ערוץ MIDI' : 'MIDI Track');
    const newTrack = {
      id: `t${tracks.length + 1}`,
      name: `${tracks.length + 1} ${trackLabel}`,
      type: 'midi',
      muted: false,
      solo: false,
      armed: false,
      volume: 80,
      pan: 0
    };
    setTracks([...tracks, newTrack]);
    onUserAction('add_midi_track_btn');
  };

  const currentHoveredInfo = hoveredElementKey && ELEMENT_INFO_MAP[hoveredElementKey];

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`bg-[#121212] border border-[#2B2B2B] rounded-xl overflow-hidden text-gray-200 select-none flex flex-col h-[820px] shadow-2xl relative ${
        isWhatIsThisActive ? 'cursor-help' : ''
      }`}
    >
      {/* Disclaimer & Branding Bar */}
      <div className="bg-[#181818] px-4 py-1.5 border-b border-[#2B2B2B] flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-bold text-amber-400 tracking-wider">{t('simulator.title')}</span>
          <span className="text-[#777] hidden md:inline">{t('simulator.disclaimer')}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* "What is this?" AI Mode Button */}
          <button
            onClick={() => setIsWhatIsThisActive(!isWhatIsThisActive)}
            className={`px-2.5 py-0.5 rounded border text-[11px] font-sans font-bold flex items-center gap-1 transition ${
              isWhatIsThisActive
                ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                : 'bg-[#252525] hover:bg-[#303030] text-amber-400 border-[#3D3D3D]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('simulator.whatIsThis')}</span>
          </button>

          <button
            onClick={onOpenWhereIsIt}
            className="px-2.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/40 font-sans font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Search className="w-3 h-3" />
            <span>{t('simulator.whereIsIt')}</span>
          </button>
        </div>
      </div>

      {/* TOP CONTROL BAR (Transport, BPM, Metronome, Time Sig, View Toggles) */}
      <div className="bg-[#1C1C1C] px-3 py-2 border-b border-[#2B2B2B] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Transport Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleElementClick('transport_play', handleTogglePlay)}
            onMouseEnter={() => setHoveredElementKey('transport_play')}
            onMouseLeave={() => setHoveredElementKey(null)}
            className={`p-2 rounded font-bold transition flex items-center justify-center cursor-pointer ${getHighlightClass('transport_play')} ${
              isPlaying ? 'bg-amber-500 text-black' : 'bg-[#2A2A2A] hover:bg-[#353535] text-amber-400'
            }`}
            title={t('simulator.playTitle')}
          >
            <Play className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() =>
              handleElementClick('transport_stop', () => {
                setIsPlaying(false);
              })
            }
            onMouseEnter={() => setHoveredElementKey('transport_stop')}
            onMouseLeave={() => setHoveredElementKey(null)}
            className={`p-2 bg-[#2A2A2A] hover:bg-[#353535] text-gray-300 rounded cursor-pointer ${getHighlightClass('transport_stop')}`}
            title={t('simulator.stopTitle')}
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() => handleElementClick('transport_record')}
            onMouseEnter={() => setHoveredElementKey('transport_record')}
            onMouseLeave={() => setHoveredElementKey(null)}
            className={`p-2 bg-[#2A2A2A] hover:bg-[#353535] text-red-500 rounded cursor-pointer ${getHighlightClass('transport_record')}`}
            title={t('simulator.recordTitle')}
          >
            <Circle className="w-4 h-4 fill-current" />
          </button>

          {/* BPM Box */}
          <div
            onClick={() => handleElementClick('bpm_input')}
            onMouseEnter={() => setHoveredElementKey('bpm_input')}
            onMouseLeave={() => setHoveredElementKey(null)}
            className={`flex items-center gap-1 bg-[#141414] px-2.5 py-1 rounded border border-[#333] ${getHighlightClass('bpm_input')}`}
          >
            <span className="text-[#777] text-[10px] font-mono">BPM:</span>
            <input
              type="number"
              value={bpm}
              onChange={(e) => {
                const val = Number(e.target.value);
                onBpmChange(val);
                onUserAction('bpm_input', val);
              }}
              className="w-12 bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none text-center"
            />
          </div>

          {/* Time Signature */}
          <span className="text-[10px] font-mono bg-[#141414] px-2 py-1.5 rounded border border-[#2B2B2B] text-gray-400">
            4 / 4
          </span>

          {/* Metronome */}
          <button
            onClick={() => handleElementClick('metronome', handleToggleMetronome)}
            onMouseEnter={() => setHoveredElementKey('metronome')}
            onMouseLeave={() => setHoveredElementKey(null)}
            className={`p-1.5 rounded border text-[11px] font-mono flex items-center gap-1 transition cursor-pointer ${getHighlightClass('metronome')} ${
              isMetronomeOn
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-[#141414] border-[#2B2B2B] text-[#777] hover:text-white'
            }`}
            title={t('simulator.metronomeTitle')}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>{t('simulator.metronome')}</span>
          </button>
        </div>

        {/* View Toggles & Automation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              handleElementClick('view_toggle_arrangement', () => setViewMode('arrangement'))
            }
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition cursor-pointer ${getHighlightClass('view_toggle_arrangement')} ${
              viewMode === 'arrangement'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-[#252525] border-[#333] text-[#888] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('simulator.arrangement')}</span>
          </button>

          <button
            onClick={() =>
              handleElementClick('view_toggle_session', () => setViewMode('session'))
            }
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition cursor-pointer ${getHighlightClass('view_toggle_session')} ${
              viewMode === 'session'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-[#252525] border-[#333] text-[#888] hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{t('simulator.session')}</span>
          </button>

          <button
            onClick={() => handleElementClick('automation_btn')}
            className={`p-1.5 bg-[#252525] border border-[#333] hover:border-amber-400 text-pink-400 rounded cursor-pointer ${getHighlightClass('automation_btn')}`}
            title={t('simulator.automation')}
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN BODY AREA (Browser + Tracks Area) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT BROWSER PANEL (RTL-aware logical border & margins) */}
        <div
          onClick={() => handleElementClick('browser')}
          onMouseEnter={() => setHoveredElementKey('browser')}
          onMouseLeave={() => setHoveredElementKey(null)}
          className={`w-56 bg-[#171717] border-e border-[#2B2B2B] flex flex-col ${getHighlightClass('browser')}`}
        >
          {/* Search Header */}
          <div className="p-2 border-b border-[#2A2A2A] space-y-1.5">
            <div className="font-bold text-[11px] text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>{t('simulator.browser')}</span>
              <span className="text-[9px] text-[#666]">Live 12</span>
            </div>
            <div className="relative">
              <Search className="w-3 h-3 text-[#666] absolute start-2 top-2" />
              <input
                type="text"
                placeholder={t('simulator.searchBrowser')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#2B2B2B] text-xs text-white ps-7 pe-2 py-1 rounded focus:border-amber-400 outline-none"
              />
            </div>
          </div>

          {/* Browser Categories */}
          <div className="p-2 space-y-1 text-xs">
            <button
              onClick={() => handleElementClick('browser_instruments', () => setActiveCategory('instruments'))}
              className={`w-full text-start px-2.5 py-1.5 rounded flex items-center gap-2 transition cursor-pointer ${getHighlightClass('browser_instruments')} ${
                activeCategory === 'instruments' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-gray-300 hover:bg-[#222]'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('simulator.instruments')}</span>
            </button>
            <button
              onClick={() => handleElementClick('browser_effects', () => setActiveCategory('effects'))}
              className={`w-full text-start px-2.5 py-1.5 rounded flex items-center gap-2 transition cursor-pointer ${getHighlightClass('browser_effects')} ${
                activeCategory === 'effects' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-gray-300 hover:bg-[#222]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('simulator.audioEffects')}</span>
            </button>
            <button
              onClick={() => handleElementClick('browser_samples', () => setActiveCategory('samples'))}
              className={`w-full text-start px-2.5 py-1.5 rounded flex items-center gap-2 transition cursor-pointer ${getHighlightClass('browser_samples')} ${
                activeCategory === 'samples' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-gray-300 hover:bg-[#222]'
              }`}
            >
              <Disc className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('simulator.samples')}</span>
            </button>
          </div>

          {/* Browser Items List */}
          <div className="flex-1 p-2 space-y-1 text-[11px] overflow-y-auto text-gray-400 border-t border-[#222]">
            {activeCategory === 'instruments' && (
              <>
                <div onClick={() => setActiveBottomTab('operator')} className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">
                  {t('simulator.operator')}
                </div>
                <div onClick={() => setActiveBottomTab('wavetable')} className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">
                  {t('simulator.wavetable')}
                </div>
                <div onClick={() => setActiveBottomTab('drum_rack')} className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">
                  {t('simulator.drumRack')}
                </div>
                <div className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">Drift</div>
                <div className="hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">Meld (Live 12)</div>
              </>
            )}
            {activeCategory === 'effects' && (
              <>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">EQ Eight</div>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">Compressor</div>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">Glue Compressor</div>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">Roar (Live 12 Saturation)</div>
                <div className="hover:text-cyan-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">Reverb & Delay</div>
              </>
            )}
            {activeCategory === 'samples' && (
              <>
                <div className="hover:text-emerald-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">Psy_Kick_145BPM.wav</div>
                <div className="hover:text-emerald-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">Techno_Rumble_909.wav</div>
                <div className="hover:text-emerald-300 cursor-pointer p-1 rounded hover:bg-[#222] font-mono">16th_Rolling_Bass.wav</div>
              </>
            )}
          </div>
        </div>

        {/* CENTER TRACK WORKSPACE (Arrangement vs Session Views) */}
        <div className="flex-1 flex flex-col bg-[#141414] overflow-hidden">
          {/* Add Track Toolbar */}
          <div className="p-2 border-b border-[#252525] bg-[#1A1A1A] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddMidiTrack}
                className={`px-2.5 py-1 bg-[#282828] hover:bg-[#333] text-amber-300 rounded text-[11px] font-semibold flex items-center gap-1 border border-[#333] cursor-pointer ${getHighlightClass('add_midi_track_btn')}`}
              >
                <Plus className="w-3 h-3" />
                <span>{t('simulator.addMidiTrack')}</span>
              </button>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#777] font-mono">
              <span>{t('simulator.grid16th')}</span>
              <span>{bpm.toFixed(2)} BPM</span>
            </div>
          </div>

          {/* VIEW MODE RENDER: ARRANGEMENT VIEW */}
          {viewMode === 'arrangement' && (
            <div className="flex-1 overflow-y-auto divide-y divide-[#222]">
              {/* Timeline Header Ruler */}
              <div className="flex h-6 bg-[#1B1B1B] border-b border-[#2B2B2B] text-[10px] font-mono text-[#888]">
                <div className="w-52 px-2 py-1 border-e border-[#2B2B2B]">{t('simulator.trackName')}</div>
                <div className="flex-1 flex items-center justify-between px-3" dir="ltr">
                  <span>1.1.1</span>
                  <span>2.1.1</span>
                  <span>3.1.1</span>
                  <span>4.1.1</span>
                  <span>5.1.1</span>
                  <span>6.1.1</span>
                  <span>7.1.1</span>
                  <span>8.1.1</span>
                </div>
              </div>

              {tracks.map((track) => (
                <div key={track.id} className="flex h-20 bg-[#161616] hover:bg-[#1A1A1A] transition">
                  {/* Track Header Controls */}
                  <div
                    onClick={() => handleElementClick('midi_track_header')}
                    onMouseEnter={() => setHoveredElementKey('midi_track_header')}
                    onMouseLeave={() => setHoveredElementKey(null)}
                    className={`w-52 p-2 border-e border-[#2A2A2A] bg-[#1E1E1E] flex flex-col justify-between text-xs ${getHighlightClass('midi_track_header')}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 truncate">{track.name}</span>
                      <span className="text-[9px] bg-[#121212] px-1 py-0.5 rounded text-[#888] font-mono">{track.type}</span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleElementClick('track_mute')}
                          onMouseEnter={() => setHoveredElementKey('track_mute')}
                          onMouseLeave={() => setHoveredElementKey(null)}
                          className={`w-6 h-5 rounded text-[10px] font-bold border transition cursor-pointer ${getHighlightClass('track_mute')} ${
                            track.muted ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-[#282828] border-[#383838] text-gray-400'
                          }`}
                          title={t('simulator.mute')}
                        >
                          M
                        </button>
                        <button
                          onClick={() => handleElementClick('track_solo')}
                          className={`w-6 h-5 rounded text-[10px] font-bold border transition cursor-pointer ${getHighlightClass('track_solo')} ${
                            track.solo ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-[#282828] border-[#383838] text-gray-400'
                          }`}
                          title={t('simulator.solo')}
                        >
                          S
                        </button>
                        <button
                          onClick={() => handleElementClick('track_arm')}
                          onMouseEnter={() => setHoveredElementKey('track_arm')}
                          onMouseLeave={() => setHoveredElementKey(null)}
                          className={`w-6 h-5 rounded text-[10px] font-bold border transition flex items-center justify-center cursor-pointer ${getHighlightClass('track_arm')} ${
                            track.armed ? 'bg-red-500 text-white border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[#282828] border-[#383838] text-red-500'
                          }`}
                          title={t('simulator.arm')}
                        >
                          ●
                        </button>
                      </div>

                      <span className="text-[9px] font-mono text-[#888]">{track.volume} dB</span>
                    </div>
                  </div>

                  {/* Track Timeline Area with Clips */}
                  <div
                    onClick={() => handleElementClick('clip_slot')}
                    className={`flex-1 p-2 bg-[#121212] relative flex items-center gap-3 cursor-pointer hover:bg-[#181818] transition ${getHighlightClass('clip_slot')}`}
                  >
                    <div className="h-14 w-48 bg-amber-500/20 border border-amber-400/50 rounded p-1 text-[10px] text-amber-300 flex flex-col justify-between">
                      <span className="font-semibold">{track.name} {t('simulator.clip')}</span>
                      <span className="text-[9px] text-amber-400/70 font-mono">{t('simulator.pattern')}</span>
                    </div>

                    <div className="h-14 w-32 bg-cyan-500/10 border border-cyan-400/30 rounded p-1 text-[10px] text-cyan-300 flex flex-col justify-between">
                      <span className="font-semibold">{t('simulator.variation')}</span>
                      <span className="text-[9px] text-cyan-400/70 font-mono">{t('simulator.loop')}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Master Track Header */}
              <div
                onClick={() => handleElementClick('master_track')}
                onMouseEnter={() => setHoveredElementKey('master_track')}
                onMouseLeave={() => setHoveredElementKey(null)}
                className={`flex h-16 bg-[#1A1A1A] border-t-2 border-amber-500/40 cursor-pointer ${getHighlightClass('master_track')}`}
              >
                <div className="w-52 p-2 border-e border-[#2A2A2A] bg-[#222] font-bold text-xs text-amber-400 flex items-center justify-between">
                  <span>{t('simulator.masterTrack')}</span>
                  <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-mono font-bold">0.0 dBFS</span>
                </div>
                <div className="flex-1 bg-[#121212] p-2 flex items-center justify-between text-xs text-[#777]">
                  <span>{t('simulator.masterChain')}</span>
                  <span className="text-emerald-400 font-mono text-[10px]">-3.2 dB Peak</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE RENDER: SESSION VIEW GRID */}
          {viewMode === 'session' && (
            <div className="flex-1 p-4 bg-[#121212] overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {tracks.map((track) => (
                  <div key={track.id} className="w-40 bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-2 flex flex-col gap-2">
                    <div className="font-bold text-xs text-amber-400 border-b border-[#333] pb-1 text-center">
                      {track.name}
                    </div>

                    {/* Clip Slots Grid */}
                    {[1, 2, 3, 4].map((slotIdx) => (
                      <div
                        key={slotIdx}
                        onClick={() => handleElementClick('clip_slot')}
                        className={`h-12 bg-[#222] hover:bg-amber-500/20 border border-[#333] hover:border-amber-400 rounded-lg p-2 flex items-center justify-between text-xs cursor-pointer transition ${getHighlightClass('clip_slot')}`}
                      >
                        <span className="text-[10px] text-[#888]">{t('simulator.clip')} {slotIdx}</span>
                        <Play className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                    ))}

                    <div className="pt-2 border-t border-[#333] flex justify-center gap-1">
                      <button className="px-2 py-1 bg-[#2B2B2B] text-[10px] rounded text-gray-300 cursor-pointer" title={t('simulator.mute')}>M</button>
                      <button className="px-2 py-1 bg-[#2B2B2B] text-[10px] rounded text-gray-300 cursor-pointer" title={t('simulator.solo')}>S</button>
                      <button className="px-2 py-1 bg-red-500 text-[10px] rounded text-white font-bold cursor-pointer" title={t('simulator.arm')}>●</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM AREA (Info View + Sub-Simulators) */}
      <div className="h-60 bg-[#1A1A1A] border-t border-[#2B2B2B] flex flex-col">
        {/* Bottom Tabs Bar */}
        <div className="px-3 py-1 bg-[#141414] border-b border-[#2A2A2A] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleElementClick('piano_roll', () => setActiveBottomTab('piano_roll'))}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${getHighlightClass('piano_roll')} ${
                activeBottomTab === 'piano_roll' ? 'bg-amber-500 text-black shadow-sm' : 'text-[#888] hover:text-white'
              }`}
            >
              {t('simulator.pianoRoll')}
            </button>
            <button
              onClick={() => handleElementClick('operator_osc', () => setActiveBottomTab('operator'))}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${getHighlightClass('operator_osc')} ${
                activeBottomTab === 'operator' ? 'bg-amber-500 text-black shadow-sm' : 'text-[#888] hover:text-white'
              }`}
            >
              {t('simulator.operator')}
            </button>
            <button
              onClick={() => handleElementClick('wavetable_pos', () => setActiveBottomTab('wavetable'))}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${getHighlightClass('wavetable_pos')} ${
                activeBottomTab === 'wavetable' ? 'bg-amber-500 text-black shadow-sm' : 'text-[#888] hover:text-white'
              }`}
            >
              {t('simulator.wavetable')}
            </button>
            <button
              onClick={() => handleElementClick('drum_rack_pad', () => setActiveBottomTab('drum_rack'))}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${getHighlightClass('drum_rack_pad')} ${
                activeBottomTab === 'drum_rack' ? 'bg-amber-500 text-black shadow-sm' : 'text-[#888] hover:text-white'
              }`}
            >
              {t('simulator.drumRack')}
            </button>
          </div>

          {/* Hover Info View Badge */}
          {currentHoveredInfo ? (
            <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'he' ? currentHoveredInfo.titleHe : currentHoveredInfo.title}</span>
            </div>
          ) : (
            <span className="text-[10px] text-[#666] font-mono">{t('simulator.shiftTabToggle')}</span>
          )}
        </div>

        {/* Sub-Simulator Display */}
        <div className="flex-1 p-2 overflow-y-auto">
          {activeBottomTab === 'piano_roll' && (
            <SubSimulatorPianoRoll
              isHighlighted={isTarget('piano_roll') || isTarget('piano_roll_draw')}
              onNoteDraw={() => onUserAction('piano_roll_draw')}
            />
          )}
          {activeBottomTab === 'operator' && (
            <SubSimulatorOperator
              isHighlighted={isTarget('operator_osc')}
              onParameterChange={(param, val) => onUserAction('operator_osc', val)}
            />
          )}
          {activeBottomTab === 'wavetable' && (
            <SubSimulatorWavetable
              isHighlighted={isTarget('wavetable_pos')}
              onParameterChange={(param, val) => onUserAction('wavetable_pos', val)}
            />
          )}
          {activeBottomTab === 'drum_rack' && (
            <SubSimulatorDrumRack
              isHighlighted={isTarget('drum_rack_pad')}
              onPadTrigger={(pad) => onUserAction('drum_rack_pad', pad)}
            />
          )}
        </div>
      </div>

      {/* "WHAT IS THIS?" AI EDUCATIONAL POPUP MODAL */}
      {selectedInfoModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border-2 border-amber-500/80 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-start">
            <div className="flex items-start justify-between border-b border-[#333] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {language === 'he' ? selectedInfoModal.info.titleHe : selectedInfoModal.info.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInfoModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg bg-[#2B2B2B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-gray-200">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold block text-[10px] uppercase">
                  {t('simulator.whatItDoes')}
                </span>
                <p>{language === 'he' ? selectedInfoModal.info.whatItDoesHe : selectedInfoModal.info.whatItDoes}</p>
              </div>

              <div className="p-3 bg-[#121212] border border-[#2B2B2B] rounded-xl space-y-1">
                <span className="text-cyan-400 font-bold block text-[10px] uppercase">
                  {t('simulator.whyItMatters')}
                </span>
                <p>{language === 'he' ? selectedInfoModal.info.whyItMattersHe : selectedInfoModal.info.whyItMatters}</p>
              </div>

              <div className="p-3 bg-[#121212] border border-[#2B2B2B] rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold block text-[10px] uppercase">
                  {t('simulator.beginnerTip')}
                </span>
                <p>{language === 'he' ? selectedInfoModal.info.tipHe : selectedInfoModal.info.tip}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedInfoModal(null)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {t('simulator.gotItReturn')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Sliders, CheckSquare, Square, Award, AlertCircle, Sparkles, ShieldAlert } from 'lucide-react';
import { AAMCProject } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MixAssistantViewProps {
  project: AAMCProject;
  onOpenCoachWithMessage: (msg: string) => void;
}

interface ChecklistItem {
  id: string;
  labelEn: string;
  labelHe: string;
  detailsEn: string;
  detailsHe: string;
  defaultChecked: boolean;
}

interface ChecklistGroup {
  category: 'Kick' | 'Bass' | 'Leads' | 'Drums' | 'Master';
  categoryHe: string;
  items: ChecklistItem[];
}

export const MixAssistantView: React.FC<MixAssistantViewProps> = ({
  project,
  onOpenCoachWithMessage,
}) => {
  const { t, language } = useLanguage();
  const isHe = language === 'he';

  const [checklist, setChecklist] = useState<ChecklistGroup[]>([
    {
      category: 'Kick',
      categoryHe: 'קיק (Kick)',
      items: [
        {
          id: 'k1',
          labelEn: 'Kick tuned to track fundamental key (e.g. F# = 46.25Hz)',
          labelHe: 'קיק מכוון למפתח הפונדמנטלי של הטראק (למשל F# = 46.25Hz)',
          detailsEn: 'Ensures sub frequencies harmonize with bass notes.',
          detailsHe: 'מבטיח שתדרֵי הסאב מתאימים בהרמוניה לצלילי הבאס.',
          defaultChecked: true,
        },
        {
          id: 'k2',
          labelEn: 'Kick duration contained under 180ms',
          labelHe: 'משך הקיק מוגבל מתחת ל-180ms',
          detailsEn: 'Prevents tail from colliding with 16th note offbeat bass.',
          detailsHe: 'מונע מהזנב להתנגש עם באס האופביט בצעד ה-16.',
          defaultChecked: true,
        },
        {
          id: 'k3',
          labelEn: 'Sub frequencies (below 100Hz) set to 100% Mono',
          labelHe: 'תדרֵי סאב (מתחת ל-100Hz) מוגדרים ל-100% מונו',
          detailsEn: 'Eliminates stereo phase cancellation on club subwoofers.',
          detailsHe: 'מבטל ביטול פאזה סטריאופוני בסאב וופרים של מועדונים.',
          defaultChecked: true,
        },
      ],
    },
    {
      category: 'Bass',
      categoryHe: 'באס (Bass)',
      items: [
        {
          id: 'b1',
          labelEn: 'Auto Filter sidechain ducking active from Kick C1',
          labelHe: 'Sidechain של Auto Filter פעיל מהקיק C1',
          detailsEn: 'Attenuates bass amplitude by 6-10dB when kick strikes.',
          detailsHe: 'מנחית את משרעת הבאס ב-6-10dB כשהקיק מכה.',
          defaultChecked: true,
        },
        {
          id: 'b2',
          labelEn: 'High pass filter set at 30Hz on sub bass',
          labelHe: 'מסנן High Pass מוגדר ב-30Hz על סאב באס',
          detailsEn: 'Removes useless ultra-low sub rumble below human hearing.',
          detailsHe: 'מסיר רשרוש סאב אולטרה-נמוך מיותר מתחת לסף השמיעה האנושית.',
          defaultChecked: true,
        },
        {
          id: 'b3',
          labelEn: 'Saw envelope decay set between 140ms and 170ms',
          labelHe: 'דעיכת מעטפת Saw מוגדרת בין 140ms ל-170ms',
          detailsEn: 'Maintains tight rolling rhythm drive without mud.',
          detailsHe: 'שומר על דחף קצב rolling הדוק ללא עכירות.',
          defaultChecked: false,
        },
      ],
    },
    {
      category: 'Leads',
      categoryHe: 'ליידים (Leads)',
      items: [
        {
          id: 'l1',
          labelEn: 'High pass filter set above 180Hz on all leads',
          labelHe: 'מסנן High Pass מעל 180Hz בכל הליידים',
          detailsEn: 'Prevents low-end energy from leaking into Kick & Bass domain.',
          detailsHe: 'מונע מזליגת אנרגיה בתדרים נמוכים לתחום הקיק והבאס.',
          defaultChecked: true,
        },
        {
          id: 'l2',
          labelEn: 'Resonant peaks notched around 3kHz - 4kHz',
          labelHe: 'פיקים תהודה מושחזים סביב 3kHz - 4kHz',
          detailsEn: 'Prevents ear fatigue on loud sound systems.',
          detailsHe: 'מונע עייפות שמע במערכות סאונד חזקות.',
          defaultChecked: false,
        },
        {
          id: 'l3',
          labelEn: 'Lead notes checked for scale lock',
          labelHe: 'תווים של לייד נבדקו להתאמה לסולם',
          detailsEn: 'Ensures no dissonant out-of-scale notes occur.',
          detailsHe: 'מוודא שאין תווים דיסוננטיים מחוץ לסולם.',
          defaultChecked: true,
        },
      ],
    },
    {
      category: 'Drums',
      categoryHe: 'תופים והייהאטס (Drums)',
      items: [
        {
          id: 'd1',
          labelEn: 'High hats high-pass filtered at 300Hz',
          labelHe: 'הייהאטס מסוננים ב-High Pass ב-300Hz',
          detailsEn: 'Cleans up lower-mid frequency space.',
          detailsHe: 'מנקה את מרחב התדרים הבינוניים-נמוכים.',
          defaultChecked: true,
        },
        {
          id: 'd2',
          labelEn: 'Open hat placed on offbeats (1.2, 2.2, 3.2, 4.2)',
          labelHe: 'הייהאט פתוח ממוקם באופביטים (1.2, 2.2, 3.2, 4.2)',
          detailsEn: 'Establishes primary groove drive.',
          detailsHe: 'מבסס את דחף הגרוב הראשי.',
          defaultChecked: true,
        },
        {
          id: 'd3',
          labelEn: 'Shakers and secondary hats panned 15-25% Left/Right',
          labelHe: 'שייקרים והייהאטס משניים ממוקמים ב-15-25% שמאל/ימין',
          detailsEn: 'Creates 3D stereo width around center kick/bass.',
          detailsHe: 'יוצר רוחב סטריאו תלת-ממדי סביב הקיק/באס המרכזי.',
          defaultChecked: false,
        },
      ],
    },
    {
      category: 'Master',
      categoryHe: 'מאסטר (Master)',
      items: [
        {
          id: 'm1',
          labelEn: 'Pre-master peak level has -3dB to -6dB headroom',
          labelHe: 'רמת השיא של הפרי-מאסטר כוללת Headroom של -3dB עד -6dB',
          detailsEn: 'Leaves clean headroom for mastering limiters.',
          detailsHe: 'משאיר מרווח נקי ללימיטרים של מאסטרינג.',
          defaultChecked: true,
        },
        {
          id: 'm2',
          labelEn: 'Master Utility has "Bass Mono" enabled at 120Hz',
          labelHe: 'ל-Master Utility יש Bass Mono מופעל ב-120Hz',
          detailsEn: 'Locks all low-end frequencies strictly to center.',
          detailsHe: 'נועל את כל תדרי הקצה הנמוך אך ורק למרכז.',
          defaultChecked: true,
        },
        {
          id: 'm3',
          labelEn: 'Track checked in Mono listening mode',
          labelHe: 'טראק נבדק במצב האזנה מונו',
          detailsEn: 'Verifies no lead or pad instruments cancel out in mono.',
          detailsHe: 'מוודא ששום כלי לייד או פאד אינו מתבטל במצב מונו.',
          defaultChecked: false,
        },
      ],
    },
  ]);

  const toggleItem = (catIdx: number, itemIdx: number) => {
    const copy = [...checklist];
    copy[catIdx].items[itemIdx].defaultChecked = !copy[catIdx].items[itemIdx].defaultChecked;
    setChecklist(copy);
  };

  let totalItems = 0;
  let checkedItems = 0;
  checklist.forEach((g) => {
    g.items.forEach((item) => {
      totalItems++;
      if (item.defaultChecked) checkedItems++;
    });
  });

  const mixScore = Math.round((checkedItems / totalItems) * 100);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="bg-[#181818] border border-[#333] p-5 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-[#90FF00]" />
            <h1 className="text-xl font-bold text-white">
              {t('mixAssistant.title')}
            </h1>
          </div>
          <p className="text-xs text-[#AAA] leading-relaxed">
            {t('mixAssistant.subtitle')}
          </p>
        </div>

        {/* Mix Readiness Score Badge */}
        <div className="bg-[#121212] border border-[#333] p-3.5 rounded-lg text-right min-w-[200px]">
          <span className="text-[10px] font-mono text-[#888] block uppercase">
            {t('mixAssistant.readinessScore')}
          </span>
          <span className={`text-2xl font-black font-mono ${mixScore >= 80 ? 'text-[#90FF00]' : 'text-[#E5A500]'}`}>
            {mixScore} / 100
          </span>
          <span className="text-[9px] font-mono text-[#666] block mt-0.5">
            {t('mixAssistant.heuristicEstimate')}
          </span>
        </div>
      </div>

      {/* Notice regarding heuristic estimation */}
      <div className="p-3 bg-[#121212] border-l-2 border-[#E5A500] rounded text-xs text-[#E5A500] flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>
          {t('mixAssistant.notice')}
        </span>
      </div>

      {/* Checklist Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {checklist.map((group, catIdx) => {
          const catKey = `mixAssistant.cat.${group.category.toLowerCase()}`;
          const translatedCat = t(catKey) !== catKey ? t(catKey) : (isHe ? group.categoryHe : group.category);
          return (
            <div key={group.category} className="bg-[#181818] border border-[#333] rounded-lg p-5 space-y-3">
              <h3 className="text-sm font-bold font-mono text-[#90FF00] uppercase border-b border-[#333] pb-2 flex items-center justify-between">
                <span>{translatedCat} {t('mixAssistant.checklistSuffix')}</span>
                <span className="text-xs text-[#888]">
                  {group.items.filter((i) => i.defaultChecked).length} / {group.items.length}
                </span>
              </h3>

              <div className="space-y-2.5">
                {group.items.map((item, itemIdx) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(catIdx, itemIdx)}
                    className={`p-3 rounded border text-xs transition-colors cursor-pointer flex items-start gap-3 ${
                      item.defaultChecked
                        ? 'bg-[#121212] border-[#90FF00]/40 text-white'
                        : 'bg-[#121212] border-[#2A2A2A] text-[#888]'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.defaultChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#90FF00]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#555]" />
                      )}
                    </div>
                    <div>
                      <strong className="block font-semibold">{isHe ? item.labelHe : item.labelEn}</strong>
                      <span className="text-[11px] text-[#888] font-sans leading-normal block mt-0.5">
                        {isHe ? item.detailsHe : item.detailsEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() =>
            onOpenCoachWithMessage(
              isHe
                ? `אני מכין את המיקסדאון שלי ב-Ableton Live 12 (${project.genre} ב-BPM ${project.bpm}). ציון המיקס שלי הוא ${mixScore}/100. תן לי צ'ק-ליסט שלב-אחר-שלב עבור שרשרת ה-Master bus.`
                : `I am preparing my mixdown in Ableton Live 12 (${project.genre} at ${project.bpm} BPM). My mix score is ${mixScore}/100. Give me a step-by-step master bus chain checklist.`
            )
          }
          className="px-5 py-2.5 bg-[#90FF00] hover:bg-[#a6ff26] text-black font-bold text-xs rounded shadow-lg transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {t('mixAssistant.askAiAudit')}
          </span>
        </button>
      </div>
    </div>
  );
};

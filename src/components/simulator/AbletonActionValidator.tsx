import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AbletonSimulatorState,
  AbletonLessonStep,
  SimulatorValidationResult,
  SimulatorActionType,
} from '../../types/abletonSimulator';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Info,
  Sliders,
  Music,
  Keyboard,
  MousePointer,
  RotateCcw,
} from 'lucide-react';
import { audioService } from '../../services/audioService';

/**
 * Validation logic engine for simulator student interactions
 */
export class AbletonActionValidatorEngine {
  public static validateStep(
    step: AbletonLessonStep,
    state: AbletonSimulatorState,
    actionType: SimulatorActionType,
    payload?: any
  ): SimulatorValidationResult {
    // 1. Custom step validation hook if defined
    if (step.validation) {
      return step.validation(state, payload);
    }

    // 2. Keyboard shortcut validation
    if (step.expectedAction === 'KEYBOARD_SHORTCUT') {
      const expectedShortcut = (step.expectedValue || '').toString().toLowerCase().trim();
      const pressedShortcut = (payload || actionType || '').toString().toLowerCase().trim();

      const isMidiTrackShortcut =
        step.targetId === 'create-midi-track' &&
        (pressedShortcut.includes('shift+t') ||
          pressedShortcut.includes('ctrl+shift+t') ||
          pressedShortcut.includes('cmd+shift+t') ||
          pressedShortcut.includes('meta+shift+t'));

      const isMidiClipShortcut =
        step.targetId === 'insert-midi-clip' &&
        (pressedShortcut.includes('shift+m') ||
          pressedShortcut.includes('ctrl+shift+m') ||
          pressedShortcut.includes('cmd+shift+m') ||
          pressedShortcut.includes('meta+shift+m'));

      if (
        pressedShortcut === expectedShortcut ||
        isMidiTrackShortcut ||
        isMidiClipShortcut ||
        actionType === 'KEYBOARD_SHORTCUT'
      ) {
        return {
          pass: true,
          message: {
            en: `✓ Correct shortcut pressed! (${step.expectedValue || 'Ctrl+Shift+T'})`,
            he: `✓ קיצור מקשים נכון! (${step.expectedValue || 'Ctrl+Shift+T'})`,
            es: `✓ ¡Atajo de teclado correcto! (${step.expectedValue || 'Ctrl+Shift+T'})`,
          },
          scoreBonus: 15,
        };
      }

      return {
        pass: false,
        message: {
          en: `Try again: Press the shortcut (${step.expectedValue || 'Ctrl+Shift+T'} / ⌘+Shift+T).`,
          he: `נסה שוב: לחץ על קיצור המקשים (${step.expectedValue || 'Ctrl+Shift+T'} / ⌘+Shift+T).`,
          es: `Intenta de nuevo: Presiona el atajo (${step.expectedValue || 'Ctrl+Shift+T'} / ⌘+Shift+T).`,
        },
      };
    }

    // 3. Action type mismatch check (with forgiving allowance for DRAG/CLICK on knobs)
    const isSliderOrKnob =
      (step.expectedAction === 'KNOB' || step.expectedAction === 'SLIDER') &&
      (actionType === 'KNOB' || actionType === 'SLIDER' || actionType === 'DRAG' || actionType === 'CLICK');

    if (actionType !== step.expectedAction && !isSliderOrKnob) {
      return {
        pass: false,
        message: {
          en: `Try again: Expected ${step.expectedAction.toLowerCase()} action, but got ${actionType.toLowerCase()}.`,
          he: `נסה שוב: נדרשת פעולת ${step.expectedAction.toLowerCase()}, אך בוצעה פעולת ${actionType.toLowerCase()}.`,
          es: `Intenta de nuevo: Se esperaba la acción ${step.expectedAction.toLowerCase()}, pero se realizó ${actionType.toLowerCase()}.`,
        },
      };
    }

    // 4. Tempo / BPM validation
    if (step.targetId === 'tempo-bpm' || (step.deviceTarget && step.deviceTarget.parameterName === 'bpm')) {
      const currentBpm = Math.round(state.bpm);
      const targetBpm = Math.round(Number(step.expectedValue || step.deviceTarget?.targetValue || 142));
      if (currentBpm === targetBpm) {
        return {
          pass: true,
          message: {
            en: `✓ Correct! BPM set to ${targetBpm}.`,
            he: `✓ נכון מאוד! ה-BPM הוגדר ל-${targetBpm}.`,
            es: `✓ ¡Correcto! BPM establecido en ${targetBpm}.`,
          },
          scoreBonus: 15,
        };
      }
      return {
        pass: false,
        message: {
          en: `Try again: BPM must be ${targetBpm} (currently ${currentBpm}).`,
          he: `נסה שוב: ה-BPM חייב להיות ${targetBpm} (כרגע ${currentBpm}).`,
          es: `Intenta de nuevo: El BPM debe ser ${targetBpm} (actualmente ${currentBpm}).`,
        },
      };
    }

    // 5. MIDI Track creation validation
    if (step.targetId === 'create-midi-track') {
      const hasMidiTrack = state.tracks.some((t) => t.type === 'midi');
      if (hasMidiTrack) {
        return {
          pass: true,
          message: {
            en: '✓ Correct! MIDI track created.',
            he: '✓ נכון מאוד! ערוץ ה-MIDI נוצר בהצלחה.',
            es: '✓ ¡Correcto! Pista MIDI creada.',
          },
          scoreBonus: 10,
        };
      }
      return {
        pass: false,
        message: {
          en: 'Try again: Create a new MIDI track in the arrangement or press Ctrl+Shift+T.',
          he: 'נסה שוב: צור ערוץ MIDI חדש בחלון ה-Arrangement או לחץ Ctrl+Shift+T.',
          es: 'Intenta de nuevo: Crea una nueva pista MIDI.',
        },
      };
    }

    // 6. Track selection validation
    if (step.targetId.startsWith('track-select-') || step.targetId === 'select-track-bass') {
      const targetTrackName = step.expectedValue || 'Bass';
      const selectedTrack = state.tracks.find((t) => t.id === state.selectedTrackId);
      if (selectedTrack && (selectedTrack.name.toLowerCase().includes(String(targetTrackName).toLowerCase()) || selectedTrack.id === step.expectedValue)) {
        return {
          pass: true,
          message: {
            en: `✓ Correct! "${selectedTrack.name}" selected.`,
            he: `✓ נכון מאוד! ערוץ "${selectedTrack.name}" נבחר.`,
            es: `✓ ¡Correcto! "${selectedTrack.name}" seleccionado.`,
          },
          scoreBonus: 10,
        };
      }
      return {
        pass: false,
        message: {
          en: `Try again: Select the ${targetTrackName} track.`,
          he: `נסה שוב: בחר את ערוץ ה-${targetTrackName}.`,
          es: `Intenta de nuevo: Selecciona la pista ${targetTrackName}.`,
        },
      };
    }

    // 7. Piano Roll MIDI Notes validation (Psytrance 16th rolling bass pattern)
    if (step.expectedPianoRollNotes && step.expectedPianoRollNotes.length > 0) {
      const currentNotes = state.pianoRollNotes || [];
      const requiredNotes = step.expectedPianoRollNotes;

      let matchedCount = 0;
      for (const req of requiredNotes) {
        const found = currentNotes.some((n) => {
          const pitchMatch = n.pitch.toUpperCase() === req.pitch.toUpperCase();
          const timeMatch = Math.abs(n.time - req.time) < 0.12;
          return pitchMatch && timeMatch;
        });
        if (found) matchedCount++;
      }

      if (matchedCount >= requiredNotes.length) {
        return {
          pass: true,
          message: {
            en: `✓ Correct! 16th rolling bassline placed perfectly (${matchedCount}/${requiredNotes.length} notes).`,
            he: `✓ נכון מאוד! תבנית ה-16th של הבס הוזנה בהצלחה (${matchedCount}/${requiredNotes.length} תווים).`,
            es: `✓ ¡Correcto! Patrón de bajo continuo colocado a la perfección.`,
          },
          scoreBonus: 25,
        };
      }

      return {
        pass: false,
        message: {
          en: `Try again: Bassline pattern requires ${requiredNotes.length} notes on the 16th grid (placed ${matchedCount}/${requiredNotes.length}).`,
          he: `נסה שוב: יש להזין ${requiredNotes.length} תווים בגריד 1/16 (כרגע הוזנו ${matchedCount}/${requiredNotes.length}).`,
          es: `Intenta de nuevo: El patrón requiere ${requiredNotes.length} notas en la cuadrícula 1/16 (${matchedCount}/${requiredNotes.length}).`,
        },
      };
    }

    // 8. Device parameter validation (Compressor Sidechain, Drift Filter, EQ Eight Low Cut)
    if (step.deviceTarget) {
      const { deviceType, parameterName, targetValue, tolerance = 0.15 } = step.deviceTarget;
      const deviceParams = state.deviceParameters?.[deviceType] || {};
      const currentVal = deviceParams[parameterName];

      if (typeof targetValue === 'boolean') {
        if (currentVal === targetValue) {
          return {
            pass: true,
            message: {
              en: `✓ Correct! ${parameterName} is now ${targetValue ? 'enabled' : 'disabled'}.`,
              he: `✓ נכון מאוד! ${parameterName} הוגדר ל-${targetValue ? 'פעיל' : 'כבוי'}.`,
              es: `✓ ¡Correcto! ${parameterName} está ahora ${targetValue ? 'activado' : 'desactivado'}.`,
            },
            scoreBonus: 10,
          };
        }
        return {
          pass: false,
          message: {
            en: `Try again: ${parameterName} must be ${targetValue ? 'enabled' : 'disabled'}.`,
            he: `נסה שוב: יש ${targetValue ? 'להפעיל' : 'לכבות'} את ${parameterName}.`,
            es: `Intenta de nuevo: ${parameterName} debe estar ${targetValue ? 'activado' : 'desactivado'}.`,
          },
        };
      }

      if (typeof targetValue === 'number') {
        const numCurrent = Number(currentVal ?? 0);
        const numTarget = Number(targetValue);
        const maxDelta = Math.max(2, Math.abs(numTarget * tolerance));

        if (Math.abs(numCurrent - numTarget) <= maxDelta) {
          return {
            pass: true,
            message: {
              en: `✓ Correct! ${parameterName} adjusted to target (${numCurrent} / target ${targetValue}).`,
              he: `✓ נכון מאוד! ${parameterName} כוונן לערך הרצוי (${numCurrent} / יעד ${targetValue}).`,
              es: `✓ ¡Correcto! ${parameterName} ajustado al objetivo (${numCurrent}).`,
            },
            scoreBonus: 15,
          };
        }

        return {
          pass: false,
          message: {
            en: `Try again: ${parameterName} must be ${targetValue} (currently ${numCurrent}).`,
            he: `נסה שוב: ${parameterName} חייב להיות ${targetValue} (כרגע ${numCurrent}).`,
            es: `Intenta de nuevo: ${parameterName} debe ser ${targetValue} (actualmente ${numCurrent}).`,
          },
        };
      }

      if (typeof targetValue === 'string') {
        if (String(currentVal).toLowerCase() === targetValue.toLowerCase()) {
          return {
            pass: true,
            message: {
              en: `✓ Correct! ${parameterName} set to "${targetValue}".`,
              he: `✓ נכון מאוד! ${parameterName} הוגדר ל-"${targetValue}".`,
              es: `✓ ¡Correcto! ${parameterName} establecido en "${targetValue}".`,
            },
            scoreBonus: 10,
          };
        }
        return {
          pass: false,
          message: {
            en: `Try again: ${parameterName} must be "${targetValue}" (currently "${currentVal || 'none'}").`,
            he: `נסה שוב: ${parameterName} חייב להיות "${targetValue}" (כרגע "${currentVal || 'ללא'}").`,
            es: `Intenta de nuevo: ${parameterName} debe ser "${targetValue}".`,
          },
        };
      }
    }

    // 9. Generic default pass for correct target interact
    return {
      pass: true,
      message: {
        en: '✓ Correct action performed!',
        he: '✓ הפעולה בוצעה בהצלחה!',
        es: '✓ ¡Acción realizada con éxito!',
      },
      scoreBonus: 10,
    };
  }
}

// Alias for backward compatibility
export const AbletonActionValidator = AbletonActionValidatorEngine;

interface AbletonActionValidatorProps {
  validationResult: SimulatorValidationResult | null;
  currentStep?: AbletonLessonStep;
  score?: number;
  learningMode?: string;
  lang?: string;
  isRTL?: boolean;
  onDismiss?: () => void;
  onShowHint?: () => void;
}

/**
 * Visual Real-Time Feedback Component
 */
export const AbletonActionValidatorFeedback: React.FC<AbletonActionValidatorProps> = ({
  validationResult,
  currentStep,
  score = 0,
  learningMode = 'guided',
  lang = 'he',
  isRTL = false,
  onDismiss,
  onShowHint,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (validationResult) {
      setIsVisible(true);
      // Play audio cue
      try {
        if (validationResult.pass) {
          audioService.playClick();
        }
      } catch (e) {
        // audio cue fallback
      }

      // Auto-hide error toast after 4.5 seconds if not dismissed
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, validationResult.pass ? 2200 : 4500);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [validationResult]);

  if (!validationResult || !isVisible) return null;

  const isPass = validationResult.pass;
  const messageText =
    validationResult.message[lang] ||
    validationResult.message.he ||
    validationResult.message.en ||
    '';

  const whyText = currentStep?.why
    ? currentStep.why[lang] || currentStep.why.he || currentStep.why.en
    : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`pointer-events-auto shadow-2xl rounded-lg p-3.5 border text-xs font-sans max-w-md w-full backdrop-blur-md transition-all ${
          isPass
            ? 'bg-[#101E12]/95 border-[#90FF00]/60 text-emerald-100 shadow-[0_4px_24px_rgba(144,255,0,0.25)]'
            : 'bg-[#221014]/95 border-[#FF5555]/60 text-rose-100 shadow-[0_4px_24px_rgba(255,85,85,0.25)]'
        }`}
      >
        {/* Top Status Header */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {isPass ? (
              <div className="w-6 h-6 rounded-full bg-[#90FF00] text-black flex items-center justify-center shrink-0 font-bold">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#FF5555] text-white flex items-center justify-center shrink-0 font-bold">
                <XCircle className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}
            <div>
              <div className="font-mono font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className={isPass ? 'text-[#90FF00]' : 'text-[#FF7777]'}>
                  {isPass
                    ? lang === 'he'
                      ? 'ביצוע מדויק!'
                      : 'Correct Action!'
                    : lang === 'he'
                    ? 'נסה שוב'
                    : 'Action Needed'}
                </span>
                {isPass && validationResult.scoreBonus && (
                  <span className="px-1.5 py-0.2 rounded bg-[#90FF00]/20 text-[#90FF00] text-[10px] font-mono font-bold">
                    +{validationResult.scoreBonus} pts
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold mt-0.5 leading-snug">
                {messageText}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer shrink-0"
            title="Dismiss feedback"
          >
            ✕
          </button>
        </div>

        {/* Why this matters / Producer insight tag */}
        {isPass && whyText && (
          <div className="mt-2 pt-2 border-t border-emerald-900/60 text-[11px] text-emerald-300/90 flex items-start gap-1.5 font-normal">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE853] shrink-0 mt-0.5" />
            <span>{whyText}</span>
          </div>
        )}

        {/* In case of error: Hint suggestion button */}
        {!isPass && onShowHint && (
          <div className="mt-2.5 pt-2 border-t border-rose-900/60 flex items-center justify-between gap-2">
            <span className="text-[10px] text-rose-300/80">
              {lang === 'he'
                ? 'זקוק לעזרה בביצוע הפעולה?'
                : 'Need guidance to solve this?'}
            </span>
            <button
              onClick={() => {
                onShowHint();
                setIsVisible(false);
              }}
              className="px-2 py-0.5 rounded bg-[#FF5555]/20 hover:bg-[#FF5555]/30 border border-[#FF5555]/50 text-rose-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'he' ? 'הצג רמז' : 'Show Hint'}</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

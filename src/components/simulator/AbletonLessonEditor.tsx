import React, { useState, useRef } from 'react';
import {
  AbletonLessonDefinition,
  AbletonLessonStep,
  NormalizedRect,
  SimulatorActionType,
} from '../../types/abletonSimulator';
import {
  Upload,
  Plus,
  Trash2,
  Save,
  Crosshair,
  Grid,
  Maximize2,
  Check,
  HelpCircle,
  Eye,
  Sliders,
} from 'lucide-react';
import { visualCoachStorageService } from '../../services/visualCoachStorageService';

interface AbletonLessonEditorProps {
  onSaveLesson: (lesson: AbletonLessonDefinition) => void;
  onClose: () => void;
  lang?: string;
  isRTL?: boolean;
}

export const AbletonLessonEditor: React.FC<AbletonLessonEditorProps> = ({
  onSaveLesson,
  onClose,
  lang = 'he',
  isRTL = false,
}) => {
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const [lessonTitleHe, setLessonTitleHe] = useState('שיעור Ableton מותאם אישית');
  const [lessonTitleEn, setLessonTitleEn] = useState('Custom Ableton Live 12 Lesson');
  const [genre, setGenre] = useState<any>('Psytrance');
  const [category, setCategory] = useState<any>('psytrance');
  const [difficulty, setDifficulty] = useState<any>('Beginner');

  // Step Creation State
  const [steps, setSteps] = useState<AbletonLessonStep[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Calibration and Coordinate Box Selection
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<NormalizedRect>({
    x: 0.1,
    y: 0.1,
    width: 0.2,
    height: 0.1,
  });

  const [stepTargetId, setStepTargetId] = useState<string>('compressor-threshold');
  const [stepActionType, setStepActionType] = useState<SimulatorActionType>('CLICK');
  const [stepInstructionHe, setStepInstructionHe] = useState<string>('לחץ על ה-BPM והגדר ל-142');
  const [stepInstructionEn, setStepInstructionEn] = useState<string>('Click the BPM and set to 142');
  const [stepExpectedVal, setStepExpectedVal] = useState<string>('142');
  const [showGrid, setShowGrid] = useState<boolean>(true);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setScreenshotUri(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const bounds = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (e.clientY - bounds.top) / bounds.height));

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentRect({ x, y, width: 0.05, height: 0.05 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPos || !canvasRef.current) return;
    const bounds = canvasRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
    const currentY = Math.max(0, Math.min(1, (e.clientY - bounds.top) / bounds.height));

    const x = Math.min(startPos.x, currentX);
    const y = Math.min(startPos.y, currentY);
    const width = Math.max(0.02, Math.abs(currentX - startPos.x));
    const height = Math.max(0.02, Math.abs(currentY - startPos.y));

    setCurrentRect({ x, y, width, height });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setStartPos(null);
  };

  const handleAddStep = () => {
    const newStep: AbletonLessonStep = {
      id: steps.length + 1,
      title: {
        en: `Step ${steps.length + 1}`,
        he: `שלב ${steps.length + 1}`,
      },
      instruction: {
        en: stepInstructionEn,
        he: stepInstructionHe,
      },
      why: {
        en: 'Crucial step for proper Ableton workflow.',
        he: 'שלב מהותי לשליטה בזרימת העבודה ב-Ableton Live 12.',
      },
      hint: {
        en: 'Follow the highlighted area.',
        he: 'הבט באזור המסומן.',
      },
      exactAction: {
        en: `${stepActionType} on target`,
        he: `בצע פעולת ${stepActionType}`,
      },
      targetId: stepTargetId,
      targetRect: { ...currentRect },
      expectedAction: stepActionType,
      expectedValue: stepExpectedVal,
      arrowDirection: 'down',
    };

    setSteps([...steps, newStep]);
    setActiveStepIndex(steps.length);
  };

  const handleSaveAll = () => {
    const customLesson: AbletonLessonDefinition = {
      id: `custom-sim-lesson-${Date.now()}`,
      category,
      title: {
        en: lessonTitleEn,
        he: lessonTitleHe,
      },
      description: {
        en: 'User calibrated Ableton Live 12 visual lesson',
        he: 'שיעור ויזואלי מותאם שנוצר על גבי צילום מסך של Ableton Live 12',
      },
      genre,
      difficulty,
      screenshotKey: 'custom-uploaded',
      screenshotUri: screenshotUri || undefined,
      initialState: {
        bpm: 142,
        viewMode: 'arrangement',
      },
      steps: steps.length > 0 ? steps : [
        {
          id: 1,
          title: { en: 'Step 1', he: 'שלב 1' },
          instruction: { en: stepInstructionEn, he: stepInstructionHe },
          why: { en: 'Why', he: 'הסבר' },
          hint: { en: 'Hint', he: 'רמז' },
          exactAction: { en: 'Action', he: 'פעולה' },
          targetId: stepTargetId,
          targetRect: currentRect,
          expectedAction: stepActionType,
          expectedValue: stepExpectedVal,
        },
      ],
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    onSaveLesson(customLesson);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 text-gray-200 select-none font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#303030] text-sm">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-[#FFE853]" />
          <span className="font-bold font-mono text-[#FFE853] text-base">
            ABLETON LIVE 12 SCREENSHOT CALIBRATOR & LESSON EDITOR
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
              showGrid ? 'bg-[#FFE853] text-black font-bold' : 'bg-[#2A2A2A] text-gray-300'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid Overlay</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-[#2A2A2A] hover:bg-[#3A3A3A] text-gray-300 text-xs font-mono cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            className="px-4 py-1.5 rounded bg-[#FFE853] hover:bg-[#FFF080] text-black font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Custom Lesson</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Canvas / Right Step Controls */}
      <div className="flex-1 flex gap-4 min-h-0 pt-3">
        {/* Left: Interactive Calibration Canvas */}
        <div className="flex-1 bg-[#161616] border border-[#2E2E2E] rounded-lg overflow-hidden flex flex-col relative">
          <div className="h-9 px-3 bg-[#202020] border-b border-[#2C2C2C] flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">
              Drag mouse across screenshot to define target normalized bounding box
            </span>
            <div className="flex items-center gap-3 text-[#FFE853]">
              <span>X: {(currentRect.x * 100).toFixed(1)}%</span>
              <span>Y: {(currentRect.y * 100).toFixed(1)}%</span>
              <span>W: {(currentRect.width * 100).toFixed(1)}%</span>
              <span>H: {(currentRect.height * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="flex-1 relative overflow-hidden flex items-center justify-center cursor-crosshair bg-[#121212]"
          >
            {screenshotUri ? (
              <img
                src={screenshotUri}
                alt="Ableton Live Calibration"
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Upload className="w-12 h-12 stroke-1 text-gray-600" />
                <span className="text-sm font-mono">Upload Ableton Live 12 Screenshot (PNG / JPG / WEBP)</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded bg-[#FFE853] text-black font-bold text-xs font-mono cursor-pointer"
                >
                  Choose Screenshot File
                </button>
              </div>
            )}

            {/* Coordinate Grid Lines */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-10 grid-rows-10 border border-white/5 divide-x divide-y divide-white/5" />
            )}

            {/* Selected Hotspot Box */}
            {screenshotUri && (
              <div
                style={{
                  position: 'absolute',
                  left: `${currentRect.x * 100}%`,
                  top: `${currentRect.y * 100}%`,
                  width: `${currentRect.width * 100}%`,
                  height: `${currentRect.height * 100}%`,
                }}
                className="border-2 border-[#FFE853] bg-[#FFE853]/25 shadow-[0_0_12px_rgba(255,232,83,0.5)] pointer-events-none flex items-center justify-center text-black font-mono font-bold text-xs"
              >
                TARGET REGION
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Right: Step Calibration & Metadata Panel */}
        <div className="w-96 bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-3 flex flex-col gap-3 overflow-y-auto min-h-0 text-xs">
          <div className="font-mono text-[#FFE853] font-bold border-b border-[#2C2C2C] pb-1.5">
            LESSON PROPERTIES
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[11px] text-gray-400 font-mono mb-1">Title (Hebrew):</label>
              <input
                type="text"
                value={lessonTitleHe}
                onChange={(e) => setLessonTitleHe(e.target.value)}
                className="w-full bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-gray-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 font-mono mb-1">Title (English):</label>
              <input
                type="text"
                value={lessonTitleEn}
                onChange={(e) => setLessonTitleEn(e.target.value)}
                className="w-full bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-gray-100 font-mono"
              />
            </div>
          </div>

          <div className="font-mono text-[#FFE853] font-bold border-b border-[#2C2C2C] pb-1.5 pt-2">
            ADD STEP CALIBRATION
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] text-gray-400 font-mono mb-1">Target ID (e.g. tempo-control):</label>
              <input
                type="text"
                value={stepTargetId}
                onChange={(e) => setStepTargetId(e.target.value)}
                className="w-full bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-gray-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 font-mono mb-1">Expected Action:</label>
              <select
                value={stepActionType}
                onChange={(e) => setStepActionType(e.target.value as SimulatorActionType)}
                className="w-full bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-[#FFE853] font-mono cursor-pointer"
              >
                <option value="CLICK">CLICK</option>
                <option value="DOUBLE_CLICK">DOUBLE_CLICK</option>
                <option value="SLIDER">SLIDER</option>
                <option value="KNOB">KNOB</option>
                <option value="MIDI_NOTE">MIDI_NOTE</option>
                <option value="TOGGLE">TOGGLE</option>
                <option value="SELECT">SELECT</option>
                <option value="TYPE">TYPE</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 font-mono mb-1">Instruction (Hebrew):</label>
              <textarea
                value={stepInstructionHe}
                onChange={(e) => setStepInstructionHe(e.target.value)}
                rows={2}
                className="w-full bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-gray-100 font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 font-mono mb-1">Instruction (English):</label>
              <textarea
                value={stepInstructionEn}
                onChange={(e) => setStepInstructionEn(e.target.value)}
                rows={2}
                className="w-full bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-gray-100 font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 font-mono mb-1">Expected Value / Validation:</label>
              <input
                type="text"
                value={stepExpectedVal}
                onChange={(e) => setStepExpectedVal(e.target.value)}
                className="w-full bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-gray-100 font-mono"
              />
            </div>

            <button
              onClick={handleAddStep}
              className="w-full py-2 rounded bg-[#333] hover:bg-[#444] text-[#FFE853] font-bold font-mono flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Step ({steps.length + 1})</span>
            </button>
          </div>

          {/* List of Defined Steps */}
          {steps.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[#2C2C2C]">
              <span className="text-[10px] text-gray-400 font-mono">DEFINED STEPS:</span>
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-[#222] border border-[#333] flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#FFE853] text-black font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-gray-200">{s.targetId} [{s.expectedAction}]</span>
                  </div>
                  <button
                    onClick={() => setSteps(steps.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

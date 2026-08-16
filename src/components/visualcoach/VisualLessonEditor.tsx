import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Save,
  Sparkles,
  Layers,
  Eye,
  ArrowRight,
  HelpCircle,
  CheckCircle,
  FileJson,
  Download,
  FolderOpen,
  Image as ImageIcon,
  Copy,
  ChevronRight,
  ChevronLeft,
  Move,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  MousePointer,
  Square,
  Circle,
  Navigation,
  Hash,
  MessageSquare,
  Crosshair,
  MapPin,
  X,
} from 'lucide-react';
import {
  VisualLesson,
  VisualLessonStep,
  ScreenAnnotation,
  AnnotationType,
  AnnotationColor,
  ArrowDirection,
  VisualLessonCategory,
  UserUploadedImage,
} from '../../types/visualLesson';
import { InstructionalImageRenderer } from './InstructionalImageRenderer';
import { visualLessonAiService } from '../../services/visualLessonAiService';
import { visualCoachStorageService } from '../../services/visualCoachStorageService';
import { AAMCProject, GenreType } from '../../types';
import { Language } from '../../i18n/types';

interface VisualLessonEditorProps {
  initialLesson?: VisualLesson | null;
  project?: AAMCProject;
  language?: Language;
  onSaveLesson: (lesson: VisualLesson) => void;
  onClose: () => void;
}

const BUNDLED_DIAGRAM_PRESETS = [
  { key: 'waveform_kick_bass', name: 'Kick & Bass Phase Waveform' },
  { key: 'waveform_kick', name: 'Kick Drum Transient & Body' },
  { key: 'compressor_ui', name: 'Hardware / Plugin Compressor' },
  { key: 'eq_spectrum', name: 'Parametric EQ (20Hz - 20kHz)' },
  { key: 'piano_roll_bass', name: 'MIDI Piano Roll 16ths' },
  { key: 'synth_signal_flow', name: 'Synth Signal Flow (Osc -> Filter -> Amp)' },
  { key: 'drum_pattern_grid', name: '16-Step Drum Grid' },
  { key: 'arrangement_timeline', name: 'Arrangement & Energy Map' },
  { key: '303_acid_pattern', name: 'TB-303 Acid Pattern & Filter' },
];

export const VisualLessonEditor: React.FC<VisualLessonEditorProps> = ({
  initialLesson,
  project,
  language = 'he',
  onSaveLesson,
  onClose,
}) => {
  const isHe = language === 'he';

  // Lesson Metadata state
  const [lessonTitleHe, setLessonTitleHe] = useState<string>(
    initialLesson?.title.he || 'שיעור חזותי חדש'
  );
  const [lessonTitleEn, setLessonTitleEn] = useState<string>(
    initialLesson?.title.en || 'New Visual Lesson'
  );
  const [category, setCategory] = useState<VisualLessonCategory>(
    initialLesson?.category || 'psytrance'
  );
  const [genre, setGenre] = useState<GenreType>(
    initialLesson?.genre || project?.genre || 'Psytrance'
  );
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    initialLesson?.difficulty || 'Intermediate'
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(
    initialLesson?.estimatedMinutes || 8
  );

  // Steps
  const [steps, setSteps] = useState<VisualLessonStep[]>(
    initialLesson?.steps && initialLesson.steps.length > 0
      ? initialLesson.steps
      : [
          {
            id: 1,
            title: { he: 'שלב 1: זיהוי השליטה והפרמטר', en: 'Step 1: Identify Control' },
            instruction: {
              he: 'התבונן בתמונה ואתר את הפרמטר המרכזי.',
              en: 'Observe the image and locate the primary parameter.',
            },
            why: {
              he: 'שליטה מדויקת מאפשרת עיצוב סאונד מקצועי ללא עיוותים.',
              en: 'Precise control enables professional sound shaping without distortion.',
            },
            exactAction: { he: 'כוון את הערך למיקום הרצוי', en: 'Set value to target position' },
            expectedResult: { he: 'הסאונד מגיב מיד לשינוי', en: 'Sound immediately reflects the change' },
            defaultImageKey: 'compressor_ui',
            annotations: [
              {
                id: 'ann-1',
                type: 'spotlight',
                x: 0.15,
                y: 0.35,
                width: 0.22,
                height: 0.3,
                color: 'lime',
                label: { he: 'פרמטר מרכזי', en: 'Main Parameter' },
                description: { he: 'כאן מבוצע הכיוונון הראשי', en: 'Primary adjustment happens here' },
              },
            ],
          },
        ]
  );

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const currentStep = steps[activeStepIndex] || steps[0];

  // Interactive Canvas Drawing & Dragging State
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Selected annotation to edit
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(
    currentStep?.annotations[0]?.id || null
  );

  // Dragging existing annotation
  const [draggingAnnId, setDraggingAnnId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resizing existing annotation
  const [resizingAnnId, setResizingAnnId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  // Drawing tool selection
  const [selectedTool, setSelectedTool] = useState<AnnotationType>('rectangle');
  const [selectedColor, setSelectedColor] = useState<AnnotationColor>('lime');
  const [arrowDirection, setArrowDirection] = useState<ArrowDirection>('right');

  // AI Assist State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Available user uploaded images from storage/project
  const [availableImages, setAvailableImages] = useState<UserUploadedImage[]>([]);

  useEffect(() => {
    const local = visualCoachStorageService.getUploadedImages();
    const projImgs = project?.projectImages || [];
    const map = new Map<string, UserUploadedImage>();
    projImgs.forEach((img) => map.set(img.id, img));
    local.forEach((img) => map.set(img.id, img));
    setAvailableImages(Array.from(map.values()));
  }, [project]);

  // Keep selected annotation in sync when switching steps
  useEffect(() => {
    if (currentStep?.annotations && currentStep.annotations.length > 0) {
      if (!currentStep.annotations.some((a) => a.id === selectedAnnId)) {
        setSelectedAnnId(currentStep.annotations[0].id);
      }
    } else {
      setSelectedAnnId(null);
    }
  }, [activeStepIndex]);

  // File Upload Handler (drag & drop / input)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      const newImg: UserUploadedImage = {
        id: `img_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        uri: dataUri,
        type: file.type,
        width: 1280,
        height: 720,
        uploadedAt: new Date().toISOString(),
        sizeBytes: file.size,
      };
      visualCoachStorageService.saveUploadedImage(newImg);
      setAvailableImages((prev) => [newImg, ...prev]);

      updateCurrentStep({
        imageUri: dataUri,
        customImageUri: dataUri,
        imageType: 'uploaded',
      });
    };
    reader.readAsDataURL(file);
  };

  const updateCurrentStep = (updates: Partial<VisualLessonStep>) => {
    setSteps((prev) => {
      const updated = [...prev];
      updated[activeStepIndex] = { ...updated[activeStepIndex], ...updates };
      return updated;
    });
  };

  // Add Step
  const handleAddStep = () => {
    const newStepId = steps.length + 1;
    const newStep: VisualLessonStep = {
      id: newStepId,
      title: { he: `שלב ${newStepId}`, en: `Step ${newStepId}` },
      instruction: {
        he: 'כוונן את הפרמטר המסומן בהתאם להנחיות.',
        en: 'Adjust the highlighted parameter according to instructions.',
      },
      why: {
        he: 'מבטיח תוצאה מקצועית ואיזון הרמוני מירבי.',
        en: 'Ensures professional clarity and maximum harmonic balance.',
      },
      exactAction: { he: 'כוונן לערך המומלץ', en: 'Set to recommended value' },
      expectedResult: { he: 'צליל יציב, שקוף ומדויק', en: 'Clean, transparent sound' },
      defaultImageKey: currentStep.defaultImageKey,
      imageUri: currentStep.imageUri,
      customImageUri: currentStep.customImageUri,
      imageType: currentStep.imageType,
      annotations: [
        {
          id: `ann-${Date.now()}`,
          type: 'spotlight',
          x: 0.35,
          y: 0.35,
          width: 0.25,
          height: 0.25,
          color: 'lime',
          label: { he: `פרמטר ${newStepId}`, en: `Parameter ${newStepId}` },
        },
      ],
    };
    setSteps([...steps, newStep]);
    setActiveStepIndex(steps.length);
  };

  // Duplicate Step
  const handleDuplicateStep = () => {
    const newStep: VisualLessonStep = {
      ...JSON.parse(JSON.stringify(currentStep)),
      id: steps.length + 1,
      title: {
        he: `${currentStep.title.he} (העתק)`,
        en: `${currentStep.title.en} (Copy)`,
      },
    };
    setSteps([...steps, newStep]);
    setActiveStepIndex(steps.length);
  };

  // Delete Step
  const handleDeleteStep = (index: number) => {
    if (steps.length <= 1) return;
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
    setActiveStepIndex(Math.max(0, activeStepIndex - 1));
  };

  // Canvas Mouse Events for drawing normalized annotations
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setIsDrawing(true);
    setDrawStart({ x, y });
    setCurrentBox({ x, y, width: 0.05, height: 0.05 });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const currentY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Case 1: Dragging existing annotation
    if (draggingAnnId) {
      const updated = currentStep.annotations.map((a) => {
        if (a.id === draggingAnnId) {
          const newX = Math.max(0, Math.min(1 - (a.width || 0.1), currentX - dragOffset.x));
          const newY = Math.max(0, Math.min(1 - (a.height || 0.1), currentY - dragOffset.y));
          return {
            ...a,
            x: Number(newX.toFixed(3)),
            y: Number(newY.toFixed(3)),
          };
        }
        return a;
      });
      updateCurrentStep({ annotations: updated });
      return;
    }

    // Case 2: Resizing existing annotation
    if (resizingAnnId) {
      const updated = currentStep.annotations.map((a) => {
        if (a.id === resizingAnnId) {
          const newW = Math.max(0.04, Math.min(1 - a.x, currentX - a.x));
          const newH = Math.max(0.04, Math.min(1 - a.y, currentY - a.y));
          return {
            ...a,
            width: Number(newW.toFixed(3)),
            height: Number(newH.toFixed(3)),
          };
        }
        return a;
      });
      updateCurrentStep({ annotations: updated });
      return;
    }

    // Case 3: Drawing new annotation
    if (isDrawing && drawStart) {
      const left = Math.min(drawStart.x, currentX);
      const top = Math.min(drawStart.y, currentY);
      const width = Math.abs(currentX - drawStart.x);
      const height = Math.abs(currentY - drawStart.y);

      setCurrentBox({ x: left, y: top, width, height });
    }
  };

  const handleCanvasMouseUp = () => {
    if (draggingAnnId) {
      setDraggingAnnId(null);
      return;
    }
    if (resizingAnnId) {
      setResizingAnnId(null);
      return;
    }

    if (!isDrawing || !currentBox) {
      setIsDrawing(false);
      return;
    }

    // Create new annotation from drawn box
    const newAnn: ScreenAnnotation = {
      id: `ann-${Date.now()}`,
      type: selectedTool,
      x: Number(currentBox.x.toFixed(3)),
      y: Number(currentBox.y.toFixed(3)),
      width: Number(Math.max(0.05, currentBox.width).toFixed(3)),
      height: Number(Math.max(0.05, currentBox.height).toFixed(3)),
      color: selectedColor,
      direction: selectedTool === 'arrow' ? arrowDirection : undefined,
      label: {
        he: `סימון ${currentStep.annotations.length + 1}`,
        en: `Marker ${currentStep.annotations.length + 1}`,
      },
      description: {
        he: 'לחץ לעריכת ההסבר המפורט לתלמיד',
        en: 'Click to edit detailed instructions',
      },
      markerNumber: currentStep.annotations.length + 1,
    };

    updateCurrentStep({
      annotations: [...currentStep.annotations, newAnn],
    });

    setSelectedAnnId(newAnn.id);
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentBox(null);
  };

  // AI-Assisted Annotation Action ("AI עזור לי לסמן")
  const handleAiAssist = async () => {
    setIsAiLoading(true);
    setAiMessage(null);
    try {
      const res = await visualLessonAiService.suggestAnnotationsForImage(
        currentStep.imageUri || currentStep.defaultImageKey,
        currentStep.title.he || 'Diagram',
        currentStep.instruction.he,
        language
      );

      if (res.annotations && res.annotations.length > 0) {
        updateCurrentStep({
          annotations: res.annotations,
        });
        setSelectedAnnId(res.annotations[0].id);
      }
      setAiMessage(res.message);
    } catch {
      setAiMessage(isHe ? 'שגיאה בניתוח AI' : 'AI analysis error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Save Lesson
  const handleSave = () => {
    const finalLesson: VisualLesson = {
      id: initialLesson?.id || `custom-lesson-${Date.now()}`,
      courseId: category,
      category,
      title: { he: lessonTitleHe, en: lessonTitleEn },
      description: {
        he: `שיעור חזותי בעיצוב אישי: ${lessonTitleHe}`,
        en: `Custom visual lesson: ${lessonTitleEn}`,
      },
      genre,
      difficulty,
      estimatedMinutes: Math.max(3, estimatedMinutes || steps.length * 2),
      tags: ['Custom', genre, 'Visual Coach'],
      steps,
      isCustom: true,
      createdAt: initialLesson?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    visualCoachStorageService.saveCustomLesson(finalLesson);
    onSaveLesson(finalLesson);
  };

  // Export JSON
  const handleExportJson = () => {
    const finalLesson: VisualLesson = {
      id: initialLesson?.id || `custom-lesson-${Date.now()}`,
      courseId: category,
      category,
      title: { he: lessonTitleHe, en: lessonTitleEn },
      description: {
        he: `שיעור חזותי בעיצוב אישי: ${lessonTitleHe}`,
        en: `Custom visual lesson: ${lessonTitleEn}`,
      },
      genre,
      difficulty,
      estimatedMinutes: Math.max(3, estimatedMinutes || steps.length * 2),
      tags: ['Custom', genre, 'Visual Coach'],
      steps,
      isCustom: true,
      createdAt: initialLesson?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(finalLesson, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `visual_lesson_${Date.now()}.json`);
    dlAnchor.click();
  };

  const selectedAnnotation = currentStep.annotations.find((a) => a.id === selectedAnnId);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#07090D]/95 backdrop-blur-xl flex flex-col overflow-hidden text-white font-sans"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* ------------------------------------------------------------- */}
      {/* HEADER BAR */}
      {/* ------------------------------------------------------------- */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#0E121A] border-b border-[#202736] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/20 border border-[#00E5FF] flex items-center justify-center text-[#00E5FF]">
            <Layers size={18} />
          </div>
          <div>
            <div className="text-sm font-black flex items-center gap-2">
              <span>{isHe ? 'סטודיו עורך שיעורים חזותיים' : 'Visual Lesson Studio & Editor'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#90FF00]/20 text-[#90FF00] font-bold border border-[#90FF00]/30">
                PRO ENGINE
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              {isHe
                ? 'הוסף, ערוך ומחק סימונים אינטראקטיביים וחבר אותם ישירות לשלבי ההוראה'
                : 'Add, edit, delete annotations and link them seamlessly to step-by-step instructions'}
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg bg-[#181F2C] border border-[#2B3547] text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            <span>{isHe ? 'ייצוא JSON' : 'Export JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-[#90FF00] hover:bg-[#A6FF2E] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(144,255,0,0.3)] transition-all"
          >
            <Save size={14} />
            <span>{isHe ? 'שמור שיעור' : 'Save Lesson'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#181F2C] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* TOP CONFIGURATION BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="px-6 py-2 bg-[#0A0D12] border-b border-[#1A212E] flex items-center gap-4 text-xs shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-bold whitespace-nowrap">{isHe ? 'שם השיעור:' : 'Lesson Title:'}</span>
          <input
            type="text"
            value={lessonTitleHe}
            onChange={(e) => setLessonTitleHe(e.target.value)}
            placeholder="כותרת בעברית"
            className="px-2.5 py-1 rounded bg-[#161B22] border border-[#252E3E] text-white text-xs outline-none focus:border-[#90FF00] w-48"
          />
          <input
            type="text"
            value={lessonTitleEn}
            onChange={(e) => setLessonTitleEn(e.target.value)}
            placeholder="Title in English"
            className="px-2.5 py-1 rounded bg-[#161B22] border border-[#252E3E] text-white text-xs outline-none focus:border-[#00E5FF] w-48"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-bold whitespace-nowrap">{isHe ? 'קטגוריה:' : 'Category:'}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as VisualLessonCategory)}
            className="px-2.5 py-1 rounded bg-[#161B22] border border-[#252E3E] text-white text-xs outline-none"
          >
            <option value="psytrance">Psytrance</option>
            <option value="goa">Goa Trance</option>
            <option value="techno">Techno</option>
            <option value="melodic-techno">Melodic Techno</option>
            <option value="sound-design">Sound Design</option>
            <option value="mixing">Mixing & Master</option>
            <option value="beginner">Beginner Fast-Track</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-bold whitespace-nowrap">{isHe ? 'רמה:' : 'Difficulty:'}</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="px-2.5 py-1 rounded bg-[#161B22] border border-[#252E3E] text-white text-xs outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN TWO-COLUMN WORKSPACE */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT/CENTER COLUMN: INTERACTIVE CANVAS & DRAWING TOOLS (65%) */}
        <div className="flex-1 flex flex-col bg-[#0A0C10] border-inline-end border-[#1B222F] overflow-hidden p-4 min-w-0">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between mb-3 px-3 py-2 bg-[#121620] rounded-xl border border-[#232C3D] gap-2 flex-wrap shrink-0">
            {/* Tool Selection */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-400 font-bold margin-inline-end-1">
                {isHe ? 'כלי סימון:' : 'Tool:'}
              </span>
              {(
                [
                  { id: 'rectangle', label: 'מלבן', icon: Square },
                  { id: 'spotlight', label: 'זרקור', icon: Eye },
                  { id: 'circle', label: 'עיגול', icon: Circle },
                  { id: 'arrow', label: 'חץ', icon: Navigation },
                  { id: 'pointer', label: 'מטרה', icon: Crosshair },
                  { id: 'number', label: 'מספר', icon: Hash },
                  { id: 'textBubble', label: 'בלון מלל', icon: MessageSquare },
                  { id: 'region', label: 'איזור', icon: MapPin },
                ] as const
              ).map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setSelectedTool(tool.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedTool === tool.id
                        ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_#00E5FF]'
                        : 'bg-[#181F2C] text-gray-300 hover:text-white'
                    }`}
                  >
                    <IconComponent size={12} />
                    <span>{isHe ? tool.label : tool.id}</span>
                  </button>
                );
              })}
            </div>

            {/* Color Selection & AI Assist Button */}
            <div className="flex items-center gap-3">
              {selectedTool === 'arrow' && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-400 text-[11px] font-bold">{isHe ? 'כיוון:' : 'Direction:'}</span>
                  <select
                    value={arrowDirection}
                    onChange={(e) => setArrowDirection(e.target.value as ArrowDirection)}
                    className="px-2 py-0.5 rounded bg-[#181F2C] text-white border border-[#2A3548] text-xs"
                  >
                    <option value="right">ימין (Right)</option>
                    <option value="left">שמאל (Left)</option>
                    <option value="top">מעלה (Top)</option>
                    <option value="bottom">מטה (Bottom)</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                {(['lime', 'cyan', 'amber', 'red', 'purple'] as AnnotationColor[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      selectedColor === c ? 'scale-125 border-white ring-2 ring-cyan-400' : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor:
                        c === 'lime'
                          ? '#90FF00'
                          : c === 'cyan'
                          ? '#00E5FF'
                          : c === 'amber'
                          ? '#FFB800'
                          : c === 'red'
                          ? '#FF0055'
                          : '#9D4EDD',
                    }}
                  />
                ))}
              </div>

              <div className="w-[1px] h-4 bg-[#283244]" />

              <button
                type="button"
                onClick={handleAiAssist}
                disabled={isAiLoading}
                className="px-3 py-1 rounded-lg bg-[#9D4EDD] hover:bg-[#B060FF] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(157,78,221,0.4)] disabled:opacity-50 transition-all"
              >
                <Sparkles size={13} className={isAiLoading ? 'animate-spin' : ''} />
                <span>{isHe ? 'AI סמן אוטומטית' : 'AI Auto-Detect'}</span>
              </button>
            </div>
          </div>

          {/* AI Banner Message */}
          {aiMessage && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-[#141A26] border border-[#00E5FF]/40 text-[#00E5FF] text-xs flex items-center justify-between shrink-0">
              <span>{aiMessage}</span>
              <button
                type="button"
                onClick={() => setAiMessage(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Interactive Drawing Stage */}
          <div className="flex-1 relative flex items-center justify-center bg-[#07090C] rounded-xl border border-[#232C3D] overflow-hidden">
            <div
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className="relative w-full h-full max-w-[1000px] aspect-[16/10] select-none cursor-crosshair flex items-center justify-center"
            >
              {/* Background Diagram / Uploaded Image */}
              <InstructionalImageRenderer
                diagramType={currentStep.diagramType}
                imageUri={currentStep.imageUri}
                customImageUri={currentStep.customImageUri}
                defaultImageKey={currentStep.defaultImageKey}
                project={project}
                className="w-full h-full pointer-events-none"
              />

              {/* Render Existing Annotations with interactive drag/resize */}
              {currentStep.annotations.map((ann) => {
                const isSelected = ann.id === selectedAnnId;
                const xPercent = ann.x * 100;
                const yPercent = ann.y * 100;
                const wPercent = (ann.width || 0.12) * 100;
                const hPercent = (ann.height || 0.12) * 100;

                return (
                  <div
                    key={ann.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAnnId(ann.id);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setSelectedAnnId(ann.id);
                      if (canvasRef.current) {
                        const rect = canvasRef.current.getBoundingClientRect();
                        const clickX = (e.clientX - rect.left) / rect.width;
                        const clickY = (e.clientY - rect.top) / rect.height;
                        setDraggingAnnId(ann.id);
                        setDragOffset({ x: clickX - ann.x, y: clickY - ann.y });
                      }
                    }}
                    style={{
                      left: `${xPercent}%`,
                      top: `${yPercent}%`,
                      width: `${wPercent}%`,
                      height: `${hPercent}%`,
                    }}
                    className={`absolute z-30 rounded-lg border-2 transition-all cursor-move ${
                      isSelected
                        ? 'border-[#90FF00] shadow-[0_0_15px_#90FF00] bg-[#90FF00]/15'
                        : 'border-[#00E5FF] bg-black/20 hover:border-white'
                    }`}
                  >
                    {/* Badge Label */}
                    <div className="absolute -top-5 inset-inline-start-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/90 text-white whitespace-nowrap border border-[#00E5FF] flex items-center gap-1">
                      <span>{ann.label?.[language] || ann.label?.he || ann.type}</span>
                    </div>

                    {/* Resize Handle at Bottom-End corner */}
                    {isSelected && (
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setResizingAnnId(ann.id);
                        }}
                        className="absolute -bottom-1 -end-1 w-3 h-3 bg-[#90FF00] rounded-sm cursor-nwse-resize shadow-md"
                      />
                    )}
                  </div>
                );
              })}

              {/* Currently Drawing Box Preview */}
              {isDrawing && currentBox && (
                <div
                  style={{
                    left: `${currentBox.x * 100}%`,
                    top: `${currentBox.y * 100}%`,
                    width: `${currentBox.width * 100}%`,
                    height: `${currentBox.height * 100}%`,
                  }}
                  className="absolute z-40 border-2 border-dashed border-[#90FF00] bg-[#90FF00]/20 pointer-events-none"
                />
              )}
            </div>
          </div>

          {/* Bottom Image Source Switcher & Drag-Drop Uploader */}
          <div className="mt-3 flex items-center justify-between px-3 py-2 bg-[#121620] rounded-xl border border-[#232C3D] gap-2 shrink-0 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-bold">
                {isHe ? 'מקור תמונה לשלב הנוכחי:' : 'Step Image Source:'}
              </span>
              <select
                value={currentStep.imageUri ? 'custom_uploaded' : currentStep.defaultImageKey || 'compressor_ui'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom_uploaded') {
                    // keep current
                  } else {
                    updateCurrentStep({
                      defaultImageKey: val,
                      imageUri: undefined,
                      customImageUri: undefined,
                      imageType: 'bundled_diagram',
                    });
                  }
                }}
                className="px-2.5 py-1 rounded bg-[#181F2C] border border-[#2A3548] text-xs text-white outline-none"
              >
                <optgroup label={isHe ? 'תבניות מוכנות מראש' : 'Presets'}>
                  {BUNDLED_DIAGRAM_PRESETS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
                {availableImages.length > 0 && (
                  <optgroup label={isHe ? 'תמונות שהועלו לפרויקט' : 'Project Images'}>
                    {availableImages.map((img) => (
                      <option key={img.id} value={`uploaded_${img.id}`}>
                        {img.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Custom Upload Button */}
            <label className="px-3 py-1 rounded-lg bg-[#1E2638] hover:bg-[#28334A] border border-[#37445E] text-xs font-bold text-[#00E5FF] cursor-pointer flex items-center gap-1.5 transition-colors">
              <Upload size={13} />
              <span>{isHe ? 'העלאת צילום מסך / תמונה מהמחשב' : 'Upload Screenshot / Image'}</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* RIGHT COLUMN: STEP METADATA & ANNOTATION DETAILS (35%) */}
        <div className="w-[420px] flex flex-col bg-[#0F131B] overflow-y-auto p-4 space-y-4 shrink-0">
          {/* Step Selector & Navigation */}
          <div className="p-3 bg-[#141A26] rounded-xl border border-[#242E40]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#00E5FF]">
                {isHe
                  ? `שלב ${activeStepIndex + 1} מתוך ${steps.length}`
                  : `Step ${activeStepIndex + 1} of ${steps.length}`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleAddStep}
                  title={isHe ? 'הוסף שלב' : 'Add Step'}
                  className="px-2 py-1 rounded bg-[#1C2536] hover:bg-[#26334A] text-[#90FF00] text-xs font-bold flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>{isHe ? 'שלב חדש' : 'Add'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDuplicateStep}
                  title={isHe ? 'שכפל שלב' : 'Duplicate Step'}
                  className="p-1.5 rounded bg-[#1C2536] hover:bg-[#26334A] text-gray-300 text-xs"
                >
                  <Copy size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteStep(activeStepIndex)}
                  disabled={steps.length <= 1}
                  title={isHe ? 'מחק שלב' : 'Delete Step'}
                  className="p-1.5 rounded bg-[#1C2536] hover:bg-[#FF0055] text-gray-400 hover:text-white text-xs disabled:opacity-30"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Step Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {steps.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeStepIndex === idx
                      ? 'bg-[#90FF00] text-black shadow-[0_0_10px_#90FF00]'
                      : 'bg-[#181F2C] text-gray-400 hover:text-white'
                  }`}
                >
                  {s.title.he || `שלב ${idx + 1}`}
                </button>
              ))}
            </div>
          </div>

          {/* Step Metadata Form */}
          <div className="space-y-3 p-3 bg-[#141A26] rounded-xl border border-[#242E40]">
            <h4 className="text-xs font-bold text-[#90FF00] flex items-center gap-1.5">
              <Layers size={14} />
              <span>{isHe ? 'הוראות ביצוע ותוכן לשלב זה' : 'Step Content & Pedagogical Details'}</span>
            </h4>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">
                {isHe ? 'כותרת השלב (עברית):' : 'Step Title (HE):'}
              </label>
              <input
                type="text"
                value={currentStep.title.he || ''}
                onChange={(e) =>
                  updateCurrentStep({
                    title: { ...currentStep.title, he: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D1118] border border-[#2A3548] text-xs text-white outline-none focus:border-[#90FF00]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">
                {isHe ? 'הוראת ביצוע ממוקדת לתלמיד:' : 'Student Instruction:'}
              </label>
              <textarea
                rows={2}
                value={currentStep.instruction.he || ''}
                onChange={(e) =>
                  updateCurrentStep({
                    instruction: { ...currentStep.instruction, he: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D1118] border border-[#2A3548] text-xs text-white outline-none focus:border-[#90FF00]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">
                {isHe ? 'למה זה חשוב ("למה?"):': 'Why it matters ("Why?"): '}
              </label>
              <textarea
                rows={2}
                value={currentStep.why.he || ''}
                onChange={(e) =>
                  updateCurrentStep({
                    why: { ...currentStep.why, he: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D1118] border border-[#2A3548] text-xs text-white outline-none focus:border-[#90FF00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  {isHe ? 'פעולה / ערך מדויק:' : 'Exact Action:'}
                </label>
                <input
                  type="text"
                  value={currentStep.exactAction.he || ''}
                  onChange={(e) =>
                    updateCurrentStep({
                      exactAction: { ...currentStep.exactAction, he: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D1118] border border-[#2A3548] text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  {isHe ? 'תוצאה צפויה:' : 'Expected Result:'}
                </label>
                <input
                  type="text"
                  value={currentStep.expectedResult.he || ''}
                  onChange={(e) =>
                    updateCurrentStep({
                      expectedResult: { ...currentStep.expectedResult, he: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0D1118] border border-[#2A3548] text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Selected Annotation Inspector */}
          {selectedAnnotation ? (
            <div className="space-y-3 p-3 bg-[#141A26] rounded-xl border border-[#00E5FF]/40">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#00E5FF] flex items-center gap-1.5">
                  <Crosshair size={14} />
                  <span>{isHe ? 'מאפייני הסימון הנבחר על התמונה' : 'Selected Annotation Properties'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    updateCurrentStep({
                      annotations: currentStep.annotations.filter((a) => a.id !== selectedAnnId),
                    });
                    setSelectedAnnId(null);
                  }}
                  className="text-gray-400 hover:text-[#FF0055] text-xs p-1 rounded bg-[#1F2636] flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  <span>{isHe ? 'מחק' : 'Delete'}</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  {isHe ? 'תווית הסימון (Label):' : 'Marker Label:'}
                </label>
                <input
                  type="text"
                  value={selectedAnnotation.label?.he || ''}
                  onChange={(e) => {
                    const updated = currentStep.annotations.map((a) =>
                      a.id === selectedAnnId
                        ? { ...a, label: { ...a.label, he: e.target.value, en: e.target.value } }
                        : a
                    );
                    updateCurrentStep({ annotations: updated });
                  }}
                  className="w-full px-2.5 py-1 rounded bg-[#0D1118] border border-[#2A3548] text-xs text-white outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  {isHe ? 'הסבר מרחף (Tooltip Description):' : 'Tooltip Description:'}
                </label>
                <input
                  type="text"
                  value={selectedAnnotation.description?.he || ''}
                  onChange={(e) => {
                    const updated = currentStep.annotations.map((a) =>
                      a.id === selectedAnnId
                        ? { ...a, description: { ...a.description, he: e.target.value, en: e.target.value } }
                        : a
                    );
                    updateCurrentStep({ annotations: updated });
                  }}
                  className="w-full px-2.5 py-1 rounded bg-[#0D1118] border border-[#2A3548] text-xs text-white outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">X (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedAnnotation.x}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const updated = currentStep.annotations.map((a) =>
                        a.id === selectedAnnId ? { ...a, x: val } : a
                      );
                      updateCurrentStep({ annotations: updated });
                    }}
                    className="w-full px-1.5 py-1 rounded bg-[#0D1118] border border-[#2A3548] text-xs text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Y (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedAnnotation.y}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const updated = currentStep.annotations.map((a) =>
                        a.id === selectedAnnId ? { ...a, y: val } : a
                      );
                      updateCurrentStep({ annotations: updated });
                    }}
                    className="w-full px-1.5 py-1 rounded bg-[#0D1118] border border-[#2A3548] text-xs text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Width</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedAnnotation.width || 0.12}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const updated = currentStep.annotations.map((a) =>
                        a.id === selectedAnnId ? { ...a, width: val } : a
                      );
                      updateCurrentStep({ annotations: updated });
                    }}
                    className="w-full px-1.5 py-1 rounded bg-[#0D1118] border border-[#2A3548] text-xs text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Height</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedAnnotation.height || 0.12}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const updated = currentStep.annotations.map((a) =>
                        a.id === selectedAnnId ? { ...a, height: val } : a
                      );
                      updateCurrentStep({ annotations: updated });
                    }}
                    className="w-full px-1.5 py-1 rounded bg-[#0D1118] border border-[#2A3548] text-xs text-white text-center"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#141A26]/50 rounded-xl border border-dashed border-[#242E40] text-center text-xs text-gray-400">
              {isHe
                ? 'לחץ וגרור על התמונה כדי להוסיף סימון חדש, או לחץ על סימון קיים כדי לערוך אותו.'
                : 'Click and drag on the image to add a new annotation, or click an existing one to edit.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

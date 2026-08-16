import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  CheckCircle2,
  Layers,
  Sliders,
  FileText,
  Tag,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  RefreshCw,
  FolderOpen,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserUploadedImage, VisualLesson, VisualLessonCategory } from '../../types/visualLesson';
import { AAMCProject, GenreType } from '../../types';
import { Language } from '../../i18n/types';
import { visualCoachStorageService } from '../../services/visualCoachStorageService';
import { visualLessonAiService } from '../../services/visualLessonAiService';
import { projectService } from '../../services/projectService';

interface ImageUploaderProps {
  project?: AAMCProject;
  language?: Language;
  onImageUploaded?: (uploadedImage: UserUploadedImage) => void;
  onCreateLessonWithImage?: (lesson: VisualLesson) => void;
  onClose?: () => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  project,
  language = 'he',
  onImageUploaded,
  onCreateLessonWithImage,
  onClose,
  className = '',
}) => {
  const isHe = language === 'he';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload State
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Metadata Form State
  const [imageName, setImageName] = useState('');
  const [category, setCategory] = useState<VisualLessonCategory>('psytrance');
  const [genre, setGenre] = useState<GenreType>(project?.genre || 'Psytrance');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [tagsInput, setTagsInput] = useState('Kick & Bass, Sound Design, Ableton Live');

  // AI & Processing States
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');

  // Gallery of Stored Images in Project
  const [savedImages, setSavedImages] = useState<UserUploadedImage[]>([]);

  useEffect(() => {
    loadSavedImages();
  }, [project]);

  const loadSavedImages = () => {
    const localSaved = visualCoachStorageService.getUploadedImages();
    const projectImgs = project?.projectImages || [];
    // Combine unique
    const map = new Map<string, UserUploadedImage>();
    projectImgs.forEach((img) => map.set(img.id, img));
    localSaved.forEach((img) => map.set(img.id, img));
    setSavedImages(Array.from(map.values()));
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(isHe ? 'אנא בחר קובץ תמונה תקין (PNG, JPG, WEBP, SVG)' : 'Please select a valid image file (PNG, JPG, WEBP, SVG)');
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert(isHe ? 'גודל הקובץ מוגבל ל-10MB' : 'Image file size is limited to 10MB');
      return;
    }

    setSelectedFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setImageName(cleanName);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setPreviewUri(dataUri);

      // Measure dimensions
      const img = new Image();
      img.onload = () => {
        setImageMeta({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = dataUri;
    };
    reader.readAsDataURL(file);
  };

  // Save to Project & Storage
  const handleSaveImageOnly = () => {
    if (!previewUri) return;

    const newImage: UserUploadedImage = {
      id: `img_${Date.now()}`,
      name: imageName.trim() || 'Custom Instructional Image',
      uri: previewUri,
      type: selectedFile?.type || 'image/png',
      width: imageMeta.width || 1280,
      height: imageMeta.height || 720,
      uploadedAt: new Date().toISOString(),
      sizeBytes: selectedFile?.size || 0,
    };

    // Save to local storage
    visualCoachStorageService.saveUploadedImage(newImage);

    // Save to active project
    if (project) {
      const updatedProject: AAMCProject = {
        ...project,
        projectImages: [newImage, ...(project.projectImages || []).filter((i) => i.id !== newImage.id)],
      };
      projectService.saveActiveProject(updatedProject);
    }

    loadSavedImages();
    if (onImageUploaded) {
      onImageUploaded(newImage);
    }

    // Switch to gallery tab or show confirmation
    setActiveTab('gallery');
  };

  // Generate Lesson with AI assistance from this image
  const handleCreateWithAi = async () => {
    if (!previewUri) return;

    setIsAiAnalyzing(true);
    setAiStatusMsg(isHe ? 'AI סורק את הדיאגרמה ומזהה בקרים ופרמטרים...' : 'AI is analyzing diagram controls & parameters...');

    try {
      const generatedLesson = await visualLessonAiService.analyzeDiagramAndGenerateLesson(
        imageName.trim() || 'Custom Synthesizer & Effect Setup',
        category,
        language,
        difficulty
      );

      // Attach our uploaded image URI to all steps in the generated lesson
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const customizedLesson: VisualLesson = {
        ...generatedLesson,
        id: `custom_lesson_${Date.now()}`,
        genre,
        tags: tags.length > 0 ? tags : generatedLesson.tags,
        isCustom: true,
        steps: generatedLesson.steps.map((s) => ({
          ...s,
          customImageUri: previewUri,
          imageUri: previewUri,
          imageType: 'uploaded',
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Also register image in project
      const newImage: UserUploadedImage = {
        id: `img_${Date.now()}`,
        name: imageName.trim() || 'Custom Instructional Image',
        uri: previewUri,
        type: selectedFile?.type || 'image/png',
        width: imageMeta.width || 1280,
        height: imageMeta.height || 720,
        uploadedAt: new Date().toISOString(),
        sizeBytes: selectedFile?.size || 0,
      };
      visualCoachStorageService.saveUploadedImage(newImage);
      visualCoachStorageService.saveCustomLesson(customizedLesson);

      if (project) {
        const updatedProject: AAMCProject = {
          ...project,
          projectImages: [newImage, ...(project.projectImages || []).filter((i) => i.id !== newImage.id)],
          visualLessons: [customizedLesson, ...(project.visualLessons || []).filter((l) => l.id !== customizedLesson.id)],
          currentVisualLessonId: customizedLesson.id,
        };
        projectService.saveActiveProject(updatedProject);
      }

      if (onCreateLessonWithImage) {
        onCreateLessonWithImage(customizedLesson);
      }
    } catch (err) {
      console.error('Failed to analyze image with AI:', err);
      // Fallback manual lesson creation
      handleCreateManualLesson();
    } finally {
      setIsAiAnalyzing(false);
      setAiStatusMsg('');
    }
  };

  // Create Manual Lesson from this image
  const handleCreateManualLesson = () => {
    if (!previewUri) return;

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const manualLesson: VisualLesson = {
      id: `custom_lesson_${Date.now()}`,
      courseId: category,
      category,
      title: {
        en: imageName.trim() || 'Custom Visual Lesson',
        he: imageName.trim() || 'שיעור חזותי מותאם אישית',
      },
      subtitle: {
        en: 'Step-by-step visual production guide',
        he: 'מדריך חזותי שלב-אחר-שלב בהפקה מוזיקלית',
      },
      description: {
        en: 'Custom visual lesson created with uploaded production diagram.',
        he: 'שיעור חזותי שנוצר עם תמונה ודיאגרמת הפקה שהועלתה.',
      },
      genre,
      difficulty,
      estimatedMinutes: 8,
      tags: tags.length > 0 ? tags : ['Visual Guide', 'Custom'],
      isCustom: true,
      steps: [
        {
          id: 1,
          title: {
            en: 'Step 1: Main Control Overview',
            he: 'שלב 1: סקירת הבקר המרכזי',
          },
          instruction: {
            en: 'Locate the primary parameter highlighted on the diagram and adjust to the recommended setting.',
            he: 'אתר את הפרמטר המרכזי המודגש בדיאגרמה וכוונן לערך המומלץ.',
          },
          why: {
            en: 'This parameter defines the core tonal balance and harmonic presence.',
            he: 'פרמטר זה קובע את האיזון הטונאלי המרכזי והנוכחות ההרמונית של הצליל.',
          },
          exactAction: {
            en: 'Set parameter value according to production requirements.',
            he: 'כוונן את ערך הפרמטר בהתאם לדרישות ההפקה.',
          },
          expectedResult: {
            en: 'Clean, tight sound with optimal headroom and transient impact.',
            he: 'סאונד הדוק ונקי עם הדרום אופטימלי ואימפקט טרנזיינטים מדויק.',
          },
          defaultImageKey: 'custom',
          customImageUri: previewUri,
          imageUri: previewUri,
          imageType: 'uploaded',
          annotations: [
            {
              id: `ann_${Date.now()}_1`,
              type: 'spotlight',
              x: 0.35,
              y: 0.35,
              width: 0.3,
              height: 0.3,
              color: 'lime',
              label: {
                en: 'Target Parameter',
                he: 'פרמטר יעד',
              },
              description: {
                en: 'Focus on this section of the interface',
                he: 'התמקד בחלק זה של הממשק',
              },
            },
            {
              id: `ann_${Date.now()}_2`,
              type: 'arrow',
              x: 0.25,
              y: 0.35,
              direction: 'right',
              color: 'cyan',
              label: {
                en: 'Adjust Here',
                he: 'כוונן כאן',
              },
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    visualCoachStorageService.saveCustomLesson(manualLesson);

    if (onCreateLessonWithImage) {
      onCreateLessonWithImage(manualLesson);
    }
  };

  const handleDeleteImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    visualCoachStorageService.deleteUploadedImage(id);
    if (project) {
      const updated = {
        ...project,
        projectImages: (project.projectImages || []).filter((i) => i.id !== id),
      };
      projectService.saveActiveProject(updated);
    }
    loadSavedImages();
  };

  return (
    <div
      className={`bg-[#0D1117] border border-[#232936] rounded-2xl p-4 sm:p-6 shadow-2xl text-white max-w-4xl w-full mx-auto relative ${className}`}
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#232936] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#90FF00]/10 border border-[#90FF00]/30 flex items-center justify-center text-[#90FF00]">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{isHe ? 'מרכז העלאת תמונות ודיאגרמות לימוד' : 'Visual Lesson Image & Diagram Center'}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#90FF00]/20 text-[#90FF00] border border-[#90FF00]/30">
                .AAMC Sync
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isHe
                ? 'העלה צילום מסך מ-Ableton, סינתיסייזר, EQ, קומפרסור או דיאגרמה וחבר אותה ישירות למנוע הלמידה'
                : 'Upload screenshots from Ableton, synths, EQs, compressors, or diagrams into the visual learning engine'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#161B22] hover:bg-[#232936] border border-[#2A3140] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#161B22] rounded-xl border border-[#232936] mb-6 max-w-sm">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-[#90FF00] text-black shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isHe ? 'העלאת תמונה חדשה' : 'Upload New Image'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'gallery'
              ? 'bg-[#90FF00] text-black shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>{isHe ? `גלריית הפרויקט (${savedImages.length})` : `Project Gallery (${savedImages.length})`}</span>
        </button>
      </div>

      {/* TAB 1: UPLOAD & CONFIGURE */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {!previewUri ? (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-[#90FF00] bg-[#90FF00]/5 scale-[0.99]'
                  : 'border-[#2D3748] hover:border-[#90FF00]/50 bg-[#161B22]/50 hover:bg-[#161B22]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-[#0D1117] border border-[#2D3748] flex items-center justify-center mx-auto mb-4 text-[#90FF00] shadow-inner group-hover:scale-105 transition-transform">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {isHe ? 'גרור לכאן תמונה או לחץ לבחירה מהמחשב' : 'Drag and drop an image or click to browse'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mb-4">
                {isHe
                  ? 'תומך ב-PNG, JPG, WebP, SVG (עד 10MB). מתאים לצילומי Ableton, תרשימי סינתזה, עיבוד תדרים וסידור ערוצים.'
                  : 'Supports PNG, JPG, WebP, SVG (up to 10MB). Perfect for Ableton screenshots, synth architectures, and frequency charts.'}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#232936] text-gray-300 text-xs font-medium border border-[#2D3748]">
                <Upload className="w-3.5 h-3.5 text-[#90FF00]" />
                <span>{isHe ? 'בחר קובץ מהמכשיר' : 'Select file from device'}</span>
              </div>
            </div>
          ) : (
            /* Uploaded Image Preview & Metadata Customizer */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Image Preview Box */}
              <div className="lg:col-span-6 bg-[#161B22] border border-[#232936] rounded-xl p-3 flex flex-col items-center">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center border border-[#2D3748]">
                  <img
                    src={previewUri}
                    alt={imageName}
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUri(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-2 end-2 p-1.5 rounded-lg bg-black/80 text-gray-300 hover:text-red-400 border border-white/10 backdrop-blur"
                    title={isHe ? 'החלף תמונה' : 'Replace image'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full mt-3 flex items-center justify-between text-[11px] text-gray-400 px-1">
                  <span>
                    {imageMeta.width} × {imageMeta.height} px
                  </span>
                  <span>{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Embedded'}</span>
                </div>
              </div>

              {/* Lesson & Metadata Controls */}
              <div className="lg:col-span-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isHe ? 'שם התמונה / נושא השיעור' : 'Image Name / Lesson Subject'}
                  </label>
                  <input
                    type="text"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    placeholder={isHe ? 'לדוגמה: Operator FM Bassline Filter' : 'e.g. Operator FM Bassline Filter'}
                    className="w-full px-3 py-2 rounded-xl bg-[#161B22] border border-[#2A3140] text-sm text-white focus:outline-none focus:border-[#90FF00] transition-colors"
                  />
                </div>

                {/* Category & Genre */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      {isHe ? 'קטגוריה' : 'Category'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as VisualLessonCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-[#161B22] border border-[#2A3140] text-xs text-white focus:outline-none focus:border-[#90FF00]"
                    >
                      <option value="psytrance">Psytrance</option>
                      <option value="goa">Goa Trance</option>
                      <option value="techno">Techno</option>
                      <option value="melodic-techno">Melodic Techno</option>
                      <option value="sound-design">Sound Design</option>
                      <option value="mixing">Mixing & Master</option>
                      <option value="beginner">Beginner Fast-Track</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      {isHe ? 'רמת קושי' : 'Difficulty'}
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#161B22] border border-[#2A3140] text-xs text-white focus:outline-none focus:border-[#90FF00]"
                    >
                      <option value="Beginner">{isHe ? 'מתחיל (Beginner)' : 'Beginner'}</option>
                      <option value="Intermediate">{isHe ? 'בינוני (Intermediate)' : 'Intermediate'}</option>
                      <option value="Advanced">{isHe ? 'מתקדם (Advanced)' : 'Advanced'}</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {isHe ? 'תגיות (מופרדות בפסיקים)' : 'Tags (comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161B22] border border-[#2A3140] text-xs text-white focus:outline-none focus:border-[#90FF00]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2.5">
                  {/* AI Diagram Analysis & Auto-Lesson */}
                  <button
                    type="button"
                    disabled={isAiAnalyzing}
                    onClick={handleCreateWithAi}
                    className="w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#90FF00] to-[#00E5FF] text-black shadow-[0_0_20px_rgba(144,255,0,0.3)] hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAiAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>{aiStatusMsg || (isHe ? 'AI מעבד דיאגרמה...' : 'AI Analyzing Diagram...')}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{isHe ? 'ניתוח אוטומטי ויצירת שיעור חכם עם AI' : 'Analyze Diagram & Build Lesson with AI'}</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isAiAnalyzing}
                      onClick={handleCreateManualLesson}
                      className="py-2 px-3 rounded-xl bg-[#1F2430] hover:bg-[#2A3140] border border-[#374151] text-xs font-bold text-gray-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>{isHe ? 'ערוך שלבים ידנית' : 'Manual Lesson Editor'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isAiAnalyzing}
                      onClick={handleSaveImageOnly}
                      className="py-2 px-3 rounded-xl bg-[#161B22] hover:bg-[#1F2430] border border-[#2A3140] text-xs font-bold text-gray-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#90FF00]" />
                      <span>{isHe ? 'שמור לפרויקט בלבד' : 'Save to Project Only'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROJECT GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          {savedImages.length === 0 ? (
            <div className="text-center py-12 bg-[#161B22]/40 border border-[#232936] rounded-2xl p-6">
              <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-gray-300 mb-1">
                {isHe ? 'אין עדיין תמונות שמורות בפרויקט' : 'No images saved in this project yet'}
              </h4>
              <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
                {isHe
                  ? 'העלה צילומי מסך ותרשימים כדי לבנות איתם שיעורים ותרגילים מותאמים אישית.'
                  : 'Upload screenshots and diagrams to construct custom interactive lessons and exercises.'}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 rounded-xl bg-[#90FF00] text-black font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isHe ? 'העלה תמונה ראשונה' : 'Upload First Image'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedImages.map((img) => (
                <div
                  key={img.id}
                  className="bg-[#161B22] border border-[#232936] hover:border-[#90FF00]/50 rounded-xl overflow-hidden group transition-all flex flex-col"
                >
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-[#232936]">
                    <img
                      src={img.uri}
                      alt={img.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                      <span className="text-[10px] text-gray-300 font-mono">
                        {img.width}x{img.height}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteImage(img.id, e)}
                        className="p-1 rounded bg-red-500/80 hover:bg-red-600 text-white text-xs"
                        title={isHe ? 'מחק מהפרויקט' : 'Delete from project'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate mb-1" title={img.name}>
                        {img.name}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        {new Date(img.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#232936] flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUri(img.uri);
                          setImageName(img.name);
                          setActiveTab('upload');
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-[#232936] hover:bg-[#90FF00] hover:text-black text-gray-300 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{isHe ? 'צור שיעור' : 'Create Lesson'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info note */}
      <div className="mt-6 pt-4 border-t border-[#232936] flex items-start gap-2.5 text-[11px] text-gray-400">
        <Info className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
        <span>
          {isHe
            ? 'כל התמונות המועלות נשמרות מקומית בדפדפן ובמבנה פרויקט ה-.AAMC שלך, ללא תלות בשרת חיצוני.'
            : 'All uploaded images are persisted locally in browser memory and synced into your .AAMC project package.'}
        </span>
      </div>
    </div>
  );
};

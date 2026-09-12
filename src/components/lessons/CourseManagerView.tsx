import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Save,
  BookOpen,
  Sparkles,
  Music,
  Play,
  Square,
  Image as ImageIcon,
  Clock,
  Sliders,
  CheckCircle2,
  Download,
  Upload,
  ArrowLeft,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Course, CourseModule, Lesson, LessonStep, ParameterHighlight, InteractiveMidiExample } from '../../types/lesson';
import { courseService } from '../../services/courseService';
import { audioService } from '../../services/audioService';
import { useLanguage } from '../../context/LanguageContext';
import { SoundPresetType } from '../../types';

interface CourseManagerViewProps {
  onOpenCoach?: (prompt?: string) => void;
  onBackToLibrary?: () => void;
  onSelectLessonToPlay?: (lesson: Lesson, course: Course) => void;
}

export const CourseManagerView: React.FC<CourseManagerViewProps> = ({
  onOpenCoach,
  onBackToLibrary,
  onSelectLessonToPlay,
}) => {
  const { t, isRtl } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [activeTab, setActiveTab] = useState<'details' | 'modules' | 'lessons' | 'preview'>('lessons');
  const [isPlayingMidi, setIsPlayingMidi] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<SoundPresetType>('psy_rolling_bass');

  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const list = await courseService.getCourses();
    setCourses(list);
    if (list.length > 0) {
      const initial = list[0];
      setSelectedCourseId(initial.id);
      setActiveCourse(initial);
      if (initial.lessons && initial.lessons.length > 0) {
        setSelectedLessonId(initial.lessons[0].id);
        setActiveLesson(initial.lessons[0]);
      }
    }
  };

  const handleSelectCourse = (courseId: string) => {
    const found = courses.find((c) => c.id === courseId);
    if (found) {
      setSelectedCourseId(found.id);
      setActiveCourse(found);
      if (found.lessons && found.lessons.length > 0) {
        setSelectedLessonId(found.lessons[0].id);
        setActiveLesson(found.lessons[0]);
      } else {
        setSelectedLessonId('');
        setActiveLesson(null);
      }
    }
  };

  const handleSelectLesson = (lessonId: string) => {
    if (!activeCourse) return;
    const found = activeCourse.lessons.find((l) => l.id === lessonId);
    if (found) {
      setSelectedLessonId(found.id);
      setActiveLesson(found);
    }
  };

  // Create new blank course
  const handleCreateNewCourse = async () => {
    const newCourseData: Partial<Course> = {
      title: 'New Production Masterclass',
      subtitle: 'Comprehensive Ableton Live 12 Sound Design & Arrangement',
      genre: 'Psytrance',
      iconName: 'Sparkles',
      description: 'Step-by-step masterclass covering workflow, sound design, and synthesis in Ableton Live 12.',
      modules: [
        {
          id: 'mod_1',
          title: 'Module 1: Sound Architecture & Rhythm',
          description: 'Fundamentals of groove, low-end synchronization, and synthesis.',
          lessonIds: ['lesson_1'],
        },
      ],
      lessons: [
        {
          id: 'lesson_1',
          title: 'Lesson 1: Precision Kick & Bass Synchronization',
          subtitle: 'Synthesizing the fundamental 16th-note rolling groove',
          description: 'Master the phase alignment and envelope modulation between punchy 909-style kicks and 303 rolling basslines.',
          objective: 'Configure Operator/Wavetable for resonant sub-bass and lock sidechain triggers.',
          learningObjectives: [
            { id: 'obj_1', description: 'Align kick fundamental with bass tonic key', category: 'concept' },
            { id: 'obj_2', description: 'Configure Live 12 Wavetable envelope decay to 16th note triplets', category: 'practical' },
          ],
          durationMinutes: 18,
          difficulty: 'Intermediate',
          genre: 'Psytrance',
          steps: [
            {
              stepNumber: 1,
              title: 'Insert Wavetable & Set Sawtooth Wave',
              contentMarkdown: 'Load Wavetable on a MIDI track. Set Oscillator 1 to Basic Shapes -> Sawtooth with a low-pass filter at 220Hz.',
              abletonInstruction: 'Press Cmd+F (Ctrl+F) -> Type "Wavetable" -> Double-click to insert on Track 2.',
              parameterHighlights: [
                { param: 'Filter Cutoff', value: '220', unit: 'Hz', purpose: 'Removes piercing high frequencies for tight rolling bass' },
                { param: 'Filter Resonance', value: '28', unit: '%', purpose: 'Adds psychedelic bite' },
              ],
            },
          ],
        },
      ],
    };

    const created = await courseService.createCourse(newCourseData);
    setCourses([...courses, created]);
    setSelectedCourseId(created.id);
    setActiveCourse(created);
    setSelectedLessonId(created.lessons[0].id);
    setActiveLesson(created.lessons[0]);
    showTemporaryStatus('New Course Initialized!');
  };

  // Add new lesson to active course
  const handleAddLesson = () => {
    if (!activeCourse) return;

    const newLessonId = `lesson_${Date.now()}`;
    const newLesson: Lesson = {
      id: newLessonId,
      title: `Lesson ${activeCourse.lessons.length + 1}: Modern Synthesis Technique`,
      subtitle: 'Advanced Ableton Live 12 Sound Design',
      description: 'Hands-on practice applying audio effects, modulation, and groove templates.',
      durationMinutes: 15,
      difficulty: 'Intermediate',
      genre: activeCourse.genre,
      learningObjectives: [
        { id: `obj_${Date.now()}`, description: 'Implement step parameters in Live 12', category: 'practical' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Device Setup & Routing',
          contentMarkdown: 'Configure track inputs and assign modulation destinations.',
          abletonInstruction: 'Drag Roar or Echo after the instrument in the Device Chain.',
        },
      ],
    };

    const updatedLessons = [...activeCourse.lessons, newLesson];
    const updatedCourse: Course = {
      ...activeCourse,
      lessons: updatedLessons,
    };

    setActiveCourse(updatedCourse);
    setSelectedLessonId(newLessonId);
    setActiveLesson(newLesson);
    courseService.updateCourse(updatedCourse.id, updatedCourse);
    showTemporaryStatus('Lesson Added!');
  };

  // Add Step to active lesson
  const handleAddStep = () => {
    if (!activeLesson || !activeCourse) return;

    const newStep: LessonStep = {
      stepNumber: (activeLesson.steps?.length || 0) + 1,
      title: `Step ${(activeLesson.steps?.length || 0) + 1}: Apply Modulation`,
      contentMarkdown: 'Adjust the parameter in Ableton Live to hear the envelope shift.',
      abletonInstruction: 'Navigate to the Filter section and automate Cutoff.',
    };

    const updatedSteps = [...(activeLesson.steps || []), newStep];
    const updatedLesson: Lesson = {
      ...activeLesson,
      steps: updatedSteps,
    };

    updateActiveLesson(updatedLesson);
  };

  // Save full course changes
  const handleSaveCourse = async () => {
    if (!activeCourse) return;
    try {
      await courseService.updateCourse(activeCourse.id, activeCourse);
      showTemporaryStatus('Course Successfully Saved to Academy!');
    } catch {
      showTemporaryStatus('Error saving course.');
    }
  };

  // Helper to update active lesson in course state
  const updateActiveLesson = (updatedLesson: Lesson) => {
    if (!activeCourse) return;
    setActiveLesson(updatedLesson);
    const updatedLessons = activeCourse.lessons.map((l) =>
      l.id === updatedLesson.id ? updatedLesson : l
    );
    const updatedCourse = { ...activeCourse, lessons: updatedLessons };
    setActiveCourse(updatedCourse);
  };

  const showTemporaryStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // Audition MIDI / Audio example
  const handleAuditionMidi = () => {
    if (isPlayingMidi) {
      audioService.stopAll();
      setIsPlayingMidi(false);
      return;
    }

    setIsPlayingMidi(true);
    // Generate an upbeat reference pattern in the chosen preset
    const demoNotes = [
      { pitch: 'F1', time: 0, duration: 0.2, velocity: 100 },
      { pitch: 'F1', time: 0.25, duration: 0.2, velocity: 85 },
      { pitch: 'F1', time: 0.5, duration: 0.2, velocity: 92 },
      { pitch: 'G#1', time: 0.75, duration: 0.2, velocity: 96 },
      { pitch: 'F1', time: 1.0, duration: 0.2, velocity: 90 },
      { pitch: 'A#1', time: 1.25, duration: 0.2, velocity: 105 },
      { pitch: 'C2', time: 1.5, duration: 0.25, velocity: 98 },
      { pitch: 'F1', time: 1.75, duration: 0.2, velocity: 88 },
    ];

    audioService.playMidiPattern(demoNotes as any, 142, selectedPreset);
    setTimeout(() => {
      setIsPlayingMidi(false);
    }, 2200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-gray-200" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Header & Course Selector Bar */}
      <div className="bg-[#181818] border border-[#333] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#90FF00]/10 border border-[#90FF00]/30 flex items-center justify-center text-[#90FF00]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#90FF00] uppercase tracking-widest">
                Curriculum Management
              </span>
              {activeCourse?.isCustom && (
                <span className="bg-[#90FF00]/20 text-[#90FF00] text-[9px] px-2 py-0.5 rounded font-mono font-bold">
                  Custom Course
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-white mt-0.5">Course Creator & Lesson Studio</h1>
            <p className="text-xs text-gray-400">
              Define interactive courses, modules, Ableton Live 12 workflow tasks, and embedded audio examples.
            </p>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onBackToLibrary && (
            <button
              onClick={onBackToLibrary}
              className="bg-[#242424] hover:bg-[#303030] text-gray-300 border border-[#444] px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Academy</span>
            </button>
          )}

          <button
            onClick={handleCreateNewCourse}
            className="bg-[#242424] hover:bg-[#303030] text-[#00E5FF] border border-[#00E5FF]/40 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Course</span>
          </button>

          <button
            onClick={handleSaveCourse}
            className="bg-[#90FF00] hover:bg-[#80e600] text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(144,255,0,0.3)]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Course</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {saveStatus && (
        <div className="bg-[#121212] border border-[#90FF00] text-[#90FF00] px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#333] pb-2">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'lessons' ? 'bg-[#90FF00] text-black font-extrabold' : 'text-gray-400 hover:text-white bg-[#1A1A1A]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Lessons Editor ({activeCourse?.lessons.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'details' ? 'bg-[#90FF00] text-black font-extrabold' : 'text-gray-400 hover:text-white bg-[#1A1A1A]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Course Meta & Genre</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'modules' ? 'bg-[#90FF00] text-black font-extrabold' : 'text-gray-400 hover:text-white bg-[#1A1A1A]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Modules Organizer</span>
        </button>
      </div>

      {/* Main Grid: Selector & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Course Selection & Lesson List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Course Selector Dropdown */}
          <div className="bg-[#181818] border border-[#333] p-4 rounded-xl space-y-2">
            <label className="text-[11px] font-mono uppercase font-bold text-gray-400">Select Active Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => handleSelectCourse(e.target.value)}
              className="w-full bg-[#121212] border border-[#444] rounded-lg p-2.5 text-xs text-white font-medium focus:outline-none focus:border-[#90FF00]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.genre})
                </option>
              ))}
            </select>
          </div>

          {/* Lessons List in Course */}
          <div className="bg-[#181818] border border-[#333] p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-gray-400">Lessons in Course</span>
              <button
                onClick={handleAddLesson}
                className="text-[10px] font-bold text-[#90FF00] hover:text-[#b4ff4c] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Lesson</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {activeCourse?.lessons.map((lesson, idx) => {
                const isSelected = lesson.id === selectedLessonId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#90FF00]/10 border-[#90FF00] text-white'
                        : 'bg-[#121212] border-[#2A2A2A] text-gray-400 hover:border-[#444] hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className={isSelected ? 'text-[#90FF00] font-bold' : 'text-gray-500'}>
                        #{idx + 1}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#222]">
                        {lesson.durationMinutes || 15}m
                      </span>
                    </div>
                    <span className="font-bold line-clamp-1">{lesson.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content Area: Detailed Editor based on Tab */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'lessons' && activeLesson && (
            <div className="space-y-6">
              {/* Lesson General Info Box */}
              <div className="bg-[#181818] border border-[#333] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#90FF00]" />
                    <span>Lesson Details</span>
                  </h2>

                  {onSelectLessonToPlay && activeCourse && (
                    <button
                      onClick={() => onSelectLessonToPlay(activeLesson, activeCourse)}
                      className="bg-[#242424] hover:bg-[#303030] text-[#90FF00] border border-[#90FF00]/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Test in Lesson Player</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold">Lesson Title</label>
                    <input
                      type="text"
                      value={activeLesson.title}
                      onChange={(e) => updateActiveLesson({ ...activeLesson, title: e.target.value })}
                      className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#90FF00]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold">Subtitle / Topic</label>
                    <input
                      type="text"
                      value={activeLesson.subtitle || ''}
                      onChange={(e) => updateActiveLesson({ ...activeLesson, subtitle: e.target.value })}
                      className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#90FF00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold">Estimated Duration (Mins)</label>
                    <input
                      type="number"
                      value={activeLesson.durationMinutes}
                      onChange={(e) => updateActiveLesson({ ...activeLesson, durationMinutes: parseInt(e.target.value) || 10 })}
                      className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#90FF00]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold">Difficulty Level</label>
                    <select
                      value={activeLesson.difficulty}
                      onChange={(e) => updateActiveLesson({ ...activeLesson, difficulty: e.target.value as any })}
                      className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#90FF00]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold">Genre</label>
                    <input
                      type="text"
                      value={activeLesson.genre}
                      onChange={(e) => updateActiveLesson({ ...activeLesson, genre: e.target.value as any })}
                      className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#90FF00]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-bold">Core Objective Description</label>
                  <textarea
                    rows={2}
                    value={activeLesson.objective || activeLesson.description}
                    onChange={(e) => updateActiveLesson({ ...activeLesson, objective: e.target.value, description: e.target.value })}
                    className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#90FF00]"
                  />
                </div>
              </div>

              {/* Embedded Audio / MIDI Example & Sound Preset Audition */}
              <div className="bg-[#181818] border border-[#333] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#00E5FF]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Embedded Audio & MIDI Synthesis Engine
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">Web Audio Live Synthesis</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold">Acoustic Sound Preset</label>
                    <select
                      value={selectedPreset}
                      onChange={(e) => setSelectedPreset(e.target.value as SoundPresetType)}
                      className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="psy_rolling_bass">Psy Rolling Bass (16th Grunt)</option>
                      <option value="acid_303">Acid 303 (Resonant Squelch)</option>
                      <option value="goa_squelch_lead">Goa Squelch Lead</option>
                      <option value="supersaw_lead">Supersaw Trance Lead</option>
                      <option value="fm_metallic_stab">FM Metallic Stab</option>
                      <option value="sub_808">Deep Sub 808</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold">Tempo & Scale Preview</label>
                    <div className="p-2 bg-[#121212] border border-[#333] rounded-lg text-xs font-mono text-gray-300">
                      142 BPM • F Minor
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      onClick={handleAuditionMidi}
                      className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                        isPlayingMidi
                          ? 'bg-red-500 text-white'
                          : 'bg-[#00E5FF] hover:bg-[#00cbe2] text-black font-extrabold'
                      }`}
                    >
                      {isPlayingMidi ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Stop Audition</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Audition Preset Sound</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Coaching Function Link */}
              <div className="bg-[#181818] border border-[#333] p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#90FF00]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Linked AI Coaching Function
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Allow students to click a single prompt to consult the AI Music Coach directly on this topic.
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    defaultValue={`Coach, explain how to set up the proper EQ and filter envelope for: ${activeLesson.title}`}
                    id="ai-lesson-prompt"
                    className="flex-1 bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#90FF00]"
                  />
                  {onOpenCoach && (
                    <button
                      onClick={() => {
                        const input = document.getElementById('ai-lesson-prompt') as HTMLInputElement;
                        onOpenCoach(input?.value);
                      }}
                      className="bg-[#242424] hover:bg-[#303030] text-[#90FF00] border border-[#90FF00]/40 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>Test AI Coach Prompt</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Step-by-Step Curriculum Workflow Instructions */}
              <div className="bg-[#181818] border border-[#333] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#90FF00]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Ableton Live 12 Interactive Steps ({activeLesson.steps?.length || 0})
                    </h3>
                  </div>

                  <button
                    onClick={handleAddStep}
                    className="bg-[#242424] hover:bg-[#303030] text-[#90FF00] border border-[#90FF00]/40 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {activeLesson.steps?.map((step, sIdx) => (
                    <div key={sIdx} className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#90FF00]">
                          Step {step.stepNumber || sIdx + 1}
                        </span>
                        <button
                          onClick={() => {
                            const updated = activeLesson.steps.filter((_, i) => i !== sIdx);
                            updateActiveLesson({ ...activeLesson, steps: updated });
                          }}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] text-gray-400 font-bold">Step Title</label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const steps = [...activeLesson.steps];
                              steps[sIdx] = { ...steps[sIdx], title: e.target.value };
                              updateActiveLesson({ ...activeLesson, steps });
                            }}
                            className="w-full bg-[#181818] border border-[#333] rounded p-2 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] text-gray-400 font-bold">Ableton Action Directive</label>
                          <input
                            type="text"
                            value={step.abletonInstruction}
                            onChange={(e) => {
                              const steps = [...activeLesson.steps];
                              steps[sIdx] = { ...steps[sIdx], abletonInstruction: e.target.value };
                              updateActiveLesson({ ...activeLesson, steps });
                            }}
                            placeholder="e.g. 'Press Tab to switch to Arrangement View'"
                            className="w-full bg-[#181818] border border-[#333] rounded p-2 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-gray-400 font-bold">Technical Explanation (Markdown)</label>
                        <textarea
                          rows={2}
                          value={step.contentMarkdown}
                          onChange={(e) => {
                            const steps = [...activeLesson.steps];
                            steps[sIdx] = { ...steps[sIdx], contentMarkdown: e.target.value };
                            updateActiveLesson({ ...activeLesson, steps });
                          }}
                          className="w-full bg-[#181818] border border-[#333] rounded p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && activeCourse && (
            <div className="bg-[#181818] border border-[#333] p-6 rounded-2xl space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#2A2A2A] pb-3">
                <Settings className="w-4 h-4 text-[#90FF00]" />
                <span>Course Metadata & Global Configuration</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold">Course Title</label>
                  <input
                    type="text"
                    value={activeCourse.title}
                    onChange={(e) => setActiveCourse({ ...activeCourse, title: e.target.value })}
                    className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold">Genre Archetype</label>
                  <select
                    value={activeCourse.genre}
                    onChange={(e) => setActiveCourse({ ...activeCourse, genre: e.target.value as any })}
                    className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="Psytrance">Psytrance</option>
                    <option value="Melodic Techno">Melodic Techno</option>
                    <option value="Full-On">Full-On Psy</option>
                    <option value="Goa">Goa Trance</option>
                    <option value="Progressive">Progressive House/Trance</option>
                    <option value="Techno">Techno</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold">Subtitle</label>
                <input
                  type="text"
                  value={activeCourse.subtitle}
                  onChange={(e) => setActiveCourse({ ...activeCourse, subtitle: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold">Course Description</label>
                <textarea
                  rows={4}
                  value={activeCourse.description}
                  onChange={(e) => setActiveCourse({ ...activeCourse, description: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveCourse}
                  className="bg-[#90FF00] hover:bg-[#80e600] text-black px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Course Metadata</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'modules' && activeCourse && (
            <div className="bg-[#181818] border border-[#333] p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#90FF00]" />
                  <span>Course Modules Organizer</span>
                </h2>

                <button
                  onClick={() => {
                    const newModule: CourseModule = {
                      id: `mod_${Date.now()}`,
                      title: `Module ${(activeCourse.modules?.length || 0) + 1}: Intermediate Techniques`,
                      description: 'Specialized sound design and arrangement workflow.',
                      lessonIds: [],
                    };
                    const updatedModules = [...(activeCourse.modules || []), newModule];
                    setActiveCourse({ ...activeCourse, modules: updatedModules });
                  }}
                  className="bg-[#242424] hover:bg-[#303030] text-[#90FF00] border border-[#90FF00]/40 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Module</span>
                </button>
              </div>

              <div className="space-y-3">
                {(!activeCourse.modules || activeCourse.modules.length === 0) && (
                  <p className="text-xs text-gray-500 italic">No modules defined yet. Click "Add Module" to create one.</p>
                )}

                {activeCourse.modules?.map((mod, mIdx) => (
                  <div key={mod.id} className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => {
                          const updated = [...activeCourse.modules!];
                          updated[mIdx] = { ...updated[mIdx], title: e.target.value };
                          setActiveCourse({ ...activeCourse, modules: updated });
                        }}
                        className="font-bold text-xs bg-transparent border-b border-transparent hover:border-[#444] focus:border-[#90FF00] text-white focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const updated = activeCourse.modules!.filter((_, i) => i !== mIdx);
                          setActiveCourse({ ...activeCourse, modules: updated });
                        }}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={mod.description || ''}
                      onChange={(e) => {
                        const updated = [...activeCourse.modules!];
                        updated[mIdx] = { ...updated[mIdx], description: e.target.value };
                        setActiveCourse({ ...activeCourse, modules: updated });
                      }}
                      placeholder="Module description"
                      className="w-full text-xs text-gray-400 bg-transparent border-b border-transparent hover:border-[#333] focus:border-[#90FF00] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { projectService } from './projectService';
import { skillService } from './skillService';
import { mistakeService } from './mistakeService';
import { learningRecommendationService } from './learningRecommendationService';

export const aiToolService = {
  getStudentProfile() {
    return {
      name: 'Producer',
      experienceLevel: 'Beginner',
      language: 'he',
      streak: 5,
      xp: 1420,
    };
  },

  getProjectContext() {
    return projectService.createNewProject('My Full-On Track', 'Psytrance', 145, 'F', 'Minor');
  },

  getLearningProgress() {
    return {
      completedLessons: ['Ableton Basics', 'Kick Placement', 'Basic Drums'],
      currentLesson: 'Rolling Bass',
      productionStage: 3,
    };
  },

  getCurrentLesson() {
    return 'Rolling Bass';
  },

  getSkillLevels() {
    return skillService.getSkills();
  },

  getRecentMistakes() {
    return mistakeService.getUnresolved();
  },

  getPracticeHistory() {
    return [
      { date: 'Yesterday', durationMin: 20, activity: 'Drum sequencer practice' },
      { date: 'Today', durationMin: 15, activity: 'Bassline groove exercise' },
    ];
  },

  getCurrentPattern() {
    return {
      id: 'pat_1',
      name: 'Psytrance Rolling Bass (F Minor)',
      type: 'bassline',
      genre: 'Psytrance',
      bpm: 145,
      key: 'F',
      scale: 'Minor',
      notes: [
        { pitch: 'F1', time: 0.25, duration: 0.2, velocity: 100 },
        { pitch: 'F1', time: 0.5, duration: 0.2, velocity: 95 },
        { pitch: 'F1', time: 0.75, duration: 0.2, velocity: 105 },
      ],
    };
  },

  recommendLesson() {
    return learningRecommendationService.getRecommendation();
  },

  recordMistake(args: { category: string; concept: string; description: string }) {
    return mistakeService.recordMistake(args.category, args.concept, args.description);
  },

  recordStrength(args: { skill: string; level: number }) {
    return skillService.updateSkill(args.skill, args.level, 'AI Tool recorded strength');
  },

  updateLearningProgress(args: { lessonId: string }) {
    return { success: true, lessonId: args.lessonId };
  },
};

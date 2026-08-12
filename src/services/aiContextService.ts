import { projectService } from './projectService';
import { skillService } from './skillService';
import { mistakeService } from './mistakeService';
import { conversationSummaryService } from './conversationSummaryService';
import { aiToolService } from './aiToolService';

export interface AIContextObject {
  student: any;
  project: any;
  learning: any;
  currentLesson: string;
  skills: Record<string, number>;
  mistakes: any[];
  summary: any;
  language: string;
  aiMode: string;
}

export class AIContextService {
  public getStudentContext() {
    return aiToolService.getStudentProfile();
  }

  public getProjectContext() {
    return aiToolService.getProjectContext();
  }

  public getLearningContext() {
    return aiToolService.getLearningProgress();
  }

  public getCurrentLessonContext() {
    return aiToolService.getCurrentLesson();
  }

  public getRecentMistakes() {
    return aiToolService.getRecentMistakes();
  }

  public getSkillContext() {
    return aiToolService.getSkillLevels();
  }

  public getRecommendedNextStep() {
    return aiToolService.recommendLesson();
  }

  public buildAIContext(language = 'he', aiMode = 'TEACHER'): AIContextObject {
    return {
      student: this.getStudentContext(),
      project: this.getProjectContext(),
      learning: this.getLearningContext(),
      currentLesson: this.getCurrentLessonContext(),
      skills: this.getSkillContext(),
      mistakes: this.getRecentMistakes(),
      summary: conversationSummaryService.getSummary(),
      language,
      aiMode,
    };
  }

  public formatPromptWithContext(userMessage: string, language = 'he', aiMode = 'TEACHER'): string {
    const ctx = this.buildAIContext(language, aiMode);
    let prompt = `[SYSTEM ROLE: Project-Aware Personal Music Teacher in ${aiMode} mode]\n`;
    prompt += `Student: ${ctx.student.experienceLevel} level, Language: ${ctx.language}\n`;
    prompt += `Project: "${ctx.project.name}" | Genre: ${ctx.project.genre} (${ctx.project.subgenre || 'Full-On'}) | BPM: ${ctx.project.bpm} | Key: ${ctx.project.key} ${ctx.project.scale || 'Minor'}\n`;
    prompt += `Current Lesson: ${ctx.currentLesson} | Production Stage: Stage ${ctx.project.productionStage || 3}\n`;
    prompt += `Weakest Skill: ${JSON.stringify(skillService.getWeakestSkill())}\n`;
    if (ctx.mistakes.length > 0) {
      prompt += `Recent Unresolved Mistake: ${ctx.mistakes[0].description} (${ctx.mistakes[0].concept})\n`;
    }
    prompt += `\n[USER QUERY]\n${userMessage}\n`;
    prompt += `\nInstructions: Respond specifically to the student's actual project values (${ctx.project.genre} at ${ctx.project.bpm} BPM in ${ctx.project.key} Minor).`;
    if (language === 'he') {
      prompt += ` Answer in Hebrew (עברית) with technical terms (like BPM, MIDI, EQ, LUFS, Operator, Wavetable) kept in LTR English.`;
    }
    return prompt;
  }
}

export const aiContextService = new AIContextService();

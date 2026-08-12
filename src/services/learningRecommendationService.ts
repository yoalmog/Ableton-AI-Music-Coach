import { skillService } from './skillService';
import { mistakeService } from './mistakeService';

export interface RecommendationResult {
  nextLesson: string;
  reason: string;
  evidence: string;
  goal: string;
  estimatedTimeMin: number;
}

export class LearningRecommendationService {
  public getRecommendation(currentLesson = 'Rolling Bass', genre = 'Psytrance'): RecommendationResult {
    const weakest = skillService.getWeakestSkill();
    const unresolvedMistakes = mistakeService.getUnresolved();

    if (unresolvedMistakes.length > 0 && weakest.name === 'kickBass') {
      return {
        nextLesson: 'Kick + Bass Relationship & Sidechain',
        reason: 'Your Kick/Bass skill is currently measured at 48/100 and you have recent timing mistakes recorded in your bass pattern.',
        evidence: `Mistake recorded: "${unresolvedMistakes[0].description}" (${unresolvedMistakes[0].occurrences} occurrences)`,
        goal: 'Align kick and offbeat bass transients cleanly without phase clashing.',
        estimatedTimeMin: 15,
      };
    }

    if (currentLesson.toLowerCase().includes('bass')) {
      return {
        nextLesson: 'Rolling Bass Automation & Filter Modulation',
        reason: 'You are actively working on bass design and rhythm. Adding filter cutoff automation will bring life to your rolling bassline.',
        evidence: `Current lesson: ${currentLesson} | Genre: ${genre}`,
        goal: 'Draw envelope modulation on the Auto Filter cutoff across 16 bars.',
        estimatedTimeMin: 20,
      };
    }

    return {
      nextLesson: 'Arrangement Energy & Breakdown Building',
      reason: 'Your rhythm and bass foundation is established. Moving into arrangement structure will help you build a complete 6-minute track.',
      evidence: `Weakest skill is ${weakest.name} (${weakest.score}/100)`,
      goal: 'Map out Intro, Breakdown, Drop, and Outro sections in Arrangement View.',
      estimatedTimeMin: 25,
    };
  }

  public getSingleNextAction(): string {
    const rec = this.getRecommendation();
    return `Spend ${rec.estimatedTimeMin} minutes on "${rec.nextLesson}".`;
  }
}

export const learningRecommendationService = new LearningRecommendationService();

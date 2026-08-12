import { MistakeRecord } from '../types/student';

const STORAGE_KEY = 'aamc_mistakes_v2';

export class MistakeService {
  private mistakes: MistakeRecord[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.mistakes = JSON.parse(data);
      } else {
        // Initial default mistakes for testing/demo
        this.mistakes = [
          {
            id: 'm_1',
            category: 'bass',
            concept: 'kick-bass-timing',
            description: 'Bass starts too close to kick transient',
            severity: 'medium',
            firstDetected: new Date().toISOString(),
            lastDetected: new Date().toISOString(),
            occurrences: 3,
            resolved: false,
            recommendedExercise: 'Move offbeat bass notes 1/16th step later.',
          },
        ];
        this.save();
      }
    } catch {
      this.mistakes = [];
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mistakes));
    } catch {}
  }

  public getMistakes(): MistakeRecord[] {
    return this.mistakes;
  }

  public getUnresolved(): MistakeRecord[] {
    return this.mistakes.filter((m) => !m.resolved);
  }

  public recordMistake(category: string, concept: string, description: string, severity: 'low' | 'medium' | 'high' = 'medium', recommendedExercise = ''): MistakeRecord {
    const existing = this.mistakes.find((m) => m.concept === concept && !m.resolved);
    if (existing) {
      existing.occurrences += 1;
      existing.lastDetected = new Date().toISOString();
      if (description) existing.description = description;
      this.save();
      return existing;
    }

    const newRecord: MistakeRecord = {
      id: `mistake_${Date.now()}`,
      category,
      concept,
      description,
      severity,
      firstDetected: new Date().toISOString(),
      lastDetected: new Date().toISOString(),
      occurrences: 1,
      resolved: false,
      recommendedExercise,
    };

    this.mistakes.unshift(newRecord);
    this.save();
    return newRecord;
  }

  public resolveMistake(id: string): void {
    const m = this.mistakes.find((item) => item.id === id);
    if (m) {
      m.resolved = true;
      this.save();
    }
  }

  public reset(): void {
    this.mistakes = [];
    this.save();
  }
}

export const mistakeService = new MistakeService();

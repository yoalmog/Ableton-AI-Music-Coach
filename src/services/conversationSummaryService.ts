export interface ConversationSummary {
  studentLearned: string[];
  strugglesWith: string[];
  currentGoal: string;
  lastUpdated: string;
}

const STORAGE_KEY = 'aamc_conv_summary_v2';

export class ConversationSummaryService {
  private summary: ConversationSummary = {
    studentLearned: ['Ableton Session vs Arrangement View', 'Basic MIDI clip drawing', 'Kick placement on 1 and 3'],
    strugglesWith: ['Kick-bass frequency masking', 'Rolling bass envelope decay'],
    currentGoal: 'Complete Full-On Psytrance bassline at 145 BPM',
    lastUpdated: new Date().toISOString(),
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.summary = JSON.parse(data);
      }
    } catch {}
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.summary));
    } catch {}
  }

  public getSummary(): ConversationSummary {
    return this.summary;
  }

  public addLearned(concept: string) {
    if (!this.summary.studentLearned.includes(concept)) {
      this.summary.studentLearned.push(concept);
      this.summary.lastUpdated = new Date().toISOString();
      this.save();
    }
  }

  public addStruggle(concept: string) {
    if (!this.summary.strugglesWith.includes(concept)) {
      this.summary.strugglesWith.push(concept);
      this.summary.lastUpdated = new Date().toISOString();
      this.save();
    }
  }

  public setCurrentGoal(goal: string) {
    this.summary.currentGoal = goal;
    this.summary.lastUpdated = new Date().toISOString();
    this.save();
  }

  public reset() {
    this.summary = {
      studentLearned: ['Ableton Basics'],
      strugglesWith: ['Kick/Bass timing'],
      currentGoal: 'Finish first track',
      lastUpdated: new Date().toISOString(),
    };
    this.save();
  }
}

export const conversationSummaryService = new ConversationSummaryService();

export interface SkillScore {
  name: string;
  score: number; // 0-100
  evidenceCount: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'aamc_skills_v2';

const DEFAULT_SKILLS: Record<string, number> = {
  abletonBasics: 75,
  rhythm: 70,
  drums: 65,
  groove: 60,
  kick: 80,
  bass: 55,
  kickBass: 48,
  soundDesign: 62,
  synthesis: 58,
  melody: 60,
  harmony: 55,
  musicTheory: 50,
  arrangement: 35,
  automation: 40,
  eq: 45,
  compression: 30,
  sidechain: 38,
  stereo: 42,
  mixing: 41,
  mastering: 25,
  earTraining: 50,
};

export class SkillService {
  private skills: Record<string, number> = { ...DEFAULT_SKILLS };

  constructor() {
    this.load();
  }

  private load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.skills = JSON.parse(data);
      } else {
        this.save();
      }
    } catch {
      this.skills = { ...DEFAULT_SKILLS };
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.skills));
    } catch {}
  }

  public getSkills(): Record<string, number> {
    return { ...this.skills };
  }

  public getSkillLevel(skillName: string): number {
    return this.skills[skillName] ?? 50;
  }

  public updateSkill(skillName: string, delta: number, evidenceReason: string): number {
    const current = this.skills[skillName] ?? 50;
    const updated = Math.max(0, Math.min(100, Math.round(current + delta)));
    this.skills[skillName] = updated;
    this.save();
    return updated;
  }

  public getWeakestSkill(): { name: string; score: number } {
    let lowestName = 'kickBass';
    let lowestScore = 100;

    for (const [name, score] of Object.entries(this.skills)) {
      if (score < lowestScore) {
        lowestScore = score;
        lowestName = name;
      }
    }
    return { name: lowestName, score: lowestScore };
  }

  public reset(): void {
    this.skills = { ...DEFAULT_SKILLS };
    this.save();
  }
}

export const skillService = new SkillService();

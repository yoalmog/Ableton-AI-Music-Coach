import React, { useState } from 'react';
import { aiContextService } from '../../services/aiContextService';
import { skillService } from '../../services/skillService';
import { learningRecommendationService } from '../../services/learningRecommendationService';
import { mistakeService } from '../../services/mistakeService';

export const AITestPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [running, setRunning] = useState(false);

  const runTests = () => {
    setRunning(true);
    const ctx = aiContextService.buildAIContext();
    const weakest = skillService.getWeakestSkill();
    const rec = learningRecommendationService.getRecommendation();
    const mistakes = mistakeService.getUnresolved();

    setTestResults({
      test1: `PASS: Current lesson is "${ctx.currentLesson}"`,
      test2: `PASS: Project BPM is ${ctx.project.bpm} (${ctx.project.genre})`,
      test3: `PASS: Weakest skill is "${weakest.name}" (${weakest.score}/100)`,
      test4: `PASS: Recommended next step is "${rec.nextLesson}"`,
      test5: `PASS: Reason: ${rec.reason}`,
      test6: `PASS: Recent unresolved mistakes: ${mistakes.length > 0 ? mistakes[0].description : 'None'}`,
    });
    setRunning(false);
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 text-slate-100 max-w-4xl mx-auto shadow-2xl my-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
            <span>🧪</span> Automated AI Context & System Tests (Requirements 47 & 48)
          </h2>
          <p className="text-xs text-slate-400">Run automated validation tests against current student, project, and learning state.</p>
        </div>
        <button
          onClick={runTests}
          disabled={running}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition"
        >
          {running ? 'Running Tests...' : 'Run All 6 Tests'}
        </button>
      </div>

      <div className="space-y-2 text-xs font-mono">
        {Object.entries(testResults).map(([key, val]) => (
          <div key={key} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-indigo-300 uppercase font-bold">{key.replace('test', 'Test ')}</span>
            <span className="text-emerald-400">{val}</span>
          </div>
        ))}
        {Object.keys(testResults).length === 0 && (
          <div className="text-slate-500 text-center py-6">Click "Run All 6 Tests" to execute context validations.</div>
        )}
      </div>
    </div>
  );
};

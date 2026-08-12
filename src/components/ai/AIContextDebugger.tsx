import React, { useState } from 'react';
import { aiContextService } from '../../services/aiContextService';
import { ollamaService } from '../../services/ollamaService';
import { useLanguage } from '../../context/LanguageContext';

export const AIContextDebugger: React.FC = () => {
  const { isRtl } = useLanguage();
  const [ollamaStatus, setOllamaStatus] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const contextData = aiContextService.buildAIContext();

  const runOllamaCheck = async () => {
    setTesting(true);
    const status = await ollamaService.checkStatus();
    setOllamaStatus(status);
    setTesting(false);
  };

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 text-slate-100 max-w-4xl mx-auto shadow-2xl my-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <span>🛡️</span> AI Context Debugger (Developer Tool)
          </h2>
          <p className="text-xs text-slate-400">Inspect real-time Student, Project, and Learning contexts sent to AI models.</p>
        </div>
        <button
          onClick={runOllamaCheck}
          disabled={testing}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs font-semibold text-slate-950 transition"
        >
          {testing ? 'Checking Ollama...' : 'Test Ollama Connection (11434)'}
        </button>
      </div>

      {ollamaStatus && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4 text-xs font-mono">
          <div className="text-amber-300 font-semibold mb-1">Ollama Status Response:</div>
          <pre className="text-emerald-400 overflow-x-auto">{JSON.stringify(ollamaStatus, null, 2)}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
          <div className="text-indigo-400 font-bold mb-2 uppercase tracking-wider">Student Context</div>
          <pre className="text-slate-300 overflow-x-auto">{JSON.stringify(contextData.student, null, 2)}</pre>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
          <div className="text-indigo-400 font-bold mb-2 uppercase tracking-wider">Project Context</div>
          <pre className="text-slate-300 overflow-x-auto">{JSON.stringify(contextData.project, null, 2)}</pre>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
          <div className="text-indigo-400 font-bold mb-2 uppercase tracking-wider">Learning & Skills</div>
          <pre className="text-slate-300 overflow-x-auto">{JSON.stringify({ learning: contextData.learning, skills: contextData.skills }, null, 2)}</pre>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
          <div className="text-indigo-400 font-bold mb-2 uppercase tracking-wider">Mistakes & Summary</div>
          <pre className="text-slate-300 overflow-x-auto">{JSON.stringify({ mistakes: contextData.mistakes, summary: contextData.summary }, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

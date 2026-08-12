import { AIRequest } from './aiTypes';

export function formatAIContext(request: AIRequest): string {
  const { message, context, history } = request;
  let text = `[USER QUERY]\n${message}\n\n`;

  if (context) {
    text += `[PROJECT CONTEXT]\n`;
    if (context.genre) text += `- Primary Genre: ${context.genre}\n`;
    if (context.subgenre) text += `- Subgenre: ${context.subgenre}\n`;
    if (context.bpm) text += `- Tempo: ${context.bpm} BPM\n`;
    if (context.key) text += `- Root Key & Scale: ${context.key} ${context.scale || 'Minor'}\n`;
    if (context.currentModule) text += `- Current Active Module: ${context.currentModule}\n`;
    if (context.userLevel) text += `- Producer Level: ${context.userLevel}\n`;
    if (context.language) text += `- Selected UI Language: ${context.language}\n`;
    text += `\n`;
  }

  if (history && history.length > 0) {
    text += `[RECENT CONVERSATION HISTORY]\n`;
    // Take last 8 turns for context window efficiency on local models
    const recent = history.slice(-8);
    recent.forEach((item) => {
      const sender = item.sender === 'user' ? 'User' : 'Coach';
      text += `${sender}: ${item.text}\n`;
    });
    text += `\nRespond specifically to the latest query above.\n`;
  }

  return text;
}

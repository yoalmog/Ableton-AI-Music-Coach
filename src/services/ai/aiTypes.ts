export type AIMode = 'local-first' | 'local-only' | 'cloud-only' | 'auto';

export interface AIModel {
  id: string;
  name: string;
  sizeBytes?: number;
  sizeHuman?: string;
  family?: string;
  modifiedAt?: string;
}

export interface AISettings {
  mode: AIMode;
  localEndpoint: string;
  localModel: string;
  cloudProvider: 'gemini';
  cloudModel: string;
  privacyMode: boolean;
  fallbackEnabled: boolean;
  apiKey: string;
  userLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AIHealth {
  ok: boolean;
  provider: 'ollama' | 'gemini' | 'none';
  status: 'CONNECTED' | 'NOT RUNNING' | 'NO MODEL INSTALLED' | 'MISSING KEY' | 'ERROR' | 'OFFLINE';
  statusMessage: string;
  modelUsed?: string;
  latencyMs?: number;
  endpoint?: string;
  installedModels?: AIModel[];
}

export interface AIRequest {
  message: string;
  history?: Array<{ sender: 'user' | 'assistant' | 'coach'; text: string }>;
  context?: {
    genre?: string;
    subgenre?: string;
    bpm?: number;
    key?: string;
    scale?: string;
    currentModule?: string;
    userLevel?: string;
    language?: string;
  };
}

export interface StructuredAction {
  action: 'generate_midi' | 'suggest_drums' | 'sound_design_preset' | 'analyze_track';
  patternType?: string;
  genre?: string;
  bpm?: number;
  key?: string;
  scale?: string;
  notes?: Array<{ pitch: string; time: number; duration: number; velocity: number }>;
  abletonTips?: string;
  deviceSettings?: Record<string, any>;
}

export interface AIResponse {
  reply: string;
  provider: 'ollama' | 'gemini' | 'none';
  model: string;
  latencyMs: number;
  status: 'success' | 'error' | 'fallback' | 'privacy_blocked';
  offline: boolean;
  error?: string;
  structuredAction?: StructuredAction;
}

export interface AIProvider {
  id: string;
  name: string;
  isAvailable(): Promise<boolean>;
  getModels(): Promise<AIModel[]>;
  chat(request: AIRequest): Promise<AIResponse>;
  testConnection(params?: any): Promise<AIHealth>;
}

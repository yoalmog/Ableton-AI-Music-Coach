import { IntegrationModeState } from '../types/abletonSimulator';

class AbletonIntegrationService {
  private currentMode: IntegrationModeState['mode'] = 'simulator';
  private listeners: Set<(state: IntegrationModeState) => void> = new Set();

  public getModeState(): IntegrationModeState {
    return {
      mode: this.currentMode,
      isLiveConnected: false, // Honesty: Current build runs in Simulator Mode
      statusMessage: {
        en: this.currentMode === 'simulator'
          ? 'Running in Ableton Live 12 Visual Simulator Mode'
          : this.currentMode === 'manual'
          ? 'Manual DAW Mode: Follow instructions in your local Ableton Live 12'
          : 'Ableton Link & OSC Bridge Ready for Native Sync',
        he: this.currentMode === 'simulator'
          ? 'פועל במצב סימולטור ויזואלי של Ableton Live 12'
          : this.currentMode === 'manual'
          ? 'מצב עבודה ידני: בצע את הפעולות ב-Ableton Live המותקן במחשבך'
          : 'גשר Ableton Link ו-OSC מוכן לסנכרון מקומי',
        es: this.currentMode === 'simulator'
          ? 'Modo Simulador Visual de Ableton Live 12'
          : this.currentMode === 'manual'
          ? 'Modo Manual: Sigue las instrucciones en tu Ableton Live local'
          : 'Enlace Ableton Link & OSC listo para sincronización',
      },
    };
  }

  public setMode(mode: IntegrationModeState['mode']) {
    this.currentMode = mode;
    this.notify();
  }

  public subscribe(listener: (state: IntegrationModeState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getModeState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getModeState();
    this.listeners.forEach((l) => l(state));
  }
}

export const abletonIntegrationService = new AbletonIntegrationService();

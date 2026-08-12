export const debugLog = {
  log: (...args: any[]) => {
    if ((import.meta as any).env?.DEV) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if ((import.meta as any).env?.DEV) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if ((import.meta as any).env?.DEV) {
      console.error(...args);
    }
  },
};

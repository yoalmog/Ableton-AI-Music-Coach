import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ableton.aimusiccoach.app',
  appName: 'Ableton AI Music Coach',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

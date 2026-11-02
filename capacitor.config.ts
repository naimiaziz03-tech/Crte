import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // IMPORTANT: replace this with the exact applicationId/package ID of the old CRTE APK.
  appId: 'ma.crte.app',
  appName: 'CRTE',
  webDir: 'www',
  bundledWebRuntime: false
};

export default config;

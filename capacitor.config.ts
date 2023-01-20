import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moneyowl.app',
  appName: 'MoneyOwl Mobile',
  webDir: 'dist/NTUCDev',
  bundledWebRuntime: false,
  server: {
    cleartext: true
  }
};

export default config;

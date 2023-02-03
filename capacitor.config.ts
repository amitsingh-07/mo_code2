import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moneyowl.app',
  appName: 'MoneyOwl Mobile',
  webDir: 'dist/NTUCDev',
  bundledWebRuntime: false,
  server: {
    cleartext: true
  },​
  plugins: {​
    SplashScreen: {​
    launchShowDuration: 3000,​
    launchAutoHide: true,​
    backgroundColor: "#ffffffff",​
    androidSplashResourceName: "splash",​
    androidScaleType: "CENTER_CROP",​
    showSpinner: false,​
    androidSpinnerStyle: "large",​
    iosSpinnerStyle: "small",​
    spinnerColor: "#999999",​
    splashFullScreen: true,​
    splashImmersive: true,​
    layoutName: "launch_screen",​
    useDialog: true,​
  }},
};

export default config;

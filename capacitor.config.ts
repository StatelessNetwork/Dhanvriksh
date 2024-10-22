import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.DhanVriksh.App',
  appName: 'Dhan Vriksh',
  webDir: 'www',
  server: {
    androidScheme: 'http'
  },
  plugins: {
      "PushNotifications": {
        "presentationOptions": ["badge", "sound", "alert"]
      },
      LocalNotifications: {
        iconColor: "#488AFF"
      }
    }
};

export default config;

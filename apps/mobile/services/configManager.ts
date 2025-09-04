import Constants from 'expo-constants';

interface AppConfig {
  apiUrl: string;
  webUrl: string;
  websocketUrl: string;
  environment: string;
  isDevelopment: boolean;
  features: {
    phoneAuth: boolean;
    realTimeChat: boolean;
    fileSharing: boolean;
    gpsTracking: boolean;
  };
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    const extras = this.getExtras();
    const isDevelopment = (extras.ENVIRONMENT || 'development') === 'development';

    this.config = {
      apiUrl: isDevelopment 
        ? (extras.API_BASE_URL || 'http://localhost:5000/api')
        : (extras.PROD_API_URL || 'https://api.yourbackend.com/api'),
      webUrl: isDevelopment 
        ? (extras.WEB_BASE_URL || 'http://localhost:3000')
        : (extras.PROD_WEB_URL || 'https://yourwebapp.com'),
      websocketUrl: isDevelopment 
        ? (extras.WEBSOCKET_URL || 'ws://localhost:5000')
        : (extras.PROD_WEBSOCKET_URL || 'wss://api.yourbackend.com'),
      environment: extras.ENVIRONMENT || 'development',
      isDevelopment,
      features: {
        phoneAuth: extras.PHONE_AUTH_ENABLED !== 'false',
        realTimeChat: extras.REALTIME_CHAT_ENABLED !== 'false',
        fileSharing: extras.FILE_SHARING_ENABLED !== 'false',
        gpsTracking: extras.GPS_TRACKING_ENABLED !== 'false',
      }
    };
  }

  private getExtras(): any {
    return (Constants as any)?.expoConfig?.extra ||
           (Constants as any)?.manifest?.extra ||
           (Constants as any)?.manifestExtra ||
           {};
  }

  getConfig(): AppConfig {
    return this.config;
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get webUrl(): string {
    return this.config.webUrl;
  }

  get websocketUrl(): string {
    return this.config.websocketUrl;
  }

  get isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  get environment(): string {
    return this.config.environment;
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  // Helper to generate URLs for linking to web frontend
  getWebUrlFor(path: string, params?: Record<string, string>): string {
    let url = `${this.webUrl}${path}`;
    
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  // Helper for deep linking between web and mobile
  getDeepLinkUrl(path: string, params?: Record<string, string>): string {
    const scheme = 'collab-mobile'; // Should match app.config.js scheme
    let url = `${scheme}://${path}`;
    
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }
}

export const configManager = new ConfigManager();
export default configManager;

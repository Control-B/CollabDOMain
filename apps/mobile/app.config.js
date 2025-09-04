import 'dotenv/config';

export default {
  expo: {
    name: "CollabMobile",
    slug: "collab-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "collab-mobile",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // Environment variables for different stages
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api',
      WEB_BASE_URL: process.env.WEB_BASE_URL || 'http://localhost:3000',
      WEBSOCKET_URL: process.env.WEBSOCKET_URL || 'ws://localhost:5000',
      ENVIRONMENT: process.env.NODE_ENV || 'development',
      
      // Production URLs (update these with your actual URLs)
      PROD_API_URL: process.env.PROD_API_URL || 'https://api.yourbackend.com/api',
      PROD_WEB_URL: process.env.PROD_WEB_URL || 'https://yourwebapp.com',
      PROD_WEBSOCKET_URL: process.env.PROD_WEBSOCKET_URL || 'wss://api.yourbackend.com',
    }
  }
};

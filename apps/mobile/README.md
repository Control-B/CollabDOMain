# CollabAzureMobile

A React Native mobile application built with Expo for collaborative logistics and fleet management. This mobile app works in conjunction with the web frontend and backend API to provide a complete transportation management solution.

## 🚀 Features

- **📱 Cross-Platform**: iOS, Android, and Web support
- **🔐 Authentication**: Phone number authentication (WhatsApp-style)
- **📊 Trip Management**: Create, track, and manage delivery trips
- **📍 Real-time Tracking**: GPS tracking and geofencing
- **📄 Document Management**: Digital signatures and document handling
- **💬 Real-time Chat**: Channel-based communication system
- **🚪 Door Status**: Monitor and control loading dock doors
- **📁 File Sharing**: Upload and manage delivery documents
- **🔔 Notifications**: Real-time alerts and updates

## 🏗️ Architecture

This mobile app is part of a larger ecosystem:

- **Mobile App** (This repository): React Native with Expo
- **Web Frontend**: React/Next.js dashboard
- **Backend API**: Node.js/Express or ASP.NET Core
- **Database**: PostgreSQL/SQL Server
- **Real-time**: WebSocket connections

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CollabAzureMobile.git
   cd CollabAzureMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```
   API_BASE_URL=http://your-backend-api.com/api
   WEB_BASE_URL=http://your-web-frontend.com
   WEBSOCKET_URL=ws://your-backend-api.com
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

## 📱 Running the App

### Development Mode

```bash
npx expo start
```

Then:
- **iOS**: Press `i` or scan QR code with Camera app
- **Android**: Press `a` or scan QR code with Expo Go
- **Web**: Press `w` or open http://localhost:8081

### Building for Production

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Build for Web
npx expo build:web
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with these variables:

```env
# Backend API URL
API_BASE_URL=http://localhost:5000/api

# Web Frontend URL  
WEB_BASE_URL=http://localhost:3000

# WebSocket URL
WEBSOCKET_URL=ws://localhost:5000

# Environment
NODE_ENV=development

# Production URLs
PROD_API_URL=https://api.yourbackend.com/api
PROD_WEB_URL=https://yourwebapp.com
PROD_WEBSOCKET_URL=wss://api.yourbackend.com
```

### App Configuration

The app uses `app.config.js` for Expo configuration and environment management.

## 📂 Project Structure

```
CollabAzureMobile/
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   ├── chat/              # Chat screens
│   ├── checkin/           # Check-in screens
│   └── trip-details/      # Trip detail screens
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── services/              # API and external services
├── store/                 # State management (Zustand)
├── types/                 # TypeScript type definitions
└── assets/               # Images, fonts, and static assets
```

## 🔑 Key Components

### Authentication
- Phone number verification
- JWT token management
- Persistent login state

### Trip Management
- Create and track trips
- Real-time progress updates
- GPS tracking integration

### Chat System
- Channel-based communication
- Real-time messaging
- File sharing capabilities

### Document Management
- Digital signature capture
- Document upload/download
- PDF generation

## 🌐 API Integration

The app integrates with your backend through:

- **REST API**: CRUD operations and data management
- **WebSocket**: Real-time updates and chat
- **File Upload**: Document and media handling

### API Service

```typescript
import { apiService } from './services/api';

// Authentication
await apiService.sendPhoneVerification('+1234567890');
await apiService.verifyPhoneCode('+1234567890', '123456');

// Trip management
await apiService.createTrip(tripData);
await apiService.updateTrip(tripId, updates);

// Document handling
await apiService.uploadDocument(formData);
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark Theme**: Optimized for mobile usage
- **Responsive**: Works on various screen sizes
- **Accessibility**: Screen reader support
- **Offline Support**: Basic functionality when offline

## 🔄 State Management

Uses Zustand for lightweight state management:

```typescript
import { useChatStore } from './store/chatStore';

const { channels, toggleDoorStatus } = useChatStore();
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Building & Deployment

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for production
eas build --platform all
```

### Expo Build (Legacy)

```bash
# Build for stores
expo build:ios
expo build:android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **Web Frontend**: [CollabAzureWeb](https://github.com/yourusername/CollabAzureWeb)
- **Backend API**: [CollabAzureAPI](https://github.com/yourusername/CollabAzureAPI)

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@yourcompany.com
- 📱 Phone: +1 (555) 123-4567
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/CollabAzureMobile/issues)

## 🚀 Getting Started with Development

1. **Set up your development environment**
2. **Connect to your backend API**
3. **Configure authentication**
4. **Test on physical devices**
5. **Deploy to app stores**

---

Built with ❤️ using React Native and Expo



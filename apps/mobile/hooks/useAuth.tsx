import { useState, useEffect, createContext, useContext } from 'react';
import { apiService } from '../services/api';
import { configManager } from '../services/configManager';

interface User {
  id: string;
  phoneNumber?: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPhone: (phoneNumber: string, verificationCode: string) => Promise<boolean>;
  sendPhoneVerification: (phoneNumber: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try to get user profile to verify token
      setLoading(false); // For now, just set loading to false
      // TODO: Add a getUserProfile method to apiService
    } catch {
      console.log('No valid session found');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(email, password);
      if (response.success && response.data) {
        const authData = response.data as { token: string; user: User };
        await apiService.setAuthToken(authData.token);
        setUser(authData.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const sendPhoneVerification = async (phoneNumber: string): Promise<boolean> => {
    try {
      const response = await apiService.sendPhoneVerification(phoneNumber);
      return response.success;
    } catch (error) {
      console.error('Failed to send verification:', error);
      return false;
    }
  };

  const loginWithPhone = async (phoneNumber: string, verificationCode: string): Promise<boolean> => {
    try {
      const response = await apiService.verifyPhoneCode(phoneNumber, verificationCode);
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Phone login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local state even if API call fails
      setUser(null);
      await apiService.clearAuthToken();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithPhone,
    sendPhoneVerification,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to get environment info
export function useAppConfig() {
  return {
    ...configManager.getConfig(),
    getWebUrl: configManager.getWebUrlFor.bind(configManager),
    getDeepLink: configManager.getDeepLinkUrl.bind(configManager),
  };
}

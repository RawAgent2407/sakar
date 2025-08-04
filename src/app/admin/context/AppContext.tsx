import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Property, Settings } from '../types';

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  user: { email: string } | null;
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('properties');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'Real Estate CMS',
      language: 'English',
      timezone: 'UTC',
    },
    preferences: {
      theme: 'dark',
      notifications: true,
    },
    security: {
      twoFA: false,
      sessionTimeout: 30,
    },
    properties: {
      defaultType: 'Apartment',
      customFields: [],
      statusTypes: ['Ready', 'Under Construction', 'Upcoming'],
    },
    integrations: {
      apiKey: '',
      webhooks: [],
    },
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setUser({ email });
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ email }));
        setCurrentPage('dashboard');
        showToast('Login successful!', 'success');
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        showToast(data.message || 'Login failed', 'error');
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      showToast('Login failed. Please try again.', 'error');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setCurrentPage('dashboard');
    showToast('Logged out successfully', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isAuthenticated,
        login,
        logout,
        user,
        properties,
        setProperties,
        settings,
        setSettings,
        showToast,
        toast,
        selectedProperty,
        setSelectedProperty,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
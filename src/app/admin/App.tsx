import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { Dashboard } from './components/pages/Dashboard';
import { Properties } from './components/pages/Properties';
import { Login } from './components/pages/Login';
import { PropertyForm } from './components/pages/PropertyForm';
import { Inquiries } from './components/pages/Inquiries';
import { Settings } from './components/pages/Settings';
import ArticlesAdmin from './components/pages/Articles';
import Groups from './components/pages/Groups';
import PropertyCategories from './components/pages/PropertyCategories';

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentPage, toast, isAuthenticated, login } = useApp();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'properties':
        return <Properties />;
      case 'property-form':
        return <PropertyForm />;
      case 'inquiries':
        return <Inquiries />;
      case 'articles':
        return <ArticlesAdmin />;
      case 'groups':
        return <Groups />;
      case 'property-categories':
        return <PropertyCategories />;
      default:
        return <Dashboard />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-black">
        <Login onLogin={login} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => {}}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header onMenuToggle={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
        
        <Footer />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => {}}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
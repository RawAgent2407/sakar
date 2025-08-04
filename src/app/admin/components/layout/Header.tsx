import React from 'react';
import { Search, Bell, User, Menu, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout, setCurrentPage } = useApp();

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          icon={Menu}
          onClick={onMenuToggle}
          className="lg:hidden"
        >{''}</Button>
        
        {/* Search bar removed as per request */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Removed Bell icon button */}
        <Button 
          variant="ghost" 
          size="sm" 
          icon={LogOut} 
          onClick={logout}
          className="text-gray-400 hover:text-red-400"
        >{''}</Button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-300" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">{user?.email || 'Admin'}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Key, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleDisplayName, getRoleBadgeColor } from '../../utils/roleUtils';

interface ProfileMenuProps {
  onChangePassword?: () => void;
}

export default function ProfileMenu({ onChangePassword }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleChangePassword = () => {
    if (onChangePassword) {
      onChangePassword();
    }
    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 md:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-target"
      >
        {/* Avatar */}
        <div className="w-8 h-8 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {getInitials(user.user_name)}
        </div>
        
        {/* User Info - Hidden on small mobile screens */}
        <div className="hidden sm:flex flex-col items-start text-left min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate max-w-24 md:max-w-32">
            {user.user_name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {user.user_id}
          </div>
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                {getInitials(user.user_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user.user_name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user.email || user.user_id}
                </div>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
                {user.jurisdiction && (
                  <div className="text-xs text-gray-400 mt-1">
                    📍 {user.jurisdiction}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Profile */}
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-4 py-3 md:py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-target"
            >
              <User className="w-4 h-4 mr-3 text-gray-400" />
              <span>View Profile</span>
            </button>

            {/* Change Password */}
            <button
              onClick={handleChangePassword}
              className="flex items-center w-full px-4 py-3 md:py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-target"
            >
              <Key className="w-4 h-4 mr-3 text-gray-400" />
              <span>Change Password</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-4 py-3 md:py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-target"
            >
              <Settings className="w-4 h-4 mr-3 text-gray-400" />
              <span>Settings</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 md:py-2 text-sm text-red-600 hover:bg-red-50 transition-colors touch-target"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Sign out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              Session expires in 24h
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
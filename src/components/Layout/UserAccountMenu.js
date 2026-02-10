import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Settings, 
  Key, 
  Trash2, 
  LogOut, 
  ChevronDown,
  Edit3,
  Shield
} from 'lucide-react';
import ChangeUsernameModal from './ChangeUsernameModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';

const UserAccountMenu = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const openModal = (modalType) => {
    setIsDropdownOpen(false);
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getDisplayName = () => {
    if (user?.user_type === 'company' && user?.company_profile?.company_name) {
      return user.company_profile.company_name;
    }
    return user?.username || '';
  };

  const getDisplayInitials = () => {
    const displayName = getDisplayName();
    return displayName ? displayName.charAt(0).toUpperCase() : 'U';
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'admin':
        return 'from-primary-600 to-primary-700';
      case 'company':
        return 'from-primary-500 to-primary-600';
      case 'influencer':
        return 'from-primary-600 to-primary-700';
      default:
        return 'from-primary-600 to-primary-700';
    }
  };

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'admin':
        return Shield;
      case 'company':
        return Settings;
      case 'influencer':
        return User;
      default:
        return User;
    }
  };

  const menuItems = [
    {
      id: 'change-username',
      label: 'Change Username',
      icon: Edit3,
      action: () => openModal('username'),
      description: 'Update your display name'
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: Key,
      action: () => openModal('password'),
      description: 'Update your account password'
    },
    {
      id: 'delete-account',
      label: 'Delete Account',
      icon: Trash2,
      action: () => openModal('delete'),
      description: 'Permanently delete your account',
      danger: true
    }
  ];

  const UserTypeIcon = getUserTypeIcon(user?.user_type);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Avatar Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 p-1 rounded-xl hover:bg-dark-700/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 group"
          aria-label="User account menu"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          {/* Avatar */}
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${getUserTypeColor(user?.user_type)} flex items-center justify-center text-white font-semibold text-sm sm:text-base shadow-lg ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-200`}>
            {getDisplayInitials()}
          </div>

          {/* User Info (Hidden on mobile) */}
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-900 truncate max-w-24 lg:max-w-32">
                {getDisplayName()}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-900 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className="flex items-center space-x-1">
              <UserTypeIcon className="w-3 h-3 text-gray-900" />
              <span className="text-xs text-gray-900 capitalize">
                {user?.user_type}
              </span>
            </div>
          </div>

          {/* Mobile Chevron */}
          <ChevronDown className={`w-4 h-4 text-gray-900 transition-transform duration-200 sm:hidden ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 sm:w-80 glass-card rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-dark-800/50 to-dark-700/50">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getUserTypeColor(user?.user_type)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {getDisplayInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {getDisplayName()}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <UserTypeIcon className="w-4 h-4 text-gray-900" />
                    <span className="text-sm text-gray-900 capitalize">
                      {user?.user_type} Account
                    </span>
                  </div>
                  {user?.email && (
                    <p className="text-xs text-gray-900 truncate mt-1">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-dark-700/30 transition-all duration-200 group ${
                      item.danger ? 'hover:bg-red-500/10' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      item.danger 
                        ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20' 
                        : 'bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${
                        item.danger ? 'text-red-400' : 'text-gray-900'
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-900">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Logout Section */}
            <div className="border-t border-white/10 p-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-dark-700/30 transition-all duration-200 group rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-500/10 text-gray-900 group-hover:bg-gray-500/20 flex items-center justify-center transition-all duration-200">
                  <LogOut className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">
                    Sign Out
                  </p>
                  <p className="text-xs text-gray-900">
                    Sign out of your account
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal === 'username' && (
        <ChangeUsernameModal isOpen={true} onClose={closeModal} />
      )}
      {activeModal === 'password' && (
        <ChangePasswordModal isOpen={true} onClose={closeModal} />
      )}
      {activeModal === 'delete' && (
        <DeleteAccountModal isOpen={true} onClose={closeModal} />
      )}
    </>
  );
};

export default UserAccountMenu;
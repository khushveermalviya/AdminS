import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import {
  BookOpen,
  ClipboardList,
  User,
  Calendar,
  FileText,
  Bell,
  Search,
  Menu,
  X,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const LogoutConfirmDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Logout</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to log out of your account?</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const FacultyNav = ({ isOpen, closeNav, onLogout }) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  
  const navItems = [
    { icon: <BookOpen className="w-5 h-5" />, title: 'Dashboard', path: '' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Subjects', path: 'subjects' },
    { icon: <User className="w-5 h-5" />, title: 'Students', path: 'class' },
    { icon: <ClipboardList className="w-5 h-5" />, title: 'Attendance', path: 'attendance' },
    { icon: <Calendar className="w-5 h-5" />, title: 'Timetable', path: 'timetable' },
    { icon: <User className="w-5 h-5" />, title: 'Result', path: 'Result' },
    { icon: <FileText className="w-5 h-5" />, title: 'Reports', path: 'reports' }

  ];
  
  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };
  
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out w-64 bg-white dark:bg-gray-800 shadow-lg z-40 md:translate-x-0 flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Faculty Panel</h2>
          <button className="md:hidden text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={closeNav}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-4 flex-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                ${isActive ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white' : ''}
              `}
              onClick={closeNav}
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
          <button 
            className="flex items-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={handleLogoutClick}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <LogoutConfirmDialog 
        isOpen={isLogoutDialogOpen} 
        onClose={() => setIsLogoutDialogOpen(false)} 
        onConfirm={() => {
          setIsLogoutDialogOpen(false);
          onLogout();
        }} 
      />
    </>
  );
};

const FacultyHeader = ({ searchQuery, setSearchQuery, openNav, onLogout }) => {
  const [username, setUsername] = useState("Guest User");
  const [toastShown, setToastShown] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('currentUsername');
    if (storedUsername) {
      setUsername(storedUsername);
      
      // Display welcome toast when username is loaded
      if(!toastShown){
        toast.custom((t) => (
          <div className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 animate-pulse" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Welcome back, {storedUsername}!
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You're successfully logged in to the faculty panel
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus:outline-none"
              >
                Dismiss
              </button>
            </div>
          </div>
        ), { duration: 5000 });
        setToastShown(true);
      }
    }
  }, [toastShown]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <button className="md:hidden p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={openNav}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative flex-1 md:ml-6">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white w-full md:w-64"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="relative profile-dropdown">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Faculty</p>
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <LogoutConfirmDialog 
        isOpen={isLogoutDialogOpen} 
        onClose={() => setIsLogoutDialogOpen(false)} 
        onConfirm={() => {
          setIsLogoutDialogOpen(false);
          onLogout();
        }} 
      />
    </>
  );
};

export default function Faculty() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  const openNav = () => setIsNavOpen(true);
  const closeNav = () => setIsNavOpen(false);
  
  // Centralized logout function
  const handleLogout = () => {
    // Show logout toast notification
    toast.success('Successfully logged out', {
      duration: 3000
    });
    
    // Remove token from localStorage
    localStorage.removeItem('tokenss');
    localStorage.removeItem('currentUsername');
    
    // Navigate to login page after a brief delay
    setTimeout(() => {
      navigate('/FacilityAuth');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <FacultyNav isOpen={isNavOpen} closeNav={closeNav} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <FacultyHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          openNav={openNav} 
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
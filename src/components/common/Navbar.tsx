import React, { useState } from 'react';
import {
  Heart,
  AlertTriangle,
  Search,
  Bot,
  User as UserIcon,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  ChevronDown,
  Building2,
  Stethoscope,
  ShieldAlert,
  LogOut,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { currentUser, currentRole, selectRole, logout, notifications, markNotificationRead } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'patient', label: 'Patient', desc: 'Book appointments & view prescriptions' },
    { role: 'doctor', label: 'Doctor', desc: 'Manage appointments & write Rx' },
    { role: 'admin', label: 'Hospital Admin', desc: 'Manage beds, doctors & analytics' },
    { role: 'guest', label: 'Regular User', desc: 'Browse hospitals & emergency info' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    selectRole(role);
    setIsRoleDropdownOpen(false);
    if (role === 'patient') onNavigate('patient-dashboard');
    else if (role === 'doctor') onNavigate('doctor-dashboard');
    else if (role === 'admin') onNavigate('admin-dashboard');
    else onNavigate('hospitals');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 text-white fill-white/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 dark:from-sky-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                MedConnect
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 rounded-md uppercase tracking-wider">
                AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Healthcare Ecosystem
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
              currentTab === 'home'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('hospitals')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              currentTab === 'hospitals'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-sky-500" />
            Hospitals
          </button>

          <button
            onClick={() => onNavigate('doctors')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              currentTab === 'doctors'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
            Doctors
          </button>

          <button
            onClick={() => onNavigate('ai-chatbot')}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              currentTab === 'ai-chatbot'
                ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-sky-400 dark:text-sky-300" />
            AI Assistant
          </button>

          {currentUser && currentUser.role !== 'guest' && (
            <button
              onClick={() => {
                if (currentRole === 'patient') onNavigate('patient-dashboard');
                else if (currentRole === 'doctor') onNavigate('doctor-dashboard');
                else if (currentRole === 'admin') onNavigate('admin-dashboard');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                currentTab.includes('dashboard')
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              Dashboard
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Role Dropdown ("I am...") - Prompt requirement */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/70 transition-colors"
            >
              <span className="text-slate-400">I am:</span>
              <span className="capitalize font-bold text-sky-600 dark:text-sky-400">
                {currentRole === 'admin' ? 'Hospital Admin' : currentRole}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSelect(r.role)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors flex flex-col ${
                      currentRole === r.role
                        ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold">{r.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {r.desc}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zero-Login Emergency Button (Prompt requirement) */}
          <button
            onClick={() => onNavigate('emergency')}
            className="relative px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/30 flex items-center gap-2 group transition-transform active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <AlertTriangle className="w-4 h-4 fill-white/20" />
            <span className="hidden sm:inline">Emergency Help</span>
            <span className="sm:hidden">Emergency</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Drawer */}
          {currentUser && currentUser.role !== 'guest' && (
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Notifications</h4>
                    <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-full">
                      {unreadCount} unread
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                            n.read
                              ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                              : 'bg-sky-50/80 dark:bg-sky-950/60 text-slate-900 dark:text-slate-100 font-medium border border-sky-200/50 dark:border-sky-800/50'
                          }`}
                        >
                          <div className="font-semibold text-slate-900 dark:text-white">{n.title}</div>
                          <p className="text-[11px] mt-0.5 text-slate-500 dark:text-slate-400">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile or Auth Trigger */}
          {currentUser && currentUser.role !== 'guest' ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-sky-500/40"
              />
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-500/20 transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <button
            onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('hospitals'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-sky-500" /> Browse Hospitals
          </button>
          <button
            onClick={() => { onNavigate('doctors'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Stethoscope className="w-4 h-4 text-teal-500" /> Find Doctors
          </button>
          <button
            onClick={() => { onNavigate('ai-chatbot'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-teal-600 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" /> AI Health & Image Assistant
          </button>
          <button
            onClick={() => { onNavigate('emergency'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" /> Emergency Triage Unit
          </button>
        </div>
      )}
    </header>
  );
};

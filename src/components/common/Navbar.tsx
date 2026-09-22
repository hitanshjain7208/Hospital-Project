import React, { useState, useEffect } from 'react';
import {
  Heart,
  AlertTriangle,
  Search,
  Bot,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  ChevronDown,
  Building2,
  Stethoscope,
  LogOut,
  Calendar,
  ShieldAlert,
  User,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'patient', label: 'Patient', desc: 'Appointments & prescriptions' },
    { role: 'doctor', label: 'Doctor', desc: 'Manage patients & write Rx' },
    { role: 'admin', label: 'Hospital Admin', desc: 'Beds, staff & analytics' },
    { role: 'guest', label: 'Guest', desc: 'Browse publicly' },
  ];

  const handleRole = (role: UserRole) => {
    selectRole(role);
    setRoleOpen(false);
    if (role === 'patient') onNavigate('patient-dashboard');
    else if (role === 'doctor') onNavigate('doctor-dashboard');
    else if (role === 'admin') onNavigate('admin-dashboard');
    else onNavigate('hospitals');
  };

  const dashTab =
    currentRole === 'patient' ? 'patient-dashboard' :
    currentRole === 'doctor' ? 'doctor-dashboard' : 'admin-dashboard';

  const isActive = (tab: string) =>
    currentTab === tab ||
    (tab === 'hospitals' && currentTab === 'hospital-detail') ||
    (tab === 'doctors' && currentTab === 'doctor-detail') ||
    (tab === dashTab && currentTab.includes('dashboard'));

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-md)] border-b border-[var(--border)]'
            : 'bg-[var(--bg-base)]'
        }`}
      >
        <div className="site-container">
          <div className="flex items-center justify-between h-[72px] gap-8">

            {/* ── Logo ── */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{ background: 'var(--green)' }}
              >
                <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="text-[1.05rem] font-bold tracking-tight transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                MedConnect
                <span className="ml-1 text-[0.625rem] font-bold tracking-widest uppercase align-middle"
                  style={{ color: 'var(--green)' }}>AI</span>
              </span>
            </button>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-7">
              {[
                { tab: 'home', label: 'Home' },
                { tab: 'hospitals', label: 'Hospitals' },
                { tab: 'doctors', label: 'Doctors' },
                { tab: 'ai-chatbot', label: 'AI Assistant' },
              ].map(({ tab, label }) => (
                <button
                  key={tab}
                  onClick={() => onNavigate(tab)}
                  className={`nav-link ${isActive(tab) ? 'active' : ''}`}
                >
                  {label}
                </button>
              ))}
              {currentUser && currentUser.role !== 'guest' && (
                <button
                  onClick={() => onNavigate(dashTab)}
                  className={`nav-link ${currentTab.includes('dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </button>
              )}
            </nav>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-2">

              {/* Role Switcher */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setRoleOpen(!roleOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] font-medium transition-all duration-200"
                  style={{
                    background: 'var(--bg-muted)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="capitalize font-semibold" style={{ color: 'var(--green)' }}>
                    {currentRole === 'admin' ? 'Admin' : currentRole}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
                </button>

                {roleOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl p-1.5 z-50 animate-fade-in"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                      Switch Role
                    </p>
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => handleRole(r.role)}
                        className="w-full text-left px-3 py-2.5 rounded-xl flex flex-col transition-all duration-150"
                        style={{
                          background: currentRole === r.role ? 'var(--green-light)' : 'transparent',
                          color: currentRole === r.role ? 'var(--green)' : 'var(--text-secondary)',
                        }}
                        onMouseEnter={(e) => {
                          if (currentRole !== r.role) (e.currentTarget as HTMLElement).style.background = 'var(--bg-muted)';
                        }}
                        onMouseLeave={(e) => {
                          if (currentRole !== r.role) (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                      >
                        <span className="text-xs font-semibold">{r.label}</span>
                        <span className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Emergency */}
              <button onClick={() => onNavigate('emergency')} className="btn btn-emergency btn-sm flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Emergency</span>
              </button>

              {/* Theme */}
              <button onClick={toggleTheme} className="btn-icon" title="Toggle theme">
                {theme === 'dark'
                  ? <Sun className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                  : <Moon className="w-4 h-4" />
                }
              </button>

              {/* Notifications */}
              {currentUser && currentUser.role !== 'guest' && (
                <div className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)} className="btn-icon relative">
                    <Bell className="w-4 h-4" />
                    {unread > 0 && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)' }} />
                    )}
                  </button>

                  {notifOpen && (
                    <div
                      className="absolute right-0 mt-2 w-80 rounded-2xl p-3 z-50 animate-fade-in"
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-lg)',
                      }}
                    >
                      <div className="flex items-center justify-between pb-2.5 mb-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                        {unread > 0 && (
                          <span className="tag tag-green text-[10px]">{unread} new</span>
                        )}
                      </div>
                      <div className="space-y-1.5 max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-xs py-3 text-center" style={{ color: 'var(--text-muted)' }}>No notifications yet.</p>
                        ) : notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className="p-2.5 rounded-xl text-xs cursor-pointer transition-all"
                            style={{
                              background: n.read ? 'var(--bg-muted)' : 'var(--green-light)',
                              border: n.read ? 'none' : '1px solid var(--border)',
                            }}
                          >
                            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</div>
                            <p className="mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                            <span className="text-[10px] mt-1 block" style={{ color: 'var(--text-muted)' }}>{n.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User / Sign In */}
              {currentUser && currentUser.role !== 'guest' ? (
                <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid var(--border)' }}>
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                    style={{ outline: '2px solid var(--border)', outlineOffset: '1px' }}
                  />
                  <button onClick={logout} className="btn-icon" title="Log out">
                    <LogOut className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
              ) : (
                <button onClick={() => onNavigate('login')} className="btn btn-primary btn-sm">
                  Sign in
                </button>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-icon lg:hidden">
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden pt-[72px] animate-fade-in"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="p-5 space-y-1">
            {[
              { tab: 'home', label: 'Home' },
              { tab: 'hospitals', label: 'Hospitals' },
              { tab: 'doctors', label: 'Doctors' },
              { tab: 'ai-chatbot', label: 'AI Assistant' },
            ].map(({ tab, label }) => (
              <button
                key={tab}
                onClick={() => { onNavigate(tab); setMobileOpen(false); }}
                className="w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all"
                style={{
                  color: currentTab === tab ? 'var(--green)' : 'var(--text-secondary)',
                  background: currentTab === tab ? 'var(--green-light)' : 'transparent',
                }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate('emergency'); setMobileOpen(false); }}
              className="w-full text-left px-5 py-4 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all"
              style={{ color: 'var(--red)', background: 'var(--red-light)' }}
            >
              <ShieldAlert className="w-4 h-4" /> Emergency Care
            </button>
          </div>
        </div>
      )}
    </>
  );
};

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Search,
  Bookmark,
  FileCheck2,
  Bell,
  User,
  Settings,
  ShieldAlert,
  BarChart3,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, isAdmin, isStudent } = useAuth();
  const { unreadCount } = useNotifications();

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore All', path: '/scholarships', icon: Search },
    { name: 'Saved Scholarships', path: '/saved', icon: Bookmark },
    { name: 'Application Tracker', path: '/tracker', icon: FileCheck2 },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Academic Profile', path: '/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Analytics Overview', path: '/admin', icon: BarChart3 },
    { name: 'Scholarship Control', path: '/admin/scholarships', icon: Layers },
    { name: 'Public Directory', path: '/scholarships', icon: Search },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden lg:flex">
      <div>
        <div className="px-3 py-2 mb-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-800 truncate">{user?.name}</h4>
            <p className="text-xs text-slate-500 capitalize">{user?.role} Portal</p>
          </div>
        </div>

        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      active ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* AI Recommendation Banner */}
      {isStudent && (
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100">
          <div className="flex items-center space-x-2 text-indigo-700 font-semibold text-xs mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>AI Matching Engine</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Keep your profile up to date for precise eligibility recommendations.
          </p>
          <Link
            to="/profile"
            className="block text-center py-1.5 text-xs font-semibold text-indigo-700 bg-white rounded-lg shadow-sm border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            Update Profile
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

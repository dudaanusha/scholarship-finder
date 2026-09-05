import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Calendar,
  AlertTriangle,
  Clock,
  ExternalLink,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';

const NotificationPage = () => {
  const { notifications, unreadCount, markRead, markAllRead, loading } = useNotifications();

  const getIconForType = (type) => {
    switch (type) {
      case 'DEADLINE_REMINDER_1D':
        return <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />;
      case 'DEADLINE_REMINDER_3D':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'DEADLINE_REMINDER_7D':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'APPLICATION_UPDATE':
        return <CheckCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center">
              <Bell className="w-6 h-6 mr-2 text-indigo-600" />
              Deadline & System Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Automated reminders at 7 days, 3 days, and 1 day before application deadlines.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <CheckCheck className="w-4 h-4 text-indigo-600" />
              <span>Mark All as Read ({unreadCount})</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-20 rounded-2xl bg-white skeleton-shimmer border border-slate-200"></div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.readStatus && markRead(n._id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  n.readStatus
                    ? 'bg-white border-slate-200 opacity-90'
                    : 'bg-indigo-50/40 border-indigo-200 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      n.readStatus ? 'bg-slate-100' : 'bg-white shadow-sm'
                    }`}
                  >
                    {getIconForType(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm font-bold truncate ${
                          n.readStatus ? 'text-slate-800' : 'text-indigo-900'
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {new Date(n.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{n.message}</p>

                    <div className="flex items-center space-x-4 text-xs">
                      {n.scholarshipId && (
                        <Link
                          to={`/scholarships/${n.scholarshipId._id || n.scholarshipId}`}
                          className="font-semibold text-indigo-600 hover:underline inline-flex items-center"
                        >
                          <span>View Scholarship Criteria</span>
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Link>
                      )}

                      {!n.readStatus && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markRead(n._id);
                          }}
                          className="text-slate-400 hover:text-slate-600 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">No Notifications Right Now</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              When you save or apply for scholarships, automated deadline countdown reminders (7-day, 3-day, and 1-day alerts) will appear here.
            </p>
            <Link
              to="/scholarships"
              className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200"
            >
              Discover Scholarships
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationPage;

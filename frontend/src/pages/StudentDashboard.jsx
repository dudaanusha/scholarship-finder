import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Bookmark,
  FileCheck2,
  Calendar,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  UserCheck,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { fetchStudentAnalytics, fetchRecommendations, toggleSaveScholarship } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import ScholarshipCard from '../components/ScholarshipCard';
import Sidebar from '../components/Sidebar';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, recRes] = await Promise.all([
          fetchStudentAnalytics(),
          fetchRecommendations(),
        ]);

        if (analyticsRes.data.success) {
          setMetrics(analyticsRes.data.data);
        }

        if (recRes.data.success) {
          setRecommendations(recRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
        setError('Unable to load personalized recommendations. Please ensure your academic profile is updated.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleToggleSave = async (id) => {
    try {
      const res = await toggleSaveScholarship(id);
      if (res.data.success) {
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (res.data.saved) next.add(id);
          else next.delete(id);
          return next;
        });
        // Update metric
        if (metrics) {
          setMetrics((prev) => ({
            ...prev,
            savedCount: res.data.saved ? prev.savedCount + 1 : Math.max(0, prev.savedCount - 1),
          }));
        }
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const completionPercentage = profile?.completionPercentage || metrics?.profileCompletion || 65;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center">
              <span>Welcome back, {user?.name || 'Scholar'}</span>
              <span className="ml-2 text-2xl">👋</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              AI-generated compatibility analysis based on your academic profile ({profile?.course || 'Undergraduate'}, {profile?.category || 'General'}).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/scholarships"
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center space-x-1.5"
            >
              <span>Explore All Scholarships</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all flex items-center space-x-1.5"
            >
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Profile Completion Alert if incomplete */}
        {completionPercentage < 80 && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm">
                  Complete Your Academic Profile ({completionPercentage}% completed)
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Adding your family income bracket, CGPA, and state domicile improves AI recommendation accuracy by 40%.
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors text-center"
            >
              Complete Profile Now
            </Link>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatsCard
            title="Available Scholarships"
            value={metrics?.totalScholarships || 16}
            subtext="In verified national database"
            icon={Award}
            color="indigo"
          />
          <StatsCard
            title="Eligible For You"
            value={metrics?.eligibleCount || 12}
            subtext="Meets baseline criteria"
            icon={TrendingUp}
            color="emerald"
          />
          <StatsCard
            title="Saved in Watchlist"
            value={metrics?.savedCount || 0}
            subtext="Monitoring deadlines"
            icon={Bookmark}
            color="amber"
          />
          <StatsCard
            title="Applications Submitted"
            value={metrics?.appliedCount || 0}
            subtext="Active tracking in pipeline"
            icon={FileCheck2}
            color="violet"
          />
        </div>

        {/* Two-Column Section: Upcoming Deadlines + AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left / Main Column: AI Recommendations (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-indigo-600 animate-pulse" />
                  Top AI-Ranked Scholarships For You
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sorted by compatibility score (Academic CGPA + Family Income + Category + Course)
                </p>
              </div>
              <Link
                to="/scholarships"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                <span>View Full List</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-64 rounded-2xl bg-slate-100 skeleton-shimmer"></div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {recommendations.slice(0, 4).map((sch) => (
                  <ScholarshipCard
                    key={sch._id}
                    scholarship={sch}
                    isSaved={savedIds.has(sch._id)}
                    onToggleSave={handleToggleSave}
                    showMatch={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <p className="text-slate-600 text-sm mb-4">
                  No direct recommendations found yet. Complete your profile fields to unlock recommendations.
                </p>
                <Link
                  to="/profile"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                  Configure Academic Profile
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Upcoming Deadlines Widget (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-rose-500" />
                  Upcoming Deadlines
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                  Urgent Alerts
                </span>
              </div>

              {metrics?.upcomingDeadlines && metrics.upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {metrics.upcomingDeadlines.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/scholarships/${item.scholarshipId}`}
                          className="font-semibold text-slate-800 text-xs hover:text-indigo-600 line-clamp-2"
                        >
                          {item.scholarshipName}
                        </Link>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.daysLeft <= 3
                              ? 'bg-rose-100 text-rose-700 animate-pulse'
                              : 'bg-amber-100 text-amber-800'
                            }`}
                        >
                          {item.daysLeft}d left
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        {item.providerOrganization}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-indigo-600">
                          ₹{item.scholarshipAmount?.toLocaleString('en-IN')}
                        </span>
                        <Link
                          to={`/scholarships/${item.scholarshipId}`}
                          className="text-slate-600 hover:text-indigo-600 font-medium flex items-center"
                        >
                          <span>Apply</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No urgent deadlines in the next 14 days.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Save scholarships to track their closing dates automatically.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Links Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-violet-950 text-white rounded-3xl p-6 shadow-xl">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 text-indigo-300" />
              </div>
              <h4 className="font-bold text-sm mb-1">Scholarship Document Checklist</h4>
              <p className="text-xs text-indigo-200 leading-relaxed mb-4">
                Keep scanned copies of your 10th/12th marksheets, family income certificate, and domicile certificate ready for quick submissions.
              </p>
              <Link
                to="/profile"
                className="block text-center py-2 px-3 bg-white text-indigo-950 font-bold text-xs rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Review Profile Documents
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

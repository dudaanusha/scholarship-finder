import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Building2,
  Calendar,
  Trash2,
  ArrowRight,
  ExternalLink,
  Coins,
  Clock,
  Sparkles,
} from 'lucide-react';
import { fetchUserApplications, toggleSaveScholarship } from '../services/api';
import Sidebar from '../components/Sidebar';

const SavedScholarshipsPage = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSavedScholarships = async () => {
    try {
      setLoading(true);
      const res = await fetchUserApplications('Saved');
      if (res.data.success) {
        setSavedItems(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching saved scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedScholarships();
  }, []);

  const handleRemove = async (scholarshipId) => {
    try {
      await toggleSaveScholarship(scholarshipId);
      setSavedItems((prev) => prev.filter((item) => item.scholarshipId?._id !== scholarshipId));
    } catch (err) {
      console.error('Error removing from saved:', err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center">
              <Bookmark className="w-6 h-6 mr-2 text-indigo-600" />
              Saved Scholarships
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your personal watchlist. We actively track deadlines and send you 7-day, 3-day, and 1-day reminders.
            </p>
          </div>
          <Link
            to="/scholarships"
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all flex items-center justify-center space-x-1"
          >
            <span>Explore More Schemes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-white skeleton-shimmer border border-slate-200"></div>
            ))}
          </div>
        ) : savedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedItems.map((item) => {
              const sch = item.scholarshipId;
              if (!sch) return null;

              const deadlineDate = new Date(sch.deadline);
              const diffDays = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold text-xs">
                        <Coins className="w-3.5 h-3.5" />
                        <span>₹{sch.scholarshipAmount?.toLocaleString('en-IN')}</span>
                      </div>

                      <button
                        onClick={() => handleRemove(sch._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from saved watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Link to={`/scholarships/${sch._id}`}>
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-indigo-600 transition-colors">
                        {sch.scholarshipName}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 flex items-center mt-1 mb-4">
                      <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>{sch.providerOrganization}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">Deadline</span>
                      <span
                        className={`text-xs font-bold ${
                          diffDays <= 3 ? 'text-rose-600 animate-pulse' : 'text-slate-800'
                        }`}
                      >
                        {deadlineDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' '}({diffDays > 0 ? `${diffDays}d left` : 'Expired'})
                      </span>
                    </div>

                    <Link
                      to={`/scholarships/${sch._id}`}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center space-x-1"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Your Watchlist is Empty</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Browse the scholarship directory and save the ones that catch your eye. We'll automatically monitor their deadlines and alert you.
            </p>
            <Link
              to="/scholarships"
              className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200"
            >
              Browse Scholarships
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedScholarshipsPage;

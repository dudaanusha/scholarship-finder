import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Calendar,
  Coins,
  ExternalLink,
  Edit3,
  Search,
} from 'lucide-react';
import { fetchUserApplications, updateAppStatus } from '../services/api';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';

const ApplicationTrackerPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('All');
  const [editingApp, setEditingApp] = useState(null);
  const [notesInput, setNotesInput] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await fetchUserApplications();
      if (res.data.success) {
        // Exclude 'Saved' only from application tracker or keep all submitted
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleOpenEdit = (app) => {
    setEditingApp(app);
    setNotesInput(app.notes || '');
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!editingApp) return;

    try {
      setSavingNotes(true);
      const res = await updateAppStatus(editingApp._id, { notes: notesInput });
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === editingApp._id ? { ...a, notes: notesInput } : a))
        );
        setEditingApp(null);
      }
    } catch (err) {
      console.error('Error updating notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const tabs = ['All', 'Applied', 'Under Review', 'Approved', 'Rejected'];

  const filteredApplications = applications.filter((app) => {
    if (selectedTab === 'All') return app.status !== 'Saved';
    return app.status === selectedTab;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Approved
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Under Review
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Rejected
          </span>
        );
      case 'Applied':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Applied
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center">
              <FileCheck2 className="w-6 h-6 mr-2 text-indigo-600" />
              Application Tracker
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time pipeline monitoring for your submitted scholarship applications.
            </p>
          </div>
          <Link
            to="/scholarships"
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all flex items-center justify-center space-x-1"
          >
            <span>Apply to New Scholarship</span>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
          {tabs.map((tab) => {
            const count =
              tab === 'All'
                ? applications.filter((a) => a.status !== 'Saved').length
                : applications.filter((a) => a.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  selectedTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    selectedTab === tab ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 rounded-3xl bg-white skeleton-shimmer border border-slate-200"></div>
            ))}
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const sch = app.scholarshipId;
              if (!sch) return null;

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Info Column */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {getStatusBadge(app.status)}
                      <span className="text-xs text-slate-400">
                        Tracking ID: <strong className="text-slate-700">{app.trackingNumber}</strong>
                      </span>
                    </div>

                    <Link to={`/scholarships/${sch._id}`}>
                      <h3 className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors">
                        {sch.scholarshipName}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {sch.providerOrganization}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Coins className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        ₹{sch.scholarshipAmount?.toLocaleString('en-IN')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Applied: {new Date(app.appliedDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </span>
                    </div>

                    {app.notes && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                        <strong className="text-slate-700">Applicant Notes:</strong> {app.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleOpenEdit(app)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Notes</span>
                    </button>

                    <a
                      href={sch.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline flex items-center font-medium"
                    >
                      <span>Portal Link</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <FileCheck2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">No Applications in this Tab</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              When you submit or record scholarship applications, you can track each stage here.
            </p>
            <Link
              to="/scholarships"
              className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200"
            >
              Browse & Apply
            </Link>
          </div>
        )}

        {/* Edit Notes Modal */}
        <Modal
          isOpen={!!editingApp}
          onClose={() => setEditingApp(null)}
          title="Update Application Notes"
        >
          <form onSubmit={handleSaveNotes} className="space-y-4">
            <p className="text-xs text-slate-500">
              Record interview dates, acknowledgment numbers, or document submission updates.
            </p>
            <textarea
              rows="4"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="e.g. Physical verification completed at student welfare office on 12th Feb."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            ></textarea>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingApp(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingNotes}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default ApplicationTrackerPage;

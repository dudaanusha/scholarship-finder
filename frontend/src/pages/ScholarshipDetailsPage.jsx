import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Coins,
  GraduationCap,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Send,
  Sparkles,
  ArrowLeft,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  fetchScholarshipById,
  toggleSaveScholarship,
  submitApplication,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import MatchBadge from '../components/MatchBadge';
import Modal from '../components/Modal';

const ScholarshipDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent, user } = useAuth();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadScholarship = async () => {
      try {
        setLoading(true);
        const res = await fetchScholarshipById(id);
        if (res.data.success) {
          setScholarship(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching scholarship details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadScholarship();
  }, [id]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await toggleSaveScholarship(id);
      if (res.data.success) {
        setIsSaved(res.data.saved);
        setToastMessage(res.data.message);
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error saving scholarship:', err);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setSubmitting(true);
      const res = await submitApplication(id, applicationNotes);
      if (res.data.success) {
        setApplyModalOpen(false);
        setToastMessage('Application successfully recorded in your Tracker!');
        setTimeout(() => {
          navigate('/tracker');
        }, 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-slate-600">Loading scholarship criteria...</p>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Scholarship Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">The requested scholarship opportunity may have expired or been removed.</p>
          <Link to="/scholarships" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const deadlineDate = new Date(scholarship.deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
  const compatibility = scholarship.compatibility;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/scholarships"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All Scholarships</span>
        </Link>

        {toastMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  {scholarship.scholarshipType}
                </span>
                {diffDays <= 7 && diffDays > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-100 animate-pulse">
                    Closing in {diffDays} days
                  </span>
                )}
                {compatibility && <MatchBadge compatibility={compatibility} />}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-2">
                {scholarship.scholarshipName}
              </h1>

              <p className="text-sm font-medium text-slate-600 flex items-center mb-4">
                <Building2 className="w-4 h-4 mr-1.5 text-slate-400" />
                <span>{scholarship.providerOrganization}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Deadline: <strong className="ml-1 text-slate-700">{deadlineDate.toLocaleDateString('en-IN', { dateStyle: 'long' })}</strong>
                </span>
                <span>•</span>
                <span>Views: <strong className="text-slate-700">{scholarship.viewsCount}</strong></span>
                <span>•</span>
                <span>Applications: <strong className="text-slate-700">{scholarship.applicationsCount}</strong></span>
              </div>
            </div>

            {/* Amount & Actions Box */}
            <div className="w-full md:w-64 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between shrink-0">
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Award Value</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-heading">
                  ₹{scholarship.scholarshipAmount?.toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-slate-500 font-medium">{scholarship.amountType || 'Per Annum'}</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Apply / Record Application</span>
                </button>

                <button
                  onClick={handleToggleSave}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center space-x-2 ${
                    isSaved
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Saved in Watchlist' : 'Save Scholarship'}</span>
                </button>

                <a
                  href={scholarship.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 text-slate-600 hover:text-indigo-600 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors text-center"
                >
                  <span>Open Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* AI Eligibility Match Breakdown (If Logged in Student) */}
        {compatibility && (
          <div className="bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/60 rounded-3xl p-6 sm:p-8 border border-indigo-200/80 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center mb-1">
                  <Sparkles className="w-4 h-4 mr-1.5 text-indigo-600 animate-pulse" />
                  AI Compatibility Diagnostic
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Your Eligibility Score: {compatibility.eligibilityPercentage}% ({compatibility.priorityRanking})
                </h3>
              </div>
              <div className="w-32 bg-slate-200 h-2.5 rounded-full overflow-hidden shrink-0">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${compatibility.eligibilityPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {compatibility.breakdown?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start space-x-3"
                >
                  {item.status === 'MATCH' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : item.status === 'PARTIAL' ? (
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800">{item.factor}</strong>
                      <span className="font-semibold text-indigo-600">
                        {item.awarded}/{item.weight} pts
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column (Span 2): Description & Criteria */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3">About the Scholarship</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {scholarship.description}
              </p>
            </div>

            {/* Eligibility Requirements */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Detailed Eligibility Criteria</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
                {scholarship.eligibilityCriteria}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-medium">Minimum Academic CGPA</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {scholarship.minimumCGPA ? `${scholarship.minimumCGPA} CGPA` : 'No minimum restriction'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-medium">Maximum Family Income Limit</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {scholarship.maximumFamilyIncome < 10000000
                      ? `₹${scholarship.maximumFamilyIncome.toLocaleString('en-IN')} / year`
                      : 'No income ceiling'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-medium">Eligible Categories</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {scholarship.applicableCategories?.join(', ') || 'All Categories'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-medium">Eligible States / Domicile</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {scholarship.applicableStates?.join(', ') || 'All India'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Required Documents */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                Required Documents Checklist
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {scholarship.requiredDocuments?.map((doc, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-800 leading-relaxed">
                  <strong>Tip:</strong> Keep scanned self-attested PDF files under 500KB for smooth uploading on the provider portal.
                </div>
              </div>
            </div>

            {/* Provider Verification Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Program</span>
              </div>
              <h4 className="font-bold text-sm mb-1">{scholarship.providerOrganization}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Listed and validated through the ScholarAI automated provider registry.
              </p>
              <a
                href={scholarship.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
              >
                Visit Official Website
              </a>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title={`Apply for ${scholarship.scholarshipName}`}
        >
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              You will be directed to the official provider application link. This action will record your application in your <strong>Application Tracker</strong> so you receive timely status reminders and deadline alerts.
            </p>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900">
              <strong>Official Application Link:</strong>
              <a
                href={scholarship.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-indigo-600 hover:underline truncate mt-1"
              >
                {scholarship.applicationLink}
              </a>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Application Notes / Tracking Reference (Optional)
              </label>
              <textarea
                rows="3"
                value={applicationNotes}
                onChange={(e) => setApplicationNotes(e.target.value)}
                placeholder="e.g. Submitted online with income certificate. Application ID: NSP-2026-991"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
              >
                {submitting ? (
                  <span>Recording...</span>
                ) : (
                  <>
                    <span>Confirm & Record Application</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ScholarshipDetailsPage;

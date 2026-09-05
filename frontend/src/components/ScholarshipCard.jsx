import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Building2,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Sparkles,
  Coins,
  GraduationCap,
} from 'lucide-react';
import MatchBadge from './MatchBadge';

const ScholarshipCard = ({
  scholarship,
  isSaved = false,
  onToggleSave,
  showMatch = true,
}) => {
  const {
    _id,
    scholarshipName,
    providerOrganization,
    scholarshipAmount,
    amountType,
    deadline,
    scholarshipType,
    eligibleCourses = [],
    applicableCategories = [],
    compatibility,
  } = scholarship;

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  let deadlineBadge = null;
  if (diffDays <= 0) {
    deadlineBadge = <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Expired</span>;
  } else if (diffDays <= 3) {
    deadlineBadge = (
      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold animate-pulse">
        {diffDays} day{diffDays > 1 ? 's' : ''} left!
      </span>
    );
  } else if (diffDays <= 7) {
    deadlineBadge = (
      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
        {diffDays} days left
      </span>
    );
  } else {
    deadlineBadge = (
      <span className="text-xs text-slate-500 flex items-center">
        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
        {deadlineDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/90 bg-white flex flex-col justify-between relative group">
      <div>
        {/* Top Header: Amount & Bookmark Button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold text-sm">
            <Coins className="w-4 h-4 text-indigo-600" />
            <span>₹{scholarshipAmount?.toLocaleString('en-IN')}</span>
            <span className="text-[10px] font-normal text-indigo-500">/{amountType || 'Year'}</span>
          </div>

          <div className="flex items-center space-x-2">
            {onToggleSave && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleSave(_id);
                }}
                className={`p-2 rounded-xl transition-all ${
                  isSaved
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save scholarship'}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Title and Provider */}
        <Link to={`/scholarships/${_id}`} className="group-hover:text-indigo-600 transition-colors">
          <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 mb-1">
            {scholarshipName}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 flex items-center mb-3 line-clamp-1">
          <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
          <span>{providerOrganization}</span>
        </p>

        {/* AI Compatibility Badge & Bar */}
        {showMatch && compatibility && (
          <div className="mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                AI Eligibility Match
              </span>
              <MatchBadge compatibility={compatibility} size="sm" />
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  compatibility.eligibilityPercentage >= 85
                    ? 'bg-emerald-500'
                    : compatibility.eligibilityPercentage >= 70
                    ? 'bg-indigo-500'
                    : compatibility.eligibilityPercentage >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-400'
                }`}
                style={{ width: `${compatibility.eligibilityPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Chips / Metadata */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
            {scholarshipType}
          </span>
          {eligibleCourses.slice(0, 2).map((c, i) => (
            <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50/60 text-indigo-700">
              {c}
            </span>
          ))}
          {applicableCategories.length > 0 && !applicableCategories.includes('All') && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
              {applicableCategories.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Deadline & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>{deadlineBadge}</div>

        <Link
          to={`/scholarships/${_id}`}
          className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ScholarshipCard;

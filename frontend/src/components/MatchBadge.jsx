import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

const MatchBadge = ({ compatibility, size = 'md' }) => {
  if (!compatibility) return null;

  const { eligibilityPercentage, priorityRanking, isEligible } = compatibility;

  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let icon = <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600 animate-pulse" />;

  if (priorityRanking === 'Top Match') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    icon = <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600 animate-pulse" />;
  } else if (priorityRanking === 'High Match') {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-indigo-600" />;
  } else if (priorityRanking === 'Eligible') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    icon = <TrendingUp className="w-3.5 h-3.5 mr-1 text-amber-600" />;
  } else {
    colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
    icon = <AlertCircle className="w-3.5 h-3.5 mr-1 text-slate-500" />;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <div className={`inline-flex items-center rounded-full border shadow-sm ${colorClasses} ${sizeClasses}`}>
      {icon}
      <span>{eligibilityPercentage}% Match</span>
      <span className="mx-1 opacity-40">•</span>
      <span className="font-medium">{priorityRanking}</span>
    </div>
  );
};

export default MatchBadge;

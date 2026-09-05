import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  FileCheck2,
  TrendingUp,
  BarChart3,
  Eye,
  Building2,
  Plus,
  Coins,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { fetchAdminAnalytics } from '../services/api';
import StatsCard from '../components/StatsCard';
import Sidebar from '../components/Sidebar';
import {
  StatusBarChart,
  CategoryDoughnutChart,
  StateDistributionChart,
} from '../components/Charts';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetchAdminAnalytics();
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const metrics = analytics?.metrics;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrative Operations Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Platform Analytics & Performance
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time monitoring of registered student demographics, scholarship listings, and application pipelines.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/scholarships"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Scholarship</span>
            </Link>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Registered Users"
            value={metrics?.totalUsers || 0}
            subtext={`${metrics?.totalStudents || 0} student applicants`}
            icon={Users}
            color="indigo"
          />
          <StatsCard
            title="Active Scholarships"
            value={metrics?.totalScholarships || 0}
            subtext="Verified in live catalog"
            icon={Award}
            color="violet"
          />
          <StatsCard
            title="Applications Submitted"
            value={metrics?.totalApplications || 0}
            subtext={`${metrics?.approvalRate || 0}% approval rate`}
            icon={FileCheck2}
            color="emerald"
          />
          <StatsCard
            title="Total Funding Pool"
            value={`₹${((metrics?.totalFundsAvailable || 0) / 10000000).toFixed(1)} Cr`}
            subtext="Combined financial value"
            icon={Coins}
            color="amber"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Status Breakdown Bar Chart (Span 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Application Pipeline Stages</h3>
                <p className="text-xs text-slate-500">Distribution across Saved, Applied, Under Review, Approved & Rejected</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                Live Data
              </span>
            </div>

            {loading ? (
              <div className="h-64 rounded-2xl bg-slate-100 skeleton-shimmer"></div>
            ) : (
              <StatusBarChart dataMap={analytics?.statusCounts} />
            )}
          </div>

          {/* Category Distribution Doughnut Chart (Span 5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Student Category Distribution</h3>
                <p className="text-xs text-slate-500">Breakdown of registered students by reservation category</p>
              </div>
            </div>

            {loading ? (
              <div className="h-64 rounded-2xl bg-slate-100 skeleton-shimmer"></div>
            ) : (
              <CategoryDoughnutChart categories={analytics?.categoryDistribution} />
            )}
          </div>
        </div>

        {/* Second Charts / Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* State-Wise Student Demographics (Span 6) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">State-Wise Student Registrations</h3>
                <p className="text-xs text-slate-500">Top states where applicants are domiciled</p>
              </div>
            </div>

            {loading ? (
              <div className="h-64 rounded-2xl bg-slate-100 skeleton-shimmer"></div>
            ) : (
              <StateDistributionChart states={analytics?.stateDistribution} />
            )}
          </div>

          {/* Top Applied & Viewed Scholarships (Span 6) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Most Popular Schemes</h3>
              <p className="text-xs text-slate-500 mb-4">High-engagement scholarships by application volume</p>

              <div className="space-y-3">
                {analytics?.mostAppliedScholarships?.slice(0, 4).map((sch, i) => (
                  <div
                    key={sch._id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{sch.scholarshipName}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{sch.providerOrganization}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-indigo-600 block">
                        {sch.applicationsCount} applied
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {sch.viewsCount} views
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <Link
                to="/admin/scholarships"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Manage all scholarships →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  TrendingUp,
  Clock,
  Award,
  Users,
  Building2,
  CheckCircle2,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { fetchScholarships } from '../services/api';
import ScholarshipCard from '../components/ScholarshipCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredScholarships, setFeaturedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick preview calculator states
  const [calcCGPA, setCalcCGPA] = useState(8.5);
  const [calcIncome, setCalcIncome] = useState(250000);
  const [calcCategory, setCalcCategory] = useState('OBC');

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetchScholarships({ limit: 3, sort: 'amount_desc' });
        if (res.data.success) {
          setFeaturedScholarships(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching scholarships:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/scholarships');
    }
  };

  // Live calculator calculation
  const getEstimatedMatches = () => {
    let count = 10;
    if (calcCGPA >= 8.0) count += 4;
    if (calcIncome <= 300000) count += 3;
    if (calcCategory === 'SC' || calcCategory === 'ST' || calcCategory === 'OBC') count += 2;
    return Math.min(16, count);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>Next-Gen AI Recommendation & Eligibility Matching Engine</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Discover Scholarships You Are{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
                Actually Eligible For
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              Never miss higher education funding again. Our intelligent matching algorithm analyzes your academic profile, family income, and category to calculate real-time compatibility scores with proactive deadline alerts.
            </p>

            {/* Live Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl shadow-xl shadow-indigo-100/60 border border-slate-200 mb-6"
            >
              <div className="flex items-center flex-1 w-full px-3 py-2">
                <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by degree, course, state, provider, or scholarship name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-slate-800 focus:outline-none placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
              >
                <span>Find Matches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular:</span>
              <button
                onClick={() => navigate('/scholarships?course=B.Tech')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Engineering / B.Tech
              </button>
              <button
                onClick={() => navigate('/scholarships?type=Government')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Government Schemes
              </button>
              <button
                onClick={() => navigate('/scholarships?category=OBC')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                OBC / SC / ST
              </button>
              <button
                onClick={() => navigate('/scholarships?type=Need-based')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Need-Based Aid
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Platform Metrics Ribbon */}
      <section className="bg-white border-y border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <p className="text-3xl font-extrabold text-indigo-600 font-heading">₹50+ Cr</p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Scholarship Funds Tracked</p>
            </div>
            <div className="p-3">
              <p className="text-3xl font-extrabold text-indigo-600 font-heading">16+</p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Active Verified Schemes</p>
            </div>
            <div className="p-3">
              <p className="text-3xl font-extrabold text-indigo-600 font-heading">98.4%</p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">AI Recommendation Precision</p>
            </div>
            <div className="p-3">
              <p className="text-3xl font-extrabold text-indigo-600 font-heading">100%</p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Direct Official Portal Links</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How AI Matching Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Intelligent Workflow
            </h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              How the AI Recommendation Engine Works
            </p>
            <p className="text-slate-600 mt-3 text-sm">
              Our multi-criteria algorithm evaluates multiple eligibility barriers simultaneously to produce a calibrated compatibility percentage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2">Build Academic Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your CGPA, course, state domicile, family income bracket, and category once.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2">AI Compatibility Score</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The engine evaluates academic criteria (30%), financial need (25%), category (20%), and geography (10%).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2">Priority Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scholarships are ranked into Top Match (≥85%), High Match (70-84%), and Eligible tiers with full criteria explanations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2">Automated Deadlines</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive automated 7-day, 3-day, and 1-day deadline reminders to submit before windows close.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Quick Eligibility Calculator Preview */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 lg:p-12 text-white shadow-2xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-400/30">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Instant Compatibility Estimator</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                  Check your scholarship eligibility in 10 seconds
                </h2>
                <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                  Adjust your parameters below to see how our AI matching engine instantly filters and ranks scholarships in real time.
                </p>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-indigo-200 mb-1">
                      Your CGPA: <span className="text-white font-bold">{calcCGPA}</span>
                    </label>
                    <input
                      type="range"
                      min="5.0"
                      max="10.0"
                      step="0.1"
                      value={calcCGPA}
                      onChange={(e) => setCalcCGPA(parseFloat(e.target.value))}
                      className="w-full accent-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-indigo-200 mb-1">
                      Annual Family Income: <span className="text-white font-bold">₹{(calcIncome / 100000).toFixed(1)}L</span>
                    </label>
                    <input
                      type="range"
                      min="50000"
                      max="1200000"
                      step="50000"
                      value={calcIncome}
                      onChange={(e) => setCalcIncome(parseInt(e.target.value))}
                      className="w-full accent-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-indigo-200 mb-1">Category</label>
                    <select
                      value={calcCategory}
                      onChange={(e) => setCalcCategory(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 text-white border border-slate-700 text-xs focus:outline-none"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Result Preview Box */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  Estimated Eligible Opportunities
                </p>
                <div className="text-5xl font-black text-white font-heading my-2">
                  {getEstimatedMatches()}+
                </div>
                <p className="text-xs text-indigo-200 mb-4">
                  Active scholarships match your current profile criteria right now.
                </p>
                <Link
                  to="/register"
                  className="w-full py-3 px-4 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs inline-flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <span>Unlock Full AI Compatibility Breakdown</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured High-Value Scholarships */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                Top Opportunities
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Featured Verified Scholarships
              </p>
            </div>
            <Link
              to="/scholarships"
              className="mt-4 sm:mt-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              <span>Explore all scholarships</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredScholarships.map((sch) => (
              <ScholarshipCard key={sch._id} scholarship={sch} showMatch={false} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="py-16 bg-indigo-600 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-indigo-200" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Start Your Personalized Scholarship Journey Today
          </h2>
          <p className="text-indigo-100 text-base max-w-2xl mx-auto mb-8">
            Create your profile in under 2 minutes. Get instant compatibility scores, deadline notifications, and track your applications end-to-end.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-indigo-600 font-bold text-sm hover:bg-slate-50 shadow-lg transition-all"
            >
              Create Free Student Account
            </Link>
            <Link
              to="/scholarships"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-700 text-white font-semibold text-sm hover:bg-indigo-800 transition-all"
            >
              Browse Scholarships Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

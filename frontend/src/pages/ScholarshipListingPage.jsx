import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { fetchScholarships, fetchFilterOptions, toggleSaveScholarship } from '../services/api';
import ScholarshipCard from '../components/ScholarshipCard';
import { useAuth } from '../context/AuthContext';

const ScholarshipListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isStudent } = useAuth();

  const [scholarships, setScholarships] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    categories: [],
    types: [],
    courses: [],
  });

  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCourse, setSelectedCourse] = useState(searchParams.get('course') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [sortOption, setSortOption] = useState('newest');
  const [page, setPage] = useState(1);

  // Load filter options on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const res = await fetchFilterOptions();
        if (res.data.success) {
          setFilterOptions(res.data.data);
        }
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };
    loadFilters();
  }, []);

  // Fetch scholarships when filters or pagination change
  useEffect(() => {
    const loadScholarships = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 9,
          search: search.trim() || undefined,
          state: selectedState !== 'All' ? selectedState : undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          course: selectedCourse !== 'All' ? selectedCourse : undefined,
          type: selectedType !== 'All' ? selectedType : undefined,
          sort: sortOption,
        };

        const res = await fetchScholarships(params);
        if (res.data.success) {
          setScholarships(res.data.data);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Error fetching scholarships list:', err);
      } finally {
        setLoading(false);
      }
    };

    loadScholarships();
  }, [search, selectedState, selectedCategory, selectedCourse, selectedType, sortOption, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedState('All');
    setSelectedCategory('All');
    setSelectedCourse('All');
    setSelectedType('All');
    setSortOption('newest');
    setPage(1);
    setSearchParams({});
  };

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
      }
    } catch (err) {
      console.error('Error toggling save in listing:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Search bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Scholarship Directory
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Explore {total} verified higher education scholarships and financial awards across India
              </p>
            </div>

            {/* Quick Mobile Filter Toggle */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter & Refine ({total} results)</span>
              </button>
            </div>
          </div>

          {/* Search bar & Sort Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search scholarship name, provider organization, or keywords..."
                className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
              >
                <option value="newest">Recently Added</option>
                <option value="deadline_asc">Deadline (Ending Soonest)</option>
                <option value="amount_desc">Amount (High to Low)</option>
                <option value="amount_asc">Amount (Low to High)</option>
                <option value="cgpa_asc">Minimum CGPA Requirement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Filter Sidebar + Results */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (Span 3) */}
          <aside className="hidden md:block md:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-indigo-600" />
                Filter Schemes
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </button>
            </div>

            {/* State Domicile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Applicable State
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none bg-slate-50"
              >
                <option value="All">All States (National)</option>
                {filterOptions.states?.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Category / Reservation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category / Reservation
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none bg-slate-50"
              >
                <option value="All">All Categories</option>
                {filterOptions.categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Course / Degree */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Eligible Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none bg-slate-50"
              >
                <option value="All">All Disciplines</option>
                {filterOptions.courses?.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Scholarship Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Scholarship Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none bg-slate-50"
              >
                <option value="All">All Types</option>
                {filterOptions.types?.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Callout */}
            {isAuthenticated && isStudent && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900">
                <span className="font-bold flex items-center mb-1 text-indigo-700">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Personalized Match Active
                </span>
                Compatibility scores are calculated against your academic profile.
              </div>
            )}
          </aside>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="md:hidden col-span-12 bg-white p-5 rounded-3xl border border-slate-200 space-y-4 mb-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Filters</h3>
                <button onClick={handleResetFilters} className="text-xs text-indigo-600 font-semibold">
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-slate-200"
                  >
                    <option value="All">All States</option>
                    {filterOptions.states?.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-slate-200"
                  >
                    <option value="All">All Categories</option>
                    {filterOptions.categories?.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          )}

          {/* Results Grid (Span 9) */}
          <main className="col-span-12 md:col-span-9 space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-72 rounded-2xl bg-white skeleton-shimmer border border-slate-200"></div>
                ))}
              </div>
            ) : scholarships.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scholarships.map((sch) => (
                    <ScholarshipCard
                      key={sch._id}
                      scholarship={sch}
                      isSaved={savedIds.has(sch._id)}
                      onToggleSave={handleToggleSave}
                      showMatch={isAuthenticated && isStudent}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Showing page <span className="font-bold">{page}</span> of{' '}
                      <span className="font-bold">{totalPages}</span> ({total} scholarships)
                    </p>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">No scholarships match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                  Try clearing some filters, widening the course or category scope, or searching for broader terms.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipListingPage;

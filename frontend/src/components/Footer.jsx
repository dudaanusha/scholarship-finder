import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, Mail, Phone, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ScholarAI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-Powered Smart Scholarship Finder & Eligibility Recommendation Engine. Connecting deserving students with verified higher education funding across India and globally.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-md px-3 py-1.5 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Scholarship Sources</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Scholarship Types
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/scholarships?type=Government" className="hover:text-indigo-400 transition-colors">
                  Government Schemes
                </Link>
              </li>
              <li>
                <Link to="/scholarships?type=Merit-based" className="hover:text-indigo-400 transition-colors">
                  Merit-Based Awards
                </Link>
              </li>
              <li>
                <Link to="/scholarships?type=Need-based" className="hover:text-indigo-400 transition-colors">
                  Need-Based Financial Aid
                </Link>
              </li>
              <li>
                <Link to="/scholarships?type=Private" className="hover:text-indigo-400 transition-colors">
                  Corporate & Foundation Grants
                </Link>
              </li>
              <li>
                <Link to="/scholarships?type=Minority" className="hover:text-indigo-400 transition-colors">
                  Minority Fellowships
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Courses */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Eligible Disciplines
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/scholarships?course=B.Tech" className="hover:text-indigo-400 transition-colors">
                  Engineering & B.Tech
                </Link>
              </li>
              <li>
                <Link to="/scholarships?course=MBBS" className="hover:text-indigo-400 transition-colors">
                  Medical & Healthcare (MBBS)
                </Link>
              </li>
              <li>
                <Link to="/scholarships?course=B.Sc" className="hover:text-indigo-400 transition-colors">
                  Pure & Applied Sciences
                </Link>
              </li>
              <li>
                <Link to="/scholarships?course=MBA" className="hover:text-indigo-400 transition-colors">
                  Management & MBA
                </Link>
              </li>
              <li>
                <Link to="/scholarships?course=Diploma" className="hover:text-indigo-400 transition-colors">
                  Polytechnic & Diploma
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Information & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Student Helpdesk
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@scholarshipfinder.edu</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>Toll-Free: 1800-200-SCHOLAR</span>
              </div>
              <p className="text-xs text-slate-500 pt-2">
                Automated 7-day, 3-day, and 1-day deadline reminders available for all saved applications.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} AI-Powered Smart Scholarship Finder and Eligibility Recommendation System. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span>Built with MERN Stack</span>
            <span>•</span>
            <span>Intelligent Matching Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

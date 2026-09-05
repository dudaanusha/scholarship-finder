import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import ScholarshipListingPage from './pages/ScholarshipListingPage';
import ScholarshipDetailsPage from './pages/ScholarshipDetailsPage';
import SavedScholarshipsPage from './pages/SavedScholarshipsPage';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import NotificationPage from './pages/NotificationPage';
import AdminDashboard from './pages/AdminDashboard';
import ScholarshipManagementPage from './pages/ScholarshipManagementPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/scholarships" element={<ScholarshipListingPage />} />
                <Route path="/scholarships/:id" element={<ScholarshipDetailsPage />} />

                {/* Student Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <SavedScholarshipsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tracker"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <ApplicationTrackerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <NotificationPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/scholarships"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ScholarshipManagementPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

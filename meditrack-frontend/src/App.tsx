import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Import all the newly created pages
import AboutPage from './pages/AboutPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ContactPage from './pages/ContactPage';
import DoctorsPage from './pages/DoctorsPage';
import HealthInfoPage from './pages/HealthInfoPage';
import HealthTrackingPage from './pages/HealthTrackingPage';
import MedicineManagementPage from './pages/MedicineManagementPage';
import StudentBookAppointmentPage from './pages/StudentBookAppointmentPage';
import TeamPage from './pages/TeamPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          
          <Route path="/about" element={<AboutPage />} />
          <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
          <Route path="/health-info" element={<ProtectedRoute><HealthInfoPage /></ProtectedRoute>} />
          <Route path="/health-tracking" element={<ProtectedRoute><HealthTrackingPage /></ProtectedRoute>} />
          <Route path="/medicine-management" element={<ProtectedRoute><MedicineManagementPage /></ProtectedRoute>} />
          <Route path="/student-book-appointment" element={<ProtectedRoute><StudentBookAppointmentPage /></ProtectedRoute>} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

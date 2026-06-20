import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import StudentDashboard from '../components/StudentDashboard';
import DoctorDashboard from '../components/DoctorDashboard';
import PharmacistDashboard from '../components/PharmacistDashboard';
import AdminDashboard from '../components/AdminDashboard';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600 text-lg">Loading...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  switch (user.role?.toLowerCase()) {
    case 'student':
      return <StudentDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'pharmacist':
      return <PharmacistDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Unknown role</div>;
  }
}

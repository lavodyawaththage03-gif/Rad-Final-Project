import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { 
  HeartPulse, 
  Calendar, 
  Newspaper, 
  User, 
  Activity, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users,
  Bell,
  ClipboardList,
  Download
} from 'lucide-react';

interface StudentProfile {
  _id?: string;
  studentId: string;
  degreeProgram: string;
  faculty: string;
  medicalHistory: string;
  allergies: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyContactPhone: string;
  height: string;
  weight: string;
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Profile State
  const [profile, setProfile] = useState<StudentProfile>({
    studentId: '',
    degreeProgram: '',
    faculty: '',
    medicalHistory: '',
    allergies: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    height: '',
    weight: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [crowdLevel, setCrowdLevel] = useState('Low'); // Can be 'Low', 'Medium', 'High'
  
  const fetchCrowdStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/crowd');
      if (res.data?.level) {
        setCrowdLevel(res.data.level);
      }
    } catch (err) {
      console.error('Failed to fetch crowd status:', err);
    }
  };
  const [realDoctors, setRealDoctors] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  const [healthNews, setHealthNews] = useState<any[]>([]);

  const fetchHealthNews = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/health-feed');
      setHealthNews(res.data);
    } catch (err) {
      console.error('Failed to fetch health news:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchDoctors();
    fetchCrowdStatus();
    fetchHealthNews();
    
    // Poll for real-time updates to crowd status and health news
    const intervalId = setInterval(() => {
      fetchCrowdStatus();
      fetchHealthNews();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchPrescriptions = async () => {
    try {
      if (!profile.studentId) return;
      const res = await axios.get(`http://localhost:8080/api/prescriptions/student/${profile.studentId}`);
      setPrescriptions(res.data);
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
    }
  };

  useEffect(() => {
    if (profile.studentId) {
      fetchPrescriptions();
      const intervalId = setInterval(fetchPrescriptions, 3000);
      return () => clearInterval(intervalId);
    }
  }, [profile.studentId]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/doctors');
      if (Array.isArray(res.data)) {
        setRealDoctors(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const [appointmentStats, setAppointmentStats] = useState({ upcoming: 0, completed: 0 });

  const fetchAppointments = async () => {
    try {
      if (!profile.studentId) return;
      const res = await axios.get('http://localhost:8080/api/appointments');
      const myAppointments = res.data.filter((a: any) => a.studentId === profile.studentId);
      
      let upcoming = 0;
      let completed = 0;
      myAppointments.forEach((a: any) => {
        if (a.status === 'Completed') completed++;
        else upcoming++;
      });
      setAppointmentStats({ upcoming, completed });
    } catch (err) {
      console.error('Failed to fetch appointments for stats', err);
    }
  };

  useEffect(() => {
    if (profile.studentId) {
      fetchAppointments();
      const intervalId = setInterval(fetchAppointments, 5000);
      return () => clearInterval(intervalId);
    }
  }, [profile.studentId]);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const studentId = localStorage.getItem('userId');
      if (!studentId) return;
      const res = await axios.get(`http://localhost:8080/api/notifications/${studentId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const markNotificationAsRead = async (id: string) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/me');
      if (response.data) {
        setProfile(response.data.profile || {
          studentId: '',
          degreeProgram: '',
          faculty: '',
          medicalHistory: '',
          allergies: '',
          bloodGroup: '',
          emergencyContact: '',
          emergencyContactPhone: '',
          height: '',
          weight: '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const response = await axios.put('http://localhost:8080/api/profile/student', profile);
      if (response.data) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBookAppointment = (docId: string) => {
    navigate(`/student-book-appointment?doctorId=${docId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Kept Navbar untouched as requested */}
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col z-20 sticky top-0 md:h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">MediTrack</h1>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Student Portal</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <HeartPulse size={20} className={activeTab === 'overview' ? 'text-blue-600' : ''} />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'appointments' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Calendar size={20} className={activeTab === 'appointments' ? 'text-purple-600' : ''} />
              Doctors & Appointments
            </button>
            <button 
              onClick={() => setActiveTab('news')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'news' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Newspaper size={20} className={activeTab === 'news' ? 'text-teal-600' : ''} />
              Health Feed
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'profile' ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <User size={20} className={activeTab === 'profile' ? 'text-orange-600' : ''} />
              My Profile
            </button>
            <button 
              onClick={() => setActiveTab('prescriptions')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'prescriptions' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ClipboardList size={20} className={activeTab === 'prescriptions' ? 'text-indigo-600' : ''} />
              Prescriptions
            </button>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl mb-4 relative">
              <p className="font-semibold text-slate-800 text-sm truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="bg-white p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all relative"
                >
                  <Bell className="text-slate-600" size={18} />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute bottom-full mb-2 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">Notifications</h3>
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                        {notifications.filter(n => !n.isRead).length} New
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                          <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => !n.isRead && markNotificationAsRead(n.id)}
                            className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm font-bold ${!n.isRead ? 'text-slate-800' : 'text-slate-600'}`}>{n.title}</h4>
                              {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></span>}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-2">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full py-2.5 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 relative">
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2 hidden md:block"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none translate-y-1/2 hidden md:block"></div>
          
          <div className="max-w-5xl mx-auto relative z-10">
          
          {/* ---- OVERVIEW TAB ---- */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Calendar size={32} />
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">Upcoming Appointments</p>
                      <p className="text-4xl font-extrabold text-slate-800">{appointmentStats.upcoming}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <CheckCircle size={32} />
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">Completed Visits</p>
                      <p className="text-4xl font-extrabold text-slate-800">{appointmentStats.completed}</p>
                    </div>
                  </div>
                </div>

                {/* Crowd Level Monitor */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center">
                  <p className="text-slate-500 font-bold mb-4 uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                    <Users size={16} /> Live Crowd Status
                  </p>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                      <circle 
                        cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray="351.85" 
                        strokeDashoffset={
                          crowdLevel === 'Low' ? 235.73 :
                          (crowdLevel === 'Moderate' || crowdLevel === 'Medium') ? 175.92 :
                          35.18
                        }
                        className={`transition-all duration-1000 ease-out ${
                          crowdLevel === 'Low' ? 'text-green-500' :
                          (crowdLevel === 'Moderate' || crowdLevel === 'Medium') ? 'text-amber-500' :
                          'text-red-500'
                        }`} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-black uppercase ${
                        crowdLevel === 'Low' ? 'text-green-600' :
                        (crowdLevel === 'Moderate' || crowdLevel === 'Medium') ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {crowdLevel === 'Low' ? 'LOW' : (crowdLevel === 'Moderate' || crowdLevel === 'Medium') ? 'MED' : 'HIGH'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-4 font-medium">
                    {crowdLevel === 'Low' ? 'Wait times are currently short. Walk-ins highly encouraged.' :
                     (crowdLevel === 'Moderate' || crowdLevel === 'Medium') ? 'Wait times are currently moderate. Walk-ins accepted.' :
                     'Wait times are currently long. Only urgent cases recommended.'}
                  </p>
                </div>
              </div>

              {/* Action Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg h-full">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Need a consultation?</h3>
                    <p className="text-blue-100 mb-6">Check live doctor availability and book your appointment instantly online.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-md text-center"
                  >
                    Find a Doctor
                  </button>
                </div>

                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg h-full">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Track Your Vitals</h3>
                    <p className="text-teal-100 mb-6">Monitor your BMI, blood pressure, heart rate, and daily steps continuously.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/health-tracking')}
                    className="w-full py-3 bg-white text-teal-600 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-md text-center flex justify-center items-center gap-2"
                  >
                    <Activity size={18} /> Open Health Tracker
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ---- DOCTORS & APPOINTMENTS TAB ---- */}
          {activeTab === 'appointments' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Doctors & Appointments</h2>
                  <p className="text-slate-500">View real-time availability and book online.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realDoctors.length > 0 ? (
                  realDoctors.map(doctor => {
                    const docName = doctor.firstName ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Dr. Unknown';
                    const isAvailable = doctor.liveStatus !== 'Unavailable';
                    return (
                      <div key={doctor.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col h-full group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            👨‍⚕️
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                            {isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{docName}</h3>
                        <p className="text-purple-600 font-semibold mb-4">{doctor.specialization || 'General Physician'}</p>

                        <div className="mt-auto pt-4 border-t border-slate-100">
                          {isAvailable ? (
                            <button 
                              onClick={() => handleBookAppointment(doctor.id)}
                              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5 flex justify-center items-center gap-2"
                            >
                              <Calendar size={18} /> Book Appointment
                            </button>
                          ) : (
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                              <p className="text-slate-500 text-sm font-semibold mb-1">Next Available</p>
                              <p className="text-slate-700 font-bold">{/*doctor.nextSlot || */ 'Check back later'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-lg font-medium">No doctors available at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- HEALTH FEED TAB ---- */}
          {activeTab === 'news' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Categorized Health Feed</h2>
              <p className="text-slate-500 mb-8">Stay updated with local, international, and university wellness news.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {healthNews.length === 0 ? (
                  <p className="text-slate-500 italic col-span-full">No health news available.</p>
                ) : (
                  healthNews.map((news: any) => (
                    <div key={news.id || news._id} onClick={() => navigate('/health-info')} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group flex flex-col">
                      <div className="h-48 bg-gradient-to-br from-teal-400 to-emerald-500 relative p-6 flex flex-col justify-end">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <span className="relative z-10 px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-lg text-xs font-bold uppercase tracking-wider self-start mb-2">
                          {news.category}
                        </span>
                        <h3 className="relative z-10 text-xl font-bold text-white leading-tight">
                          {news.title}
                        </h3>
                      </div>
                      <div className="p-5 flex justify-between items-center bg-white flex-1">
                        <span className="text-sm font-semibold text-slate-500">{news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                        <span className="text-sm font-semibold text-teal-600 flex items-center gap-1"><Clock size={14}/> {Math.max(1, Math.ceil((news.content?.length || 0) / 200))} min read</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ---- PROFILE TAB ---- */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">My Health Information</h2>
                  <p className="text-slate-500">Manage your medical records and emergency contacts.</p>
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors">
                    Edit Details
                  </button>
                )}
              </div>
              
              {message && (
                <div className={`p-4 rounded-xl mb-6 font-medium flex items-center gap-2 ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <AlertCircle size={20} />
                  {message}
                </div>
              )}

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Student ID</label>
                        <input type="text" value={profile.studentId} onChange={(e) => setProfile({ ...profile, studentId: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Degree Program</label>
                        <input type="text" value={profile.degreeProgram} onChange={(e) => setProfile({ ...profile, degreeProgram: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Faculty</label>
                        <input type="text" value={profile.faculty} onChange={(e) => setProfile({ ...profile, faculty: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Blood Group</label>
                        <input type="text" value={profile.bloodGroup} onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Height</label>
                        <input type="text" value={profile.height} onChange={(e) => setProfile({ ...profile, height: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" placeholder="e.g. 175 cm" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Weight</label>
                        <input type="text" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" placeholder="e.g. 65 kg" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Allergies</label>
                        <input type="text" value={profile.allergies} onChange={(e) => setProfile({ ...profile, allergies: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Medical History</label>
                        <input type="text" value={profile.medicalHistory} onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 bg-red-50/50 -mx-8 px-8 pb-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Emergency Contact Name</label>
                        <input type="text" value={profile.emergencyContact} onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Emergency Phone</label>
                        <input type="tel" value={profile.emergencyContactPhone} onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white" />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-100 mt-4">
                      <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors">Cancel</button>
                      <button onClick={handleSave} disabled={isSaving} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Student ID</p>
                      <p className="text-xl font-bold text-slate-800">{profile.studentId || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Degree Program</p>
                      <p className="text-xl font-bold text-slate-800">{profile.degreeProgram || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Faculty</p>
                      <p className="text-xl font-bold text-slate-800">{profile.faculty || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Group</p>
                      <p className="text-xl font-bold text-slate-800">{profile.bloodGroup || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Height</p>
                      <p className="text-xl font-bold text-slate-800">{profile.height || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Weight</p>
                      <p className="text-xl font-bold text-slate-800">{profile.weight || 'Not set'}</p>
                    </div>
                    
                    <div className="md:col-span-3 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Allergies</p>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-slate-800 font-medium">{profile.allergies || 'None reported'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Medical History</p>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-slate-800 font-medium">{profile.medicalHistory || 'None reported'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-3 mt-4 bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col md:flex-row gap-8 justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                          <AlertCircle size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Emergency Contact</p>
                          <p className="text-xl font-bold text-slate-800">{profile.emergencyContact || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Emergency Phone</p>
                        <p className="text-xl font-bold text-slate-800">{profile.emergencyContactPhone || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- MY PRESCRIPTIONS TAB ---- */}
          {activeTab === 'prescriptions' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">My Prescriptions</h2>
              
              {prescriptions.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center text-slate-500">
                  <ClipboardList className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-xl">You have no active or past prescriptions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {prescriptions.map((p: any) => (
                    <div key={p.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow print:shadow-none print:border-none print:p-0">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 pr-4">
                            {p.medicines?.map((med: any, idx: number) => (
                              <div key={idx} className="mb-4 last:mb-0 border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                                <h3 className="font-bold text-xl text-slate-800">{med.medicineName}</h3>
                                <p className="text-slate-600 font-medium">Dosage: {med.dosage} <span className="text-slate-400 font-normal">| Qty: {med.quantity}</span></p>
                                <div className="bg-slate-50 rounded-xl p-3 mt-2 border border-slate-100">
                                  <p className="text-sm text-slate-600 font-bold mb-1">Instructions:</p>
                                  <p className="text-sm text-slate-700">{med.instructions}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider print:hidden ${
                            p.status === 'ISSUED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {p.status === 'ISSUED' ? 'Completed' : 'Processing'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-xs text-slate-500">
                          <p>Prescribed by: <strong className="text-slate-700">{p.doctorName}</strong></p>
                          <p>{new Date(p.issuedAt).toLocaleDateString()}</p>
                        </div>

                        {/* Live Status Tracker */}
                        {p.status !== 'ISSUED' && p.status !== 'PHARMACIST_REJECTED' && (
                          <div className="mt-4 pt-4 border-t border-slate-100 print:hidden">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Live Pharmacy Status</p>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${p.status === 'PENDING_PHARMACIST_CHECK' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                              <div className={`flex-1 h-1 ${['PHARMACIST_CONFIRMED', 'DOCTOR_CONFIRMED'].includes(p.status) ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                              <div className={`w-3 h-3 rounded-full ${p.status === 'PENDING_PHARMACIST_CHECK' ? 'bg-slate-200' : p.status === 'PHARMACIST_CONFIRMED' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                              <div className={`flex-1 h-1 ${['DOCTOR_CONFIRMED'].includes(p.status) ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                              <div className={`w-3 h-3 rounded-full ${p.status === 'DOCTOR_CONFIRMED' ? 'bg-green-500 animate-pulse' : 'bg-slate-200'}`}></div>
                            </div>
                            <p className="text-xs text-center text-slate-500 mt-2 font-medium">
                              {p.status === 'PENDING_PHARMACIST_CHECK' ? 'Awaiting Inventory Check...' :
                               p.status === 'PHARMACIST_CONFIRMED' ? 'Inventory Verified. Awaiting Final Doctor Approval...' :
                               'Ready for Pickup! Head to the pharmacy.'}
                            </p>
                          </div>
                        )}
                        {p.status === 'PHARMACIST_REJECTED' && (
                          <div className="mt-4 pt-4 border-t border-slate-100 print:hidden">
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                              <p className="text-red-700 font-bold text-sm text-center">Medicine Out of Stock</p>
                              <p className="text-red-600 text-xs text-center mt-1">Please return to your doctor for an alternative prescription.</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => window.print()}
                        className="mt-6 w-full py-2.5 rounded-xl border-2 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 print:hidden"
                      >
                        <Download size={18} /> Download / Print
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Calendar, 
  Pill, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle,
  Activity,
  Package,
  Plus,
  Trash2,
  User
} from 'lucide-react';

interface AdminProfile {
  _id?: string;
  adminLevel: string;
  department: string;
  permissions: string[];
  totalUsers: number;
  totalDoctors: number;
  totalStudents: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Overview State
  const [profile, setProfile] = useState<AdminProfile>({
    adminLevel: 'admin',
    department: '',
    permissions: [],
    totalUsers: 0,
    totalDoctors: 0,
    totalStudents: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Mock Data States
  const [crowdStatus, setCrowdStatus] = useState('Moderate');
  const [medicines, setMedicines] = useState<any[]>([]);
  const [realDoctors, setRealDoctors] = useState<any[]>([]);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [allSchedules, setAllSchedules] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [newInventoryForm, setNewInventoryForm] = useState({
    medicineName: '',
    stockQuantity: 0,
    expiryDate: ''
  });
  const [newDoctorForm, setNewDoctorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    specialization: '',
    hospital: '',
    yearsOfExperience: 0
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalStudents: 0,
    totalPharmacists: 0,
  });
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);
  const [cmsPosts, setCmsPosts] = useState<any[]>([]);
  const [cmsForm, setCmsForm] = useState({ title: '', category: 'Health Alert', content: '' });

  const [doctorPage, setDoctorPage] = useState(0);
  const DOCTORS_PER_PAGE = 4;
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
    fetchMedicines();
    fetchCrowdStatus();
    fetchDoctors();
    fetchStats();
    fetchInventoryAlerts();
    
    const intervalId = setInterval(() => {
      fetchStats();
      fetchInventoryAlerts();
      fetchInventory();
      fetchCmsPosts();
    }, 5000);

    fetchAllAppointments();
    fetchAllSchedules();
    fetchInventory();
    fetchCmsPosts();

    return () => clearInterval(intervalId);
  }, [user]);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/inventory');
      setInventoryItems(res.data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const fetchCmsPosts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/health-feed');
      setCmsPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch CMS posts:', err);
    }
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/health-feed', cmsForm);
      setCmsForm({ title: '', category: 'Health Alert', content: '' });
      fetchCmsPosts();
    } catch (err) {
      console.error('Failed to publish post:', err);
    }
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        medicineName: newInventoryForm.medicineName,
        stockQuantity: newInventoryForm.stockQuantity,
        expiryDate: newInventoryForm.expiryDate ? new Date(newInventoryForm.expiryDate) : null
      };
      await axios.post('http://localhost:8080/api/inventory', payload);
      setNewInventoryForm({ medicineName: '', stockQuantity: 0, expiryDate: '' });
      fetchInventory();
    } catch (err) {
      console.error('Failed to add inventory:', err);
    }
  };

  const handleDeleteInventory = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error('Failed to delete inventory:', err);
    }
  };

  const fetchAllSchedules = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/doctors/schedules/all');
      setAllSchedules(res.data);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/appointments');
      setAllAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch all appointments:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/stats');
      setStats(res.data);
    } catch (err) { console.error('Failed to fetch stats', err); }
  };

  const fetchInventoryAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/inventory');
      const alerts: any[] = [];
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      res.data.forEach((item: any) => {
        if (item.stockQuantity < 50) {
          alerts.push({
            id: (item.id || item._id) + '_stock',
            medicine: item.medicineName,
            type: item.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock',
            message: item.stockQuantity === 0 ? 'Completely depleted. Needs immediate restock.' : `Only ${item.stockQuantity} units remaining.`,
            priority: item.stockQuantity === 0 ? 'High' : 'Medium'
          });
        }
        
        if (item.expiryDate) {
          const expiry = new Date(item.expiryDate);
          if (expiry <= thirtyDaysFromNow && expiry >= now) {
            const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
            alerts.push({
              id: (item.id || item._id) + '_expiry',
              medicine: item.medicineName,
              type: 'Expiring Soon',
              message: `Batch expires in ${diffDays} days (${expiry.toLocaleDateString()}).`,
              priority: diffDays < 7 ? 'High' : 'Medium'
            });
          } else if (expiry < now) {
            alerts.push({
              id: (item.id || item._id) + '_expired',
              medicine: item.medicineName,
              type: 'Expired',
              message: `Batch has expired on ${expiry.toLocaleDateString()}!`,
              priority: 'High'
            });
          }
        }
      });
      setInventoryAlerts(alerts);
    } catch (err) { console.error('Failed to fetch inventory alerts:', err); }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/doctors');
      if (Array.isArray(res.data)) setRealDoctors(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/medicine-requests');
      setMedicines(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCrowdStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/crowd');
      if (res.data?.level) setCrowdStatus(res.data.level);
    } catch (err) { console.error(err); }
  };

  const handleUpdateCrowdStatus = async (level: string) => {
    try {
      await axios.put('http://localhost:8080/api/crowd', { level });
      setCrowdStatus(level);
    } catch (err) { console.error(err); }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/me');
      if (response.data) {
        setProfile(response.data.profile || {
          adminLevel: 'admin',
          department: '',
          permissions: [],
          totalUsers: 0,
          totalDoctors: 0,
          totalStudents: 0,
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
      const response = await axios.put('http://localhost:8080/api/profile/admin', profile);
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Actions
  const handleApproveMedicine = async (id: string) => {
    try {
      await axios.put(`http://localhost:8080/api/medicine-requests/${id}`, { status: 'Approved' });
      setMedicines(medicines.map(m => (m._id === id || m.id === id) ? { ...m, status: 'Approved' } : m));
    } catch (err) { console.error(err); }
  };

  const handleRejectMedicine = async (id: string) => {
    try {
      await axios.put(`http://localhost:8080/api/medicine-requests/${id}`, { status: 'Rejected' });
      setMedicines(medicines.map(m => (m._id === id || m.id === id) ? { ...m, status: 'Rejected' } : m));
    } catch (err) { console.error(err); }
  };

  const handleRegisterDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        ...newDoctorForm,
        role: 'DOCTOR',
        confirmPassword: newDoctorForm.password
      });
      alert('Doctor successfully registered!');
      setShowAddDoctorModal(false);
      setNewDoctorForm({ firstName: '', lastName: '', email: '', password: '', specialization: '', hospital: '', yearsOfExperience: 0 });
      fetchDoctors(); // refresh list
    } catch (err) {
      console.error('Failed to register doctor:', err);
      setMessage('Failed to register doctor.');
    }
  };

  const handleDeleteDoctor = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this doctor?")) {
      try {
        await axios.delete(`http://localhost:8080/api/doctors/${id}`);
        fetchDoctors();
        setMessage('Doctor removed successfully!');
      } catch (err) {
        console.error('Failed to delete doctor:', err);
        setMessage('Failed to delete doctor.');
      }
    }
  };

  const openDoctorProfile = (doctor: any) => {
    setSelectedDoctorProfile(doctor);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col z-20 sticky top-0 md:h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">MediTrack</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} className={activeTab === 'overview' ? 'text-blue-600' : ''} />
            System Overview
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <User size={20} className={activeTab === 'profile' ? 'text-indigo-600' : ''} />
            My Profile
          </button>
          
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'schedule' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Calendar size={20} className={activeTab === 'schedule' ? 'text-purple-600' : ''} />
            Schedule & Bookings
          </button>

          <button 
            onClick={() => setActiveTab('medicine')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'medicine' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Pill size={20} className={activeTab === 'medicine' ? 'text-teal-600' : ''} />
            Medicine Approvals
          </button>

          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'inventory' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Package size={20} className={activeTab === 'inventory' ? 'text-emerald-600' : ''} />
            Inventory Mgt.
          </button>

          <button 
            onClick={() => setActiveTab('crowd')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'crowd' ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users size={20} className={activeTab === 'crowd' ? 'text-orange-600' : ''} />
            Crowd Status
          </button>

          <button 
            onClick={() => setActiveTab('cms')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'cms' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <FileText size={20} className={activeTab === 'cms' ? 'text-rose-600' : ''} />
            Content Mgt. (CMS)
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl mb-4">
            <p className="font-semibold text-slate-800 text-sm truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
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
        
        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* ---- OVERVIEW TAB ---- */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">System Overview</h2>
              
              {message && (
                <div className={`p-4 rounded-xl mb-6 font-medium ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-slate-500 font-semibold text-sm">Total Users</p>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Users size={20} />
                    </div>
                  </div>
                  <p className="text-4xl font-extrabold text-slate-800">{stats.totalUsers}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-slate-500 font-semibold text-sm">Total Doctors</p>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Activity size={20} />
                    </div>
                  </div>
                  <p className="text-4xl font-extrabold text-slate-800">{stats.totalDoctors}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-slate-500 font-semibold text-sm">Total Students</p>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Users size={20} />
                    </div>
                  </div>
                  <p className="text-4xl font-extrabold text-slate-800">{stats.totalStudents}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-slate-500 font-semibold text-sm">Total Pharmacists / Nurses</p>
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <Pill size={20} />
                    </div>
                  </div>
                  <p className="text-4xl font-extrabold text-slate-800">{stats.totalPharmacists}</p>
                </div>
              </div>


              </div>
          )}

          {/* ---- MY PROFILE TAB ---- */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">My Profile</h2>
              
              {/* Admin Settings */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-800">Admin Profile Settings</h2>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">First Name</label>
                    <p className="text-slate-800 font-medium text-lg">{user?.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Last Name</label>
                    <p className="text-slate-800 font-medium text-lg">{user?.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Email Address</label>
                    <p className="text-slate-800 font-medium text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Phone Number</label>
                    <p className="text-slate-800 font-medium text-lg">{user?.phoneNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Admin ID</label>
                    <p className="text-slate-800 font-medium text-lg">{profile.adminId || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Admin Level</label>
                    {isEditing ? (
                      <select
                        value={profile.adminLevel}
                        onChange={(e) => setProfile({ ...profile, adminLevel: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                      >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    ) : (
                      <p className="text-slate-800 font-medium text-lg capitalize">{profile.adminLevel}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                        placeholder="e.g. Administration"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium text-lg">{profile.department || 'Not specified'}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- MANAGE DOCTORS & BOOKINGS TAB ---- */}
          {activeTab === 'schedule' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Schedule & Bookings</h2>

              {/* Global Bookings Feed */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow relative mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Global Appointments Feed (Confirmed Bookings)</h3>
                {allAppointments.length === 0 ? (
                  <p className="text-slate-500 italic">No appointments have been booked yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-sm text-slate-500">
                          <th className="pb-3 font-semibold">Student ID</th>
                          <th className="pb-3 font-semibold">Doctor ID</th>
                          <th className="pb-3 font-semibold">Date & Time</th>
                          <th className="pb-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allAppointments.map((apt, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-4 text-slate-800 font-semibold">{apt.studentId}</td>
                            <td className="py-4 text-slate-600">{apt.doctorId}</td>
                            <td className="py-4 text-slate-600">
                              {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.startTime}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded font-bold text-xs ${apt.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'}`}>
                                {apt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Global Schedules Feed */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow relative mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Doctor Schedules (Available & Booked Slots)</h3>
                {allSchedules.length === 0 ? (
                  <p className="text-slate-500 italic">No schedules have been created by doctors yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-sm text-slate-500">
                          <th className="pb-3 font-semibold">Doctor ID</th>
                          <th className="pb-3 font-semibold">Date</th>
                          <th className="pb-3 font-semibold">Time</th>
                          <th className="pb-3 font-semibold">Availability</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allSchedules.map((slot, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-4 text-slate-800 font-semibold">{slot.doctorId}</td>
                            <td className="py-4 text-slate-600">{new Date(slot.date).toLocaleDateString()}</td>
                            <td className="py-4 text-slate-600">{slot.startTime} - {slot.endTime}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded font-bold text-xs ${slot.isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {slot.isAvailable ? 'Available' : 'Booked'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Manage Doctors */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow relative">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-800">Registered Doctors</h3>
                  <button 
                    onClick={() => setShowAddDoctorModal(!showAddDoctorModal)}
                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-semibold hover:bg-purple-100 transition-colors"
                  >
                    {showAddDoctorModal ? 'Cancel' : 'Add New Doctor'}
                  </button>
                </div>
                
                {showAddDoctorModal && (
                  <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-800 mb-4">Register New Doctor</h4>
                    <form onSubmit={handleRegisterDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required type="text" placeholder="First Name" className="p-3 rounded-lg border" value={newDoctorForm.firstName} onChange={e => setNewDoctorForm({...newDoctorForm, firstName: e.target.value})} />
                      <input required type="text" placeholder="Last Name" className="p-3 rounded-lg border" value={newDoctorForm.lastName} onChange={e => setNewDoctorForm({...newDoctorForm, lastName: e.target.value})} />
                      <input required type="email" placeholder="Email" className="p-3 rounded-lg border" value={newDoctorForm.email} onChange={e => setNewDoctorForm({...newDoctorForm, email: e.target.value})} />
                      <input required type="password" placeholder="Password" className="p-3 rounded-lg border" value={newDoctorForm.password} onChange={e => setNewDoctorForm({...newDoctorForm, password: e.target.value})} />
                      <input required type="text" placeholder="Specialization (e.g. General Physician)" className="p-3 rounded-lg border md:col-span-2" value={newDoctorForm.specialization} onChange={e => setNewDoctorForm({...newDoctorForm, specialization: e.target.value})} />
                      <input required type="text" placeholder="Hospital (e.g. Base Hospital Kuliyapitiya)" className="p-3 rounded-lg border md:col-span-2" value={newDoctorForm.hospital} onChange={e => setNewDoctorForm({...newDoctorForm, hospital: e.target.value})} />
                      <input required type="number" placeholder="Years of Experience" className="p-3 rounded-lg border" value={newDoctorForm.yearsOfExperience || ''} onChange={e => setNewDoctorForm({...newDoctorForm, yearsOfExperience: parseInt(e.target.value)})} />
                      <div className="md:col-span-2 mt-2">
                        <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold w-full md:w-auto">Register Doctor</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-sm text-slate-500">
                        <th className="pb-3 font-semibold">Doctor Name</th>
                        <th className="pb-3 font-semibold">Specialization</th>
                        <th className="pb-3 font-semibold">Hospital</th>
                        <th className="pb-3 font-semibold">Experience</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {realDoctors.slice(doctorPage * DOCTORS_PER_PAGE, (doctorPage + 1) * DOCTORS_PER_PAGE).map((doc, idx) => (
                        <tr key={idx} onClick={() => openDoctorProfile(doc)} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="py-4 text-slate-800 font-semibold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">{doc.firstName?.charAt(0)}</div>
                            Dr. {doc.firstName} {doc.lastName}
                          </td>
                          <td className="py-4 text-slate-600">{doc.specialization}</td>
                          <td className="py-4 text-slate-600">{doc.hospital || 'Not Specified'}</td>
                          <td className="py-4">
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-bold text-xs">{doc.experienceYears}+ Years</span>
                          </td>
                          <td className="py-4 text-right">
                            <button onClick={(e) => handleDeleteDoctor(doc.id, e)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {realDoctors.length === 0 && !showAddDoctorModal && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500">No doctors registered yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {realDoctors.length > DOCTORS_PER_PAGE && (
                  <div className="flex justify-between items-center mt-6 border-t border-slate-100 pt-4">
                    <button 
                      onClick={() => setDoctorPage(Math.max(0, doctorPage - 1))}
                      disabled={doctorPage === 0}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-slate-500">
                      Page {doctorPage + 1} of {Math.ceil(realDoctors.length / DOCTORS_PER_PAGE)}
                    </span>
                    <button 
                      onClick={() => setDoctorPage(Math.min(Math.ceil(realDoctors.length / DOCTORS_PER_PAGE) - 1, doctorPage + 1))}
                      disabled={doctorPage >= Math.ceil(realDoctors.length / DOCTORS_PER_PAGE) - 1}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Doctor Profile Modal */}
          {selectedDoctorProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                      {selectedDoctorProfile.firstName?.charAt(0)}
                    </div>
                    Dr. {selectedDoctorProfile.firstName} {selectedDoctorProfile.lastName}
                  </h3>
                  <button onClick={() => setSelectedDoctorProfile(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                    <XCircle size={24} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Email</p>
                      <p className="font-semibold text-slate-800">{selectedDoctorProfile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Specialization</p>
                      <p className="font-semibold text-slate-800">{selectedDoctorProfile.specialization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Hospital</p>
                      <p className="font-semibold text-slate-800">{selectedDoctorProfile.hospital || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Experience</p>
                      <p className="font-semibold text-slate-800">{selectedDoctorProfile.experienceYears}+ Years</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end">
                  <button onClick={() => setSelectedDoctorProfile(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---- MEDICINE APPROVALS TAB ---- */}
          {activeTab === 'medicine' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Medicine Approvals</h2>
              <div className="space-y-4">
                {medicines.map((req: any) => (
                  <div key={req._id || req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-800">{req.medicineName} ({req.medicineType || 'Medicine'}) - {req.dosage}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mb-1">
                        Quantity: <span className="font-semibold text-slate-700">{req.quantity}</span> • Priority: <span className={`font-semibold ${req.priorityLevel === 'Critical' ? 'text-red-500' : req.priorityLevel === 'Urgent' ? 'text-orange-500' : 'text-slate-700'}`}>{req.priorityLevel || 'Normal'}</span>
                      </p>
                      <p className="text-slate-500 text-sm italic mb-2">"{req.reason}"</p>
                      <p className="text-slate-400 text-xs">Requested by Doctor <span className="font-medium text-slate-600">{req.doctorId}</span> on {new Date(req.requestedAt).toLocaleString()}</p>
                    </div>
                    
                    {req.status === 'Pending' && (
                      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <button 
                          onClick={() => handleApproveMedicine(req._id || req.id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-semibold transition-colors"
                        >
                          <CheckCircle size={18} /> Approve
                        </button>
                        <button 
                          onClick={() => handleRejectMedicine(req._id || req.id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold transition-colors"
                        >
                          <XCircle size={18} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {medicines.length === 0 && (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
                    No medicine requests pending.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- INVENTORY TAB ---- */}
          {activeTab === 'inventory' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Inventory Management</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Inventory Form */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Add Stock</h3>
                  <form onSubmit={handleAddInventory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Medicine Name</label>
                      <input required type="text" value={newInventoryForm.medicineName} onChange={(e) => setNewInventoryForm({...newInventoryForm, medicineName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Stock Quantity</label>
                      <input required type="number" min="0" value={newInventoryForm.stockQuantity} onChange={(e) => setNewInventoryForm({...newInventoryForm, stockQuantity: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date (Optional)</label>
                      <input type="date" value={newInventoryForm.expiryDate} onChange={(e) => setNewInventoryForm({...newInventoryForm, expiryDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                    </div>
                    <button type="submit" className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-2">
                      <Plus size={18} /> Add to Inventory
                    </button>
                  </form>
                </div>

                {/* Inventory List */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">Current Stock</h3>
                    </div>
                    {inventoryItems.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        No items in inventory.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                        {inventoryItems.map((item: any) => {
                          const itemAlerts = inventoryAlerts.filter(a => a.medicine === item.medicineName);
                          return (
                            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <p className="font-bold text-slate-800">{item.medicineName}</p>
                                  {itemAlerts.map(alert => (
                                    <span key={alert.id} className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${alert.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                      {alert.type}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                  <span>Stock: <strong className={item.stockQuantity < 50 ? 'text-red-500' : 'text-emerald-600'}>{item.stockQuantity}</strong></span>
                                  {item.expiryDate && (
                                    <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                              <button onClick={() => handleDeleteInventory(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---- CROWD STATUS TAB ---- */}
          {activeTab === 'crowd' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Center Crowd Status</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center max-w-2xl mx-auto hover:shadow-md transition-shadow">
                <p className="text-slate-500 font-medium mb-8">Update the real-time crowd level displayed to students.</p>
                
                <div className="flex justify-center items-center gap-8 mb-12">
                  {/* Status Indicator Circle */}
                  <div className={`relative flex items-center justify-center w-48 h-48 rounded-full border-8 transition-colors duration-500 ${
                    crowdStatus === 'Low' ? 'border-green-400 bg-green-50' :
                    crowdStatus === 'Moderate' ? 'border-amber-400 bg-amber-50' :
                    'border-red-400 bg-red-50'
                  }`}>
                    <div className="text-center animate-in zoom-in duration-300">
                      <span className="block text-4xl mb-2">
                        {crowdStatus === 'Low' ? '😌' : crowdStatus === 'Moderate' ? '🚶‍♂️' : '🏃‍♂️💨'}
                      </span>
                      <span className={`text-2xl font-black uppercase tracking-wider ${
                        crowdStatus === 'Low' ? 'text-green-700' :
                        crowdStatus === 'Moderate' ? 'text-amber-700' :
                        'text-red-700'
                      }`}>
                        {crowdStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => handleUpdateCrowdStatus('Low')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${crowdStatus === 'Low' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 -translate-y-1' : 'bg-slate-100 text-slate-600 hover:bg-green-50'}`}
                  >
                    Set Low
                  </button>
                  <button 
                    onClick={() => handleUpdateCrowdStatus('Moderate')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${crowdStatus === 'Moderate' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 -translate-y-1' : 'bg-slate-100 text-slate-600 hover:bg-amber-50'}`}
                  >
                    Set Moderate
                  </button>
                  <button 
                    onClick={() => handleUpdateCrowdStatus('High')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${crowdStatus === 'High' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 -translate-y-1' : 'bg-slate-100 text-slate-600 hover:bg-red-50'}`}
                  >
                    Set High
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---- CMS TAB ---- */}
          {activeTab === 'cms' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Content Management</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Post Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Broadcast New Update</h3>
                  <form className="space-y-5" onSubmit={handlePublishPost}>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Title</label>
                      <input type="text" value={cmsForm.title} onChange={(e) => setCmsForm({...cmsForm, title: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 transition-colors" placeholder="e.g. Dengue Awareness Week" required/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Category</label>
                      <select value={cmsForm.category} onChange={(e) => setCmsForm({...cmsForm, category: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 transition-colors">
                        <option>Health Alert</option>
                        <option>Medical News</option>
                        <option>Wellness Article</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Content</label>
                      <textarea rows={4} value={cmsForm.content} onChange={(e) => setCmsForm({...cmsForm, content: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 transition-colors" placeholder="Write your broadcast message here..." required></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      Publish Post
                    </button>
                  </form>
                </div>

                {/* Recent Posts */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Broadcasts</h3>
                  <div className="space-y-4">
                    {cmsPosts.length === 0 ? (
                      <p className="text-slate-500 italic">No recent broadcasts found.</p>
                    ) : (
                      cmsPosts.map((post: any) => (
                        <div key={post.id || post._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5 relative">
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await axios.delete(`http://localhost:8080/api/health-feed/${post.id || post._id}`);
                                fetchCmsPosts();
                              } catch (err) { console.error(err); }
                            }}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            ✖
                          </button>
                          <div className="flex justify-between items-start mb-2 pr-6">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">{post.category}</span>
                            <span className="text-xs text-slate-400 font-medium">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">{post.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      </div>
    </div>
  );
}

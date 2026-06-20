import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { 
  User, 
  Calendar, 
  Pill, 
  CheckCircle,
  Activity,
  Clock,
  Send,
  FileText,
  HeartPulse
} from 'lucide-react';

interface DoctorProfile {
  _id?: string;
  medicalRegistrationNumber?: string;
  specialization?: string;
  qualification?: string;
  availableDays?: string;
  availableTime?: string;
  yearsOfExperience?: number;
  department?: string;
  liveStatus?: string;
  
  // Keep legacy for safety
  licenseNumber?: string;
  hospital?: string;
  consultationFee?: number;
  qualifications?: string[];
  availableHours?: Record<string, string>;
}

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('appointments');

  // Profile State
  const [profile, setProfile] = useState<DoctorProfile>({
    medicalRegistrationNumber: '',
    specialization: '',
    qualification: '',
    availableDays: '',
    availableTime: '',
    yearsOfExperience: 0,
    department: '',
    liveStatus: 'Available',
    consultationFee: 0,
    qualifications: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock Data States
  const [appointments, setAppointments] = useState<any[]>([]);
  const [scheduleSlots, setScheduleSlots] = useState<any[]>([]);
  const [slotForm, setSlotForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });

  const [medicineForm, setMedicineForm] = useState({
    name: '',
    type: 'Tablet',
    dosage: '',
    quantity: 1,
    priority: 'Normal',
    reason: '',
  });
  const [myMedicineRequests, setMyMedicineRequests] = useState<any[]>([]);

  // Prescription State
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [prescriptionForm, setPrescriptionForm] = useState({
    studentId: '',
    studentName: '',
    medicines: [{ medicineName: '', dosage: '', quantity: 1, instructions: '' }]
  });

  const [vitalsForm, setVitalsForm] = useState({
    studentId: '',
    weight: '',
    height: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    steps: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
      fetchAppointments();
      fetchScheduleSlots();
      fetchMyMedicineRequests();
      fetchPrescriptions();

      const intervalId = setInterval(() => {
        fetchPrescriptions();
      }, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [user?.id]);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/prescriptions/doctor/${user?.id}`);
      setPrescriptions(res.data);
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
    }
  };

  const fetchMyMedicineRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/medicine-requests');
      setMyMedicineRequests(res.data.filter((req: any) => req.doctorId === user?.id));
    } catch (err) {
      console.error('Failed to fetch medicine requests:', err);
    }
  };

  const fetchScheduleSlots = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/doctors/${user?.id}/slots`);
      setScheduleSlots(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/appointments/doctor/${user?.id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/me');
      if (response.data?.profile) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put('http://localhost:8080/api/profile/doctor', profile);
      if (response.data) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating profile');
    }
    setIsLoading(false);
  };

  const handleStatusToggle = async () => {
    const newStatus = profile.liveStatus === 'Available' ? 'Unavailable' : 'Available';
    try {
      await axios.put(`http://localhost:8080/api/doctors/${user?.id}/status`, { status: newStatus });
      setProfile({ ...profile, liveStatus: newStatus });
    } catch (err) {
      console.error('Failed to update status', err);
      // Optimistically update anyway for demo
      setProfile({ ...profile, liveStatus: newStatus });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCompleteAppointment = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/appointments/${id}/status`, { status: 'Completed' }, { headers: { Authorization: `Bearer ${token}` }});
      setAppointments(appointments.map(a => (a.id === id || a._id === id) ? { ...a, status: 'Completed' } : a));
    } catch (err) {
      console.error('Failed to mark complete:', err);
      alert('Failed to update appointment status.');
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:8080/api/doctors/${user?.id}/slots`, {
        date: slotForm.date,
        startTime: slotForm.startTime,
        endTime: slotForm.endTime
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert('Time slot(s) added successfully!');
      if (res.data.slots) {
        setScheduleSlots([...scheduleSlots, ...res.data.slots]);
      } else if (res.data.slot) {
        setScheduleSlots([...scheduleSlots, res.data.slot]);
      }
      setSlotForm({ date: '', startTime: '', endTime: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add time slot.');
    }
  };

  const handleSubmitMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/medicine-requests', {
        doctorId: user?.id,
        medicineName: medicineForm.name,
        medicineType: medicineForm.type,
        dosage: medicineForm.dosage,
        quantity: medicineForm.quantity,
        priorityLevel: medicineForm.priority,
        reason: medicineForm.reason
      }, { headers: { Authorization: `Bearer ${token}` }});
      alert(`Medicine Request for ${medicineForm.name} submitted to Admin for review!`);
      setMedicineForm({ name: '', type: 'Tablet', dosage: '', quantity: 1, priority: 'Normal', reason: '' });
      fetchMyMedicineRequests();
    } catch (err) {
      console.error(err);
      alert('Failed to submit medicine request');
    }
  };

  const handleWritePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/prescriptions', {
        doctorId: user?.id,
        doctorName: `Dr. ${user?.firstName} ${user?.lastName}`,
        studentId: prescriptionForm.studentId,
        studentName: prescriptionForm.studentName,
        medicines: prescriptionForm.medicines,
        status: 'PENDING_PHARMACIST_CHECK'
      });
      alert('Prescription submitted! Awaiting Pharmacist stock check.');
      setPrescriptionForm({ studentId: '', studentName: '', medicines: [{ medicineName: '', dosage: '', quantity: 1, instructions: '' }] });
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert('Failed to write prescription');
    }
  };

  const handleLogVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        studentId: vitalsForm.studentId,
        weight: parseFloat(vitalsForm.weight) || 0,
        height: parseFloat(vitalsForm.height) || 0,
        bloodPressureSystolic: parseInt(vitalsForm.bloodPressureSystolic) || 0,
        bloodPressureDiastolic: parseInt(vitalsForm.bloodPressureDiastolic) || 0,
        heartRate: parseInt(vitalsForm.heartRate) || 0,
        steps: parseInt(vitalsForm.steps) || 0,
      };

      await axios.post('http://localhost:8080/api/health-metrics', payload);
      setVitalsForm({ studentId: '', weight: '', height: '', bloodPressureSystolic: '', bloodPressureDiastolic: '', heartRate: '', steps: '' });
      alert('Vitals logged successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to log vitals');
    }
  };

  const addMedicineRow = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [...prescriptionForm.medicines, { medicineName: '', dosage: '', quantity: 1, instructions: '' }]
    });
  };

  const updateMedicineRow = (index: number, field: string, value: any) => {
    const newMedicines = [...prescriptionForm.medicines];
    newMedicines[index] = { ...newMedicines[index], [field]: value };
    setPrescriptionForm({ ...prescriptionForm, medicines: newMedicines });
  };

  const removeMedicineRow = (index: number) => {
    const newMedicines = prescriptionForm.medicines.filter((_, i) => i !== index);
    setPrescriptionForm({ ...prescriptionForm, medicines: newMedicines });
  };

  const handleFinalConfirmPrescription = async (id: string) => {
    try {
      await axios.put(`http://localhost:8080/api/prescriptions/${id}/status`, { status: 'DOCTOR_CONFIRMED' });
      fetchPrescriptions();
    } catch (err) { console.error(err); }
  };

  const handleCancelPrescription = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel and delete this prescription?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/prescriptions/${id}`);
      setPrescriptions(prescriptions.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col z-20 sticky top-0 md:h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">MediTrack</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Doctor Portal</p>
          </div>
        </div>

        {/* Live Status Control */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Live Availability</p>
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {profile.liveStatus === 'Available' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${profile.liveStatus === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span className="font-semibold text-sm text-slate-700">{profile.liveStatus || 'Available'}</span>
            </div>
            <button 
              onClick={handleStatusToggle}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${profile.liveStatus === 'Available' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
            >
              Toggle
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'appointments' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Calendar size={20} className={activeTab === 'appointments' ? 'text-indigo-600' : ''} />
            My Appointments
          </button>
          
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'schedule' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Clock size={20} className={activeTab === 'schedule' ? 'text-blue-600' : ''} />
            Manage Schedule
          </button>
          
          <button 
            onClick={() => setActiveTab('medicines')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'medicines' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Pill size={20} className={activeTab === 'medicines' ? 'text-teal-600' : ''} />
            Request Medicine
          </button>

          <button 
            onClick={() => setActiveTab('prescriptions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'prescriptions' ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <FileText size={20} className={activeTab === 'prescriptions' ? 'text-orange-600' : ''} />
            Patient Prescriptions
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'profile' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <User size={20} className={activeTab === 'profile' ? 'text-purple-600' : ''} />
            Professional Profile
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl mb-4">
            <p className="font-semibold text-slate-800 text-sm truncate">Dr. {user?.firstName} {user?.lastName}</p>
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2 hidden md:block"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none translate-y-1/2 hidden md:block"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* ---- APPOINTMENTS TAB ---- */}
          {activeTab === 'appointments' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">My Appointments</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Calendar size={24} /></div>
                  <div>
                    <div className="text-slate-500 font-semibold text-sm">Today's Total</div>
                    <div className="text-3xl font-extrabold text-slate-800">
                      {appointments.filter(a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()).length}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24} /></div>
                  <div>
                    <div className="text-slate-500 font-semibold text-sm">Remaining</div>
                    <div className="text-3xl font-extrabold text-slate-800">{appointments.filter(a => a.status !== 'Completed').length}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {appointments.map((apt: any) => (
                  <div key={apt._id || apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-800">Student ID: {apt.studentId}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                          apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'Scheduled' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm flex items-center gap-2">
                        <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">{apt.reason || 'General'}</span>
                        <span>•</span>
                        <span>{new Date(apt.appointmentDate).toLocaleDateString()} at {apt.startTime}</span>
                      </p>
                    </div>
                    
                    {apt.status !== 'Completed' && (
                      <button 
                        onClick={() => handleCompleteAppointment(apt._id || apt.id)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-semibold transition-colors"
                      >
                        <CheckCircle size={18} /> Mark Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- SCHEDULE TAB ---- */}
          {activeTab === 'schedule' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Manage Schedule</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Add Time Slot</h3>
                    <form onSubmit={handleAddSlot} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                        <input 
                          type="date" 
                          required
                          value={slotForm.date}
                          onChange={(e) => setSlotForm({...slotForm, date: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Start Time</label>
                          <input 
                            type="time" 
                            required
                            value={slotForm.startTime}
                            onChange={(e) => setSlotForm({...slotForm, startTime: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">End Time</label>
                          <input 
                            type="time" 
                            required
                            value={slotForm.endTime}
                            onChange={(e) => setSlotForm({...slotForm, endTime: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Clock size={18} />
                        Add Slot
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="font-bold text-slate-800">My Current Slots</h3>
                    </div>
                    {scheduleSlots.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        <Clock className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p>No available slots found.</p>
                        <p className="text-sm">Add some time slots to allow students to book appointments.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                        {scheduleSlots.map((slot: any, idx: number) => (
                          <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold uppercase">{new Date(slot.date).toLocaleString('default', { month: 'short', timeZone: 'UTC' })}</span>
                                <span className="text-lg font-extrabold leading-none">{new Date(slot.date).getUTCDate()}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{slot.startTime} - {slot.endTime}</p>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${slot.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {slot.isAvailable ? 'Available' : 'Booked'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---- MEDICINE REQUESTS TAB ---- */}
          {activeTab === 'medicines' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Submit Medicine Request</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">New Inventory Request</h3>
                  <p className="text-sm text-slate-500 mb-6">Request administration to add new medication to the central pharmacy inventory.</p>
                  
                  <form className="space-y-5" onSubmit={handleSubmitMedicine}>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Medicine Name</label>
                      <input 
                        type="text" 
                        required
                        value={medicineForm.name}
                        onChange={e => setMedicineForm({...medicineForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 transition-colors" 
                        placeholder="e.g. Augmentin 625 Duo" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Medicine Type</label>
                        <select 
                          required
                          value={medicineForm.type}
                          onChange={e => setMedicineForm({...medicineForm, type: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 transition-colors" 
                        >
                          <option value="Tablet">Tablet</option>
                          <option value="Capsule">Capsule</option>
                          <option value="Syrup">Syrup</option>
                          <option value="Injection">Injection</option>
                          <option value="Ointment">Ointment</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Dosage / Form</label>
                        <input 
                          type="text" 
                          required
                          value={medicineForm.dosage}
                          onChange={e => setMedicineForm({...medicineForm, dosage: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 transition-colors" 
                          placeholder="e.g. 625mg Tablets" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Quantity Required</label>
                        <input 
                          type="number" 
                          required
                          value={medicineForm.quantity}
                          onChange={e => setMedicineForm({...medicineForm, quantity: parseInt(e.target.value) || 1})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 transition-colors" 
                          placeholder="e.g. 100" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Priority Level</label>
                        <select 
                          required
                          value={medicineForm.priority}
                          onChange={e => setMedicineForm({...medicineForm, priority: e.target.value})}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 transition-colors" 
                        >
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Reason for Request</label>
                      <textarea 
                        rows={3} 
                        required
                        value={medicineForm.reason}
                        onChange={e => setMedicineForm({...medicineForm, reason: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 transition-colors" 
                        placeholder="Briefly explain why this is needed for patients..."
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      <Send size={18} /> Submit to Admin
                    </button>
                  </form>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <Activity size={32} className="text-teal-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Request Process</h4>
                  <p className="text-slate-600">Once submitted, your request goes directly to the Administration panel for review. Upon approval, the Pharmacist will update the inventory.</p>
                </div>
              </div>

              {/* List of submitted requests */}
              <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-800">My Submitted Requests</h3>
                </div>
                {myMedicineRequests.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <p>You haven't submitted any medicine requests yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                    {myMedicineRequests.map((req: any, idx: number) => (
                      <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-800">{req.medicineName} ({req.medicineType || 'Medicine'}) - {req.dosage}</p>
                          <p className="text-sm text-slate-500 mt-1">Quantity: {req.quantity} • Priority: <strong className={req.priorityLevel === 'Critical' ? 'text-red-500' : req.priorityLevel === 'Urgent' ? 'text-orange-500' : 'text-slate-600'}>{req.priorityLevel || 'Normal'}</strong></p>
                          <p className="text-xs text-slate-400 mt-1">Requested on: {new Date(req.requestedAt).toLocaleString()}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap
                          ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                            req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                            req.status === 'Dispensed' ? 'bg-blue-100 text-blue-700' : 
                            'bg-amber-100 text-amber-700'}`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- PATIENT PRESCRIPTIONS TAB ---- */}
          {activeTab === 'prescriptions' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Patient Prescriptions</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Write Prescription Form */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Write Prescription</h3>
                  <form onSubmit={handleWritePrescription} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Student ID</label>
                      <input required type="text" value={prescriptionForm.studentId} onChange={(e) => setPrescriptionForm({...prescriptionForm, studentId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Student Name</label>
                      <input required type="text" value={prescriptionForm.studentName} onChange={(e) => setPrescriptionForm({...prescriptionForm, studentName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                    </div>

                    <div className="space-y-4 border-t border-slate-100 pt-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-semibold text-slate-700">Medicines</label>
                      </div>
                      
                      {prescriptionForm.medicines.map((med, index) => (
                        <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                          {prescriptionForm.medicines.length > 1 && (
                            <button type="button" onClick={() => removeMedicineRow(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          )}
                          <div>
                            <input required type="text" placeholder="Medicine Name" value={med.medicineName} onChange={(e) => updateMedicineRow(index, 'medicineName', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input required type="text" placeholder="Dosage (e.g. 10mg)" value={med.dosage} onChange={(e) => updateMedicineRow(index, 'dosage', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                            </div>
                            <div>
                              <input required type="number" placeholder="Qty" value={med.quantity} onChange={(e) => updateMedicineRow(index, 'quantity', parseInt(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                            </div>
                          </div>
                          <div>
                            <textarea required placeholder="Instructions" value={med.instructions} onChange={(e) => updateMedicineRow(index, 'instructions', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm" rows={2}></textarea>
                          </div>
                        </div>
                      ))}

                      <button type="button" onClick={addMedicineRow} className="w-full py-2 px-4 rounded-xl border-2 border-dashed border-orange-300 text-orange-600 font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm">
                        + Add Another Medicine
                      </button>
                    </div>
                    <button type="submit" className="w-full py-2.5 px-4 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 shadow-md transition-all flex items-center justify-center gap-2">
                      <FileText size={18} /> Send to Pharmacy
                    </button>
                  </form>
                </div>

                {/* Log Vitals Form */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2"><Activity className="text-rose-500 w-5 h-5"/> Update Patient Vitals</h3>
                  <form onSubmit={handleLogVitals} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Student ID</label>
                      <input required type="text" value={vitalsForm.studentId} onChange={(e) => setVitalsForm({...vitalsForm, studentId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="e.g. stu001" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Heart Rate (bpm)</label>
                        <input type="number" value={vitalsForm.heartRate} onChange={(e) => setVitalsForm({...vitalsForm, heartRate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="e.g. 72" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Weight (kg)</label>
                        <input type="number" step="0.1" value={vitalsForm.weight} onChange={(e) => setVitalsForm({...vitalsForm, weight: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="e.g. 70" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">BP Systolic</label>
                        <input type="number" value={vitalsForm.bloodPressureSystolic} onChange={(e) => setVitalsForm({...vitalsForm, bloodPressureSystolic: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="e.g. 120" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">BP Diastolic</label>
                        <input type="number" value={vitalsForm.bloodPressureDiastolic} onChange={(e) => setVitalsForm({...vitalsForm, bloodPressureDiastolic: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="e.g. 80" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Height (cm)</label>
                        <input type="number" value={vitalsForm.height} onChange={(e) => setVitalsForm({...vitalsForm, height: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="e.g. 175" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Daily Steps</label>
                        <input type="number" value={vitalsForm.steps} onChange={(e) => setVitalsForm({...vitalsForm, steps: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm" placeholder="e.g. 5000" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 px-4 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 shadow-md transition-all flex items-center justify-center gap-2 mt-2">
                      <HeartPulse size={18} /> Update Vitals
                    </button>
                  </form>
                </div>
                
                {/* Tracking & Final Confirmation */}
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="text-xl font-bold text-slate-800">Prescription Status Tracker</h3>
                  {prescriptions.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
                      You haven't written any prescriptions yet.
                    </div>
                  ) : (
                    prescriptions.map((p: any) => (
                      <div key={p.id || p._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">{p.studentName} ({p.studentId})</h4>
                            {p.medicines?.map((med: any, idx: number) => (
                              <p key={idx} className="text-slate-600 font-medium mt-1 text-sm">{med.medicineName} - {med.dosage} <span className="text-slate-400 font-normal">x{med.quantity}</span></p>
                            ))}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            p.status === 'PENDING_PHARMACIST_CHECK' ? 'bg-slate-100 text-slate-600' :
                            p.status === 'PHARMACIST_CONFIRMED' ? 'bg-amber-100 text-amber-700' :
                            p.status === 'PHARMACIST_REJECTED' ? 'bg-red-100 text-red-700' :
                            p.status === 'DOCTOR_CONFIRMED' ? 'bg-indigo-100 text-indigo-700' :
                            p.status === 'ISSUED' ? 'bg-green-100 text-green-700' : 'bg-slate-100'
                          }`}>
                            {p.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        
                        {/* Progress Bar Visualization */}
                        {p.status !== 'PHARMACIST_REJECTED' ? (
                          <div className="relative pt-1 mt-4 mb-6 hidden sm:block">
                            <div className="flex mb-2 items-center justify-between text-xs font-semibold text-slate-500">
                              <span className={p.status === 'PENDING_PHARMACIST_CHECK' ? 'text-orange-600' : 'text-green-600'}>Prescribed</span>
                              <span className={['PHARMACIST_CONFIRMED','DOCTOR_CONFIRMED','ISSUED'].includes(p.status) ? 'text-green-600' : ''}>Pharm OK</span>
                              <span className={['DOCTOR_CONFIRMED','ISSUED'].includes(p.status) ? 'text-green-600' : ''}>Doc OK</span>
                              <span className={p.status === 'ISSUED' ? 'text-green-600' : ''}>Issued</span>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100">
                              <div style={{ width: p.status === 'PENDING_PHARMACIST_CHECK' ? '25%' : p.status === 'PHARMACIST_CONFIRMED' ? '50%' : p.status === 'DOCTOR_CONFIRMED' ? '75%' : '100%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                            <p className="text-red-700 font-bold text-sm">Pharmacist reported this medicine is Out of Stock.</p>
                            <p className="text-red-600 text-xs mt-1">Please cancel this prescription and write a new one with an alternative medicine.</p>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
                          {p.status === 'PHARMACIST_REJECTED' && (
                            <button 
                              onClick={() => handleCancelPrescription(p.id || p._id)}
                              className="px-6 py-2 bg-white border-2 border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-bold transition-colors"
                            >
                              Cancel & Delete
                            </button>
                          )}
                          {p.status === 'PHARMACIST_CONFIRMED' && (
                            <button 
                              onClick={() => handleFinalConfirmPrescription(p.id || p._id)}
                              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors"
                            >
                              Give Final Confirmation
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---- PROFILE TAB ---- */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Professional Profile</h2>
              
              {message && (
                <div className={`p-4 rounded-xl mb-6 font-medium ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-800">My Details</h2>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Reg. Number</label>
                        <input type="text" value={profile.medicalRegistrationNumber || profile.licenseNumber || ''} onChange={(e) => setProfile({...profile, medicalRegistrationNumber: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Specialization</label>
                        <input type="text" value={profile.specialization || ''} onChange={(e) => setProfile({...profile, specialization: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Department</label>
                        <input type="text" value={profile.department || ''} onChange={(e) => setProfile({...profile, department: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Years of Experience</label>
                        <input type="number" value={profile.yearsOfExperience || 0} onChange={(e) => setProfile({...profile, yearsOfExperience: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Qualification</label>
                        <input type="text" value={profile.qualification || ''} onChange={(e) => setProfile({...profile, qualification: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Available Days</label>
                        <input type="text" value={profile.availableDays || ''} onChange={(e) => setProfile({...profile, availableDays: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" placeholder="e.g. Mon, Wed, Fri" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Available Time</label>
                        <input type="text" value={profile.availableTime || ''} onChange={(e) => setProfile({...profile, availableTime: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" placeholder="e.g. 9 AM - 1 PM" />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-100">
                      <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">Cancel</button>
                      <button onClick={handleUpdate} disabled={isLoading} className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition-all">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Reg. Number</p>
                      <p className="text-lg font-medium text-slate-800">{profile.medicalRegistrationNumber || profile.licenseNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Specialization</p>
                      <p className="text-lg font-medium text-slate-800">{profile.specialization || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</p>
                      <p className="text-lg font-medium text-slate-800">{profile.department || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience</p>
                      <p className="text-lg font-medium text-slate-800">{profile.yearsOfExperience || '0'} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Qualification</p>
                      <p className="text-lg font-medium text-slate-800">{profile.qualification || 'Not provided'}</p>
                    </div>
                    
                    <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl flex flex-col sm:flex-row gap-8">
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Available Days</p>
                        <p className="text-slate-800 font-medium">{profile.availableDays || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Available Time</p>
                        <p className="text-slate-800 font-medium">{profile.availableTime || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
      </div>
    </div>
  );
}

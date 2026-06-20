import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { 
  User, 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  Package,
  Clock,
  ClipboardList,
  Plus,
  Trash2,
  XCircle
} from 'lucide-react';

interface PharmacistProfile {
  _id?: string;
  pharmacistId: string;
  licenseNumber: string;
  qualification: string;
  workingShift: string;
  address: string;
  department: string;
}

export default function PharmacistDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('inventory_mgt');

  const [profile, setProfile] = useState<PharmacistProfile>({
    pharmacistId: '',
    licenseNumber: '',
    qualification: '',
    workingShift: '',
    address: '',
    department: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [requestStockForm, setRequestStockForm] = useState({
    medicineName: '',
    orderQuantity: 0
  });

  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);

  // Prescriptions State
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchInventoryAlerts();
    fetchInventoryItems();
    fetchPrescriptions();

    const intervalId = setInterval(() => {
      fetchPrescriptions();
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/prescriptions');
      setPrescriptions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
    }
  };

  const fetchInventoryAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/inventory');
      const alerts: any[] = [];
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const data = Array.isArray(res.data) ? res.data : [];
      data.forEach((item: any) => {
        if (item.stockQuantity < 50) {
          alerts.push({
            id: (item.id || item._id) + '_stock',
            medicine: item.medicineName,
            type: item.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock',
            message: item.stockQuantity === 0 ? 'Completely depleted. Needs immediate restock.' : `Only ${item.stockQuantity} units remaining in inventory.`,
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
              message: `Batch has expired on ${expiry.toLocaleDateString()}! Dispose immediately.`,
              priority: 'High'
            });
          }
        }
      });
      setInventoryAlerts(alerts);
    } catch (err) { console.error(err); }
  };

  const fetchInventoryItems = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/inventory');
      setInventoryItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const handleRequestStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestStockForm.medicineName || requestStockForm.orderQuantity <= 0) return;
    
    try {
      const payload = {
        medicineName: requestStockForm.medicineName,
        quantity: requestStockForm.orderQuantity,
        medicineType: 'Restock',
        dosage: 'N/A',
        priorityLevel: 'Normal',
        reason: 'Pharmacist Restock Order'
      };
      await axios.post('http://localhost:8080/api/medicine-requests', payload);
      setRequestStockForm({ medicineName: '', orderQuantity: 0 });
      setMessage('Stock order request sent to Admin successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to request stock:', err);
      setMessage('Failed to send stock request.');
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
      const response = await axios.put('http://localhost:8080/api/profile/pharmacist', profile);
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Actions
  const handleDismissAlert = (id: number) => {
    setInventoryAlerts(inventoryAlerts.filter(a => a.id !== id));
  };

  const handleConfirmPrescriptionToDoctor = async (id: string) => {
    try {
      await axios.put(`http://localhost:8080/api/prescriptions/${id}/status`, { status: 'PHARMACIST_CONFIRMED' });
      fetchPrescriptions();
    } catch (err) { console.error(err); }
  };

  const handleRejectPrescription = async (id: string) => {
    try {
      await axios.put(`http://localhost:8080/api/prescriptions/${id}/status`, { status: 'PHARMACIST_REJECTED' });
      fetchPrescriptions();
    } catch (err) { console.error(err); }
  };

  const handleIssueMedicine = async (id: string) => {
    try {
      await axios.put(`http://localhost:8080/api/prescriptions/${id}/status`, { status: 'ISSUED' });
      fetchPrescriptions();
    } catch (err) { console.error(err); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">MediTrack</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pharmacist</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('inventory_mgt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'inventory_mgt' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Package size={20} className={activeTab === 'inventory_mgt' ? 'text-emerald-600' : ''} />
            Inventory Mgt.
          </button>
          
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'inventory' ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Package size={20} className={activeTab === 'inventory' ? 'text-orange-600' : ''} />
            Inventory Alerts
          </button>

          <button 
            onClick={() => setActiveTab('prescriptions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'prescriptions' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ClipboardList size={20} className={activeTab === 'prescriptions' ? 'text-indigo-600' : ''} />
            Fulfill Prescriptions
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'profile' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <User size={20} className={activeTab === 'profile' ? 'text-teal-600' : ''} />
            My Profile
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2 hidden md:block"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none translate-y-1/2 hidden md:block"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* ---- INVENTORY MGT TAB ---- */}
          {activeTab === 'inventory_mgt' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Inventory Management</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Request Stock Form */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Request Stock Order</h3>
                  <form onSubmit={handleRequestStock} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Select Medicine</label>
                      <select 
                        required 
                        value={requestStockForm.medicineName} 
                        onChange={(e) => setRequestStockForm({...requestStockForm, medicineName: e.target.value})} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-slate-50"
                      >
                        <option value="">-- Select a Medicine --</option>
                        {inventoryItems.map((item) => (
                          <option key={item.id} value={item.medicineName}>{item.medicineName}</option>
                        ))}
                      </select>
                    </div>

                    {requestStockForm.medicineName && (() => {
                      const selectedItem = inventoryItems.find(i => i.medicineName === requestStockForm.medicineName);
                      if (!selectedItem) return null;
                      return (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                          <p className="text-slate-500 flex justify-between">Current Stock: <strong className="text-slate-800">{selectedItem.stockQuantity}</strong></p>
                          <p className="text-slate-500 flex justify-between">Expiry Date: <strong className="text-slate-800">{selectedItem.expiryDate ? new Date(selectedItem.expiryDate).toLocaleDateString() : 'N/A'}</strong></p>
                        </div>
                      );
                    })()}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Order Quantity</label>
                      <input 
                        required 
                        type="number" 
                        min="1" 
                        value={requestStockForm.orderQuantity || ''} 
                        onChange={(e) => setRequestStockForm({...requestStockForm, orderQuantity: parseInt(e.target.value) || 0})} 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" 
                      />
                    </div>

                    {requestStockForm.medicineName && requestStockForm.orderQuantity > 0 && (() => {
                      const selectedItem = inventoryItems.find(i => i.medicineName === requestStockForm.medicineName);
                      if (!selectedItem) return null;
                      return (
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-sm">
                          <p className="text-emerald-700 flex justify-between">Expected Stock After Order: <strong>{selectedItem.stockQuantity + requestStockForm.orderQuantity}</strong></p>
                        </div>
                      );
                    })()}

                    <button type="submit" className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-2">
                      <Plus size={18} /> Place Order to Admin
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
                        {inventoryItems.map((item: any) => (
                          <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                              <p className="font-bold text-slate-800">{item.medicineName}</p>
                              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                <span>Stock: <strong className={item.stockQuantity < 50 ? 'text-red-500' : 'text-emerald-600'}>{item.stockQuantity}</strong></span>
                                {item.expiryDate && (
                                  <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                                )}
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

          {/* ---- FULFILL PRESCRIPTIONS TAB ---- */}
          {activeTab === 'prescriptions' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Fulfill Prescriptions</h2>

              {/* Step 1: Confirm to Doctor */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Step 1: Awaiting Your Review (From Doctor)</h3>
                {prescriptions.filter((p: any) => p.status === 'PENDING_PHARMACIST_CHECK').length === 0 ? (
                  <p className="text-slate-500 italic">No prescriptions are awaiting your inventory check.</p>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.filter((p: any) => p.status === 'PENDING_PHARMACIST_CHECK').map((p: any) => (
                      <div key={p.id || p._id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center bg-blue-50/30">
                        <div>
                          <p className="font-bold text-slate-800">{p.studentName} ({p.studentId})</p>
                          {p.medicines?.map((med: any, idx: number) => (
                            <p key={idx} className="text-slate-600 font-medium text-sm mt-1">Prescribed: {med.medicineName} ({med.dosage}) - Qty: {med.quantity}</p>
                          ))}
                          <p className="text-sm text-slate-500 mt-2">By {p.doctorName}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                          <button 
                            onClick={() => handleConfirmPrescriptionToDoctor(p.id || p._id)}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center gap-2"
                          >
                            <CheckCircle size={18} /> Confirm Availability
                          </button>
                          <button 
                            onClick={() => handleRejectPrescription(p.id || p._id)}
                            className="px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                          >
                            <XCircle size={18} /> Out of Stock
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Issue Medicine */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Step 2: Doctor Confirmed (Ready to Issue)</h3>
                {prescriptions.filter((p: any) => p.status === 'DOCTOR_CONFIRMED').length === 0 ? (
                  <p className="text-slate-500 italic">No prescriptions are ready to be issued right now.</p>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.filter((p: any) => p.status === 'DOCTOR_CONFIRMED').map((p: any) => (
                      <div key={p.id || p._id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center bg-green-50/50">
                        <div>
                          <p className="font-bold text-slate-800 text-xl">{p.studentName} ({p.studentId})</p>
                          {p.medicines?.map((med: any, idx: number) => (
                            <div key={idx} className="mt-2 bg-white/50 p-3 rounded-lg border border-green-100">
                              <p className="text-slate-800 font-bold">Dispense: {med.medicineName} ({med.dosage}) - Qty: <span className="text-xl">{med.quantity}</span></p>
                              <p className="text-sm text-slate-600 mt-1">Instructions: {med.instructions}</p>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => handleIssueMedicine(p.id || p._id)}
                          className="mt-4 md:mt-0 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-extrabold shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 text-lg"
                        >
                          <Package size={24} /> Issue Medicine
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- INVENTORY ALERTS TAB ---- */}
          {activeTab === 'inventory' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Inventory Notifications</h2>
              
              {inventoryAlerts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Inventory is healthy!</h3>
                  <p className="text-slate-500">There are no low stock or expiring medication alerts at this time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inventoryAlerts.map(alert => (
                    <div key={alert.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${alert.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                        <AlertTriangle size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-bold text-slate-800">{alert.medicine}</h3>
                          <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${alert.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {alert.type}
                          </span>
                        </div>
                        <p className="text-slate-600 mb-4">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---- PROFILE TAB ---- */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-8">My Profile</h2>
              
              {message && (
                <div className={`p-4 rounded-xl mb-6 font-medium ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-800">Professional Information</h2>
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
                        <label className="block text-sm font-semibold text-slate-600 mb-2">License Number</label>
                        <input type="text" value={profile.licenseNumber} onChange={(e) => setProfile({...profile, licenseNumber: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50" placeholder="License Number" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Qualification</label>
                        <input type="text" value={profile.qualification} onChange={(e) => setProfile({...profile, qualification: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50" placeholder="Qualification" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Working Shift</label>
                        <input type="text" value={profile.workingShift} onChange={(e) => setProfile({...profile, workingShift: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50" placeholder="Morning / Evening / Night" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Department</label>
                        <input type="text" value={profile.department} onChange={(e) => setProfile({...profile, department: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50" placeholder="Department" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Address</label>
                      <textarea value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50" rows={3} placeholder="Address" />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                      <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">Cancel</button>
                      <button onClick={handleUpdate} disabled={isLoading} className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md transition-all">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">License Number</p>
                      <p className="text-lg font-medium text-slate-800">{profile.licenseNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Qualification</p>
                      <p className="text-lg font-medium text-slate-800">{profile.qualification || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Working Shift</p>
                      <p className="text-lg font-medium text-slate-800">{profile.workingShift || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</p>
                      <p className="text-lg font-medium text-slate-800">{profile.department || 'Not provided'}</p>
                    </div>
                    {profile.address && (
                      <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Address</p>
                        <p className="text-slate-800">{profile.address}</p>
                      </div>
                    )}
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

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Activity, Inbox, Plus, CheckCircle, XCircle } from 'lucide-react';

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

  // Admin Features State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [crowdLevel, setCrowdLevel] = useState('Low');
  const [medicineRequests, setMedicineRequests] = useState<any[]>([]);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  
  // Content CMS State
  const [showContentModal, setShowContentModal] = useState(false);
  const [newContent, setNewContent] = useState({ title: '', category: 'wellness', content: '' });

  const fetchDashboardData = async () => {
    try {
      const [inqRes, statRes, medRes] = await Promise.all([
        fetch('/api/inquiries'),
        fetch('/api/system-status'),
        fetch('/api/medicine-requests')
      ]);
      
      if (inqRes.ok) setInquiries((await inqRes.json()).inquiries || []);
      if (statRes.ok) setCrowdLevel((await statRes.json()).status?.crowdLevel || 'Low');
      if (medRes.ok) setMedicineRequests((await medRes.json()).requests || []);
    } catch(err) { console.error('Failed to fetch dashboard data', err); }
  };

  useEffect(() => {
    fetchProfile();
    fetchDashboardData();
  }, []);

  const updateCrowdLevel = async (level: string) => {
    setCrowdLevel(level);
    try {
      await fetch('/api/system-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crowdLevel: level })
      });
      setMessage('Crowd level updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMedRequestStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/medicine-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: adminNotes[id] || '' })
      });
      fetchDashboardData();
      setMessage(`Request ${status}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const resolveInquiry = async (id: string) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      fetchDashboardData();
    } catch (error) {
      console.error(error);
    }
  };

  const submitHealthContent = async () => {
    if (!newContent.title || !newContent.content) return;
    try {
      await fetch('/api/health-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
      setShowContentModal(false);
      setNewContent({ title: '', category: 'wellness', content: '' });
      setMessage('Content published successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile || {
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
      const response = await fetch('/api/profile/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update profile');
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
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">MediTrack</h1>
            <p className="text-gray-600">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{profile.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Doctors</h3>
            <p className="text-3xl font-bold text-green-600">{profile.totalDoctors}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-purple-600">{profile.totalStudents}</p>
          </div>
        </div>

        {/* Admin Settings */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Edit Details
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Level</label>
              {isEditing ? (
                <select
                  value={profile.adminLevel}
                  onChange={(e) => setProfile({ ...profile, adminLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              ) : (
                <p className="text-gray-800 capitalize">{profile.adminLevel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-gray-800">{profile.department || 'Not set'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {/* Global Clinic Status */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8 border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              Global Clinic Crowd Level
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {['Low', 'Medium', 'High'].map(level => (
              <Button 
                key={level}
                onClick={() => updateCrowdLevel(level)}
                className={`${
                  crowdLevel === level 
                    ? level === 'Low' ? 'bg-green-600 hover:bg-green-700' : level === 'Medium' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } text-white font-bold py-2 px-6 rounded-full`}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Health Content CMS */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Health Information CMS</h2>
            <Button onClick={() => setShowContentModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Publish New Content
            </Button>
          </div>
          {showContentModal && (
            <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-bold text-lg mb-4">Create New Article</h3>
              <div className="space-y-4 mb-4">
                <input type="text" placeholder="Title" value={newContent.title} onChange={(e) => setNewContent({...newContent, title: e.target.value})} className="w-full px-4 py-2 border rounded" />
                <select value={newContent.category} onChange={(e) => setNewContent({...newContent, category: e.target.value})} className="w-full px-4 py-2 border rounded">
                  <option value="wellness">Wellness Tip</option>
                  <option value="local_news">Local News</option>
                  <option value="international_news">International News</option>
                  <option value="university_news">University News</option>
                </select>
                <textarea placeholder="Content..." value={newContent.content} onChange={(e) => setNewContent({...newContent, content: e.target.value})} className="w-full px-4 py-2 border rounded" rows={5}></textarea>
              </div>
              <div className="flex gap-2">
                <Button onClick={submitHealthContent} className="bg-indigo-600 text-white">Publish</Button>
                <Button onClick={() => setShowContentModal(false)} className="bg-gray-300 text-black">Cancel</Button>
              </div>
            </div>
          )}
          <p className="text-gray-600 text-sm">Use this section to broadcast medical news and wellness tips to the Student Dashboard.</p>
        </div>

        {/* Medicine Request Approvals */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Medicine Requests</h2>
          <div className="space-y-4">
            {medicineRequests.filter(r => r.status === 'pending').map(req => (
              <div key={req._id} className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-bold text-gray-900">{req.medicineName} - {req.dosage}</h4>
                  <p className="text-sm text-gray-600">Doctor: Dr. {req.doctorId?.userId?.firstName} {req.doctorId?.userId?.lastName}</p>
                  <p className="text-sm text-gray-600">Reason: {req.reason}</p>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="Admin Notes (Optional)" 
                    value={adminNotes[req._id] || ''}
                    onChange={(e) => setAdminNotes({...adminNotes, [req._id]: e.target.value})}
                    className="px-3 py-1 text-sm border rounded"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleMedRequestStatus(req._id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 h-auto"><CheckCircle className="w-3 h-3 mr-1" /> Approve</Button>
                    <Button onClick={() => handleMedRequestStatus(req._id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-3 h-auto"><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
                  </div>
                </div>
              </div>
            ))}
            {medicineRequests.filter(r => r.status === 'pending').length === 0 && (
              <p className="text-gray-500">No pending medicine requests.</p>
            )}
          </div>
        </div>

        {/* Inquiries */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Inbox className="w-6 h-6 text-gray-600" />
            Support Inquiries
          </h2>
          <div className="space-y-4">
            {inquiries.filter(i => i.status === 'open').map(inquiry => (
              <div key={inquiry._id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{inquiry.subject}</h4>
                    <p className="text-xs text-gray-500">From: {inquiry.name} ({inquiry.email})</p>
                  </div>
                  <Button onClick={() => resolveInquiry(inquiry._id)} variant="outline" className="text-xs h-auto py-1">Mark Resolved</Button>
                </div>
                <p className="text-gray-700 text-sm">{inquiry.message}</p>
              </div>
            ))}
            {inquiries.filter(i => i.status === 'open').length === 0 && (
              <p className="text-gray-500">No open inquiries.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';

interface DoctorProfile {
  _id?: string;
  licenseNumber: string;
  specialization: string;
  hospital: string;
  department: string;
  yearsOfExperience: number;
  qualifications: string[];
  consultationFee: number;
  availableHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<DoctorProfile>({
    licenseNumber: '',
    specialization: '',
    hospital: '',
    department: '',
    yearsOfExperience: 0,
    qualifications: [],
    consultationFee: 0,
    availableHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [medicineRequests, setMedicineRequests] = useState<any[]>([]);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', reason: '' });

  useEffect(() => {
    fetchProfile();
    fetchMedicineRequests();
  }, []);

  const fetchMedicineRequests = async () => {
    try {
      const response = await fetch('/api/medicine-requests');
      if (response.ok) {
        const data = await response.json();
        setMedicineRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Failed to fetch medicine requests', error);
    }
  };

  const submitMedicineRequest = async () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.reason) return;
    try {
      const response = await fetch('/api/medicine-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineName: newMedicine.name,
          dosage: newMedicine.dosage,
          reason: newMedicine.reason,
        }),
      });
      if (response.ok) {
        setShowMedicineModal(false);
        setNewMedicine({ name: '', dosage: '', reason: '' });
        fetchMedicineRequests();
        setMessage('Medicine request submitted successfully');
        setTimeout(() => setMessage(''), 3000);
      }
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
          licenseNumber: '',
          specialization: '',
          hospital: '',
          department: '',
          yearsOfExperience: 0,
          qualifications: [],
          consultationFee: 0,
          availableHours: {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: '',
          },
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
      const response = await fetch('/api/profile/doctor', {
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

  const addQualification = () => {
    if (newQualification.trim()) {
      setProfile({
        ...profile,
        qualifications: [...profile.qualifications, newQualification],
      });
      setNewQualification('');
    }
  };

  const removeQualification = (index: number) => {
    setProfile({
      ...profile,
      qualifications: profile.qualifications.filter((_, i) => i !== index),
    });
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
            <p className="text-gray-600">Doctor Dashboard</p>
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

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Professional Details</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Edit Details
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.licenseNumber}
                  onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-gray-800">{profile.licenseNumber || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.specialization}
                  onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-gray-800">{profile.specialization || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital/Clinic</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.hospital}
                  onChange={(e) => setProfile({ ...profile, hospital: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-gray-800">{profile.hospital || 'Not set'}</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profile.yearsOfExperience}
                  onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-gray-800">{profile.yearsOfExperience || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profile.consultationFee}
                  onChange={(e) => setProfile({ ...profile, consultationFee: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <p className="text-gray-800">${profile.consultationFee || 'Not set'}</p>
              )}
            </div>
          </div>

          {/* Qualifications */}
          <div className="mt-6 pt-6 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-3">Qualifications</label>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    placeholder="Add qualification"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Button onClick={addQualification} className="bg-green-600 hover:bg-green-700 text-white">
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {profile.qualifications.map((qual, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                      <span>{qual}</span>
                      <button
                        onClick={() => removeQualification(index)}
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {profile.qualifications.length > 0 ? (
                  profile.qualifications.map((qual, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded-lg">
                      {qual}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Not set</p>
                )}
              </div>
            )}
          </div>

          {/* Available Hours */}
          <div className="mt-6 pt-6 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-3">Available Hours</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profile.availableHours).map(([day, hours]) => (
                <div key={day}>
                  <label className="text-xs font-medium text-gray-600 capitalize">{day}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          availableHours: { ...profile.availableHours, [day]: e.target.value },
                        })
                      }
                      placeholder="e.g., 9AM-5PM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="text-gray-800 text-sm">{hours || 'Not set'}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-8">
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

        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Medicine Requests</h2>
            <Button onClick={() => setShowMedicineModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
              New Request
            </Button>
          </div>
          
          {showMedicineModal && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-bold text-lg mb-4">Submit New Medicine</h3>
              <div className="space-y-4 mb-4">
                <input type="text" placeholder="Medicine Name" value={newMedicine.name} onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="Dosage" value={newMedicine.dosage} onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                <textarea placeholder="Reason" value={newMedicine.reason} onChange={(e) => setNewMedicine({...newMedicine, reason: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea>
              </div>
              <div className="flex gap-2">
                <Button onClick={submitMedicineRequest} className="bg-blue-600 hover:bg-blue-700 text-white">Submit</Button>
                <Button onClick={() => setShowMedicineModal(false)} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {medicineRequests.map(req => (
              <div key={req._id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">{req.medicineName} - {req.dosage}</h4>
                  <p className="text-sm text-gray-600">Reason: {req.reason}</p>
                  {req.adminNotes && <p className="text-sm text-blue-600 mt-1">Admin Notes: {req.adminNotes}</p>}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  req.status === 'approved' ? 'bg-green-100 text-green-700' : 
                  req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {req.status}
                </div>
              </div>
            ))}
            {medicineRequests.length === 0 && <p className="text-gray-500">No medicine requests submitted yet.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

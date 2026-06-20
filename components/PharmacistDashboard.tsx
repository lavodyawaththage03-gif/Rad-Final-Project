'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import Navbar from './Navbar';

interface PharmacistProfile {
  _id?: string;
  licenseNumber: string;
  pharmacy: string;
  specialization: string;
  yearsOfExperience: number;
  qualifications: string;
  consultationFee: number;
  availableHours: string;
  certifications: string;
}

export default function PharmacistDashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<PharmacistProfile>({
    licenseNumber: '',
    pharmacy: '',
    specialization: '',
    yearsOfExperience: 0,
    qualifications: '',
    consultationFee: 0,
    availableHours: '',
    certifications: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [medicineRequests, setMedicineRequests] = useState<any[]>([]);

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
      console.error('Error fetching medicine requests', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/profile/pharmacist', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600">Pharmacist Dashboard</p>
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

          {/* Professional Information Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Professional Information</h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={profile.licenseNumber}
                      onChange={(e) => setProfile({...profile, licenseNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pharmacy Name
                    </label>
                    <input
                      type="text"
                      value={profile.pharmacy}
                      onChange={(e) => setProfile({...profile, pharmacy: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={profile.specialization}
                      onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profile.yearsOfExperience}
                      onChange={(e) => setProfile({...profile, yearsOfExperience: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fee
                    </label>
                    <input
                      type="number"
                      value={profile.consultationFee}
                      onChange={(e) => setProfile({...profile, consultationFee: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications
                  </label>
                  <textarea
                    value={profile.qualifications}
                    onChange={(e) => setProfile({...profile, qualifications: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Hours
                  </label>
                  <input
                    type="text"
                    value={profile.availableHours}
                    onChange={(e) => setProfile({...profile, availableHours: e.target.value})}
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications
                  </label>
                  <textarea
                    value={profile.certifications}
                    onChange={(e) => setProfile({...profile, certifications: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">License Number</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.licenseNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pharmacy</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.pharmacy || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Specialization</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.specialization || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Years of Experience</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.yearsOfExperience || '0'} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="text-lg font-semibold text-gray-900">${profile.consultationFee || '0'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Hours</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.availableHours || 'Not provided'}</p>
                </div>
                {profile.qualifications && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Qualifications</p>
                    <p className="text-gray-900">{profile.qualifications}</p>
                  </div>
                )}
                {profile.certifications && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Certifications</p>
                    <p className="text-gray-900">{profile.certifications}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Medicine Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Medicine Requests from Doctors</h2>
            <div className="space-y-4">
              {medicineRequests.map(req => (
                <div key={req._id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{req.medicineName} - {req.dosage}</h4>
                    <p className="text-sm text-gray-700 mt-1 font-medium">Doctor: Dr. {req.doctorId?.userId?.firstName} {req.doctorId?.userId?.lastName}</p>
                    <p className="text-sm text-gray-600 mt-1">Reason: {req.reason}</p>
                    {req.adminNotes && <p className="text-sm text-blue-600 mt-1 font-medium">Admin Notes: {req.adminNotes}</p>}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    req.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {req.status}
                  </div>
                </div>
              ))}
              {medicineRequests.length === 0 && (
                <p className="text-gray-500">No medicine requests found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

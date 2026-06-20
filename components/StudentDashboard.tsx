'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navbar from './Navbar';
import { Heart, Pill, Calendar, Users, Activity, AlertCircle, Clock, CheckCircle } from 'lucide-react';

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
  const [doctors, setDoctors] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [upcoming, setUpcoming] = useState<any>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [crowdLevel, setCrowdLevel] = useState<string>('Low');

  useEffect(() => {
    fetchProfile();
    fetchDoctors();
    fetchAppointments();
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/system-status');
      if (response.ok) {
        const data = await response.json();
        setCrowdLevel(data.status?.crowdLevel || 'Low');
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile || {
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

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setUpcoming(data.upcoming);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/profile/student', {
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Student Health Dashboard</h1>
              <p className="text-blue-100 mt-1">Wayamba University of Sri Lanka</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-xl">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {message && (
            <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <AlertCircle className="w-5 h-5" />
              {message}
            </div>
          )}

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link href="/health-tracking">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Health Tracking</h3>
                </div>
                <p className="text-sm text-gray-600">Monitor your health metrics</p>
              </div>
            </Link>

            <Link href="/medicine-management">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Medications</h3>
                </div>
                <p className="text-sm text-gray-600">Manage your prescriptions</p>
              </div>
            </Link>

            <Link href="/student-book-appointment">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Appointments</h3>
                </div>
                <p className="text-sm text-gray-600">Book doctor appointments</p>
              </div>
            </Link>

            <Link href="/doctors">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Our Doctors</h3>
                </div>
                <p className="text-sm text-gray-600">Find expert doctors</p>
              </div>
            </Link>
          </div>

          {/* Crowd Level Indicator */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
              Live Clinic Crowd Level
            </h2>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full font-bold text-white ${
                crowdLevel === 'Low' ? 'bg-green-500' :
                crowdLevel === 'Medium' ? 'bg-orange-500' : 'bg-red-500'
              }`}>
                {crowdLevel}
              </div>
              <p className="text-gray-600">
                {crowdLevel === 'Low' ? 'Short wait times. Walk-ins are welcome.' :
                 crowdLevel === 'Medium' ? 'Moderate wait times. Please book an appointment if possible.' :
                 'High wait times. We strongly recommend booking an appointment.'}
              </p>
            </div>
          </div>

          {/* Upcoming Appointments Preview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-600" />
                Upcoming Appointment
              </h2>
            </div>
            {upcoming ? (
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Dr. {upcoming.doctorId?.userId?.firstName} {upcoming.doctorId?.userId?.lastName}</h3>
                  <p className="text-purple-600 font-medium text-lg mt-1">Date: {upcoming.appointmentDate}</p>
                  <p className="text-purple-600 font-medium text-lg">Time: {upcoming.appointmentTime}</p>
                  <p className="text-sm text-gray-500 mt-2">Status: {upcoming.status}</p>
                </div>
                <Clock className="w-16 h-16 text-purple-300 hidden md:block" />
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <Clock className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-600 text-sm">No upcoming appointments scheduled.</p>
                <Link 
                  href="/student-book-appointment"
                  className="inline-block mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-semibold"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Appointment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-100" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-100" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-100" />
              </div>
            </div>
          </div>

          {/* Doctors Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-red-600" />
                Available Doctors
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doctor, idx) => {
                const getNextAvailableSlot = (hours: any) => {
                  if (!hours) return 'Check availability';
                  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                  const today = new Date().getDay();
                  for (let i = 0; i < 7; i++) {
                    const checkDay = days[(today + i) % 7];
                    if (hours[checkDay] && hours[checkDay].trim() !== '') {
                      return i === 0 ? `Today, ${hours[checkDay]}` : i === 1 ? `Tomorrow, ${hours[checkDay]}` : `This ${checkDay.charAt(0).toUpperCase() + checkDay.slice(1)}, ${hours[checkDay]}`;
                    }
                  }
                  return 'Currently Unavailable';
                };

                return (
                  <div key={doctor._id || idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">👨‍⚕️</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">Dr. {doctor.userId?.firstName} {doctor.userId?.lastName}</h3>
                        <p className="text-red-600 font-semibold text-sm">{doctor.specialization || 'General Physician'}</p>
                        <p className="text-gray-600 text-sm mt-1">{doctor.yearsOfExperience || '10+'} Years Experience</p>
                        <p className="text-gray-600 text-sm">{doctor.hospital || 'Base Hospital'}</p>
                        <p className="text-blue-600 font-medium text-sm mt-2">
                          ⏱ Next Available: {getNextAvailableSlot(doctor.availableHours)}
                        </p>
                        <div className="mt-3">
                          <Link href={`/student-book-appointment?doctorId=${doctor._id}`}>
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold">
                              Book Now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {doctors.length === 0 && (
                <p className="text-gray-500">No active doctors available at the moment.</p>
              )}
            </div>
          </div>

          {/* Health Information Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Your Health Information
              </h2>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Edit Details
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.studentId}
                    onChange={(e) => setProfile({ ...profile, studentId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.studentId || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree Program</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.degreeProgram}
                    onChange={(e) => setProfile({ ...profile, degreeProgram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.degreeProgram || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.faculty}
                    onChange={(e) => setProfile({ ...profile, faculty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.faculty || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.bloodGroup}
                    onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.bloodGroup || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 175 cm"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.height || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 65 kg"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.weight || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.allergies}
                    onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.allergies || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.emergencyContactPhone}
                    onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.emergencyContactPhone || 'Not set'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                {isEditing ? (
                  <textarea
                    value={profile.medicalHistory}
                    onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.medicalHistory || 'Not set'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.emergencyContact}
                    onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.emergencyContact || 'Not set'}</p>
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
        </main>
      </div>
    </>
  );
}

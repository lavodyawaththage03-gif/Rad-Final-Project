import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

export default function Register() {
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [role, setRole] = useState('student');
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Student-specific fields
  const [studentId, setStudentId] = useState('');
  const [address, setAddress] = useState('');
  const [faculty, setFaculty] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  // Doctor-specific fields
  const [doctorId, setDoctorId] = useState('');
  const [medicalRegistrationNumber, setMedicalRegistrationNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [availableDays, setAvailableDays] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [department, setDepartment] = useState('');

  // Pharmacist-specific fields
  const [pharmacistId, setPharmacistId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [workingShift, setWorkingShift] = useState('');

  // Admin-specific fields
  const [adminId, setAdminId] = useState('');
  const [adminRole, setAdminRole] = useState('Admin');

  const navigate = useNavigate();
  const { register, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setShowDetails(true);
  };

  const validateCommonFields = () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName || !gender || !dateOfBirth) {
      setError('Please fill in all required personal information fields');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const validateRoleFields = () => {
    if (role === 'student' && (!studentId || !address || !faculty || !degreeProgram || !academicYear || !emergencyContact || !bloodGroup)) {
      setError('Please fill in all student information fields');
      return false;
    }
    if (role === 'doctor' && (!doctorId || !medicalRegistrationNumber || !specialization || !qualification || !yearsOfExperience || !department)) {
      setError('Please fill in all doctor information fields');
      return false;
    }
    if (role === 'pharmacist' && (!pharmacistId || !licenseNumber || !qualification || !workingShift || !address || !department)) {
      setError('Please fill in all pharmacist information fields');
      return false;
    }
    if (role === 'admin' && (!adminId || !department || !address)) {
      setError('Please fill in all admin information fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!validateCommonFields()) {
        setIsLoading(false);
        return;
      }

      if (!validateRoleFields()) {
        setIsLoading(false);
        return;
      }

      const registrationData = {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phoneNumber,
        gender,
        dateOfBirth,
        role,
        ...(role === 'student' && { studentId, address, faculty, degreeProgram, academicYear, emergencyContact, emergencyContactPhone, bloodGroup, allergies, medicalHistory }),
        ...(role === 'doctor' && { doctorId, medicalRegistrationNumber, specialization, qualification, availableDays, availableTime, yearsOfExperience, department }),
        ...(role === 'pharmacist' && { pharmacistId, licenseNumber, qualification, workingShift, address, department }),
        ...(role === 'admin' && { adminId, department, address, adminRole }),
      };

      await register(email, password, confirmPassword, role, firstName, lastName, registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-50 via-indigo-100 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 flex items-center justify-center p-4 py-8 relative overflow-hidden">
        {/* Abstract decorative shapes */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

        <div className="w-full max-w-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto relative z-10 border border-white/20 dark:border-slate-700/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">MediTrack</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Create your account</p>
          </div>

          {!showDetails ? (
            <div className="space-y-4">
              <p className="text-center text-slate-600 dark:text-slate-300 font-semibold mb-6 text-lg">Select Your Role</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleChange('student')}
                  className="w-full p-6 border-2 border-blue-200 dark:border-blue-900/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 hover:shadow-md transition-all duration-300 text-slate-800 dark:text-white font-bold group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎓</div>
                  Student
                </button>
                <button
                  onClick={() => handleRoleChange('doctor')}
                  className="w-full p-6 border-2 border-teal-200 dark:border-teal-900/50 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-400 hover:shadow-md transition-all duration-300 text-slate-800 dark:text-white font-bold group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🩺</div>
                  Doctor
                </button>
                <button
                  onClick={() => handleRoleChange('pharmacist')}
                  className="w-full p-6 border-2 border-orange-200 dark:border-orange-900/50 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-400 hover:shadow-md transition-all duration-300 text-slate-800 dark:text-white font-bold group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💊</div>
                  Pharmacist
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className="w-full p-6 border-2 border-purple-200 dark:border-purple-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-400 hover:shadow-md transition-all duration-300 text-slate-800 dark:text-white font-bold group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🛡️</div>
                  Admin
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm sticky top-0 z-10">
                  {error}
                </div>
              )}

              {/* Common Fields Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Student-specific fields */}
              {role === 'student' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Student Information</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                      <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="STU001" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                      <input type="text" value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="Faculty of Engineering" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree Program</label>
                      <input type="text" value={degreeProgram} onChange={(e) => setDegreeProgram(e.target.value)} placeholder="B.Sc. Computer Science" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                      <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                        <option value="">Select Blood Group</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                      <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g., Pollen, Nuts" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                      <input type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Parent/Guardian Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                      <input type="tel" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                      <textarea value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} placeholder="Any previous medical conditions..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" rows={2} />
                    </div>
                  </div>
                </div>
              )}

              {/* Doctor-specific fields */}
              {role === 'doctor' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Doctor Information</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID</label>
                      <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder="DOC001" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical Registration Number</label>
                      <input type="text" value={medicalRegistrationNumber} onChange={(e) => setMedicalRegistrationNumber(e.target.value)} placeholder="SLMC/MDCB Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                      <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="General Physician" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                      <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="MBBS, MD" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                      <input type="number" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} placeholder="10" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="General Medicine" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
                      <input type="text" value={availableDays} onChange={(e) => setAvailableDays(e.target.value)} placeholder="Mon-Fri" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Available Time</label>
                      <input type="text" value={availableTime} onChange={(e) => setAvailableTime(e.target.value)} placeholder="9 AM - 5 PM" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Pharmacist-specific fields */}
              {role === 'pharmacist' && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Pharmacist Information</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacist ID</label>
                      <input type="text" value={pharmacistId} onChange={(e) => setPharmacistId(e.target.value)} placeholder="PHARM001" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                      <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="Pharmacy License" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                      <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="Diploma/BSc Pharmacy" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Working Shift</label>
                      <select value={workingShift} onChange={(e) => setWorkingShift(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm">
                        <option value="">Select Shift</option>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Pharmacy" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Admin-specific fields */}
              {role === 'admin' && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Admin Information</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
                      <input type="text" value={adminId} onChange={(e) => setAdminId(e.target.value)} placeholder="ADM001" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select value={adminRole} onChange={(e) => setAdminRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm">
                        <option value="Admin">Admin</option>
                        <option value="Super Admin">Super Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Administration" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Password fields */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Security</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 -mx-4 rounded-b-2xl border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setShowDetails(false)} className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-3 rounded-xl transition-colors">
                  Back
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  {isLoading ? 'Creating...' : 'Sign Up'}
                </button>
              </div>
            </form>
          )}

          {!showDetails && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Log In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Calendar, Plus, Clock, AlertCircle, CheckCircle, Users, ChevronRight, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

function BarChart3({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="4" height="18" />
      <rect x="9" y="7" width="4" height="14" />
      <rect x="15" y="5" width="4" height="16" />
    </svg>
  );
}

export default function AppointmentsPage() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking appointment:', formData);
    setShowBookingForm(false);
  };

  // Sample upcoming appointments (empty for now)
  const upcomingAppointments: any[] = [];

  // Sample stats
  const stats = [
    { label: 'Total Appointments', value: 0, icon: Calendar, color: 'blue' },
    { label: 'Completed', value: 0, icon: CheckCircle, color: 'green' },
    { label: 'Pending', value: 0, icon: Clock, color: 'orange' },
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Appointments</h1>
          <p className="text-purple-100 text-lg">Book and manage doctor appointments seamlessly</p>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Quick Action Button */}
          <div className="mb-8">
            <button 
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Book New Appointment
            </button>
          </div>

          {/* Booking Form Modal */}
          {showBookingForm && (
            <div className="mb-8 bg-white rounded-lg shadow-lg p-8 border-l-4 border-purple-600">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Book an Appointment</h2>
                <button 
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleBookAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                  <select 
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    <option value="Dr. K.M.S.V. Jayasinghe">Dr. K.M.S.V. Jayasinghe</option>
                    <option value="Dr. R.A.V.K. Rathnayake">Dr. R.A.V.K. Rathnayake</option>
                  </select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
                  <input 
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label>
                  <input 
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                  <input 
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="General checkup, specific concern, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea 
                    name="notes"
                    placeholder="Any additional information for the doctor..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Confirm Appointment
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Upcoming Appointments */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  Upcoming Appointments
                </h2>
                {upcomingAppointments.length > 0 && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {upcomingAppointments.length}
                  </span>
                )}
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt, idx) => (
                    <div key={idx} className="border-l-4 border-purple-600 bg-purple-50 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{apt.doctorName}</h4>
                          <p className="text-gray-600 text-sm">{apt.reason}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {apt.time}
                            </span>
                          </div>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 font-semibold">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium mb-2">No upcoming appointments</p>
                  <p className="text-gray-500 text-sm mb-6">Schedule your first appointment with a doctor</p>
                  <button 
                    onClick={() => setShowBookingForm(true)}
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Book Now
                  </button>
                </div>
              )}
            </div>

            {/* Appointment Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600 h-fit">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Appointment Stats
              </h3>
              <div className="space-y-4">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  const colorClass = stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                                    stat.color === 'green' ? 'bg-green-50 text-green-600' : 
                                    'bg-orange-50 text-orange-600';
                  return (
                    <div key={idx} className={`p-4 rounded-lg ${colorClass}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium opacity-75">{stat.label}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <Icon className="w-8 h-8 opacity-25" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Available Doctors Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-red-600" />
                Available Doctors to Book
              </h2>
              <Link to="/doctors" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctor 1 */}
              <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">👨‍⚕️</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">Dr. K.M.S.V. Jayasinghe</h3>
                    <p className="text-red-600 font-semibold text-sm mb-1">General Physician</p>
                    <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>5.0 (150 reviews)</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>Base Hospital Kuliyapitiya</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowBookingForm(true)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold transition"
                      >
                        Book Now
                      </button>
                      <Link to="/doctors/1" className="flex-1">
                        <button className="w-full border border-red-600 text-red-600 hover:bg-red-50 py-2 rounded text-sm font-semibold transition">
                          Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor 2 */}
              <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">👨‍⚕️</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">Dr. R.A.V.K. Rathnayake</h3>
                    <p className="text-red-600 font-semibold text-sm mb-1">General Physician</p>
                    <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>5.0 (150 reviews)</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>Base Hospital Kuliyapitiya</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowBookingForm(true)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold transition"
                      >
                        Book Now
                      </button>
                      <Link to="/doctors/2" className="flex-1">
                        <button className="w-full border border-red-600 text-red-600 hover:bg-red-50 py-2 rounded text-sm font-semibold transition">
                          Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Find Doctors */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900">Find Doctors</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Browse available doctors by specialization, experience, and ratings.
              </p>
              <Link to="/doctors" className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                Browse Doctors <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Easy Booking */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900">Easy Booking</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Book appointments in seconds with our simple scheduling system.
              </p>
              <button 
                onClick={() => setShowBookingForm(true)}
                className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1"
              >
                Book Now <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Reminders */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="font-bold text-gray-900">Smart Reminders</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Receive automatic reminders before your appointments so you never miss a visit.
              </p>
              <div className="text-orange-600 font-semibold text-sm">Enabled</div>
            </div>

            {/* Video Consultations */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📹</span>
                </div>
                <h4 className="font-bold text-gray-900">Video Consultations</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Conduct consultations via video call for convenience and safety.
              </p>
              <div className="text-purple-600 font-semibold text-sm">Available</div>
            </div>

            {/* Prescription Management */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📄</span>
                </div>
                <h4 className="font-bold text-gray-900">Get Prescriptions</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Receive digital prescriptions directly through the app.
              </p>
              <Link to="/medicine-management" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1">
                View Prescriptions <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Appointment History */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-pink-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📚</span>
                </div>
                <h4 className="font-bold text-gray-900">History & Notes</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Keep a complete record of all past appointments and doctor notes.
              </p>
              <div className="text-pink-600 font-semibold text-sm">Coming Soon</div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Appointment Tips</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Arrive 10 minutes early to your appointments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Bring any relevant medical records or documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Prepare a list of questions or concerns beforehand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Keep track of your appointment reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Reschedule if you cannot attend to avoid blocking time for others</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Link to="/dashboard" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

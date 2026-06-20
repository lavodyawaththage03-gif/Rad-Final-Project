import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';

function BookAppointmentContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctorId = searchParams.get('doctorId');

  const [doctor, setDoctor] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Group slots by date
  const [groupedSlots, setGroupedSlots] = useState<Record<string, any[]>>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(''); // For date filtering

  const [studentId, setStudentId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!doctorId) {
      setError('No doctor selected.');
      setIsLoading(false);
      return;
    }

    fetchData();
  }, [doctorId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch student profile to get the actual studentId
      try {
        const meRes = await axios.get('http://localhost:8080/api/auth/me', { headers: { Authorization: `Bearer ${token}` }});
        if (meRes.data?.profile?.studentId) {
          setStudentId(meRes.data.profile.studentId);
        }
      } catch (e) {
        console.error('Could not fetch student profile', e);
      }

      // Fetch all doctors to find the current one
      const docRes = await axios.get('http://localhost:8080/api/doctors');
      const doctorsArray = Array.isArray(docRes.data) ? docRes.data : (docRes.data.doctors || []);
      const found = doctorsArray.find((d: any) => d.id === doctorId || d._id === doctorId);
      if (found) setDoctor(found);

      // Fetch slots
      const slotRes = await axios.get(`http://localhost:8080/api/doctors/${doctorId}/slots`);
      const slotsArray = Array.isArray(slotRes.data) ? slotRes.data : (slotRes.data.slots || []);
      setSlots(slotsArray);

      // Group slots by date
      const grouped = slotsArray.reduce((acc: any, slot: any) => {
        const slotDate = slot.date ? slot.date.split('T')[0] : 'Unknown Date';
        if (!acc[slotDate]) {
          acc[slotDate] = [];
        }
        acc[slotDate].push(slot);
        return acc;
      }, {});
      setGroupedSlots(grouped);
      
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    setIsBooking(true);
    setError('');

    const slot = slots.find(s => (s.id || s._id) === selectedSlot);
    if (!slot) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/appointments', {
        doctorId,
        scheduleId: slot.id || slot._id,
        studentId: studentId || 'Unknown Student',
        reason: 'General Consultation'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Appointment booked successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to book appointment.');
      setIsBooking(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Book an Appointment</h1>
            {doctor && (
              <p className="mt-2 text-blue-100">
                Dr. {doctor.userId?.firstName} {doctor.userId?.lastName} - {doctor.specialization || 'General Physician'}
              </p>
            )}
          </div>

          <div className="p-8">
            {error && (
              <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-4 mb-6 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {success}
              </div>
            )}

            {!doctor && !error && (
              <p className="text-gray-500">Doctor not found.</p>
            )}

            {doctor && (
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Available Dates & Times
                  </h2>
                  <div className="flex-1"></div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {selectedDate && (
                      <button 
                        onClick={() => setSelectedDate('')}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                {Object.keys(groupedSlots).length === 0 ? (
                  <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">No available time slots for this doctor at the moment.</p>
                ) : (
                  <div className="space-y-6">
                    {(() => {
                      const filteredSlots = Object.entries(groupedSlots).filter(([date]) => selectedDate ? date === selectedDate : true);
                      
                      if (filteredSlots.length === 0) {
                        return <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">No available time slots on the selected date.</p>;
                      }

                      return filteredSlots.map(([date, dateSlots]: [string, any]) => (
                        <div key={date} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">{date}</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {dateSlots.map((slot: any) => (
                              <button
                                key={slot._id}
                                 onClick={() => setSelectedSlot(slot.id || slot._id)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2
                                  ${selectedSlot === (slot.id || slot._id) 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                                  }`}
                              >
                                <Clock className="w-4 h-4" />
                                {slot.startTime} - {slot.endTime}
                              </button>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                className="flex-1 py-2 px-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                onClick={() => navigate('/dashboard')}
                disabled={isBooking || !!success}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
                disabled={!selectedSlot || isBooking || !!success}
                onClick={handleBook}
              >
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function StudentBookAppointmentPage() {
  return (
    <BookAppointmentContent />
  );
}

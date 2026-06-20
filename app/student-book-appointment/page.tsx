'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
      // Fetch all doctors to find the current one
      const docRes = await fetch('/api/doctors');
      if (docRes.ok) {
        const docData = await docRes.json();
        const found = docData.doctors.find((d: any) => d._id === doctorId);
        if (found) setDoctor(found);
      }

      // Fetch slots
      const slotRes = await fetch(`/api/doctors/${doctorId}/slots`);
      if (slotRes.ok) {
        const slotData = await slotRes.json();
        setSlots(slotData.slots);

        // Group slots by date
        const grouped = slotData.slots.reduce((acc: any, slot: any) => {
          if (!acc[slot.appointmentDate]) {
            acc[slot.appointmentDate] = [];
          }
          acc[slot.appointmentDate].push(slot);
          return acc;
        }, {});
        setGroupedSlots(grouped);
      }
    } catch (err) {
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

    const slot = slots.find(s => s._id === selectedSlot);
    if (!slot) return;

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          scheduleId: slot._id,
          appointmentDate: slot.appointmentDate,
          appointmentTime: slot.appointmentTime,
        }),
      });

      if (response.ok) {
        setSuccess('Appointment booked successfully! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to book appointment.');
        setIsBooking(false);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during booking.');
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Available Dates & Times
                </h2>
                
                {Object.keys(groupedSlots).length === 0 ? (
                  <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">No available time slots for this doctor at the moment.</p>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedSlots).map(([date, dateSlots]: [string, any]) => (
                      <div key={date} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">{date}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {dateSlots.map((slot: any) => (
                            <button
                              key={slot._id}
                              onClick={() => setSelectedSlot(slot._id)}
                              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2
                                ${selectedSlot === slot._id 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                                }`}
                            >
                              <Clock className="w-4 h-4" />
                              {slot.appointmentTime}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700"
                onClick={() => router.push('/dashboard')}
                disabled={isBooking || !!success}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!selectedSlot || isBooking || !!success}
                onClick={handleBook}
              >
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading booking page...</div>
      </div>
    }>
      <BookAppointmentContent />
    </Suspense>
  );
}

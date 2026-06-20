import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Appointment } from '@/lib/models/Appointment';
import { DoctorSchedule } from '@/lib/models/DoctorSchedule';
import { DoctorProfile } from '@/lib/models/DoctorProfile';
import { User } from '@/lib/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const _user = User;
    const _doc = DoctorProfile;

    const appointments = await Appointment.find({ studentId: user.userId })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    const stats = {
      total: appointments.length,
      completed: appointments.filter(a => a.status === 'Completed').length,
      pending: appointments.filter(a => a.status === 'Pending').length,
    };

    const upcoming = appointments.find(a => a.status === 'Pending');

    return NextResponse.json({ stats, upcoming }, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { doctorId, scheduleId, appointmentDate, appointmentTime } = await request.json();

    if (!doctorId || !scheduleId || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slot = await DoctorSchedule.findById(scheduleId);
    if (!slot || !slot.isAvailable) {
      return NextResponse.json({ error: 'Slot is no longer available' }, { status: 400 });
    }

    slot.isAvailable = false;
    await slot.save();

    const appointment = new Appointment({
      studentId: user.userId,
      doctorId,
      scheduleId,
      appointmentDate,
      appointmentTime,
      status: 'Pending',
    });
    await appointment.save();

    return NextResponse.json({ message: 'Appointment booked successfully', appointment }, { status: 201 });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ error: 'Failed to book appointment' }, { status: 500 });
  }
}

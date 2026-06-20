import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { DoctorSchedule } from '@/lib/models/DoctorSchedule';

export async function GET(request: Request, context: any) {
  try {
    await connectDB();
    const params = await context.params;
    const doctorId = params.id;

    // Fetch available future slots
    const slots = await DoctorSchedule.find({
      doctorId,
      isAvailable: true,
    }).sort({ appointmentDate: 1, appointmentTime: 1 });

    return NextResponse.json({ slots }, { status: 200 });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}

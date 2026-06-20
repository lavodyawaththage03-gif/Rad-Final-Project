import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MedicineRequest } from '@/lib/models/MedicineRequest';
import { DoctorProfile } from '@/lib/models/DoctorProfile';
import { User } from '@/lib/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    
    let query = {};
    if (user.role === 'doctor') {
      const doctor = await DoctorProfile.findOne({ userId: user.userId });
      if (doctor) query = { doctorId: doctor._id };
    }
    // Pharmacist and admin can see all requests
    
    const requests = await MedicineRequest.find(query)
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'firstName lastName' } })
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'doctor') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await connectDB();
    const { medicineName, dosage, reason } = await req.json();
    const doctor = await DoctorProfile.findOne({ userId: user.userId });
    if (!doctor) return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
    
    const request = await MedicineRequest.create({
      doctorId: doctor._id,
      medicineName,
      dosage,
      reason,
    });
    
    return NextResponse.json({ request }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}

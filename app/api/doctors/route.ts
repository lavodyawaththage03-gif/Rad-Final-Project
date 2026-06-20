import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { DoctorProfile } from '@/lib/models/DoctorProfile';
import { User } from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();
    const _user = User; // Register User model for populate
    const doctors = await DoctorProfile.find({ status: 'Active' })
      .populate('userId', 'firstName lastName')
      .exec();

    return NextResponse.json({ doctors }, { status: 200 });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

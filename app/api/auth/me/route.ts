import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { StudentProfile } from '@/lib/models/StudentProfile';
import { DoctorProfile } from '@/lib/models/DoctorProfile';
import { AdminProfile } from '@/lib/models/AdminProfile';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userData = await User.findById(user.userId);
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get role-specific profile
    let profile = null;
    if (userData.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user.userId });
    } else if (userData.role === 'doctor') {
      profile = await DoctorProfile.findOne({ userId: user.userId });
    } else if (userData.role === 'admin') {
      profile = await AdminProfile.findOne({ userId: user.userId });
    }

    return NextResponse.json({
      user: {
        id: userData._id,
        email: userData.email,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      profile,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

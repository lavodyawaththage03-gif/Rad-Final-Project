import { connectDB } from '@/lib/mongodb';
import { StudentProfile } from '@/lib/models/StudentProfile';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user || user.role !== 'student') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: user.userId },
      data,
      { new: true }
    );

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Update student profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

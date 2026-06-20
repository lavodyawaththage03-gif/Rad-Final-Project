import { connectDB } from '@/lib/mongodb';
import { AdminProfile } from '@/lib/models/AdminProfile';
import { getCurrentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const profile = await AdminProfile.findOneAndUpdate(
      { userId: user.userId },
      data,
      { new: true }
    );

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Update admin profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

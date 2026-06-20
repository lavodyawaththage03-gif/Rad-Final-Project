import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { PharmacistProfile } from '@/lib/models/PharmacistProfile';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Authorization token missing' },
        { status: 401 }
      );
    }

    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    let profile = await PharmacistProfile.findOne({ userId });

    if (!profile) {
      profile = new PharmacistProfile({
        userId,
        ...body,
      });
    } else {
      Object.assign(profile, body);
    }

    await profile.save();

    return NextResponse.json(
      { message: 'Profile updated successfully', profile },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Error updating profile' },
      { status: 500 }
    );
  }
}

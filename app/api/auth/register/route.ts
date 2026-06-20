import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { StudentProfile } from '@/lib/models/StudentProfile';
import { DoctorProfile } from '@/lib/models/DoctorProfile';
import { PharmacistProfile } from '@/lib/models/PharmacistProfile';
import { AdminProfile } from '@/lib/models/AdminProfile';
import { createToken, setAuthCookie } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      email, 
      password, 
      confirmPassword, 
      role, 
      firstName, 
      lastName,
      phoneNumber,
      gender,
      dateOfBirth,
      studentId,
      address,
      faculty,
      degreeProgram,
      academicYear,
      emergencyContact,
      emergencyContactPhone,
      bloodGroup,
      allergies,
      medicalHistory,
      doctorId,
      pharmacistId,
      adminId
    } = body;

    // Validation
    if (!email || !password || !confirmPassword || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      firstName: firstName || '',
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
    });

    await user.save();

    // Create role-specific profile
    let profileId;
    if (role === 'student') {
      const studentProfile = new StudentProfile({
        userId: user._id,
        studentId: studentId || '',
        address: address || '',
        faculty: faculty || '',
        degreeProgram: degreeProgram || '',
        academicYear: academicYear || '',
        gender: gender || '',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        phoneNumber: phoneNumber || '',
        emergencyContact: emergencyContact || '',
        emergencyContactPhone: emergencyContactPhone || '',
        bloodGroup: bloodGroup || '',
        allergies: allergies || '',
        medicalHistory: medicalHistory || '',
      });
      await studentProfile.save();
      profileId = studentProfile._id;
    } else if (role === 'doctor') {
      const doctorProfile = new DoctorProfile({
        userId: user._id,
        doctorId: doctorId || '',
      });
      await doctorProfile.save();
      profileId = doctorProfile._id;
    } else if (role === 'pharmacist') {
      const pharmacistProfile = new PharmacistProfile({
        userId: user._id,
        pharmacistId: pharmacistId || '',
        address: address || '',
      });
      await pharmacistProfile.save();
      profileId = pharmacistProfile._id;
    } else if (role === 'admin') {
      const adminProfile = new AdminProfile({
        userId: user._id,
        adminId: adminId || '',
        address: address || '',
        adminLevel: 'admin',
      });
      await adminProfile.save();
      profileId = adminProfile._id;
    }

    user.profileId = profileId;
    await user.save();

    // Create token and set cookie
    const token = createToken(user._id.toString(), role);
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
      },
      { status: 201 }
    );

    // Set auth cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

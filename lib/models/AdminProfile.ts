import mongoose from 'mongoose';

const adminProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminId: String,
    phoneNumber: String,
    role: {
      type: String,
      enum: ['Super Admin', 'Admin'],
      default: 'Admin',
    },
    department: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    profilePicture: String,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    lastLogin: Date,
    address: String,
    adminLevel: {
      type: String,
      enum: ['super_admin', 'admin'],
      default: 'admin',
    },
    permissions: [String],
    totalUsers: Number,
    totalDoctors: Number,
    totalStudents: Number,
  },
  { timestamps: true }
);

export const AdminProfile = mongoose.models.AdminProfile || mongoose.model('AdminProfile', adminProfileSchema);

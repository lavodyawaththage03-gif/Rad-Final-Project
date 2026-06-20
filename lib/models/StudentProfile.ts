import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: String,
    degreeProgram: String,
    faculty: String,
    academicYear: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: Date,
    phoneNumber: String,
    address: String,
    emergencyContact: String,
    emergencyContactPhone: String,
    bloodGroup: String,
    allergies: String,
    medicalHistory: String,
    profilePicture: String,
    university: String,
    department: String,
    height: String,
    weight: String,
    medicalConditions: String,
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);

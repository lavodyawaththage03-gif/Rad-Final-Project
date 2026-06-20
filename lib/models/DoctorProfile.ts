import mongoose from 'mongoose';

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: String,
    medicalRegistrationNumber: String,
    specialization: String,
    qualification: String,
    phoneNumber: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: Date,
    availableDays: [String],
    availableTime: String,
    yearsOfExperience: Number,
    department: String,
    profilePicture: String,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    licenseNumber: String,
    hospital: String,
    consultationFee: Number,
    availableHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
    qualifications: [String],
  },
  { timestamps: true }
);

export const DoctorProfile = mongoose.models.DoctorProfile || mongoose.model('DoctorProfile', doctorProfileSchema);

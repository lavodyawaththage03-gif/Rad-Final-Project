import mongoose, { Schema } from 'mongoose';

const pharmacistProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pharmacistId: String,
    licenseNumber: String,
    qualification: String,
    phoneNumber: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: Date,
    department: String,
    workingShift: {
      type: String,
      enum: ['Morning', 'Evening', 'Night'],
    },
    profilePicture: String,
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    address: String,
    yearsOfExperience: Number,
    specialization: String,
    pharmacy: String,
    certifications: String,
    consultationFee: Number,
    availableHours: String,
    qualifications: String,
  },
  { timestamps: true }
);

export const PharmacistProfile =
  mongoose.models.PharmacistProfile ||
  mongoose.model('PharmacistProfile', pharmacistProfileSchema);

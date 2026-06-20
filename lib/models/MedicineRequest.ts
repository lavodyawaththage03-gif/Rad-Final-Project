import mongoose from 'mongoose';

const medicineRequestSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorProfile',
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: String,
  },
  { timestamps: true }
);

export const MedicineRequest = mongoose.models.MedicineRequest || mongoose.model('MedicineRequest', medicineRequestSchema);

import mongoose from 'mongoose';

const systemStatusSchema = new mongoose.Schema(
  {
    crowdLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminProfile',
    },
  },
  { timestamps: true }
);

export const SystemStatus = mongoose.models.SystemStatus || mongoose.model('SystemStatus', systemStatusSchema);

import mongoose from 'mongoose';

const healthContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['wellness', 'local_news', 'international_news', 'university_news'],
      required: true,
    },
    content: { type: String, required: true },
    imageUrl: String,
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminProfile',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const HealthContent = mongoose.models.HealthContent || mongoose.model('HealthContent', healthContentSchema);

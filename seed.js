const mongoose = require('mongoose');

// Mongoose Models Setup
const doctorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: String,
    hospital: String,
    yearsOfExperience: Number,
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const doctorScheduleSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'DoctorProfile', required: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: String,
});

const DoctorProfile = mongoose.models.DoctorProfile || mongoose.model('DoctorProfile', doctorProfileSchema);
const DoctorSchedule = mongoose.models.DoctorSchedule || mongoose.model('DoctorSchedule', doctorScheduleSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

const MONGODB_URI = 'mongodb+srv://Lavodya:12345@clustermedi.lnx6czb.mongodb.net/?appName=ClusterMedi';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    // Find any existing doctor
    let doctor = await DoctorProfile.findOne({ status: 'Active' });

    if (!doctor) {
      console.log('No active doctor found. Creating a dummy doctor...');
      // Create user
      const user = new User({
        email: 'dr.john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'doctor'
      });
      await user.save();

      // Create profile
      doctor = new DoctorProfile({
        userId: user._id,
        specialization: 'Cardiologist',
        hospital: 'City Central Hospital',
        yearsOfExperience: 15,
        status: 'Active'
      });
      await doctor.save();
    }

    console.log('Generating slots for doctor:', doctor._id);

    // Generate slots for tomorrow and day after
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const dates = [
      tomorrow.toISOString().split('T')[0],
      dayAfter.toISOString().split('T')[0]
    ];

    const times = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'];

    for (const date of dates) {
      for (const time of times) {
        // Check if slot exists
        const exists = await DoctorSchedule.findOne({ doctorId: doctor._id, appointmentDate: date, appointmentTime: time });
        if (!exists) {
          await new DoctorSchedule({
            doctorId: doctor._id,
            appointmentDate: date,
            appointmentTime: time,
            isAvailable: true
          }).save();
        }
      }
    }

    console.log('Successfully seeded doctor schedules!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
}

seed();

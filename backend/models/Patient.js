const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Stable', 'Critical', 'Recovered', 'Admitted'],
    default: 'Admitted'
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);

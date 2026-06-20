'use client';

import Navbar from '@/components/Navbar';
import { Pill, Plus, Calendar, AlertCircle, CheckCircle, Clock, Bell, Trash2, Edit2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function MedicineManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [medications, setMedications] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    prescribedBy: '',
    startDate: '',
    endDate: '',
    reason: '',
    sideEffects: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.medicationName && formData.dosage && formData.frequency) {
      setMedications([...medications, { id: Date.now(), ...formData }]);
      setFormData({
        medicationName: '',
        dosage: '',
        frequency: '',
        prescribedBy: '',
        startDate: '',
        endDate: '',
        reason: '',
        sideEffects: '',
        notes: '',
      });
      setShowAddForm(false);
    }
  };

  const handleAddReminder = () => {
    if (medications.length > 0) {
      setReminders([...reminders, { id: Date.now(), medicationId: medications[0].id, time: '09:00', enabled: true }]);
    }
  };

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Pill className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Medicine Management</h1>
          <p className="text-green-100 text-lg">Track prescriptions, dosages, and set reminders</p>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Quick Action Button */}
          <div className="mb-8">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Medication
            </button>
          </div>

          {/* Add Medication Form */}
          {showAddForm && (
            <div className="mb-8 bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-600">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Medication</h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddMedication} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medication Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name *</label>
                  <input 
                    type="text"
                    name="medicationName"
                    value={formData.medicationName}
                    onChange={handleInputChange}
                    placeholder="e.g., Aspirin"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
                  <input 
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="e.g., 500mg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                  <select 
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  >
                    <option value="">Select frequency...</option>
                    <option value="Once a day">Once a day</option>
                    <option value="Twice a day">Twice a day</option>
                    <option value="Three times a day">Three times a day</option>
                    <option value="Every 4 hours">Every 4 hours</option>
                    <option value="Every 6 hours">Every 6 hours</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>

                {/* Prescribed By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed By</label>
                  <input 
                    type="text"
                    name="prescribedBy"
                    value={formData.prescribedBy}
                    onChange={handleInputChange}
                    placeholder="Doctor's name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                {/* Reason */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Medication</label>
                  <input 
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g., Pain relief, infection treatment"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                {/* Side Effects */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Known Side Effects</label>
                  <textarea 
                    name="sideEffects"
                    value={formData.sideEffects}
                    onChange={handleInputChange}
                    placeholder="e.g., Headache, nausea"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    rows={2}
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g., Take with food, avoid alcohol"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    rows={2}
                  />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Add Medication
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Current Medications */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Pill className="w-6 h-6 text-green-600" />
                  Current Medications
                </h2>
                {medications.length > 0 && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {medications.length}
                  </span>
                )}
              </div>

              {medications.length > 0 ? (
                <div className="space-y-4">
                  {medications.map((med) => (
                    <div key={med.id} className="border-l-4 border-green-600 bg-green-50 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{med.medicationName}</h4>
                          <p className="text-green-600 font-semibold text-sm">{med.dosage}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteMedication(med.id)} className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                        <div>
                          <span className="font-semibold">Frequency:</span> {med.frequency}
                        </div>
                        {med.reason && (
                          <div>
                            <span className="font-semibold">Reason:</span> {med.reason}
                          </div>
                        )}
                        {med.prescribedBy && (
                          <div className="col-span-2">
                            <span className="font-semibold">Prescribed By:</span> {med.prescribedBy}
                          </div>
                        )}
                        {med.sideEffects && (
                          <div className="col-span-2 text-orange-600 font-medium">
                            <span className="font-semibold">Side Effects:</span> {med.sideEffects}
                          </div>
                        )}
                        {med.notes && (
                          <div className="col-span-2">
                            <span className="font-semibold">Notes:</span> {med.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Pill className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium mb-2">No medications added</p>
                  <p className="text-gray-500 text-sm mb-6">Start tracking your medications by clicking &quot;Add New Medication&quot; button above.</p>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Add Now
                  </button>
                </div>
              )}
            </div>

            {/* Medication Reminders */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-600" />
                  Reminders
                </h3>
                {reminders.length > 0 && (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    {reminders.length}
                  </span>
                )}
              </div>

              {reminders.length > 0 ? (
                <div className="space-y-3">
                  {reminders.map((reminder) => {
                    const med = medications.find(m => m.id === reminder.medicationId);
                    return (
                      <div key={reminder.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{med?.medicationName}</p>
                            <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{reminder.time}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Bell className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-600 font-medium">No active reminders</p>
                  <p className="text-xs text-gray-500 mt-1">Add medications to set reminders</p>
                  {medications.length > 0 && (
                    <button 
                      onClick={handleAddReminder}
                      className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold transition"
                    >
                      Add Reminder
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Medication Statistics */}
          {medications.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Medications</p>
                    <p className="text-3xl font-bold text-gray-900">{medications.length}</p>
                  </div>
                  <Pill className="w-12 h-12 text-blue-100" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Reminders</p>
                    <p className="text-3xl font-bold text-gray-900">{reminders.length}</p>
                  </div>
                  <Bell className="w-12 h-12 text-green-100" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Today&apos;s Doses</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <Clock className="w-12 h-12 text-orange-100" />
                </div>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Track Dosage */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">💊</span>
                </div>
                <h4 className="font-bold text-gray-900">Track Dosage</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Keep detailed records of medication dosage and frequency to ensure proper adherence to prescribed treatment plans.
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
              >
                Add Medication <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Health Tracking */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">❤️</span>
                </div>
                <h4 className="font-bold text-gray-900">Health Tracking</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Monitor your overall health and see how medications are affecting your vital signs and wellness.
              </p>
              <Link href="/health-tracking" className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1">
                Go to Health Tracking <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Doctor Consultation */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">👨‍⚕️</span>
                </div>
                <h4 className="font-bold text-gray-900">Doctor Consultation</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Book an appointment with a doctor to discuss your medications and adjust treatment as needed.
              </p>
              <Link href="/appointments" className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1">
                Book Appointment <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Prescription History */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📋</span>
                </div>
                <h4 className="font-bold text-gray-900">Prescription History</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Maintain a complete history of all prescriptions for easy reference and to share with healthcare providers.
              </p>
              <button 
                onClick={() => window.print()}
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1"
              >
                Export Records <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Side Effects Monitoring */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="font-bold text-gray-900">Side Effects Monitor</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Log any side effects experienced and receive alerts if they may require medical attention or dose adjustment.
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1"
              >
                Record Side Effect <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Drug Interactions */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-600 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">⚠️</span>
                </div>
                <h4 className="font-bold text-gray-900">Drug Interactions</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Get alerts about potential drug interactions when adding new medications to your list.
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
              >
                Check Interactions <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Medication Safety Tips</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Always take medications as prescribed by your doctor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Store medications in cool, dry places away from children and pets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Never skip doses without consulting your healthcare provider</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Keep all medications in their original containers with labels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Report any side effects or adverse reactions immediately to your doctor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Properly dispose of expired or unused medications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/appointments" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Doctor Appointments</h4>
                  <p className="text-sm text-gray-600">Schedule or manage appointments</p>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-600" />
              </div>
            </Link>

            <Link href="/health-tracking" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Health Tracking</h4>
                  <p className="text-sm text-gray-600">Monitor vital signs and health</p>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </div>
            </Link>

            <Link href="/doctors" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Find Doctors</h4>
                  <p className="text-sm text-gray-600">Browse and connect with doctors</p>
                </div>
                <ChevronRight className="w-5 h-5 text-red-600" />
              </div>
            </Link>
          </div>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Link href="/dashboard" className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

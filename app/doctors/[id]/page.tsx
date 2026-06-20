'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Heart, Award, MapPin, Star, Calendar, Phone, Mail } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function DoctorProfile() {
  const params = useParams();
  const doctorId = params.id;

  const doctorsData: { [key: string]: any } = {
    '1': {
      id: 1,
      name: 'Dr. K.M.S.V. Jayasinghe',
      specialization: 'General Physician',
      experience: '10+ Years',
      hospital: 'Base Hospital Kuliyapitiya',
      reviews: 150,
      rating: 5,
      icon: '👨‍⚕️',
      bio: 'Dr. K.M.S.V. Jayasinghe is a highly experienced General Physician with over 10 years of clinical practice. He specializes in preventive healthcare, chronic disease management, and comprehensive medical consultations.',
      qualifications: ['MBBS', 'MD (Internal Medicine)', 'Post Graduate Diploma in Healthcare Management'],
      specialties: ['General Medicine', 'Chronic Disease Management', 'Preventive Care', 'Health Counseling'],
      availability: ['Monday to Friday: 9:00 AM - 5:00 PM', 'Saturday: 10:00 AM - 2:00 PM', 'Sunday: Closed'],
      contactPhone: '+94 71 234 5678',
      contactEmail: 'dr.jayasinghe@basehosp.lk',
      languages: ['Sinhala', 'English', 'Tamil'],
    },
    '2': {
      id: 2,
      name: 'Dr. R.A.V.K. Rathnayake',
      specialization: 'General Physician',
      experience: '10+ Years',
      hospital: 'Base Hospital Kuliyapitiya',
      reviews: 150,
      rating: 5,
      icon: '👨‍⚕️',
      bio: 'Dr. R.A.V.K. Rathnayake is a dedicated General Physician with extensive experience in patient care and medical consultation. He is known for his compassionate approach and commitment to patient wellness.',
      qualifications: ['MBBS', 'MD (General Medicine)', 'Certificate in Emergency Medicine'],
      specialties: ['General Medicine', 'Emergency Care', 'Patient Education', 'Wellness Programs'],
      availability: ['Monday to Thursday: 9:00 AM - 6:00 PM', 'Friday: 9:00 AM - 4:00 PM', 'Saturday: 11:00 AM - 3:00 PM', 'Sunday: Closed'],
      contactPhone: '+94 71 345 6789',
      contactEmail: 'dr.rathnayake@basehosp.lk',
      languages: ['Sinhala', 'English'],
    }
  };

  const doctor = doctorsData[doctorId as string] || doctorsData['1'];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/doctors" className="text-red-100 hover:text-white mb-4 inline-flex items-center gap-1">
            ← Back to Doctors
          </Link>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-red-500 to-rose-500 h-32 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-red-500">
                  <span className="text-7xl">{doctor.icon}</span>
                </div>
              </div>
              
              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                <p className="text-red-600 font-semibold text-lg mb-6">{doctor.specialization}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Experience</span>
                    </div>
                    <p className="font-bold text-gray-900">{doctor.experience}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Hospital</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{doctor.hospital}</p>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-gray-600">Rating</span>
                    </div>
                    <p className="font-bold text-gray-900">{doctor.rating}.0 ({doctor.reviews} reviews)</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600">Status</span>
                    </div>
                    <p className="font-bold text-gray-900 text-green-600">Available</p>
                  </div>
                </div>

                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mb-6 transition">
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Book Appointment
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{doctor.bio}</p>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Qualifications</h2>
              <ul className="space-y-2">
                {doctor.qualifications.map((qual: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    {qual}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Specialties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {doctor.specialties.map((specialty: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Availability</h2>
              <div className="space-y-3">
                {doctor.availability.map((time: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((lang: string, idx: number) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 mb-8 border-l-4 border-blue-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900 font-semibold">{doctor.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900 font-semibold">{doctor.contactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg mb-4 transition inline-block">
                <Calendar className="w-5 h-5 inline mr-2" />
                Book Now
              </button>
              <Link href="/doctors" className="inline-block ml-4 border border-red-600 text-red-600 hover:bg-red-50 font-bold py-3 px-8 rounded-lg transition">
                Back to Doctors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

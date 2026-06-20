'use client';

import Navbar from '@/components/Navbar';
import { Heart, Search, Star, MapPin, Award } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');

  const doctors = [
    {
      id: 1,
      name: 'Dr. K.M.S.V. Jayasinghe',
      specialization: 'General Physician',
      experience: '10+ Years',
      hospital: 'Base Hospital Kuliyapitiya',
      reviews: 150,
      rating: 5,
      fee: 'Rs. 1,500',
      icon: '👨‍⚕️'
    },
    {
      id: 2,
      name: 'Dr. R.A.V.K. Rathnayake',
      specialization: 'General Physician',
      experience: '10+ Years',
      hospital: 'Base Hospital Kuliyapitiya',
      reviews: 150,
      rating: 5,
      fee: 'Rs. 1,500',
      icon: '👨‍⚕️'
    }
  ];

  const specializations = [
    'All Specializations',
    'General Physician',
    'Pediatrician',
    'Cardiologist',
    'Dermatologist',
    'Psychiatrist'
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'All Specializations' ||
                                 doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Expert Doctors</h1>
          <p className="text-red-100 text-lg">Access qualified healthcare professionals</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none"
                />
              </div>
              <select 
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg outline-none md:w-64"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-600">
              Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Available Doctors Grid */}
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="bg-gradient-to-r from-red-500 to-rose-500 h-32 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <span className="text-5xl">{doctor.icon}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-red-600 font-semibold text-sm mb-3">{doctor.specialization}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>{doctor.experience} Experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(doctor.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({doctor.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/appointments" className="flex-1">
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition text-sm">
                          Book Now
                        </button>
                      </Link>
                      <Link href={`/doctors/${doctor.id}`} className="flex-1">
                        <button className="w-full border border-red-600 text-red-600 hover:bg-red-50 py-2 rounded font-semibold transition text-sm">
                          Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center mb-12">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Found</h3>
              <p className="text-gray-600">
                No doctors match your search criteria. Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Our Team Link */}
          <div className="bg-blue-50 rounded-lg shadow-md p-8 text-center border-l-4 border-blue-600 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">MediTrack Leadership Team</h2>
            <p className="text-gray-700 mb-6">
              Our platform is led by experienced healthcare professionals and technology experts. Meet the team that ensures your health is in good hands.
            </p>
            <Link
              href="/team"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              View Our Team
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Verified Professionals */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900">Verified Professionals</h4>
              </div>
              <p className="text-gray-600 text-sm">
                All doctors are verified with valid medical credentials and licenses from recognized institutions.
              </p>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🩺</span>
                </div>
                <h4 className="font-bold text-gray-900">Various Specializations</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Find doctors across multiple specializations including General Physicians, Specialists, and Surgeons.
              </p>
            </div>

            {/* Ratings & Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-bold text-gray-900">Ratings & Reviews</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Read honest patient reviews and ratings to make informed decisions about your healthcare provider.
              </p>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📅</span>
                </div>
                <h4 className="font-bold text-gray-900">Check Availability</h4>
              </div>
              <p className="text-gray-600 text-sm">
                View real-time availability and book appointments at convenient times that fit your schedule.
              </p>
            </div>

            {/* Consultation Fees */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
                <h4 className="font-bold text-gray-900">Transparent Fees</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Know consultation fees upfront with no hidden charges. Compare and choose based on your budget.
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-pink-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🏆</span>
                </div>
                <h4 className="font-bold text-gray-900">Experience Details</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Learn about doctors' years of experience, qualifications, and specialization details before booking.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/dashboard" className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

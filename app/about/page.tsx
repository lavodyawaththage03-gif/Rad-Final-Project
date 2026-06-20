'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Users, Heart, Target, Award } from 'lucide-react';

export default function About() {
  const team = [
    {
      name: 'Dr. D.H.C.P. Karunasekara',
      position: 'Chief Medical Officer',
      specialty: 'Healthcare Technology',
      avatar: '👨‍⚕️',
      bio: 'Leading our medical strategy and ensuring quality healthcare standards for all students.',
    },
    {
      name: 'Mr. A.N.C.B Athavuda',
      position: 'Chief Technology Officer',
      specialty: 'Software Development',
      avatar: '👨‍💼',
      bio: 'Overseeing the technical infrastructure and development of the MediTrack platform.',
    },
    {
      name: 'Mrs. J.A.V. Jayaweera',
      position: 'Head of Clinical Affairs',
      specialty: 'Medical Practice',
      avatar: '👩‍⚕️',
      bio: 'Managing clinical operations and ensuring best practices in patient care.',
    },
    {
      name: 'Mr. M.U.N. Munaweera',
      position: 'Operations Manager',
      specialty: 'System Administration',
      avatar: '👨‍💼',
      bio: 'Coordinating daily operations and system administration across all departments.',
    },
  ];

  const stats = [
    { number: '1000+', label: 'Students Served' },
    { number: '50+', label: 'Healthcare Professionals' },
    { number: '5000+', label: 'Appointments Handled' },
    { number: '10000+', label: 'Prescriptions Issued' },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About MediTrack</h1>
          <p className="text-blue-100 text-lg">
            Transforming student healthcare at Wayamba University of Sri Lanka
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2 justify-center">
              <Heart className="w-8 h-8 text-blue-600" />
              Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              MediTrack is a comprehensive health management platform designed specifically for Wayamba University of Sri Lanka students. We believe that accessible, quality healthcare is essential for academic success and overall well-being.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Our platform streamlines the entire healthcare experience by providing students with easy access to health tracking tools, medication management, appointment scheduling, and a network of expert medical professionals.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We&apos;re committed to empowering students to take control of their health while providing healthcare professionals with the tools they need to deliver exceptional care.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-3xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose MediTrack Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
            <Target className="w-8 h-8 text-blue-600" />
            Why Choose MediTrack?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Comprehensive Platform</h3>
              <p className="text-gray-600">
                All your health management needs in one place - from tracking vital signs to managing medications and scheduling appointments.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Medical Team</h3>
              <p className="text-gray-600">
                Access qualified healthcare professionals who understand the unique healthcare needs of university students.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive interface designed with students in mind, making healthcare management simple and convenient.
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-600">
              <h3 className="text-lg font-bold text-gray-900 mb-2">University Integration</h3>
              <p className="text-gray-600">
                Seamlessly integrated with Wayamba University systems for better coordination and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center flex items-center justify-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Our Leadership Team
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Meet the experienced professionals leading MediTrack
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border-t-4 border-blue-600">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-center">
                  <div className="text-6xl">{member.avatar}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-2">{member.position}</p>
                  <p className="text-gray-500 text-xs font-medium mb-4 uppercase">{member.specialty}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Partnership */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />
              Wayamba University Partnership
            </h2>
            <p className="text-gray-700 leading-relaxed">
              MediTrack is proudly developed and maintained in partnership with Wayamba University of Sri Lanka. Our commitment is to provide the highest quality healthcare management system tailored to meet the unique needs of university students. Through continuous innovation and collaboration with our leadership team, we strive to set new standards in student healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Join MediTrack?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Take control of your health and wellness with our comprehensive platform designed for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded font-semibold transition"
            >
              Create Account
            </Link>
            <Link
              href="/"
              className="border border-white text-white hover:bg-blue-700 px-8 py-3 rounded font-semibold transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

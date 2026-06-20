'use client';

import Navbar from '@/components/Navbar';
import { Users, Mail, Phone } from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. D.H.C.P. Karunasekara',
      title: 'Chief Medical Officer',
      department: 'Healthcare Technology',
      role: 'doctor',
      bio: 'Leading the healthcare technology initiatives and medical strategy for the MediTrack platform.',
      experience: '20+ years in healthcare management',
      expertise: ['Healthcare Management', 'Medical Technology', 'Clinical Operations']
    },
    {
      id: 2,
      name: 'Mr. A.N.C.B Athavuda',
      title: 'Chief Technology Officer',
      department: 'Software Development',
      role: 'manager',
      bio: 'Overseeing all technical development and infrastructure of the MediTrack platform.',
      experience: '15+ years in software development',
      expertise: ['Software Architecture', 'Cloud Infrastructure', 'Full-stack Development']
    },
    {
      id: 3,
      name: 'Mrs. J.A.V. Jayaweera',
      title: 'Head of Clinical Affairs',
      department: 'Medical Practice',
      role: 'doctor',
      bio: 'Managing clinical operations and ensuring best practices in medical service delivery.',
      experience: '18+ years in clinical practice',
      expertise: ['Clinical Operations', 'Patient Care', 'Medical Standards']
    },
    {
      id: 4,
      name: 'Mr. M.U.N. Munaweera',
      title: 'Operations Manager',
      department: 'System Administration',
      role: 'manager',
      bio: 'Ensuring smooth operations and efficient system administration of all MediTrack services.',
      experience: '12+ years in operations management',
      expertise: ['Operations Management', 'System Administration', 'Process Optimization']
    }
  ];

  const getRoleIcon = (role: string) => {
    return role === 'doctor' ? '👨‍⚕️' : '👨‍💼';
  };

  return (
    <>
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Our Team</h1>
          <p className="text-blue-100 text-lg">
            Meet the talented professionals leading MediTrack
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden border-t-4 border-blue-600"
              >
                {/* Member Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                  <div className="text-5xl mb-4">
                    {getRoleIcon(member.role)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-1">
                    {member.title}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.department}
                  </p>
                </div>

                {/* Member Details */}
                <div className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Experience */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Experience
                    </p>
                    <p className="text-gray-600 text-sm">
                      {member.experience}
                    </p>
                  </div>

                  {/* Expertise */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Areas of Expertise
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="border-t border-gray-200 pt-4 flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition text-sm">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-medium transition text-sm">
                      <Phone className="w-4 h-4" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Info Section */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About Our Team
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The MediTrack team consists of experienced healthcare professionals and technology experts dedicated to improving student health management at Wayamba University of Sri Lanka.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Together, they bring a unique combination of medical expertise, technology innovation, and operational excellence to ensure that every student has access to quality healthcare services and information.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2">Need to Contact Our Team?</h2>
          <p className="text-blue-100 mb-6">
            Reach out for inquiries or support
          </p>
          <a
            href="mailto:support@meditrack.edu"
            className="inline-block bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition"
          >
            Send Us an Email
          </a>
        </div>
      </section>
    </>
  );
}

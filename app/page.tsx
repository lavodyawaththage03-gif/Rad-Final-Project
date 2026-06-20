'use client';

import { useAuth } from '@/app/context/AuthContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Heart, Activity, Pill, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 text-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-6">
            {/* Wayamba University Logo */}
            <div className="mb-4 flex items-center justify-center gap-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-trsYWMKsRJQMAEqfziIqlYiWTg0CEI.png"
                alt="Wayamba University of Sri Lanka"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-4">
              Wayamba University of Sri Lanka
            </p>
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">⚕</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">MediTrack</h1>
          <p className="text-xl text-gray-600 mb-8">
            University Student Health Management System
          </p>
          <div className="flex gap-4 justify-center">
            {!loading && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded font-semibold transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Health Tracking */}
            <Link href="/health-tracking">
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg hover:bg-blue-50 transition cursor-pointer h-full">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Health Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor your health and wellness
                </p>
              </div>
            </Link>

            {/* Medicine Management */}
            <Link href="/medicine-management">
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg hover:bg-green-50 transition cursor-pointer h-full">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Pill className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Medicine Management
                </h3>
                <p className="text-gray-600">
                  Track prescriptions and medications
                </p>
              </div>
            </Link>

            {/* Appointments */}
            <Link href="/appointments">
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg hover:bg-purple-50 transition cursor-pointer h-full">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Appointments
                </h3>
                <p className="text-gray-600">
                  Book and manage doctor appointments
                </p>
              </div>
            </Link>

            {/* Expert Doctors */}
            <Link href="/doctors">
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg hover:bg-red-50 transition cursor-pointer h-full">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Expert Doctors
                </h3>
                <p className="text-gray-600">
                  Access qualified healthcare professionals
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Available Doctors Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Doctors</h2>
          <p className="text-gray-600 mb-8">
            Browse our network of qualified healthcare professionals
          </p>
          <Link
            href="/doctors"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold transition"
          >
            View All Doctors
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About MediTrack</h2>
              <p className="text-gray-600 text-lg">
                Learn more about our platform and the team behind it
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border-l-4 border-blue-600 text-center">
              <p className="text-gray-700 mb-6 leading-relaxed">
                MediTrack is a comprehensive health management system designed specifically for Wayamba University of Sri Lanka students. Our platform streamlines healthcare management by providing easy access to health tracking, medication management, appointment scheduling, and expert medical professionals.
              </p>
              <Link
                href="/about"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold transition"
              >
                Explore Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8">
            Join thousands of students managing their health with MediTrack
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
          >
            Create Your Account Today
          </Link>
        </div>
      </section>
    </>
  );
}

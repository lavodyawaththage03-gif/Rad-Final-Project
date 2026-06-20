'use client';

import Navbar from '@/components/Navbar';
import { Activity, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function HealthTracking() {
  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Activity className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Health Tracking</h1>
          <p className="text-blue-100 text-lg">Monitor your health and wellness</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vital Signs Tracking */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Vital Signs</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Track your blood pressure, heart rate, temperature, and other vital signs regularly.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Track Now →
              </button>
            </div>

            {/* Weight Management */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Weight Management</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Monitor your weight changes and receive personalized recommendations for healthy living.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Track Now →
              </button>
            </div>

            {/* Fitness Goals */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Fitness Goals</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Set and track your fitness objectives. Monitor exercise routines and physical activities.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Track Now →
              </button>
            </div>

            {/* Sleep Tracking */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">😴</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sleep Tracking</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Monitor your sleep patterns and quality. Get insights to improve your sleep health.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Track Now →
              </button>
            </div>

            {/* Nutrition Tracking */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🥗</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Nutrition Tracking</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Log your meals and track calories, nutrients, and dietary intake for better health.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Track Now →
              </button>
            </div>

            {/* Mental Health */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-pink-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Mental Health</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Monitor mood, stress levels, and emotional well-being with daily check-ins.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Track Now →
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Regular Monitoring is Important</h3>
                <p className="text-gray-700">
                  Consistent health tracking helps you understand your patterns and identify potential health issues early. 
                  Share your health data with healthcare professionals during consultations for better diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

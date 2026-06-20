import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Heart, Activity, Pill, Calendar } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 py-24 text-center">
        {/* Abstract decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-12 -right-12 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-6">
            {/* Wayamba University Logo */}
            <div className="mb-4 flex items-center justify-center gap-4">
              <img
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
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 mb-6 drop-shadow-sm">MediTrack</h1>
          <p className="text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            University Student Health Management System
          </p>
          <div className="flex gap-4 justify-center">
            {!loading && isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white dark:bg-slate-800 border-2 border-blue-100 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 px-8 py-4 rounded-full font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </section>



      {/* About Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-4">About MediTrack</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Learn more about our platform and the team behind it
              </p>
            </div>
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl p-12 border border-blue-100 dark:border-slate-700 shadow-xl overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <p className="text-slate-700 dark:text-slate-300 mb-8 text-lg leading-relaxed font-medium">
                MediTrack is a comprehensive health management system designed specifically for Wayamba University of Sri Lanka students. Our platform streamlines healthcare management by providing easy access to health tracking, medication management, appointment scheduling, and expert medical professionals.
              </p>
              <Link
                to="/about"
                className="inline-block bg-slate-800 dark:bg-slate-100 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-extrabold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of students managing their health with MediTrack today.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </>
  );
}

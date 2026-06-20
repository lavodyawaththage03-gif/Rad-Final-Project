'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold">⚕</span>
          </div>
          <span>MediTrack</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-blue-100 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-100 transition">
            About
          </Link>
          <Link href="/health-info" className="hover:text-blue-100 transition">
            Health Info
          </Link>
          <Link href="/contact" className="hover:text-blue-100 transition">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {!loading && isAuthenticated && user ? (
            <>
              <span className="text-sm hidden sm:inline">
                Welcome, {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-medium transition"
              >
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/login"
                className="bg-transparent border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded font-medium transition"
              >
                Register
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

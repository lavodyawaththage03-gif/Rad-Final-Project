import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-border/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white hover:opacity-80 transition-opacity">
          <img src="/meditrack-logo.png" alt="MediTrack Logo" className="w-8 h-8 rounded-full object-cover" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MediTrack</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
            About
          </Link>
          <Link to="/health-info" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
            Health Info
          </Link>
          <Link to="/contact" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {!loading && isAuthenticated && user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                Welcome, {user.email}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full font-medium transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 font-medium px-4 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-medium shadow-md shadow-blue-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Register
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

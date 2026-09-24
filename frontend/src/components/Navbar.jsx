import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF6ED]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-[#2F6F4E] flex items-center justify-center text-white shadow-sm">
              <Wrench size={20} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#1F2937]">
              Care<span className="text-[#2F6F4E]">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-sm text-gray-700">
            <Link to="/" className="hover:text-[#2F6F4E] transition">Home</Link>
            <Link to="/services" className="hover:text-[#2F6F4E] transition">Services</Link>
            <a href="/#how-it-works" className="hover:text-[#2F6F4E] transition">How It Works</a>
            <a href="/#why-us" className="hover:text-[#2F6F4E] transition">Why Us</a>
          </div>

          {/* Auth Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={user.role === 'provider' ? '/provider/dashboard' : '/dashboard'}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold transition"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold transition"
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-[#2F6F4E] px-3 py-2 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-4 py-2 bg-[#2F6F4E] hover:bg-[#25593e] text-white rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6ED] border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 font-medium">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-800">Home</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-800">Services</Link>
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-800">How It Works</a>
          <a href="/#why-us" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-800">Why Us</a>
          <hr className="border-stone-200 my-2" />
          {user ? (
            <div className="space-y-2">
              <Link
                to={user.role === 'provider' ? '/provider/dashboard' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#2F6F4E] font-semibold"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-800"
              >
                Profile ({user.name})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-red-600 font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 border border-stone-300 rounded-lg text-gray-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 bg-[#2F6F4E] text-white rounded-lg font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
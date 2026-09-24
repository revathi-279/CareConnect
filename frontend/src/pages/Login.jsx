import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Wrench } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#2F6F4E] text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow">
            <Wrench size={22} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1F2937]">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your appointments</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@careconnect.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6F4E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6F4E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#2F6F4E] hover:bg-[#25593e] text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 mt-2"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#2F6F4E] hover:underline">
            Register now
          </Link>
        </p>

        {/* Development Quick Helper */}
        <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-gray-400 text-center">
          Demo Customer: <span className="font-mono text-gray-600">customer@careconnect.com</span> / <span className="font-mono text-gray-600">password123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
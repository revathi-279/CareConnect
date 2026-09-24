import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Phone, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateProfileState } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      const res = await api.patch('/users/profile', { name, phone });
      if (res.data?.success) {
        updateProfileState(res.data.data);
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#1F2937] mb-1">Account Profile</h1>
        <p className="text-sm text-gray-500 mb-6">Manage your contact and identity details</p>

        {message && <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6F4E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Email Address (Fixed)
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 bg-stone-100 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6F4E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Account Role
            </label>
            <div className="relative">
              <Shield size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                disabled
                value={user?.role || 'customer'}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 bg-stone-100 rounded-xl text-gray-500 capitalize cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#2F6F4E] hover:bg-[#25593e] text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 mt-4"
          >
            {submitting ? 'Saving changes...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookingDetails from './pages/BookingDetails';
import ProviderDashboard from './pages/ProviderDashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <Routes>
            {/* Public Access */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Provider Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['provider']} />}>
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            </Route>

            {/* Shared Authenticated Routes */}
            <Route element={<ProtectedRoute allowedRoles={['customer', 'provider']} />}>
              <Route path="/bookings/:id" element={<BookingDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import SupportBot from '../chat/SupportBot';

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">CareConnect</Link>
          
        <nav className="flex items-center gap-6">
            <Link to="/services" className="text-text-muted hover:text-primary transition-colors font-medium">Services</Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <Link to="/dashboard" className="text-text-muted hover:text-primary transition-colors font-medium">Dashboard</Link>
                )}
                {user?.role === 'provider' && (
                  <Link to="/provider-hub" className="text-primary hover:text-primary-hover transition-colors font-bold flex items-center gap-1">
                    Provider Hub
                  </Link>
                )}
                {/* NEW: Admin Link */}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-red-500 hover:text-red-600 transition-colors font-bold flex items-center gap-1">
                    Admin Command
                  </Link>
                )}

                
                <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                  <div className="flex items-center gap-2 text-text-main font-medium">
                    <User size={18} className="text-secondary" />
                    <span>{user?.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    title="Log out"
                    className="text-text-muted hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                <Link to="/login" className="text-text-main font-medium hover:text-primary transition-colors">Log in</Link>
                <Link to="/register" className="bg-secondary hover:bg-secondary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-background">
        <Outlet />
      </main>

      <SupportBot />

      <footer className="bg-surface py-6 border-t border-gray-100 text-center text-text-muted text-sm">
        © 2026 CareConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
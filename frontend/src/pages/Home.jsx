import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Search } from 'lucide-react';
import useServiceStore from '../store/serviceStore';

const Home = () => {
  const { categories, fetchCategories, isLoading } = useServiceStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-text-main">
          Expert home services, <span className="text-primary">right at your door.</span>
        </h1>
        <p className="text-lg text-text-muted mb-8">
          From AC repair to deep cleaning, book verified professionals instantly. Transparent pricing, guaranteed quality.
        </p>
        
        {/* Search Bar Placeholder */}
        <div className="max-w-xl mx-auto flex items-center bg-surface p-2 rounded-full shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-primary transition-all">
          <Search className="text-text-muted ml-3" size={20} />
          <input 
            type="text" 
            placeholder="What do you need help with?" 
            className="w-full px-4 py-2 bg-transparent focus:outline-none"
            onClick={() => navigate('/services')} // Redirect to services for now
          />
          <button 
            onClick={() => navigate('/services')}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-text-main">Explore Categories</h2>
          <button 
            onClick={() => navigate('/services')}
            className="text-primary hover:text-primary-hover font-medium flex items-center"
          >
            View all services
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div 
                key={category._id}
                onClick={() => navigate(`/services?category=${category._id}`)}
                className="bg-surface p-6 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center group"
              >
                <div className="h-14 w-14 bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white rounded-full flex items-center justify-center mb-4 transition-colors">
                  <LayoutGrid size={28} />
                </div>
                <h3 className="font-semibold text-lg text-text-main">{category.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
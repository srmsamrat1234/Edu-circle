import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTutors, getSubjects } from '../services/api';
import TutorCard from '../components/TutorCard';

const FindTutors = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    minPrice: '',
    maxPrice: '',
    teachingMode: ''
  });

  useEffect(() => {
    loadSubjects();
    loadTutors();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadTutors = async (customFilters = filters) => {
    try {
      setLoading(true);
      // Remove empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(customFilters).filter(([_, value]) => value !== '')
      );
      
      const response = await getAllTutors(activeFilters);
      setTutors(response.data.tutors);
    } catch (error) {
      console.error('Error loading tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    loadTutors(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      subject: '',
      minPrice: '',
      maxPrice: '',
      teachingMode: ''
    };
    setFilters(emptyFilters);
    loadTutors(emptyFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* ← BACK BUTTON - Blue + White Theme */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            <span className="text-lg">←</span> Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Expert Tutors
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with verified tutors for personalized learning experiences
          </p>
        </div>

        {/* Filters Card - Blue + White Theme */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Teaching Mode Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teaching Mode
              </label>
              <select
                name="teachingMode"
                value={filters.teachingMode}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">All Modes</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            {/* Min Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price (₹)
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (₹)
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="10000"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{tutors.length}</span> tutor{tutors.length !== 1 ? 's' : ''}
          </p>
          {Object.values(filters).some(v => v !== '') && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* Tutors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Finding tutors...</p>
            </div>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tutors found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to find more tutors</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindTutors;
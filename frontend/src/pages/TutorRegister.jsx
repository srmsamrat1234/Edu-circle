import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, getSubjects } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TutorRegister = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'tutor',
    
    // Tutor Specific
    subjects: [],
    hourlyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    experience: '',
    bio: '',
    qualification: '',
    teachingMode: []
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleTeachingModeToggle = (mode) => {
    setFormData(prev => ({
      ...prev,
      teachingMode: prev.teachingMode.includes(mode)
        ? prev.teachingMode.filter(m => m !== mode)
        : [...prev.teachingMode, mode]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.subjects.length === 0) {
      setError('Please select at least one subject');
      setLoading(false);
      return;
    }

    if (formData.teachingMode.length === 0) {
      setError('Please select at least one teaching mode');
      setLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const tutorData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        subjects: formData.subjects,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
        weeklyRate: formData.weeklyRate ? Number(formData.weeklyRate) : undefined,
        monthlyRate: formData.monthlyRate ? Number(formData.monthlyRate) : undefined,
        experience: formData.experience ? Number(formData.experience) : 0,
        bio: formData.bio,
        qualification: formData.qualification,
        teachingMode: formData.teachingMode
      };

      const response = await register(tutorData);
      authRegister(response.data, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-emerald-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            👨‍ Become a Tutor
          </h1>
          <p className="text-gray-600">
            Join Educircle and start teaching students online
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Professional Details
            </h2>
            
            <div className="space-y-6">
              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., M.Sc Mathematics, B.Tech Computer Science"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About You (Bio)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell students about your teaching style, expertise, and what makes you a great tutor..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Subjects You Teach *
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map((subject, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSubjectToggle(subject)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    formData.subjects.includes(subject)
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formData.subjects.includes(subject) && '✓ '}
                  {subject}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Selected: {formData.subjects.length} subject{formData.subjects.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Teaching Mode */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
              Teaching Mode *
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTeachingModeToggle('Online')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.teachingMode.includes('Online')
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">🌐</div>
                <h3 className="font-bold text-gray-900">Online</h3>
                <p className="text-sm text-gray-600">Teach via video calls</p>
              </button>

              <button
                type="button"
                onClick={() => handleTeachingModeToggle('Offline')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.teachingMode.includes('Offline')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-bold text-gray-900">Offline</h3>
                <p className="text-sm text-gray-600">In-person sessions</p>
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
              Pricing (Optional)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Rate (₹)
                </label>
                <input
                  type="number"
                  name="weeklyRate"
                  value={formData.weeklyRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="3000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rate (₹)
                </label>
                <input
                  type="number"
                  name="monthlyRate"
                  value={formData.monthlyRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="10000"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : '🚀 Become a Tutor'}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorRegister;
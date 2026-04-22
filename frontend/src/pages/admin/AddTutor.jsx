import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AddTutor = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
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
      const response = await API.get('/tutors/subjects');
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
    setSuccess('');
    setLoading(true);

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
      const tutorData = {
        ...formData,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
        weeklyRate: formData.weeklyRate ? Number(formData.weeklyRate) : undefined,
        monthlyRate: formData.monthlyRate ? Number(formData.monthlyRate) : undefined,
        experience: formData.experience ? Number(formData.experience) : 0,
        isVerified: true
      };

      await API.post('/admin/tutors', tutorData);
      setSuccess('Tutor added successfully!');
      setTimeout(() => navigate('/admin/tutors'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tutor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <AdminHeader 
            title="➕ Add New Tutor"
            subtitle="Create a new tutor account"
          />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="M.Sc Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  maxLength="500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell about teaching experience..."
                />
              </div>
            </div>

            {/* Subjects */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Subjects *</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-4 py-3 rounded-xl font-medium transition ${
                      formData.subjects.includes(subject)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formData.subjects.includes(subject) && '✓ '}{subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Teaching Mode */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Teaching Mode *</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleTeachingModeToggle('Online')}
                  className={`p-6 rounded-xl border-2 transition ${
                    formData.teachingMode.includes('Online')
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🌐</div>
                  <h3 className="font-bold text-gray-900">Online</h3>
                </button>
                <button
                  type="button"
                  onClick={() => handleTeachingModeToggle('Offline')}
                  className={`p-6 rounded-xl border-2 transition ${
                    formData.teachingMode.includes('Offline')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">📍</div>
                  <h3 className="font-bold text-gray-900">Offline</h3>
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing (₹)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Rate</label>
                  <input
                    type="number"
                    name="weeklyRate"
                    value={formData.weeklyRate}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rate</label>
                  <input
                    type="number"
                    name="monthlyRate"
                    value={formData.monthlyRate}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-cyan-700 transition shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating Tutor...' : '✅ Create Tutor Account'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/tutors')}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTutor;
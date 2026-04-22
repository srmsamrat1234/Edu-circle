import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const EditProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    qualification: '',
    experience: '',
    bio: '',
    hourlyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    subjects: [],
    teachingMode: []
  });

  const subjectsList = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'Hindi', 'Computer Science', 'Python',
    'Data Science', 'Machine Learning', 'Programming'
  ];

  useEffect(() => {
    if (user && user.role !== 'tutor') {
      navigate('/dashboard');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      const response = await API.get(`/tutors/profile`);
      const tutor = response.data.tutor;
      setFormData({
        qualification: tutor.qualification || '',
        experience: tutor.experience || '',
        bio: tutor.bio || '',
        hourlyRate: tutor.hourlyRate || '',
        weeklyRate: tutor.weeklyRate || '',
        monthlyRate: tutor.monthlyRate || '',
        subjects: tutor.subjects || [],
        teachingMode: tutor.teachingMode || []
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      await API.put('/tutors/profile', {
        ...formData,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : 0,
        weeklyRate: formData.weeklyRate ? Number(formData.weeklyRate) : 0,
        monthlyRate: formData.monthlyRate ? Number(formData.monthlyRate) : 0,
        experience: formData.experience ? Number(formData.experience) : 0
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/tutor-dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button - Blue + White Theme */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/tutor-dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition hover:bg-blue-50 rounded-lg"
            >
              <span className="text-lg">←</span> Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">✏️ Edit Profile</h1>
              <p className="text-gray-600">Update your tutoring profile</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
            <span className="text-xl">✅</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Qualification & Experience */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="M.Sc Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="5"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                maxLength="500"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Tell students about your teaching experience..."
              />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subjects *</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjectsList.map((subject, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSubjectToggle(subject)}
                  className={`px-4 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                    formData.subjects.includes(subject)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {formData.subjects.includes(subject) && <span>✓</span>}{subject}
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
                className={`p-6 rounded-xl border-2 transition flex flex-col items-center gap-3 ${
                  formData.teachingMode.includes('Online')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-4xl">🌐</div>
                <h3 className="font-bold text-gray-900 text-lg">Online</h3>
                <p className="text-sm text-gray-600">Teach via video call</p>
              </button>
              <button
                type="button"
                onClick={() => handleTeachingModeToggle('Offline')}
                className={`p-6 rounded-xl border-2 transition flex flex-col items-center gap-3 ${
                  formData.teachingMode.includes('Offline')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-4xl">📍</div>
                <h3 className="font-bold text-gray-900 text-lg">Offline</h3>
                <p className="text-sm text-gray-600">In-person sessions</p>
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 Set Your Pricing (₹)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="500"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Rate
                </label>
                <input
                  type="number"
                  name="weeklyRate"
                  value={formData.weeklyRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="3000"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rate
                </label>
                <input
                  type="number"
                  name="monthlyRate"
                  value={formData.monthlyRate}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="10000"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              💡 Set your own rates based on your experience and qualifications
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>💾 Save Profile</>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tutor-dashboard')}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
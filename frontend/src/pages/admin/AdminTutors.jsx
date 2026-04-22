import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminTutors = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/users?role=tutor');
      setTutors(response.data.users);
    } catch (error) {
      console.error('Error loading tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, isVerified) => {
    try {
      await API.patch(`/admin/tutors/${id}/verify`, { isVerified });
      alert(`Tutor ${isVerified ? 'verified' : 'unverified'} successfully`);
      loadTutors();
    } catch (error) {
      console.error('Error verifying tutor:', error);
      alert('Failed to update tutor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutor?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        alert('Tutor deleted successfully');
        loadTutors();
      } catch (error) {
        console.error('Error deleting tutor:', error);
        alert('Failed to delete tutor');
      }
    }
  };

  const filteredTutors = tutors.filter(tutor => 
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.subjects?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <AdminHeader 
            title="👨‍🏫 Manage Tutors"
            subtitle="View and manage all tutors"
          />

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => navigate('/admin/tutors/add')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg"
            >
              ➕ Add New Tutor
            </button>
            <input
              type="text"
              placeholder="Search tutors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div key={tutor._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                      {tutor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{tutor.name}</h3>
                      <p className="text-gray-600 text-sm">{tutor.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tutor.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tutor.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                {tutor.subjects && tutor.subjects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Subjects:</p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.slice(0, 3).map((subject, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {subject}
                        </span>
                      ))}
                      {tutor.subjects.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{tutor.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">💰 ₹{tutor.hourlyRate || 0}/hour</p>
                  <p className="text-sm text-gray-600">⭐ {tutor.experience || 0} years exp.</p>
                  <p className="text-sm text-gray-600">📊 {tutor.rating?.toFixed(1) || 'New'} ({tutor.totalReviews || 0} reviews)</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(tutor._id, !tutor.isVerified)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                      tutor.isVerified 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {tutor.isVerified ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    onClick={() => handleDelete(tutor._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTutors.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-600 text-lg">No tutors found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTutors;
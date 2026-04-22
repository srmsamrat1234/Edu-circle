import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const PendingTutors = () => {
  const navigate = useNavigate();
  const [pendingTutors, setPendingTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    loadPendingTutors();
  }, []);

  const loadPendingTutors = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/users?role=tutor');
      const pending = response.data.users.filter(tutor => !tutor.isVerified);
      setPendingTutors(pending);
    } catch (error) {
      console.error('Error loading pending tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, tutorName) => {
    if (!window.confirm(`Verify tutor: ${tutorName}?`)) return;

    try {
      setVerifying(id);
      await API.patch(`/admin/tutors/${id}/verify`, { isVerified: true });
      alert(`✅ ${tutorName} has been verified successfully!`);
      loadPendingTutors();
    } catch (error) {
      console.error('Error verifying tutor:', error);
      alert('❌ Failed to verify tutor');
    } finally {
      setVerifying(null);
    }
  };

  const handleReject = async (id, tutorName) => {
    if (!window.confirm(`Reject and delete tutor: ${tutorName}?`)) return;

    try {
      await API.delete(`/admin/users/${id}`);
      alert(`❌ ${tutorName} has been rejected and deleted.`);
      loadPendingTutors();
    } catch (error) {
      console.error('Error rejecting tutor:', error);
      alert('❌ Failed to reject tutor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <AdminHeader 
            title="⏳ Pending Tutor Verification"
            subtitle="Review and verify new tutor applications"
          />

          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-600 text-lg">Loading pending tutors...</p>
            </div>
          ) : pendingTutors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending tutor applications</p>
              <button
                onClick={() => navigate('/admin/tutors')}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                View All Tutors
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <h3 className="font-bold text-yellow-900 text-lg">
                      {pendingTutors.length} Pending Application{pendingTutors.length !== 1 ? 's' : ''}
                    </h3>
                    <p className="text-yellow-700">Please review these tutor profiles before verification</p>
                  </div>
                </div>
              </div>

              {pendingTutors.map((tutor) => (
                <div key={tutor._id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl text-white font-bold">
                        {tutor.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{tutor.name}</h3>
                        <p className="text-gray-600">{tutor.email}</p>
                        <p className="text-gray-600">{tutor.phone}</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm">
                      ⏳ Pending Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Professional Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Qualification:</span> <span className="font-medium">{tutor.qualification || 'N/A'}</span></p>
                        <p><span className="text-gray-600">Experience:</span> <span className="font-medium">{tutor.experience || 0} years</span></p>
                        <p><span className="text-gray-600">Hourly Rate:</span> <span className="font-medium">₹{tutor.hourlyRate || 0}</span></p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Subjects & Mode</h4>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {tutor.subjects?.map((subject, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              {subject}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {tutor.teachingMode?.map((mode, idx) => (
                            <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${
                              mode === 'Online' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {mode === 'Online' ? '🌐' : '📍'} {mode}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {tutor.bio && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                      <p className="text-gray-600 bg-gray-50 rounded-xl p-4">{tutor.bio}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVerify(tutor._id, tutor.name)}
                      disabled={verifying === tutor._id}
                      className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {verifying === tutor._id ? (
                        <>⏳ Verifying...</>
                      ) : (
                        <>✅ Verify Tutor</>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(tutor._id, tutor.name)}
                      className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition shadow-lg"
                    >
                      ❌ Reject
                    </button>
                    <button
                      onClick={() => navigate(`/tutor/${tutor._id}`)}
                      className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
                    >
                      👁️ View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingTutors;
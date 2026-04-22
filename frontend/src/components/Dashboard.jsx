import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import ChatInterface from '../components/ChatInterface';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingPending, setLoadingPending] = useState(false);
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch pending bookings count for notification badge
  useEffect(() => {
    if (user?.role === 'student' || user?.role === 'parent') {
      loadPendingCount();
    }
  }, [user]);

  const loadPendingCount = async () => {
    try {
      setLoadingPending(true);
      const response = await API.get('/bookings/my-bookings');
      const count = response.data.bookings.filter(b => b.status === 'pending').length;
      setPendingCount(count);
    } catch (error) {
      console.error('Error loading pending count:', error);
      setPendingCount(0);
    } finally {
      setLoadingPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Blue + White Theme */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🎓 Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Chat Button - For ALL roles */}
              {(user?.role === 'student' || user?.role === 'parent' || user?.role === 'tutor') && (
                <button
                  onClick={() => setChatOpen(true)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2 text-sm md:text-base"
                >
                  💬 Chat
                </button>
              )}
              <button
                onClick={logout}
                className="px-4 md:px-6 py-2 md:py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition text-sm md:text-base"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900 font-medium truncate">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-gray-900 font-medium capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-900 font-medium">{user?.phone || 'Not added'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-gray-900 font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Student/Parent Dashboard Cards */}
        {(user?.role === 'student' || user?.role === 'parent') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Find Tutors */}
            <button
              onClick={() => navigate('/find-tutors')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group text-left"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                🔍
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Find Tutors</h3>
              <p className="text-gray-600 text-sm">Search and book tutors</p>
            </button>

            {/* My Bookings with Notification Badge */}
            <button
              onClick={() => navigate('/my-bookings')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group text-left relative"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                📅
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">My Bookings</h3>
              <p className="text-gray-600 text-sm">View your bookings</p>
              {/* Notification Badge */}
              {pendingCount > 0 && !loadingPending && (
                <span className="absolute top-4 right-4 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
                  {pendingCount}
                </span>
              )}
              {loadingPending && (
                <span className="absolute top-4 right-4 bg-gray-300 text-gray-600 px-2 py-1 rounded-full text-xs">
                  ...
                </span>
              )}
            </button>

            {/* Materials */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                📚
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Materials</h3>
              <p className="text-gray-600 text-sm">Access study materials</p>
            </div>
          </div>
        )}

        {/* Tutor Dashboard Cards */}
        {user?.role === 'tutor' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => navigate('/tutor-dashboard/edit-profile')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group text-left"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                👤
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">My Profile</h3>
              <p className="text-gray-600 text-sm">Edit your profile</p>
            </button>
            <button
              onClick={() => navigate('/tutor-dashboard')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group text-left"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                👥
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">My Students</h3>
              <p className="text-gray-600 text-sm">Manage students</p>
            </button>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                💰
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Earnings</h3>
              <p className="text-gray-600 text-sm">View your earnings</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface - For ALL users */}
      <ChatInterface 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
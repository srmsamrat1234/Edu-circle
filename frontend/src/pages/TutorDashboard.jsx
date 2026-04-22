import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMeeting } from '../context/MeetingContext';
import API from '../services/api';
import ChatSidebar from '../components/ChatSidebar';
import JitsiMeet from '../components/meetings/JitsiMeet';

const TutorDashboard = () => {
  const { user, logout } = useAuth();
  const { activeMeeting, startMeeting, endMeeting, meetingLoading, meetingError } = useMeeting();
  const navigate = useNavigate();
  
  const [pendingBookings, setPendingBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'tutor') {
      navigate('/dashboard');
      return;
    }
    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const [pendingRes, acceptedRes] = await Promise.all([
        API.get('/bookings/tutor/pending'),
        API.get('/bookings/tutor-bookings')
      ]);
      
      setPendingBookings(pendingRes.data.bookings);
      setAcceptedBookings(acceptedRes.data.bookings.filter(b => b.status === 'accepted'));
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action, response = '') => {
    try {
      await API.patch(`/bookings/${bookingId}/status`, {
        status: action,
        tutorResponse: response
      });
      loadBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking');
    }
  };

  // ========== START SESSION BUTTON HANDLER ==========
  const handleStartSession = async (booking) => {
    try {
      // Validate user is logged in
      if (!user?._id || !user?.name || !user?.email) {
        alert('Please login again to start a session');
        return;
      }
      
      // Start meeting with tutor as moderator (isModerator = true)
      await startMeeting(booking._id, true);
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start video session. Please try again.');
    }
  };

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // ========== SHOW MEETING MODAL IF ACTIVE ==========
  if (activeMeeting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
        {/* Meeting Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center border-b border-gray-700">
          <div>
            <h2 className="text-lg font-bold">🎥 Live Session</h2>
            <p className="text-sm text-gray-400">Room: {activeMeeting.roomName} (Moderator)</p>
          </div>
          <button
            onClick={endMeeting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
          >
            ✕ End Session
          </button>
        </div>
        
        {/* Jitsi Meet Component */}
        <div className="flex-1">
          <JitsiMeet
            roomName={activeMeeting.roomName}
            userName={activeMeeting.userName}
            userEmail={activeMeeting.userEmail}
            isModerator={activeMeeting.isModerator}
            onEndCall={endMeeting}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👨‍🏫 Tutor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setChatOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              💬 Chat
            </button>
            <button
              onClick={() => navigate('/tutor-dashboard/edit-profile')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="text-4xl font-bold text-yellow-600">{pendingBookings.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Active Sessions</p>
            <p className="text-4xl font-bold text-green-600">{acceptedBookings.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-4xl font-bold text-blue-600">
              ₹{acceptedBookings.reduce((sum, b) => sum + (b.amount || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Rating</p>
            <p className="text-4xl font-bold text-purple-600">⭐ {user?.rating?.toFixed(1) || 'New'}</p>
          </div>
        </div>

        {/* Meeting Error Alert */}
        {meetingError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <span>⚠️ {meetingError}</span>
          </div>
        )}

        {/* Pending Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ⏳ Pending Booking Requests
            {pendingBookings.length > 0 && (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                {pendingBookings.length} new
              </span>
            )}
          </h2>

          {pendingBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending requests 🎉</p>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{booking.student?.name}</h3>
                      <p className="text-gray-600">{booking.student?.email}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      booking.status === 'accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {booking.status === 'pending' ? '⏳ Pending' :
                       booking.status === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Subject</p>
                      <p className="font-medium text-gray-900">{booking.subject}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Package</p>
                      <p className="font-medium text-gray-900 capitalize">{booking.packageType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Date & Time</p>
                      <p className="font-medium text-gray-900">
                        {new Date(booking.preferredDate).toLocaleDateString()} at {formatTime(booking.preferredTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Amount</p>
                      <p className="font-medium text-green-600">₹{booking.amount}</p>
                    </div>
                  </div>

                  {booking.message && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                      <p className="text-sm text-gray-600 italic">"{booking.message}"</p>
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleBookingAction(booking._id, 'accepted')}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2"
                    >
                      ✅ Accept
                    </button>
                    <button
                      onClick={() => handleBookingAction(booking._id, 'rejected')}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center gap-2"
                    >
                      ❌ Reject
                    </button>
                    <button
                      onClick={() => setChatOpen(true)}
                      className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center gap-2"
                    >
                      💬 Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accepted Bookings - With Start Session Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✅ Accepted Sessions</h2>

          {acceptedBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active sessions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {acceptedBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{booking.student?.name}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.subject}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(booking.preferredDate).toLocaleDateString()}<br/>
                        <span className="text-sm text-gray-500">{formatTime(booking.preferredTime)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.mode === 'Online' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {booking.mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₹{booking.amount}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {/* START SESSION BUTTON */}
                          <button
                            onClick={() => handleStartSession(booking)}
                            disabled={meetingLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {meetingLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            ) : (
                              '🎥 Start'
                            )}
                          </button>
                          
                          {/* Chat Button */}
                          <button
                            onClick={() => setChatOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                          >
                            💬 Chat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <ChatSidebar 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
};

export default TutorDashboard;
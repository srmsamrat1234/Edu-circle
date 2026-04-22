import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMeeting } from '../context/MeetingContext';
import API from '../services/api';
import ChatInterface from '../components/ChatInterface';
import JitsiMeet from '../components/meetings/JitsiMeet';

const MyBookings = () => {
  const { user } = useAuth();
  const { activeMeeting, startMeeting, endMeeting, meetingLoading, meetingError } = useMeeting();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatWith, setChatWith] = useState(null);

  useEffect(() => {
    loadBookings();
    const interval = setInterval(loadBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadBookings = async () => {
    try {
      setError('');
      const response = await API.get('/bookings/my-bookings');
      setBookings(response.data.bookings);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '⏳ Pending', border: 'border-yellow-200' },
      accepted: { bg: 'bg-green-100', text: 'text-green-700', label: '✅ Accepted', border: 'border-green-200' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: '❌ Rejected', border: 'border-red-200' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: '✓ Completed', border: 'border-blue-200' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', label: '✕ Cancelled', border: 'border-gray-200' }
    };
    return badges[status] || badges.pending;
  };

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ========== JOIN CLASS BUTTON HANDLER ==========
  const handleJoinClass = async (booking) => {
    try {
      // Validate user is logged in with required info
      if (!user?._id || !user?.name || !user?.email) {
        alert('Please login again to join the class');
        return;
      }
      
      // Start meeting with student as participant (isModerator = false)
      await startMeeting(booking._id, false);
    } catch (error) {
      console.error('Failed to join class:', error);
      alert('Failed to start video call. Please try again.');
    }
  };

  // ========== MESSAGE TUTOR BUTTON HANDLER ==========
  const handleMessageTutor = (tutor) => {
    setChatWith(tutor);
    setChatOpen(true);
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const acceptedCount = bookings.filter(b => b.status === 'accepted').length;

  // ========== SHOW MEETING MODAL IF ACTIVE ==========
  if (activeMeeting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
        {/* Meeting Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center border-b border-gray-700">
          <div>
            <h2 className="text-lg font-bold">🎥 Live Class</h2>
            <p className="text-sm text-gray-400">Room: {activeMeeting.roomName}</p>
          </div>
          <button
            onClick={endMeeting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
          >
            ✕ End Call
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
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* ← BACK BUTTON */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            <span className="text-lg">←</span> Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">📚 My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage and track your tutoring sessions</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadBookings} className="text-red-700 font-semibold hover:underline">Retry</button>
          </div>
        )}

        {/* Meeting Error */}
        {meetingError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <span>⚠️ {meetingError}</span>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Accepted</p>
            <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Notification Alert for Pending Requests */}
        {pendingCount > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="text-blue-900 font-medium">
                You have {pendingCount} pending {pendingCount === 1 ? 'request' : 'requests'} waiting for tutor response
              </p>
              <p className="text-blue-700 text-sm mt-1">Tutors usually respond within 24 hours</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: '⏳ Pending' },
            { key: 'accepted', label: '✅ Accepted' },
            { key: 'rejected', label: '❌ Rejected' },
            { key: 'completed', label: '✓ Completed' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-2.5 rounded-xl font-medium transition ${
                filter === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Book a session with a tutor to get started!' 
                : `No ${filter} bookings yet.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/find-tutors')}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Find Tutors
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const badge = getStatusBadge(booking.status);
              return (
                <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl font-bold text-blue-600">
                        {booking.tutor?.name?.charAt(0).toUpperCase() || 'T'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{booking.tutor?.name}</h3>
                        <p className="text-gray-600">{booking.subject}</p>
                        {booking.tutorResponse && (
                          <p className="text-sm text-gray-500 mt-1">
                            Last update: {new Date(booking.updatedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-t border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Package</p>
                      <p className="font-semibold text-gray-900 capitalize">{booking.packageType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(booking.preferredDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                      <p className="font-semibold text-gray-900">{formatTime(booking.preferredTime)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                      <p className="font-semibold text-green-600">₹{booking.amount}</p>
                    </div>
                  </div>

                  {/* Tutor Response */}
                  {booking.tutorResponse && (
                    <div className={`rounded-xl p-4 mb-4 ${
                      booking.status === 'accepted' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        booking.status === 'accepted' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        💬 Tutor's Response:
                      </p>
                      <p className={`text-sm mt-1 ${
                        booking.status === 'accepted' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {booking.tutorResponse}
                      </p>
                    </div>
                  )}

                  {/* Status-Specific Messages & Actions */}
                  {booking.status === 'pending' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <p className="text-sm text-yellow-900 font-medium">
                        ⏳ Your request is pending
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        The tutor will review your request and respond soon. You'll be notified when they accept or reject.
                      </p>
                    </div>
                  )}

                  {booking.status === 'accepted' && (
                    <div className="flex flex-wrap gap-3">
                      {/* JOIN CLASS BUTTON */}
                      <button
                        onClick={() => handleJoinClass(booking)}
                        disabled={meetingLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {meetingLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Starting...
                          </>
                        ) : (
                          <>📹 Join Class</>
                        )}
                      </button>
                      
                      {/* Message Tutor Button */}
                      <button
                        onClick={() => handleMessageTutor(booking.tutor)}
                        className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center gap-2"
                      >
                        💬 Message Tutor
                      </button>
                      
                      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
                        📋 View Details
                      </button>
                    </div>
                  )}

                  {booking.status === 'rejected' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-900 font-medium">
                        ❌ This booking was rejected
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        The tutor was unable to accept your request. Please try booking another session or contact the tutor directly.
                      </p>
                      <button
                        onClick={() => navigate('/find-tutors')}
                        className="inline-block mt-3 px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm"
                      >
                        Find Another Tutor
                      </button>
                    </div>
                  )}

                  {booking.status === 'completed' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-sm text-blue-900 font-medium">
                        ✓ Session completed
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Thank you for learning with us! You can rate your tutor experience.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Interface - For messaging tutors */}
      {chatOpen && chatWith && (
        <ChatInterface 
          isOpen={chatOpen} 
          onClose={() => { setChatOpen(false); setChatWith(null); }}
        />
      )}
    </div>
  );
};

export default MyBookings;
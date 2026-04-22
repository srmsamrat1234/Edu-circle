import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTutorById, addReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import ChatWindow from '../components/ChatWindow';

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Booking & Chat states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadTutor();
  }, [id]);

  const loadTutor = async () => {
    try {
      setLoading(true);
      const response = await getTutorById(id);
      setTutor(response.data.tutor);
    } catch (error) {
      console.error('Error loading tutor:', error);
      showToast('Failed to load tutor profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to add a review', 'error');
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      await addReview(id, {
        rating: review.rating,
        review: review.comment
      });
      showToast('Review submitted successfully!', 'success');
      setShowReviewForm(false);
      setReview({ rating: 5, comment: '' });
      loadTutor();
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast(error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tutor not found</h2>
          <p className="text-gray-600 mb-6">The tutor profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/find-tutors')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            ← Back to Tutors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* ← BACK BUTTON - Blue + White Theme */}
        <button
          onClick={() => navigate('/find-tutors')}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition px-4 py-2 rounded-lg hover:bg-blue-50"
        >
          <span className="text-lg">←</span> Back to Tutors
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header - Blue Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl font-bold">
                {tutor.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{tutor.name}</h1>
                <p className="text-blue-100 mb-1">{tutor.qualification || 'Experienced Tutor'}</p>
                <p className="text-blue-200 text-sm">{tutor.experience || 0} years experience</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Rating & Reviews */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center">
                <span className="text-3xl mr-2">⭐</span>
                <div>
                  <span className="text-2xl font-bold text-yellow-700">
                    {tutor.rating?.toFixed(1) || 'New'}
                  </span>
                  <span className="text-gray-600 ml-2">
                    ({tutor.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
              {(user?.role === 'student' || user?.role === 'parent') && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition"
                >
                  {showReviewForm ? 'Cancel' : 'Add Review'}
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-200">
                <h3 className="font-bold text-gray-900">Rate this Tutor</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={review.rating}
                    onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>⭐ {num} - {['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'][5 - num]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {/* Bio */}
            {tutor.bio && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed">{tutor.bio}</p>
              </div>
            )}

            {/* Subjects */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Subjects</h3>
              {tutor.subjects && tutor.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No subjects specified</p>
              )}
            </div>

            {/* Teaching Mode */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Teaching Mode</h3>
              {tutor.teachingMode && tutor.teachingMode.length > 0 ? (
                <div className="flex gap-3">
                  {tutor.teachingMode.map((mode, index) => (
                    <span
                      key={index}
                      className={`px-4 py-2 rounded-xl font-medium border ${
                        mode === 'Online'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {mode === 'Online' ? '🌐' : '📍'} {mode}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No teaching mode specified</p>
              )}
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pricing</h3>
              {tutor.hourlyRate || tutor.weeklyRate || tutor.monthlyRate ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tutor.hourlyRate && (
                    <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-200">
                      <p className="text-sm text-gray-600">Per Hour</p>
                      <p className="text-2xl font-bold text-gray-900">₹{tutor.hourlyRate}</p>
                    </div>
                  )}
                  {tutor.weeklyRate && (
                    <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-200">
                      <p className="text-sm text-gray-600">Per Week</p>
                      <p className="text-2xl font-bold text-gray-900">₹{tutor.weeklyRate}</p>
                    </div>
                  )}
                  {tutor.monthlyRate && (
                    <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-200">
                      <p className="text-sm text-gray-600">Per Month</p>
                      <p className="text-2xl font-bold text-gray-900">₹{tutor.monthlyRate}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No pricing specified</p>
              )}
            </div>

            {/* Availability */}
            {tutor.availability && tutor.availability.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Available Slots</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tutor.availability.map((slot, index) => (
                    <div key={index} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <p className="font-medium text-emerald-900">{slot.day}</p>
                      <p className="text-sm text-emerald-700">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons - Blue + White Theme */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-sm"
              >
                📅 Book a Session
              </button>
              <button
                onClick={() => setShowChat(true)}
                className="px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                💬 Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          tutor={tutor}
          onClose={() => setShowBookingModal(false)}
          onSuccess={(msg) => showToast(msg, 'success')}
        />
      )}

      {/* Chat Window */}
      {showChat && (
        <ChatWindow
          receiverId={tutor._id}
          receiverName={tutor.name}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 text-white font-medium ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } animate-pulse`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default TutorProfile;
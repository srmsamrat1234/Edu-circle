import { useState } from 'react';
import API from '../services/api';

// Helper function: Convert 24-hour to 12-hour format
const convertTo12Hour = (time24) => {
  if (!time24) return '--:--';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const BookingModal = ({ tutor, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    packageType: 'hourly',
    mode: 'Online',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate amount with fallback values
      let amount;
      if (formData.packageType === 'hourly') {
        amount = tutor.hourlyRate || 500;
      } else if (formData.packageType === 'weekly') {
        amount = tutor.weeklyRate || 3000;
      } else {
        amount = tutor.monthlyRate || 10000;
      }

      // Duration based on package
      const duration = formData.packageType === 'hourly' ? '1 hour' :
                       formData.packageType === 'weekly' ? '1 week' :
                       '1 month';

      // Prepare booking data
      const bookingData = {
        tutorId: tutor._id,
        subject: tutor.subjects?.[0] || 'General',
        packageType: formData.packageType,
        amount: amount,
        duration: duration,
        mode: formData.mode,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message || ''
      };

      console.log('Sending booking data:', bookingData);

      const response = await API.post('/bookings', bookingData);
      
      onSuccess('Booking request sent successfully!');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to send booking request. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">📅 Book a Session</h2>
          <p className="text-gray-600 mt-1">with {tutor.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Package Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Package
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, packageType: 'hourly' })}
                className={`p-4 rounded-xl border-2 transition ${
                  formData.packageType === 'hourly'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">⏰</div>
                <div className="font-bold text-gray-900">Hourly</div>
                <div className="text-sm text-gray-600">₹{tutor.hourlyRate || 500}/hr</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, packageType: 'weekly' })}
                className={`p-4 rounded-xl border-2 transition ${
                  formData.packageType === 'weekly'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">📅</div>
                <div className="font-bold text-gray-900">Weekly</div>
                <div className="text-sm text-gray-600">₹{tutor.weeklyRate || 3000}/wk</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, packageType: 'monthly' })}
                className={`p-4 rounded-xl border-2 transition ${
                  formData.packageType === 'monthly'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">📆</div>
                <div className="font-bold text-gray-900">Monthly</div>
                <div className="text-sm text-gray-600">₹{tutor.monthlyRate || 10000}/mo</div>
              </button>
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'Online' })}
                className={`p-4 rounded-xl border-2 transition ${
                  formData.mode === 'Online'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🌐</div>
                <div className="font-bold">Online</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'Offline' })}
                className={`p-4 rounded-xl border-2 transition ${
                  formData.mode === 'Offline'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">📍</div>
                <div className="font-bold">Offline</div>
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time *
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  required
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm font-semibold text-blue-700 min-w-[80px] text-center">
                  {convertTo12Hour(formData.preferredTime)}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Shows as 12-hour format (e.g., 6:30 PM)
              </p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Tutor (Optional)
            </label>
            <textarea
              rows="3"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              maxLength="500"
              placeholder="Tell the tutor about your learning goals..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 mb-2">Booking Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span className="font-semibold">{formData.packageType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">
                  ₹{formData.packageType === 'hourly' ? (tutor.hourlyRate || 500) :
                     formData.packageType === 'weekly' ? (tutor.weeklyRate || 3000) :
                     (tutor.monthlyRate || 10000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className="font-semibold">{formData.mode}</span>
              </div>
              {formData.preferredTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{convertTo12Hour(formData.preferredTime)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : '📅 Send Booking Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
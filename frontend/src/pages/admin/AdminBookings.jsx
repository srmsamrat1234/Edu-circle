import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // This is a placeholder - actual booking system will be implemented in Step 8
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // Placeholder data - will be replaced with actual API call
      const placeholderBookings = [
        {
          _id: '1',
          studentName: 'Rahul Sharma',
          tutorName: 'Dr. Sarah Johnson',
          subject: 'Mathematics',
          date: '2026-04-05',
          time: '10:00 AM - 11:00 AM',
          status: 'pending',
          type: 'Online',
          amount: 800
        },
        {
          _id: '2',
          studentName: 'Priya Patel',
          tutorName: 'Prof. Rajesh Kumar',
          subject: 'Computer Science',
          date: '2026-04-06',
          time: '2:00 PM - 3:00 PM',
          status: 'confirmed',
          type: 'Online',
          amount: 1000
        },
        {
          _id: '3',
          studentName: 'Amit Kumar',
          tutorName: 'Ms. Priya Sharma',
          subject: 'English',
          date: '2026-04-07',
          time: '4:00 PM - 5:00 PM',
          status: 'completed',
          type: 'Offline',
          amount: 600
        }
      ];
      setBookings(placeholderBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <AdminHeader 
            title="📅 Booking Management"
            subtitle="View and manage all session bookings"
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-600 text-sm font-medium mb-1">Total Bookings</p>
              <p className="text-4xl font-bold text-gray-900">{bookings.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-yellow-600 text-sm font-medium mb-1">Pending</p>
              <p className="text-4xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-blue-600 text-sm font-medium mb-1">Confirmed</p>
              <p className="text-4xl font-bold text-blue-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-green-600 text-sm font-medium mb-1">Completed</p>
              <p className="text-4xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-bold text-blue-900 text-lg">Booking System - Coming Soon</h3>
                <p className="text-blue-700 mt-1">
                  The complete booking system with request/accept functionality will be implemented in <strong>Step 8</strong>. 
                  This page shows placeholder data for now.
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Bookings
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  filter === 'pending' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  filter === 'confirmed' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  filter === 'completed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-600 text-lg">No bookings found</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tutor</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{booking.studentName}</td>
                        <td className="px-6 py-4 text-gray-600">{booking.tutorName}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {booking.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div>
                            <p className="text-sm">{booking.date}</p>
                            <p className="text-sm text-gray-500">{booking.time}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.type === 'Online' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.type === 'Online' ? '🌐' : '📍'} {booking.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">₹{booking.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
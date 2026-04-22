import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const NotificationBell = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    // Poll every 10 seconds for new notifications
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await API.get('/admin/stats');
      const pendingCount = response.data.stats.pendingTutors || 0;
      setCount(pendingCount);
      
      if (pendingCount > 0) {
        setNotifications([{
          id: 1,
          type: 'tutor_pending',
          message: `${pendingCount} tutor${pendingCount !== 1 ? 's' : ''} awaiting verification`,
          time: 'Just now',
          icon: '⏳'
        }]);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleNotificationClick = () => {
    setShowDropdown(false);
    navigate('/admin/tutors/pending');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      >
        <span className="text-2xl">🔔</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {count}
          </span>
        )}
      </button>

      {showDropdown && notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={handleNotificationClick}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{notif.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 text-center">
            <button
              onClick={handleNotificationClick}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
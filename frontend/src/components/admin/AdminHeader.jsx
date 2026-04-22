import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

const AdminHeader = ({ title, subtitle }) => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          {user && <p className="text-sm text-gray-500 mt-1">Welcome back, {user.name}</p>}
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Bell with Live Updates */}
          <NotificationBell />
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition shadow-lg"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
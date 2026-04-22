import { useState, useEffect } from 'react';
import API from '../../services/api';

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
    const interval = setInterval(loadActivities, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadActivities = async () => {
    try {
      const [usersRes, tutorsRes] = await Promise.all([
        API.get('/admin/users?limit=5'),
        API.get('/admin/users?role=tutor&limit=5')
      ]);

      const recentActivities = [
        ...usersRes.data.users.slice(0, 3).map(user => ({
          id: user._id,
          type: 'user',
          action: 'registered',
          user: user.name,
          role: user.role,
          time: new Date(user.createdAt).toLocaleString()
        })),
        ...tutorsRes.data.users.slice(0, 3).map(tutor => ({
          id: tutor._id,
          type: 'tutor',
          action: tutor.isVerified ? 'verified' : 'pending',
          user: tutor.name,
          role: 'tutor',
          time: new Date(tutor.createdAt).toLocaleString()
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      setActivities(recentActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const getActionIcon = (action) => {
    switch(action) {
      case 'verified': return '✅';
      case 'pending': return '⏳';
      default: return '👤';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        📊 Live Activity Feed
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">
          LIVE
        </span>
      </h3>
      
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{getActionIcon(activity.action)}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {activity.user}
                </p>
                <p className="text-sm text-gray-600">
                  {activity.action === 'verified' ? '✅ Verified as tutor' :
                   activity.action === 'pending' ? '⏳ Pending verification' :
                   `👤 Registered as ${activity.role}`}
                </p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveActivityFeed;
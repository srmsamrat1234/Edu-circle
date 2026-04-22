import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/admin/StatCard';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <AdminHeader 
            title="🔐 Admin Dashboard" 
            subtitle="Manage your platform from here"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon="👥"
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard 
              title="Total Tutors"
              value={stats?.totalTutors || 0}
              icon="👨‍🏫"
              gradient="from-emerald-500 to-emerald-600"
            />
            <StatCard 
              title="Total Students"
              value={stats?.totalStudents || 0}
              icon="🎓"
              gradient="from-purple-500 to-purple-600"
            />
            <StatCard 
              title="Total Parents"
              value={stats?.totalParents || 0}
              icon="👪"
              gradient="from-orange-500 to-orange-600"
            />
            <StatCard 
              title="Verified Tutors"
              value={stats?.verifiedTutors || 0}
              icon="✅"
              gradient="from-green-500 to-green-600"
            />
            <StatCard 
              title="Pending Verification"
              value={stats?.pendingTutors || 0}
              icon="⏳"
              gradient="from-red-500 to-red-600"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionCard 
                icon="➕"
                title="Add New Tutor"
                desc="Create tutor account"
                onClick={() => navigate('/admin/tutors/add')}
                gradient="from-emerald-50 to-emerald-100"
              />
              <QuickActionCard 
                icon="👥"
                title="View All Users"
                desc="Manage users"
                onClick={() => navigate('/admin/users')}
                gradient="from-blue-50 to-blue-100"
              />
              <QuickActionCard 
                icon="⏳"
                title="Pending Tutors"
                desc="Verify tutors"
                onClick={() => navigate('/admin/tutors/pending')}
                gradient="from-yellow-50 to-yellow-100"
              />
              <QuickActionCard 
                icon="🏠"
                title="Back to Home"
                desc="View public site"
                onClick={() => navigate('/')}
                gradient="from-purple-50 to-purple-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ icon, title, desc, onClick, gradient }) => (
  <button
    onClick={onClick}
    className={`p-6 bg-gradient-to-br ${gradient} rounded-xl hover:shadow-lg transition group text-left`}
  >
    <div className="text-4xl mb-3 group-hover:scale-110 transition">{icon}</div>
    <h3 className="font-bold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{desc}</p>
  </button>
);

export default AdminDashboard;
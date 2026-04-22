import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const url = filter 
        ? `/admin/users?role=${filter}`
        : '/admin/users';
      const response = await API.get(url);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        alert('User deleted successfully');
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          <AdminHeader 
            title="👥 Manage Users"
            subtitle="View and manage all users"
          />

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="tutor">Tutor</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-600">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'tutor' ? 'bg-blue-100 text-blue-700' :
                            user.role === 'parent' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.role === 'tutor' ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredUsers.length === 0 && (
                  <div className="p-8 text-center text-gray-600">
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
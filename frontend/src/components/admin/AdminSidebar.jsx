import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Manage Users', icon: '👥' },
    { path: '/admin/tutors', label: 'Manage Tutors', icon: '👨‍' },
    { path: '/admin/tutors/add', label: 'Add New Tutor', icon: '➕' },
    { path: '/admin/tutors/pending', label: 'Pending Verification', icon: '⏳' },
    { path: '/', label: 'Back to Home', icon: '🏠' },
  ];

  return (
    <div className="w-64 bg-white shadow-xl h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          🔐 Admin Panel
        </h2>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
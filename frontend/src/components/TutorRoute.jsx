import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // ← Fixed: ../ not ../../

const TutorRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Check if user is logged in AND is tutor
  if (!user || user.role !== 'tutor') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default TutorRoute;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MeetingProvider } from './context/MeetingContext';
import { StuGBotProvider } from './components/StuGBot/StuGBotContext';  // ✅ StuGBot Context
import StuGBot from './components/StuGBot/StuGBot';  // ✅ StuGBot Component

// Protected Route Wrappers
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import TutorRoute from './components/TutorRoute';

// ============ PUBLIC PAGES ============
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TutorRegister from './pages/TutorRegister';

// ============ USER PAGES (Protected) ============
import Dashboard from './components/Dashboard';
import FindTutors from './pages/FindTutors';
import TutorProfile from './pages/TutorProfile';
import MyBookings from './pages/MyBookings';

// ============ TUTOR PAGES (Tutor Only) ============
import TutorDashboard from './pages/TutorDashboard';
import EditProfile from './pages/EditProfile';

// ============ ADMIN PAGES (Admin Only) ============
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTutors from './pages/admin/AdminTutors';
import AddTutor from './pages/admin/AddTutor';
import AdminBookings from './pages/admin/AdminBookings';
import PendingTutors from './pages/admin/PendingTutors';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MeetingProvider>
          <StuGBotProvider>  {/* ✅ Wraps entire app for StuGBot context */}
            
            {/* ============ ALL ROUTES ============ */}
            <Routes>
              
              {/* --- Public Routes --- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tutor-register" element={<TutorRegister />} />

              {/* --- User Routes (Protected) --- */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/find-tutors"
                element={
                  <ProtectedRoute>
                    <FindTutors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutor/:id"
                element={
                  <ProtectedRoute>
                    <TutorProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* --- Tutor Routes (Tutor Only) --- */}
              <Route
                path="/tutor-dashboard"
                element={
                  <TutorRoute>
                    <TutorDashboard />
                  </TutorRoute>
                }
              />
              <Route
                path="/tutor-dashboard/edit-profile"
                element={
                  <TutorRoute>
                    <EditProfile />
                  </TutorRoute>
                }
              />

              {/* --- Admin Routes (Admin Only) --- */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/tutors"
                element={
                  <AdminRoute>
                    <AdminTutors />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/tutors/add"
                element={
                  <AdminRoute>
                    <AddTutor />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/tutors/pending"
                element={
                  <AdminRoute>
                    <PendingTutors />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <AdminBookings />
                  </AdminRoute>
                }
              />

              {/* --- Catch All (404) --- */}
              <Route path="*" element={<Navigate to="/" replace />} />
              
            </Routes>

            {/* ✅ StuGBot Component - Outside Routes = Visible on ALL Pages */}
            <StuGBot />

          </StuGBotProvider>
        </MeetingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
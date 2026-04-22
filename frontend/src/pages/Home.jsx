import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                🎓
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Educircle</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-5 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Learn from the Best
            <br />
            <span className="text-blue-200">Tutors Online and Offline Services</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with expert tutors, learn at your own pace, and achieve your academic goals.
            Whether you're a student or parent, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg"
            >
              Start With Demo Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              I'm Already a Member
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-white">1000+</p>
              <p className="text-blue-200 mt-1">Expert Tutors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">5000+</p>
              <p className="text-blue-200 mt-1">Happy Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">4.9★</p>
              <p className="text-blue-200 mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Why Choose Educircle?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We provide the best learning experience with verified tutors and personalized attention
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-5">
                👨‍🏫
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Tutors</h3>
              <p className="text-gray-600">
                Learn from verified, experienced tutors across all subjects and levels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-5">
                📚
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Study Materials</h3>
              <p className="text-gray-600">
                Access comprehensive notes, resources, and learning materials.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-5">
                💬
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1-on-1 Sessions</h3>
              <p className="text-gray-600">
                Personalized online and offline sessions tailored to your needs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-5">
                📅
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Book sessions at your convenience with real-time availability.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-5">
                ⭐
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ratings & Reviews</h3>
              <p className="text-gray-600">
                Choose tutors based on verified ratings and student feedback.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-5">
                🔒
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-gray-600">
                Verified tutors, secure payments, and monitored sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Get started in 4 simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Sign Up', desc: 'Create your free account' },
              { num: '2', title: 'Find Tutors', desc: 'Search by subject & rating' },
              { num: '3', title: 'Book Session', desc: 'Schedule at your time' },
              { num: '4', title: 'Start Learning', desc: 'Achieve your goals' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Preview */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Popular Subjects
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Find expert tutors for a wide range of subjects
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'].map((subject, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-xl text-center shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100"
              >
                <p className="font-semibold text-gray-900">{subject}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/find-tutors"
              className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-1"
            >
              View All Subjects →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of students and parents who trust Educircle
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg"
            >
              Get Started for Free
            </Link>
            <Link
              to="/tutor-register"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              Become a Tutor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  🎓
                </div>
                <span className="text-xl font-bold">Educircle</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting students with expert tutors for personalized learning experiences.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/find-tutors" className="hover:text-white transition">Find Tutors</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">For Tutors</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/tutor-register" className="hover:text-white transition">Become a Tutor</Link></li>
                <li><a href="#" className="hover:text-white transition">Tutor Guidelines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📧 support@educircle.com</li>
                <li>📱 +91 9876543210</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 Educircle. MCA Final Year Project. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
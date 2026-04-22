import { useNavigate } from 'react-router-dom';

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Header: Avatar + Name + Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white font-bold">
            {tutor.name?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
            <p className="text-gray-600 text-sm">{tutor.experience || 0} years experience</p>
            {tutor.qualification && (
              <p className="text-indigo-600 text-sm font-medium">{tutor.qualification}</p>
            )}
          </div>
        </div>
        <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
          <span className="text-yellow-500 mr-1">⭐</span>
          <span className="font-bold text-yellow-700">{tutor.rating?.toFixed(1) || 'New'}</span>
          <span className="text-gray-500 text-sm ml-1">({tutor.totalReviews || 0})</span>
        </div>
      </div>

      {/* Bio */}
      {tutor.bio && (
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{tutor.bio}</p>
      )}

      {/* Subjects */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Subjects:</h4>
        <div className="flex flex-wrap gap-2">
          {tutor.subjects?.slice(0, 5).map((subject, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
            >
              {subject}
            </span>
          ))}
          {tutor.subjects?.length > 5 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{tutor.subjects.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Teaching Mode */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Teaching Mode:</h4>
        <div className="flex gap-2">
          {tutor.teachingMode?.map((mode, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                mode === 'Online' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {mode === 'Online' ? '🌐' : '📍'} {mode}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Pricing:</h4>
        <div className="space-y-1 text-sm">
          {tutor.hourlyRate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Per Hour:</span>
              <span className="font-semibold text-gray-900">₹{tutor.hourlyRate}</span>
            </div>
          )}
          {tutor.weeklyRate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Per Week:</span>
              <span className="font-semibold text-gray-900">₹{tutor.weeklyRate}</span>
            </div>
          )}
          {tutor.monthlyRate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Per Month:</span>
              <span className="font-semibold text-gray-900">₹{tutor.monthlyRate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate(`/tutor/${tutor._id}`)}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        View Profile & Book
      </button>
    </div>
  );
};

export default TutorCard;
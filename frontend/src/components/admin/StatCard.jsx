const StatCard = ({ title, value, icon, gradient }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-8 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-opacity-90 text-sm font-medium mb-1">{title}</p>
          <p className="text-5xl font-bold">{value}</p>
        </div>
        <div className="text-6xl opacity-30">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
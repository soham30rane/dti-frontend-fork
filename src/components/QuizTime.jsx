import React from 'react';

const TimerDisplay = ({ percentage }) => {
  const getColor = () => {
    if (percentage > 75) {
      return 'bg-green-400';
    } else if (percentage > 50) {
      return 'bg-yellow-400';
    } else if (percentage > 25) {
      return 'bg-orange-400';
    } else {
      return 'bg-red-400';
    }
  };

  return (
    <div className="flex items-center justify-center mt-4 mb-6">
      <div className="w-screen">
        <div className="w-10/12 mx-auto h-2 bg-gray-300 rounded-full overflow-hidden shadow-md">
          <div className={`h-full ${getColor()} rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;

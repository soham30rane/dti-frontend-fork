import React, { useState, useEffect, useMemo } from 'react';

const Leaderboard = ({ olderLeaderboardData, newerLeaderboardData }) => {
  // State to track if the device is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  

  // Effect to update isMobile when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures effect only runs once on mount

  // Sort the leaderboard data based on scores (highest first)
  olderLeaderboardData.sort((a, b) => b.score - a.score);
  newerLeaderboardData.sort((a, b) => b.score - a.score);

  // Find the maximum score
  const olderMaxScore = Math.max(...olderLeaderboardData.map(entry => entry.score));
  const newerMaxScore = Math.max(...newerLeaderboardData.map(entry => entry.score));
  const newBoard1 = JSON.parse(JSON.stringify(newerLeaderboardData))
  for(let i=0;i<newBoard1.length;i++){
    let x = olderLeaderboardData.find(item => item.username === newBoard1[i].username)
    newBoard1[i].score = (x ? x.score : 0)
  }

  // State to hold the currently displayed leaderboard data
  const [displayedLeaderboardData, setDisplayedLeaderboardData] = useState(newBoard1);

  // Calculate padding based on isMobile
  const padding = useMemo(() => (isMobile ? 'px-3' : 'px-6'), [isMobile]);

  // Use CSS transition to animate score transition from older to newer leaderboard
  useEffect(() => {
    // Trigger the animation after a delay (adjust duration as needed)
    const delay = setTimeout(() => {
      // Display the newer leaderboard data
      setDisplayedLeaderboardData(newerLeaderboardData);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className={`bg-gray-100 rounded-lg shadow-lg overflow-hidden ${isMobile ? 'w-full mr-2' : 'w-4/6 mx-auto mt-8'}`}>
      <h2 className={`font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text ${isMobile ? "text-2xl p-3" : "text-3xl p-6"}`}>
        Quiz 1521
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className={`py-3 ${padding} text-left`}>#</th>
              <th className={`py-3 ${padding} text-left`}>Username</th>
              <th className={`py-3 ${padding} text-center`}>Score</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {displayedLeaderboardData.map((entry, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                <td className={`py-3 ${padding} text-left whitespace-nowrap`}>{index + 1}</td>
                <td className={`py-3 ${padding} text-left`}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{entry.username}</span>
                </td>
                <td className={`py-3 ${padding} text-left ${isMobile ? "w-full" : "w-3/4"}`}>
                  <div className="flex items-center">
                    <span className="font-semibold mr-3">{entry.score}</span>
                    <div className="w-full  rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 h-full rounded-full"
                        style={{
                          width: `${(entry.score / newerMaxScore) * 100}%`,
                          transition: 'width 1s ease-in-out' // CSS transition for width change
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;

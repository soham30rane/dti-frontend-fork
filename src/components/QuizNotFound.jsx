import React from 'react';
import notFoundIcon from './assets/icons8-not-found-100.png'

const QuizNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-400 to-pink-600">
      <img src={notFoundIcon} alt="Not found" />
      <h1 className="text-5xl font-semibold mb-2 text-center">Quiz Not Found</h1>
      <p className="text-gray-700 text-lg text-center">Oops! We couldn't find the quiz you're looking for.</p>
    </div>
  );
};

export default QuizNotFound;

import React from 'react';
import waitImg from './assets/icons8-waiting.gif'

const QuizNotStarted = ({ quizCode,title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen m-auto bg-gradient-to-r from-blue-400 to-purple-600">
      <img src={waitImg} alt="Wait" className='m-6'/>
      <h1 className="text-5xl font-semibold mb-2 text-center">Quiz Not Started</h1>
      <p className="text-gray-700 text-lg text-center mb-4">The quiz {`'${title}'`} with code <span className="font-semibold">{quizCode}</span> has not started yet.</p>
    </div>
  );
};

export default QuizNotStarted;

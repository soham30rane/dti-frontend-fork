import React, { useState, useEffect } from 'react';
import TimerDisplay from './QuizTime';
import { socket } from '../socket';

const QuizQuestion = ({ question,roomcode }) => {
  const { questionText, options, correctIndex,q_index } = question;
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const totalTime = 9; // Total time in seconds

  useEffect(() => {
    console.log('Elapsed time:', elapsedTime);
    const timer = setInterval(() => {
      if (!answered) {
        setElapsedTime((prevTime) => prevTime + 0.1);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [answered, elapsedTime]);

  const handleOptionSelect = (index) => {
    if (!answered) {
      setSelectedOption(index);
      setAnswered(true);
      let token = localStorage.getItem('user')
      console.log('Delta factor : ',getPercentageRemaining())
      const delta = (100 - getPercentageRemaining()) * -0.01 * 0.5; // Minimum score for right answer 50%
      console.log(delta)
      console.log('answer',roomcode,q_index,index,token,delta)
      socket.emit('answer',roomcode,q_index,index,token,delta)
    }
  };

  const getOptionStyle = (index) => {
    if (answered) {
      if (index === correctIndex) {
        return selectedOption === index ? 'bg-green-500 text-white' : '';
      } else {
        return selectedOption === index ? 'bg-red-500 text-white' : '';
      }
    }
    return '';
  };

  const getPercentageRemaining = () => {
    return ((totalTime - elapsedTime) / totalTime) * 100;
  };

  console.log('Percentage remaining:', getPercentageRemaining());

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-indigo-600">
      <TimerDisplay percentage={getPercentageRemaining()} />
      <h1 className="text-3xl font-semibold text-white mb-6 text-center mt-6">{questionText}</h1>
      <div className="grid grid-cols-1 gap-4 mx-3 my-3">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-full py-4 px-8 rounded-lg font-semibold text-lg focus:outline-none border border-gray-300 ${getOptionStyle(index)} transition duration-500 ease-in-out ${answered&& correctIndex === index ? 'bg-green-500 text-white':''}`}
            onClick={() => handleOptionSelect(index)}
            disabled={answered && selectedOption !== index}
            style={{display:`${option === ''?'none':''}`}}
          >
            {option}
          </button>
        ))}
      </div>
      {answered && (
        <div className="mt-8">
          <p className="text-white font-semibold">
            {selectedOption === correctIndex ? 'Correct! 🎉' : 'Incorrect! ❌'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;

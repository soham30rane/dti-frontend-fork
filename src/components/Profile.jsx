import React, { useEffect, useState } from 'react';

export default function Profile() {
    const [quizzes, setQuizzes] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        document.body.style.minHeight = '100vh'
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    },[]);

    const getProfile = async () => {
        const token = localStorage.getItem('user');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
        const data = await response.json();
        console.log(data.quizes);
        setQuizzes(data.quizes);
    };

    const startQuiz = async (quiz) => {
        if(quiz.completed){
            window.location.href = '/quiz/' + quiz.code;
            return;
        }

        if(quiz.started){
            window.location.href = '/quiz/' + quiz.code;
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/start/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('user'),
            },
            body: JSON.stringify({ code: quiz.code }),
        });
        const data = await response.json();
        console.log(data);
        if (data.error) {
            alert(data.message);
        } else {
            window.location.href = '/profile';
        }
    };

    useEffect(() => {
        getProfile();
    },[]);

    return (
        <div className='w-screen min-h-screen bg-gradient-to-r from-blue-400 to-green-300' >
            <div className={`profile ${isMobile?'':'w-4/6'} mx-auto`} style={{ padding: '20px' }}>
                <h1 className="profile-name text-4xl font-bold m-6" style={{ color: 'darkblue' }}>
                    {'Your quizzes'}
                </h1>
                <div className="quiz-list">
                    {quizzes.length === 0?<div className='text-center text-gray-800 text-lg font-semibold py-4' > You don't have any Quizes </div>:<></>}
                    {quizzes.map((quiz, index) => (
                        <div
                        key={index}
                        className="flex justify-between items-center p-4 border border-gray-800 bg-blue-200 mb-4 rounded-lg shadow-md hover:bg-blue-300 transition-colors duration-300 ease-in-out"
                    >
                        <h3 className={`${isMobile?'text-md':'text-xl'} text-white font-bold mx-2`}>{quiz.title}</h3>
                        <span className={`${isMobile?'text-xs':'text-sm'} text-gray-600 mx-2`}>{quiz.code}</span>
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isMobile?'w-1/3':''}`}
                            onClick={() => startQuiz(quiz)}
                        >
                            <span className={`${isMobile?'text-sm':''}`}>{quiz.started?`${quiz.completed?"View Results":"View Live"}`:"Start Quiz"}</span>
                        </button>
                    </div>
                    
                    ))}
                </div>
            </div>
        </div>
    );
}

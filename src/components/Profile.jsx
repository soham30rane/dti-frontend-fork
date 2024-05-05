import React, { useEffect, useState } from 'react';

export default function Profile() {
    const [quizzes, setQuizzes] = useState([]);
    const [username, setUsername] = useState('');

    const getProfile = async () => {
        const token = localStorage.getItem('user');
        const response = await fetch('http://localhost:5000/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
        const data = await response.json();
        console.log(data.quizzes);
        setQuizzes(data.quizzes[0]);
        setUsername(data.user.username);
        console.log(quizzes);
    };

    const startQuiz = async (quiz) => {
        const response = await fetch(`http://localhost:5000/quiz/start/`, {
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
            window.location.href = '/quiz/' + quiz.code;
        }
    };

    useEffect(() => {
        getProfile();
    });

    return (
        <div className="profile" style={{ padding: '20px' }}>
            <h1 className="profile-name" style={{ color: 'darkblue', fontSize: '24px' }}>
                {'Your quizzes'}
            </h1>
            <div className="quiz-list">
                {quizzes.map((quiz, index) => (
                    <div
                        key={index}
                        className="quiz"
                        style={{
                            backgroundColor: 'lightblue',
                            marginBottom: '10px',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            border: '1px solid black',
                        }}
                    >
                        <h3 style={{ fontSize: '18px', color: 'white' }}>{quiz.title}</h3>
                        <button
                            className="start-quiz-button"
                            style={{
                                backgroundColor: 'blue',
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                border: 'none',
                            }}
                            onClick={() => {
                                startQuiz(quiz);
                            }}
                        >
                            Start Quiz
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

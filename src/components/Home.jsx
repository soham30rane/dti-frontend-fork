import React, { useEffect, useState } from 'react';
import './css/Home.css';

export default function Home() {
    const [username, setUsername] = useState('');
    const [quizcode, setQuizcode] = useState('');
    const getprofile = async () => {
        const token = localStorage.getItem('user');
        const response = await fetch('http://localhost:5000/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        const data = await response.json();
        console.log(data);
        if(data.user) setUsername(data.user.username);
        else window.location.href = '/login'
    }
    useEffect(() => {    
        getprofile();
    }, []);

    const handleNewQuiz = () => {
        // Logic for creating a new quiz
        window.location.href = '/create';
    };

    const handleJoinQuiz = () => {
        // Logic for joining a quiz
        if (quizcode.length !== 11) {
            return;
        }
    };
    const changequizcode = (e) => {
        setQuizcode(e.target.value);
    }
    return (
        <div className="user-options">
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600">
                <h1 className="text-6xl text-white mb-4">Hi, {username}</h1>
                <div className="flex items-center">
                    <button className="new-quiz btn btn-secondary" onClick={handleNewQuiz}>Create Quiz</button>
                    <h2 className="text-3xl text-white mx-4">or</h2>
                    <input
                        type="text"
                        className="input join-input"
                        placeholder="Enter quiz code to join"
                        value={quizcode}
                        onChange={changequizcode}
                    />
                    <button
                        className={quizcode.length === 0 ? "join-quiz disabled-button mx-3" : "join-quiz btn btn-secondary mx-3"}
                        onClick={handleJoinQuiz}
                    >
                        Join Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}


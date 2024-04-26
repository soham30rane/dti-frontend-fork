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
        setUsername(data.user.username);
    }
    useEffect(() => {
        getprofile();
    }, []);

    const handleNewQuiz = () => {
        // Logic for creating a new quiz
    };

    const handleJoinQuiz = () => {
        // Logic for joining a quiz
        if(quizcode.length!==11){
            return;
        }
    };

    return (
        <div>
            <div className="user-options">
                <div className='welcome'>Hi, {username}</div>
                <div>
                <button className="new-quiz" onClick={handleNewQuiz}>New Quiz</button>
                <input type="text" className="join-input" placeholder="Enter quiz code to join" />
                <button className={quizcode.length==0?"join-quiz disabled-button":"join-quiz"} onClick={handleJoinQuiz}>Join Quiz</button></div>
            </div> 
            <div className="about-quest"></div>
        </div>
    );
}

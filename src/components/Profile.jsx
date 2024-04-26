import React, { useEffect, useState } from 'react'

export default function Profile() {
    const [quizes, setQuizes] = useState([]);
    const loadQuizes = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            return;
        }
        const response = await fetch('http://localhost:5000/user/quizes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        const data = await response.json();
        console.log(data);
        setQuizes(data.quizes);
    }
    const [username, setUsername] = useState('');
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
    const startquiz = async (quiz) => {
        const response = await fetch(`http://localhost:5000/quiz/start/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('user')
            },
            body: JSON.stringify({ code: quiz.code })
        })
        const data = await response.json();
        console.log(data);
        if (data.error) {
            alert(data.message);
        } else {
            window.location.href = '/quiz/' + quiz.code;
        }
    }
    useEffect(() => {
        getprofile();
        // loadQuizes();
    }, [])
    return (
        <div className="profile" style={{ padding: '20px' }}>
            <h1 className="profile-name" style={{ color: 'darkblue', fontSize: '24px' }}>{username}</h1>
            <div className="quiz-list">
                {quizes.map((quiz) => (
                    <div className="quiz" key={quiz.id} style={{
                        backgroundColor: 'lightblue',
                        marginBottom: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'space-between',
                        alignContent: 'space-between',
                        padding: '10px',
                        border: '1px solid black'
                    }}> 
                        <h3 style={{
                            fontSize: '18px'
                        }}>{quiz.title}</h3>
                        <button className="start-quiz-button" style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', borderRadius: '5px', border: 'none' }} onClick={()=>{
                            startquiz(quiz);
                        }}>Start Quiz</button>
                    </div>
                ))}
            </div>
        </div>

    );
}

import React, { useEffect } from 'react'
import { useState } from 'react'
import './css/Login.css'
import bgimage from './assets/loginbg.png'

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setusername] = useState('');
    const [errormessage, setmessage] = useState('');
    const handleRegister = async () => {
        const response = await fetch('http://localhost:5000/user/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'breakanti'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username
            })
        });
        const data = await (response).json();
        console.log(data);
        if(data.error){
            setmessage(data.message);
        }else{
            localStorage.setItem('user',data.token);
            window.location.href = "/";
        }
    }
    window.onkeydown = (e) => {
        if(e.key === "Enter"){
            handleRegister();
        }
    }
    useEffect(()=>{
        document.querySelector('body').style.backgroundImage = `url(${bgimage})`
    },[])

    return (
        <div className="container" style={{
            // backgroundImage: bgimage,
        }}>
            <div className="box">
                <h1 className="title">Register</h1>
                <div style={{
                    color: 'red',
                    textAlign: 'center',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                }}>{errormessage}</div>
                <form>
                    <div className="inputs">
                        <div className="input emailinput">
                            <input type="text" className='login-input' placeholder="Username" required value={username} onChange={(e)=>{
                                setusername(e.target.value);
                            }}/>
                        </div>
                        <div className="input emailinput">
                            <input type="Email" className='login-input' placeholder="Email" required value={email} onChange={(e)=>{
                                setEmail(e.target.value);
                            }}/>
                        </div>
                        <div className="input">
                            <input type="password" className="login-input" placeholder="Password" value={password} required onChange={(e)=>{
                                setPassword(e.target.value);
                            }}/>
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="login-button register" type="button" onClick={()=>{
                            handleRegister();
                        }}>Register</button>
                        <button className="login-button disable signin" type="button" onClick={()=>{
                            window.location.href = "/login";
                        }}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

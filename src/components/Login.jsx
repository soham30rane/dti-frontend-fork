import React, { useEffect } from 'react'
import { useState } from 'react'
import './css/Login.css'
import bgimage from './assets/loginbg.png'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setmessage] = useState('');
    const handleLogin = async () => {
        const response = await fetch('http://localhost:5000/user/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'breakanti'
            },
            body: JSON.stringify({
                email: email,
                password: password,
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
            handleLogin();
        }
    }

    useEffect(() => {
        // document.querySelector('body').style.width = '100vw'
        document.querySelector('body').style.backgroundImage = `url(${bgimage})`
    },[])

    return (
        <div className="container" style={{
            // backgroundImage: bgimage,
        }}>
            <div className="box">
                <h1 className="title">Login</h1>
                <div style={{
                    color: 'red',
                    textAlign: 'center',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                }}>{errormessage}</div>
                <form>
                    <div className="inputs">
                        <div className="input emailinput">
                            <input className='login-input' type="Email" placeholder="Email" required value={email} onChange={(e)=>{
                                setEmail(e.target.value);
                            }}/>
                        </div>
                        <div className="input">
                            <input className='login-input' type="password" placeholder="Password" value={password} required onChange={(e)=>{
                                setPassword(e.target.value);
                            }}/>
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="login-button" type="button"onClick={()=>{
                            handleLogin();
                        }}>Login</button>
                        <button className="disable signup login-button" type="button"onClick={()=>{
                            window.location.href = "/register";
                        }}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

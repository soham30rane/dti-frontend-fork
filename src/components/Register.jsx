import React, { useEffect } from 'react'
import { useState } from 'react'
import './css/Login.css'
import bgimage from './assets/loginbg.png'
import { confirmAlert } from 'react-confirm-alert'; // Import

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setusername] = useState('');
    const [errormessage, setmessage] = useState('');
    const [otpVal,setOtpVal] = useState('')
    const [showOtpBox,setShowOtpBox] = useState(false)

    const isValidEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const sendOTP = async () => {
        console.log('Sending otp')
        if(!isValidEmail()){ setmessage("Please enter valid email");return;}
        if(password.length < 4){ setmessage('Password is too short');return;}
        if(!username){setmessage('Username required');return;}
        setmessage('')
        // send the otp
        confirmAlert({
            title: 'Send otp',
            message: `An OTP will be sent on email ${email} . Ensure your email is correct `,
            buttons: [
              {
                label: 'Send OTP',
                onClick: async () => {
                    try {
                        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/sendOtp`,{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'breakanti'
                            },
                            body: JSON.stringify({
                                email: email
                            })       
                        })
                        const data = await (response).json();
                        setmessage(data.message)
                        if(data.error) { 
                            console.log(data)
                            return
                        }
                        setShowOtpBox(true)
                    } catch(err){
                        setmessage('Unable to send otp')
                        console.log(err)
                    }
                },
                style : { backgroundColor: 'rgb(68, 68, 240) ', color: 'white ' },
              },
              {
                label: 'Cancel',
                onClick: () => {
                    console.log("otp cancelled")
                } 
              }
            ]
          });
    }

    const handleVerify = async () => {
        if(password.length < 4){ setmessage('Password is too short');return;}
        if(!username){setmessage('Username required');return;}
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/register`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'breakanti'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    username: username,
                    userOtp : otpVal
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
        } catch(err){
            setmessage('Server error')
            return
        }
    }
    window.onkeydown = (e) => {
        if(e.key === "Enter"){
            if(showOtpBox){
                sendOTP()
            } else {
                handleVerify()
            }
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
                        {showOtpBox && <div className="input">
                            <input type="number" className="login-input" placeholder="Enter OTP" value={otpVal} required onChange={(e)=>{
                                setOtpVal(e.target.value);
                            }}/>
                        </div>}
                    </div>
                    <div className="buttons">
                        <button className={`login-button register`} type="button" onClick={()=>{
                            if(showOtpBox){
                                handleVerify()
                            } else {
                                sendOTP()
                            }
                        }}>{showOtpBox ? 'Verify' : 'Register'}</button>
                        <button className="login-button disable signin" type="button" onClick={()=>{
                            window.location.href = "/login";
                        }}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

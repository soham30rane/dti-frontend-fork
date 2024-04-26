import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {IoLogOutOutline} from 'react-icons/io5';
import { useState} from 'react';
import './css/Navbar.css';

const Navbar = () => {
    const [username, setUsername] = useState('');
    const getprofile = async () => {  
        const token = localStorage.getItem('user');
        if(!token){
             return;
        }
        const response = await fetch('http://localhost:5000/user/profile',{
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
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    useEffect(() => {
        getprofile();
    }, [])
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <a href='/'>Quest</a>
            </div>
            {localStorage.getItem('user')?<div className="navbar-user">
                <span className="navbar-username" onClick={()=>{
                    window.location.href = '/profile';
                }}>{username}</span>
                <span className="navbar-logout-icon" onClick={()=>{
                    handleLogout();
                }}>{<IoLogOutOutline/>}</span>
            </div>:<></>}
        </nav>
    );
};

export default Navbar;
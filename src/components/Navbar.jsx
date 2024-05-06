import React, { useEffect, useState } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import './css/Navbar.css';
import successIcon from "./assets/icons8-success-16.png";
import errorIcon from "./assets/icons8-error-32.png";
import { Tooltip } from '@material-tailwind/react';

const Navbar = ({ connection }) => {
    const [username, setUsername] = useState('');

    const getProfile = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            return;
        }
        const response = await fetch('http://localhost:5000/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const data = await response.json();
        setUsername(data.user.username);
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-logo px-5">
                <a href='/'>Quest</a>
            </div>
            <div className='px-2 mx-2'>
                {connection?
                <Tooltip content="Server connection successful" placement="right">
                <img src={successIcon} alt="" />
                </Tooltip>:
                <Tooltip content="Server connection failed" placement="right">
                <img src={errorIcon} alt="" />
                </Tooltip>
                }
            </div>
            {localStorage.getItem('user') &&
                <div className="navbar-user">
                    <span className="navbar-username btn mx-4" onClick={() => window.location.href = '/profile'}>
                        {username}
                    </span>
                    <span className="navbar-logout-icon btn rounded-full" onClick={handleLogout}>
                        <IoLogOutOutline />
                    </span>
                </div>
            }
        </nav>
    );
};

export default Navbar;

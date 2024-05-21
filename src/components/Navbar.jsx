import React, { useEffect, useState } from 'react';
import { IoPersonOutline,IoLogOutOutline } from 'react-icons/io5';
import './css/Navbar.css';
import successIcon from "./assets/icons8-success-16.png";
import errorIcon from "./assets/icons8-error-32.png";
import { Tooltip } from '@material-tailwind/react';

const Navbar = ({ connection }) => {
    const [username, setUsername] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(()=>{
        if(window.location.host === 'main--mellow-sprite-c623cb.netlify.app'){
            window.location.href = 'https://the-quest.tech'
        }
    },[])

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    const getProfile = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await response.json();
            setUsername(data.user.username);
        } catch(err) {
            console.log(err);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    useEffect(() => {
        getProfile();
    }, []);

    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo px-5">
                <a href='/'>Quest</a>
            </div>
            <div className='px-2 mx-2'>
                {connection?
                <Tooltip content="Server connection successful" placement={isMobile?'bottom':'right'} offset={isMobile?25:5}>
                <img src={successIcon} alt="" />
                </Tooltip>:
                <Tooltip content="Server starting up. Please wait a moment. This might take up to 30 seconds. Refresh to try again" placement={isMobile?'bottom':'right'} open={true} offset={isMobile?25:5}>
                <img src={errorIcon} alt="" />
                </Tooltip>
                }
            </div>
            {localStorage.getItem('user') && connection && username!=='' &&
                <div className="navbar-user">
                    <button
                        style={{ backgroundColor: '#2563EB', color: '#FFFFFF', padding: '0.5rem 1rem', borderRadius: '0.375rem', transition: 'background-color 0.3s' }}
                        className="btn mx-4 hover:bg-blue-600"
                        onClick={() => (window.location.href = '/profile')}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#1E40AF'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#2563EB'; }}
                    >
                        Dashboard
                    </button>
                    <span className="navbar-logout-icon btn rounded-full" onClick={toggleMenu}>
                        <IoPersonOutline/>
                    </span>
                    {showMenu && (
                        <div className="absolute right-0 mx-3 mt-40 w-48 bg-white rounded-md shadow-lg z-10">
                            <div className="px-4 py-2 border-b border-gray-300">
                                <span className="block text-gray-700 text-center">{username}</span>
                            </div>
                            <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
                                <IoLogOutOutline className="mx-2" />
                                <span>Sign out</span>
                            </div>
                        </div>
                    )}
                </div>
            }
        </nav>
    );
};

export default Navbar;

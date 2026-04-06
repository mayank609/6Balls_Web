import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

import './OpeningScreen.css';

const OpeningScreen = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    
    const handleGoogleLogin = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://api.6balls.live';
        window.location.href = `${apiUrl}/api/auth/player/login`;
    };

    return (
        <div className={`opening ${mounted ? 'opening--mounted' : ''}`}>
            <div className="opening__bg"></div>
            <div className="opening__gradient"></div>

            <button className="opening__theme-btn glass" onClick={() => { }}>
                <Settings size={20} color="var(--color-primary)" />
            </button>

            <div className="opening__bottom">
                <div className="opening__card glass">
                    <h1 className="opening__title">Welcome to 6BALLS</h1>
                    <p className="opening__subtitle">Play each ball and win</p>

                    <button className="opening__login-btn" onClick={handleGoogleLogin}>
                        <div className="opening__login-icon">
                            <img src="/assets/google-icon.svg" alt="Google" width={20} height={20} />
                        </div>
                        <span className="opening__login-text">Login with Google</span>
                    </button>

                    <p className="opening__signup">
                        Don't have an account? <span onClick={() => navigate('/login')}>SignUp</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OpeningScreen;

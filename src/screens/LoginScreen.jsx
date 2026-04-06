import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import './LoginScreen.css';

const LoginScreen = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://api.6balls.live';
        window.location.href = `${apiUrl}/api/auth/player/login`;
    };

    return (
        <div className="login">
            <div className="login__bg"></div>
            <div className="login__gradient"></div>

            <div className="login__content">
                <div className="login__topbar">
                    <button className="login__back-btn" onClick={() => navigate('/')}>
                        <ChevronLeft size={24} />
                    </button>
                </div>

                <div className="login__spacer" />

                <div className="login__hero">
                    <h1>GET YOUR</h1>
                    <h1>HEAD IN</h1>
                    <div className="login__badge">THE GAME</div>
                    <p className="login__hero-sub">Login or Sign Up with 6BALLS.</p>
                </div>

                <div className="login__spacer" />

                <div className="login__card glass">
                    <button
                        className="login__google-btn glass"
                        onClick={handleGoogleLogin}
                    >
                        <img 
                            src="/assets/google-icon.svg" 
                            alt="Google" 
                            className="login__google-icon"
                        />
                        <span>Continue with Google</span>
                    </button>
                    <p className="login__terms">By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;

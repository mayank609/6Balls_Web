import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './LoginScreen.css';

const LoginScreen = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');

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
                    <div className="login__input-row glass">
                        <span className="login__flag">🇮🇳</span>
                        <input
                            type="tel"
                            placeholder="Enter Mobile Number"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="login__input"
                        />
                    </div>

                    <button
                        className="login__submit-btn"
                        onClick={() => navigate('/otp', { state: { phone } })}
                    >
                        Send OTP
                    </button>

                    <div className="login__divider">
                        <span className="login__line" />
                        <span className="login__or">OR</span>
                        <span className="login__line" />
                    </div>

                    <div className="login__social-row">
                        <button className="login__social-btn glass">G</button>
                        <button className="login__social-btn glass">f</button>
                        <button className="login__social-btn glass">🍎</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './OtpScreen.css';

const OtpScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const phone = location.state?.phone || '9509 666 777';
    const [otp, setOtp] = useState('');
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleChange = (val) => {
        if (val.length <= 4 && /^\d*$/.test(val)) setOtp(val);
    };

    return (
        <div className="otp">
            <div className="otp__bg"></div>
            <div className="otp__gradient"></div>

            {/* Hidden actual input */}
            <input
                ref={inputRef}
                type="tel"
                maxLength={4}
                value={otp}
                onChange={e => handleChange(e.target.value)}
                className="otp__hidden-input"
                autoFocus
            />

            <div className="otp__content">
                <div className="otp__topbar">
                    <button className="otp__back-btn" onClick={() => navigate('/login')}>
                        <ChevronLeft size={24} />
                    </button>
                </div>

                <div className="otp__spacer" />

                <div className="otp__header">
                    <h1>ACCOUNT</h1>
                    <div className="otp__verify-badge">VERIFICATION</div>
                </div>

                <div className="otp__spacer" />

                <div className="otp__card glass">
                    <p className="otp__desc">
                        We've sent a 4-digit code to<br />
                        <span className="otp__phone">+91 {phone}</span>
                    </p>

                    <div className="otp__boxes" onClick={() => inputRef.current?.focus()}>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className={`otp__box ${otp[i] ? 'otp__box--filled' : ''}`}>
                                {otp[i] || <span className="otp__dash" />}
                            </div>
                        ))}
                    </div>

                    <button
                        className={`otp__verify-btn ${otp.length === 4 ? 'otp__verify-btn--active' : ''}`}
                        disabled={otp.length !== 4}
                        onClick={() => navigate('/onboarding')}
                    >
                        VERIFY CODE
                    </button>

                    <div className="otp__resend">
                        <span>Didn't receive?</span>
                        <button className="otp__resend-btn">RESEND</button>
                    </div>
                </div>

                <div className="otp__spacer otp__spacer--lg" />

                <h2 className="otp__brand">6BALLS</h2>
            </div>
        </div>
    );
};

export default OtpScreen;

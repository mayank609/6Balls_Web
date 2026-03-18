import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingScreen.css';

const OnboardingScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        inviteCode: ''
    });

    const handleComplete = () => {
        if (formData.name && formData.username) {
            navigate('/lobby');
        }
    };

    return (
        <div className="onboard">
            <div className="onboard__bg" />

            <div className="onboard__content">
                <h1 className="onboard__title">COMPLETE YOUR PROFILE</h1>
                <div className="onboard__bar" />

                <div className="onboard__card glass">
                    <p className="onboard__subtitle">The first step to glory</p>

                    <div className="onboard__field">
                        <label>Full Name</label>
                        <input
                            placeholder="e.g. MS Dhoni"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="onboard__field">
                        <label>Username</label>
                        <input
                            placeholder="CoolCaptain7"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="onboard__field">
                        <label>Invite Code</label>
                        <input
                            placeholder="Optional"
                            value={formData.inviteCode}
                            onChange={e => setFormData({ ...formData, inviteCode: e.target.value })}
                        />
                    </div>

                    <button
                        className={`onboard__btn ${formData.name && formData.username ? 'onboard__btn--active' : ''}`}
                        onClick={handleComplete}
                        disabled={!formData.name || !formData.username}
                    >
                        START PLAYING
                    </button>
                </div>

                <p className="onboard__footer">Joining 5M+ Cricket Fans</p>
            </div>
        </div>
    );
};

export default OnboardingScreen;

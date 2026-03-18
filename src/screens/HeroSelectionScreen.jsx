import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import './HeroSelectionScreen.css';

const HeroSelectionScreen = () => {
    const navigate = useNavigate();
    const [selectedHero, setSelectedHero] = useState(null);

    return (
        <div className="hero-selection">
            <div className="hero-selection__bg"></div>
            <div className="hero-selection__gradient"></div>

            {/* Topbar */}
            <header className="hero-topbar">
                <button className="hs-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="hs-title">SELECT YOUR HERO</h1>
                <div style={{ width: 44 }}></div>
            </header>

            <main className="hs-content">
                <div className="hs-headings">
                    <span className="hs-subtitle">WHO WILL WIN?</span>
                    <h2 className="hs-main-heading">Pick your Hero</h2>
                </div>

                <div className="hs-reward-box">
                    <Star size={20} className="hs-star-icon" />
                    <span>Get 50 Coins for correct prediction!</span>
                </div>

                <div className="hs-cards-container">
                    <button
                        className={`hs-hero-card ${selectedHero === 'batsman' ? 'hs-hero-card--selected' : ''}`}
                        onClick={() => setSelectedHero('batsman')}
                    >
                        <div className="hs-image-circle">
                            <div className="hs-image-mask hs-image-mask--bat"></div>
                        </div>

                        <span className="hs-hero-title">BATSMAN</span>
                        <div className="hs-hero-target">
                            <span>Target &gt; 7.0</span>
                        </div>
                    </button>

                    <button
                        className={`hs-hero-card ${selectedHero === 'bowler' ? 'hs-hero-card--selected' : ''}`}
                        onClick={() => setSelectedHero('bowler')}
                    >
                        <div className="hs-image-circle">
                            <div className="hs-image-mask hs-image-mask--bowl"></div>
                        </div>

                        <span className="hs-hero-title">BOWLER</span>
                        <div className="hs-hero-target">
                            <span>Target &lt; 7.0</span>
                        </div>
                    </button>
                </div>

                <div style={{ flex: 1 }}></div>

                <button
                    className="hs-lock-btn"
                    disabled={!selectedHero}
                    onClick={() => navigate('/play')}
                >
                    LOCK SELECTION
                </button>
            </main>
        </div>
    );
};

export default HeroSelectionScreen;

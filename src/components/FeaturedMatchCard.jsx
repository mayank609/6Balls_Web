import React, { useState, useEffect } from 'react';
import InterstellarVSShield from './InterstellarVSShield';
import './FeaturedMatchCard.css';

const outcomes = [
    'DUCK', 'DOT BALL', 'DOT BALL', 'BOWLED!', 'CAUGHT!',
    '1 RUN', '1 RUN', '2 RUNS', '2 RUNS', '4 RUNS',
    '4 RUNS', 'SIX!', 'SIX!', 'CAUGHT!'
];

const FeaturedMatchCard = () => {
    const [outcome, setOutcome] = useState('');
    const [showOutcome, setShowOutcome] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const randOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            setOutcome(randOutcome);
            setShowOutcome(false);
            setProgress(0);

            // Animate progress over 4 seconds
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const p = Math.min(elapsed / 4000, 1);
                setProgress(p);
                if (p >= 0.75) setShowOutcome(true);
                if (p < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }, 4500);

        // Initial trigger
        const randOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        setOutcome(randOutcome);
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const p = Math.min(elapsed / 4000, 1);
            setProgress(p);
            if (p >= 0.75) setShowOutcome(true);
            if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        return () => clearInterval(interval);
    }, []);

    const isSpecial = outcome.includes('SIX') || outcome.includes('4');

    return (
        <div className="featured-match-card glow-primary">
            {/* Animated background gradient */}
            <div className="featured-card-bg"></div>
            <div className="featured-card-gradient"></div>

            <div className="featured-card-content">
                {/* Top row */}
                <div className="featured-top-row">
                    <div className="league-badge glass-panel">
                        <span>SUPER LEAGUE 2026</span>
                    </div>
                    <div className="live-tag">
                        <div className="live-dot"></div>
                        <span>LIVE</span>
                    </div>
                </div>

                {/* Teams Row */}
                <div className="featured-teams-row">
                    <div className="team-unit">
                        <div className="team-avatar">
                            <span>MI</span>
                        </div>
                        <span className="team-city">MUMBAI</span>
                        <span className="team-score">172/6</span>
                    </div>

                    <InterstellarVSShield size={60} />

                    <div className="team-unit">
                        <div className="team-avatar">
                            <span>CSK</span>
                        </div>
                        <span className="team-city">CHENNAI</span>
                        <span className="team-score">84/2</span>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="featured-bottom-row">
                    <div className="prize-info">
                        <span className="prize-label">PRIZE POOL</span>
                        <span className="prize-value">80 CRORE COINS</span>
                    </div>
                    <button className="play-now-btn">
                        PLAY NOW
                    </button>
                </div>
            </div>

            {/* Outcome Overlay */}
            {showOutcome && (
                <div className="outcome-overlay">
                    <span className={`outcome-text ${isSpecial ? 'outcome-special' : ''}`}>
                        {outcome}
                    </span>
                </div>
            )}
        </div>
    );
};

export default FeaturedMatchCard;

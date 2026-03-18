import React from 'react';
import './InterstellarVSShield.css';

const InterstellarVSShield = ({ size = 60 }) => {
    return (
        <div className="vs-shield" style={{ width: size, height: size }}>
            {/* Cosmic Glow */}
            <div className="vs-cosmic-glow"></div>
            {/* Outer rotating ring */}
            <div className="vs-outer-ring">
                <div className="vs-ring-dot"></div>
            </div>
            {/* Inner ring */}
            <div className="vs-inner-ring"></div>
            {/* Core Orb */}
            <div className="vs-core-orb">
                <span className="vs-text" style={{ fontSize: size * 0.3 }}>VS</span>
            </div>
        </div>
    );
};

export default InterstellarVSShield;

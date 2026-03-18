import React from 'react';
import { Menu, Star } from 'lucide-react';
import './PremiumHomeAppBar.css';

const PremiumHomeAppBar = ({ onNavigationIconClick }) => {
    return (
        <div className="premium-app-bar">
            <div className="app-bar-left">
                <button onClick={onNavigationIconClick} className="nav-icon-btn">
                    <Menu size={24} color="var(--color-text-primary)" />
                </button>
            </div>

            <div className="app-bar-center">
                <h1 className="app-bar-title">6BALLS</h1>
            </div>

            <div className="app-bar-right">
                <div className="coin-container glass-panel">
                    <Star size={16} fill="var(--color-secondary)" color="var(--color-secondary)" />
                    <span className="coin-count">540</span>
                </div>
            </div>
        </div>
    );
};

export default PremiumHomeAppBar;

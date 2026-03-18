import React from 'react';
import InterstellarVSShield from './InterstellarVSShield';
import { Bell } from 'lucide-react';
import './VividMatchCard.css';

const matchData = [
    { team1: 'IND', city1: 'India', team2: 'PAK', city2: 'Pakistan' },
    { team1: 'AUS', city1: 'Australia', team2: 'ENG', city2: 'England' },
    { team1: 'SA', city1: 'South Africa', team2: 'NZ', city2: 'New Zealand' },
    { team1: 'WI', city1: 'West Indies', team2: 'SL', city2: 'Sri Lanka' },
    { team1: 'BAN', city1: 'Bangladesh', team2: 'AFG', city2: 'Afghanistan' },
    { team1: 'IND', city1: 'India', team2: 'AUS', city2: 'Australia' },
    { team1: 'ENG', city1: 'England', team2: 'SA', city2: 'South Africa' },
    { team1: 'PAK', city1: 'Pakistan', team2: 'NZ', city2: 'New Zealand' },
];

const VividMatchCard = ({ index }) => {
    const isHot = index % 3 === 0;
    const data = matchData[index % matchData.length];

    return (
        <div className={`vivid-match-card ${isHot ? 'vivid-hot' : ''}`}>
            {/* Background canvas simulation */}
            {isHot && <div className="vivid-hot-glow"></div>}
            <div className="vivid-spotlight vivid-spotlight-left"></div>
            <div className="vivid-spotlight vivid-spotlight-right"></div>
            <div className="vivid-field-line"></div>

            <div className="vivid-card-content">
                {/* Top Row - Teams */}
                <div className="vivid-teams-row">
                    <div className="vivid-team-unit">
                        <div className="vivid-team-avatar">
                            <span>{data.team1}</span>
                        </div>
                        <span className="vivid-team-city">{data.city1}</span>
                    </div>

                    <InterstellarVSShield size={44} />

                    <div className="vivid-team-unit">
                        <div className="vivid-team-avatar">
                            <span>{data.team2}</span>
                        </div>
                        <span className="vivid-team-city">{data.city2}</span>
                    </div>
                </div>

                {/* Bottom Vivid Bar */}
                <div className={`vivid-bottom-bar ${isHot ? 'vivid-bottom-hot' : ''}`}>
                    <div className="vivid-bottom-left">
                        <div className={`contest-badge ${isHot ? 'badge-hot' : 'badge-normal'}`}>
                            <span>{isHot ? 'MEGA' : 'GUARANTEED'}</span>
                        </div>
                        <div className="pool-info">
                            <span className="pool-label">WINNING POOL</span>
                            <span className="pool-value">25 Lakhs Pool</span>
                        </div>
                    </div>
                    <Bell
                        size={18}
                        color={isHot ? 'var(--color-secondary)' : 'rgba(255,255,255,0.3)'}
                    />
                </div>
            </div>
        </div>
    );
};

export default VividMatchCard;

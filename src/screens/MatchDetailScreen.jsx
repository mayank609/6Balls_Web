import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Star, Plus, ChevronDown } from 'lucide-react';
import './MatchDetailScreen.css';

const MatchDetailScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="match-detail">
            {/* Background elements */}
            <div className="match-detail__bg-image"></div>
            <div className="match-detail__bg-gradient"></div>

            {/* Top Bar */}
            <header className="match-detail__topbar">
                <button className="match-detail__back" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                    <span>Back</span>
                </button>

                <div className="match-detail__balance-pill">
                    <Star size={16} className="match-detail__star-icon" />
                    <span className="match-detail__balance-text">$15,000</span>
                    <button className="match-detail__add-btn">
                        <Plus size={14} />
                    </button>
                </div>

                <button className="match-detail__search">
                    <Search size={24} />
                </button>
            </header>

            <main className="match-detail__content">
                {/* Premium Match Card */}
                <div className="premium-match-card">
                    <div className="premium-match-card__gradient"></div>
                    <div className="premium-match-card__bg-pitch"></div>

                    <div className="premium-match-card__content">
                        <div className="premium-match-card__header">
                            <div className="premium-match-card__league">TATA IPL 2025</div>
                            <div className="premium-match-card__live">
                                <span className="premium-match-card__pulse"></span>
                                LIVE
                            </div>
                        </div>

                        <div className="premium-match-card__teams">
                            <div className="team-badge">
                                <div className="team-badge__flag">🇮🇳</div>
                                <div className="team-badge__name">IND</div>
                            </div>

                            <div className="premium-match-card__score-area">
                                <div className="premium-match-card__score">2 : 1</div>
                                <div className="premium-match-card__innings">1st innings</div>
                            </div>

                            <div className="team-badge">
                                <div className="team-badge__flag">🇦🇺</div>
                                <div className="team-badge__name">AUS</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Players Stats Card */}
                <div className="stats-card">
                    <h3 className="stats-card__title">Top Players</h3>
                    <div className="stats-card__grid">
                        <div className="stat-chip stat-chip--green">
                            <span>Virat</span>
                            <strong>16.32</strong>
                        </div>
                        <div className="stat-chip stat-chip--neon">
                            <span>Rohit</span>
                            <strong>35</strong>
                        </div>
                        <div className="stat-chip stat-chip--orange">
                            <span>Smith</span>
                            <strong>65</strong>
                        </div>
                        <div className="stat-chip stat-chip--blue">
                            <span>Maxwell</span>
                            <strong>45</strong>
                        </div>
                    </div>
                </div>

                {/* Premium Odds Row */}
                <div className="odds-row">
                    <div className="odds-button">
                        <span className="odds-button__label">1x</span>
                        <span className="odds-button__value">3.56</span>
                    </div>
                    <div className="odds-button">
                        <span className="odds-button__label">x</span>
                        <span className="odds-button__value">2.36</span>
                    </div>
                    <div className="odds-button">
                        <span className="odds-button__label">2x</span>
                        <span className="odds-button__value">4.23</span>
                    </div>
                </div>

                {/* Place Prediction Button */}
                <button className="prediction-btn" onClick={() => navigate('/contests')}>
                    <Star size={20} fill="#000" />
                    <span>Place Prediction</span>
                </button>

                {/* Performance Section */}
                <div className="performance-header">
                    <h2>Performance</h2>
                    <div className="performance-dropdown">
                        <span>Match</span>
                        <ChevronDown size={18} className="performance-dropdown__icon" />
                    </div>
                </div>

                <div className="performance-grid">
                    <PerformanceStat label="Possession" val1="100%" val2="45%" />
                    <PerformanceStat label="Goal attempts" val1="08" val2="04" />
                    <PerformanceStat label="Shot on goal" val1="04" val2="03" />
                    <PerformanceStat label="Corner kicks" val1="5" val2="4" />
                    <PerformanceStat label="Saves" val1="8" val2="4" />
                    <PerformanceStat label="Fouls" val1="8" val2="7" />
                </div>

                <div className="spacer-bottom"></div>
            </main>
        </div>
    );
};

const PerformanceStat = ({ label, val1, val2 }) => (
    <div className="performance-stat">
        <div className="performance-stat__label">{label}</div>
        <div className="performance-stat__values">
            <span className="performance-stat__val1">{val1}</span>
            <span className="performance-stat__val2">{val2}</span>
        </div>
        <div className="performance-stat__progress">
            <div className="performance-stat__bar" style={{ width: '60%' }}></div>
        </div>
    </div>
);

export default MatchDetailScreen;

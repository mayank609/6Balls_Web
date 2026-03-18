import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar, ArrowRight } from 'lucide-react';
import './MatchStatsScreen.css';

const MatchStatsScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="match-stats">
            {/* Animated Grid Background */}
            <div className="match-stats__grid-bg"></div>
            <div className="match-stats__pitch-overlay"></div>

            {/* Topbar */}
            <header className="match-stats__topbar">
                <button className="ms-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="ms-title">MATCH INTEL</h1>
                <div style={{ width: 40 }}></div>
            </header>

            <main className="ms-content">
                {/* Stadium Card */}
                <div className="ms-holo-card">
                    <div className="ms-holo-card__glass">
                        {/* Corner accents */}
                        <div className="ms-accent ms-accent--tl"></div>
                        <div className="ms-accent ms-accent--br"></div>

                        <div className="ms-stadium-info">
                            <div className="ms-stadium-icon">
                                <MapPin size={20} />
                            </div>
                            <div className="ms-stadium-text">
                                <span className="ms-stadium-name">WANKHEDE STADIUM</span>
                                <span className="ms-stadium-city">MUMBAI, INDIA</span>
                            </div>
                        </div>

                        <div className="ms-divider"></div>

                        <div className="ms-pitch-stats">
                            <div className="ms-stat-item">
                                <MapPin size={16} className="ms-stat-icon" />
                                <span className="ms-stat-label">PITCH</span>
                                <span className="ms-stat-value">BATTING PARADISE</span>
                            </div>
                            <div className="ms-stat-item">
                                <Star size={16} className="ms-stat-icon" />
                                <span className="ms-stat-label">WEATHER</span>
                                <span className="ms-stat-value">28°C CLEAR</span>
                            </div>
                            <div className="ms-stat-item">
                                <Calendar size={16} className="ms-stat-icon" />
                                <span className="ms-stat-label">AVG 1ST</span>
                                <span className="ms-stat-value">185 RUNS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Header */}
                <div className="ms-section-header">
                    <div className="ms-line"></div>
                    <span className="ms-section-title"> KEY MATCHUPS </span>
                    <div className="ms-line"></div>
                </div>

                {/* Player 1 Card (Batsman) */}
                <div className="ms-player-card">
                    <div className="ms-player-glass ms-player-glass--blue">
                        <div className="ms-player-gradient ms-player-gradient--blue"></div>
                        <div className="ms-player-details">
                            <h2 className="ms-player-name">VIRAT KOHLI</h2>
                            <span className="ms-player-role ms-text--blue">ANCHOR / AGGRESSOR</span>
                            <div className="ms-player-metrics">
                                <span className="ms-metric-chip">LAST 100: 142</span>
                                <span className="ms-metric-chip">SR: 142</span>
                            </div>
                        </div>
                    </div>
                    {/* Pop out image */}
                    <div className="ms-player-avatar ms-avatar--blue">
                        {/* Empty box placeholder for the image to simulate native */}
                        <div className="ms-avatar-placeholder ms-avatar-placeholder--bat"></div>
                    </div>
                </div>

                {/* VS Badge */}
                <div className="ms-vs-badge">
                    <span>VS</span>
                </div>

                {/* Player 2 Card (Bowler) */}
                <div className="ms-player-card">
                    <div className="ms-player-glass ms-player-glass--red">
                        <div className="ms-player-gradient ms-player-gradient--red"></div>
                        <div className="ms-player-details">
                            <h2 className="ms-player-name">JASPRIT BUMRAH</h2>
                            <span className="ms-player-role ms-text--red">DEATH SPECIALIST</span>
                            <div className="ms-player-metrics">
                                <span className="ms-metric-chip">LAST 100: 12 W</span>
                                <span className="ms-metric-chip">ECON: 6.2</span>
                            </div>
                        </div>
                    </div>
                    {/* Pop out image */}
                    <div className="ms-player-avatar ms-avatar--red">
                        <div className="ms-avatar-placeholder ms-avatar-placeholder--bowl"></div>
                    </div>
                </div>

                <div style={{ flex: 1 }}></div>

                {/* Gamified Button */}
                <button
                    className="ms-gamified-btn"
                    onClick={() => navigate('/hero-selection')}
                >
                    <span className="ms-gamified-text">Choose your Hero</span>
                    <ArrowRight size={20} />
                </button>
            </main>
        </div>
    );
};

export default MatchStatsScreen;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, Users, Shield } from 'lucide-react';
import './ContestsDetailsScreen.css';

const ContestsDetailsScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="contests-details">
            {/* Top Bar */}
            <header className="cd-header">
                <button className="cd-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="cd-title">Contest Details</h1>
                <div style={{ width: 24 }}></div> {/* spacer */}
            </header>

            <main className="cd-content">
                {/* Team Header */}
                <div className="cd-team-header">
                    <div className="cd-team-display">
                        <div className="cd-team-logo">RR</div>
                        <span className="cd-team-name">RR</span>
                    </div>
                    <div className="cd-vs">vs</div>
                    <div className="cd-team-display">
                        <span className="cd-team-name">SRH</span>
                        <div className="cd-team-logo">SR</div>
                    </div>
                </div>

                {/* Contest Info Card */}
                <div className="cd-info-card">
                    <div className="cd-card-top">
                        <div className="cd-badge">
                            <Trophy size={14} color="#000" />
                            <span>Mega</span>
                        </div>
                        <div className="cd-prize-coins">
                            <Star size={18} fill="#FFD700" color="#FFD700" />
                            <span>50,876</span>
                        </div>
                    </div>

                    <div className="cd-prize-main">
                        <div className="cd-pool-icon">
                            <Star size={20} fill="#000" color="#000" />
                        </div>
                        <span className="cd-pool-amount">5 Lakhs</span>
                    </div>

                    <div className="cd-progress-container">
                        <div className="cd-progress-bar">
                            <div className="cd-progress-fill" style={{ width: '10%' }}></div>
                        </div>
                        <div className="cd-progress-labels">
                            <span className="cd-spots-left">123 left</span>
                            <span className="cd-spots-total">1234 spots</span>
                        </div>
                    </div>

                    <div className="cd-stats-row">
                        <div className="cd-stat-item">
                            <span className="cd-stat-label">Prize</span>
                            <span className="cd-stat-value">₹ 2 Lakhs</span>
                        </div>
                        <div className="cd-stat-item">
                            <span className="cd-stat-label">Win %</span>
                            <span className="cd-stat-value">100%</span>
                        </div>
                        <div className="cd-stat-item">
                            <span className="cd-stat-label">Max.</span>
                            <span className="cd-stat-value">10 teams</span>
                        </div>
                    </div>

                    {/* Leaderboard Section */}
                    <div className="cd-leaderboard">
                        <h3 className="cd-leaderboard-title">Rankings</h3>

                        <div className="cd-rankings-list">
                            <div className="cd-rank-item">
                                <span className="cd-rank">#1</span>
                                <span className="cd-rank-prize">2 Lakhs Coins</span>
                            </div>
                            <div className="cd-rank-item">
                                <span className="cd-rank">#2</span>
                                <span className="cd-rank-prize">1 Lakh Coins</span>
                            </div>
                            <div className="cd-rank-item">
                                <span className="cd-rank">#3</span>
                                <span className="cd-rank-prize">50,000 Coins</span>
                            </div>
                            <div className="cd-rank-item">
                                <span className="cd-rank">#4 - #10</span>
                                <span className="cd-rank-prize">10,000 Coins</span>
                            </div>
                            <div className="cd-rank-item">
                                <span className="cd-rank">#11 - #100</span>
                                <span className="cd-rank-prize">1,000 Coins</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Bar */}
            <footer className="cd-bottom-bar">
                <button className="cd-join-btn" onClick={() => navigate('/play')}>
                    Join Now
                </button>
            </footer>
        </div>
    );
};

export default ContestsDetailsScreen;

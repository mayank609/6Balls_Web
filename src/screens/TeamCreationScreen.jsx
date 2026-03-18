import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X } from 'lucide-react';
import './TeamCreationScreen.css';

const MOCK_PLAYERS = {
    'WK': [
        { id: 1, name: 'MS Dhoni', role: 'WK | CSK', credits: 9.5, selected: true },
        { id: 2, name: 'K Rahul', role: 'WK | LSG', credits: 9.0, selected: false },
        { id: 3, name: 'R Pant', role: 'WK | DC', credits: 8.5, selected: false }
    ],
    'BAT': [
        { id: 4, name: 'V Kohli', role: 'BAT | RCB', credits: 10.0, selected: true },
        { id: 5, name: 'S Gill', role: 'BAT | GT', credits: 9.0, selected: false },
        { id: 6, name: 'R Sharma', role: 'BAT | MI', credits: 9.5, selected: true }
    ],
    'BOWL': [
        { id: 7, name: 'J Bumrah', role: 'BOWL | MI', credits: 9.5, selected: true },
        { id: 8, name: 'M Siraj', role: 'BOWL | RCB', credits: 8.5, selected: false }
    ],
    'AR': [
        { id: 9, name: 'H Pandya', role: 'AR | MI', credits: 9.5, selected: true },
        { id: 10, name: 'R Jadeja', role: 'AR | CSK', credits: 9.0, selected: false }
    ]
};

const CATEGORIES = ['WK', 'BAT', 'BOWL', 'AR'];

const TeamCreationScreen = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('WK');

    // MOCK state
    const currentList = MOCK_PLAYERS[activeTab] || [];
    const selectedCount = 7;
    const maxAllowed = 11;

    return (
        <div className="team-creation">
            {/* Background elements */}
            <div className="team-creation__bg-image"></div>
            <div className="team-creation__bg-gradient"></div>

            {/* Topbar */}
            <header className="team-creation__topbar">
                <button className="tc-back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h1 className="tc-title">CREATE TEAM</h1>
                <div className="tc-credits">100 Credits</div>
            </header>

            <main className="tc-content">
                {/* Match Header Card */}
                <div className="tc-header-card">
                    <div className="tc-header-card__max">Max 7 players from a team</div>

                    <div className="tc-header-card__teams">
                        <div className="tc-team-info">
                            <span className="tc-team-name">IND</span>
                            <span className="tc-team-count">4</span>
                        </div>
                        <div className="tc-timer">00:45:12</div>
                        <div className="tc-team-info">
                            <span className="tc-team-name">AUS</span>
                            <span className="tc-team-count">3</span>
                        </div>
                    </div>

                    <div className="tc-progress">
                        <div className="tc-progress__labels">
                            <span>Players</span>
                            <span className="tc-progress__count">{selectedCount}/{maxAllowed}</span>
                        </div>
                        <div className="tc-progress__bar-container">
                            {[...Array(maxAllowed)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`tc-progress__segment ${i < selectedCount ? 'tc-progress__segment--active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="tc-tabs-scroll">
                    <div className="tc-tabs">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`tc-tab ${activeTab === cat ? 'tc-tab--active' : ''}`}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="tc-instruction">
                    Select 1-4 Wicket Keepers
                </div>

                {/* Player List */}
                <div className="tc-players">
                    {currentList.map(player => (
                        <div key={player.id} className={`player-card ${player.selected ? 'player-card--selected' : ''}`}>
                            <div className="player-card__avatar">
                                {/* placeholder dot if no image */}
                                <div className="player-card__avatar-img"></div>
                                {player.selected && <div className="player-card__badge-selected"></div>}
                            </div>

                            <div className="player-card__info">
                                <span className="player-card__name">{player.name}</span>
                                <span className={`player-card__role ${player.selected ? 'player-card__role--selected' : ''}`}>
                                    {player.role}
                                </span>
                            </div>

                            <div className="player-card__credits">
                                <span className="player-card__credit-val">{player.credits}</span>
                                <span className="player-card__credit-lbl">Cr</span>
                            </div>

                            <button className={`player-card__action ${player.selected ? 'player-card__action--selected' : ''}`}>
                                {player.selected ? <X size={18} /> : <Plus size={18} />}
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Bottom Bar */}
            <footer className="tc-bottombar">
                <button className="tc-btn-preview">TEAM PREVIEW</button>
                <button className="tc-btn-continue" onClick={() => navigate('/contests')}>CONTINUE</button>
            </footer>
        </div>
    );
};

export default TeamCreationScreen;

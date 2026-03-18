import React from 'react';
import { User, Swords } from 'lucide-react';
import './Tabs.css';
import { useNavigate } from 'react-router-dom';

const BattleTab = () => {
    const navigate = useNavigate();

    return (
        <div className="tab-container battle-container">
            <h2 className="tab-title"><span className="text-xl">⚔️</span> HEAD TO HEAD BATTLES</h2>

            <div className="battle-hero glass">
                <Swords size={48} color="var(--color-primary)" className="battle-icon" />
                <h3>1v1 SUPER OVER</h3>
                <p>Play against real players and win their coins!</p>
                <button className="battle-btn" onClick={() => navigate('/play')}>FIND OPPONENT</button>
            </div>

            <h3 className="sub-title">ACTIVE LOBBIES</h3>
            <div className="battle-list">
                {[
                    { name: 'Rahul99', rating: '1450', entry: 100 },
                    { name: 'CricketKing', rating: '2100', entry: 500 },
                    { name: 'DhoniFan', rating: '1120', entry: 50 },
                ].map((p, i) => (
                    <div key={i} className="battle-row glass">
                        <div className="battle-player">
                            <div className="battle-avatar"><User size={16} /></div>
                            <div>
                                <div className="battle-name">{p.name}</div>
                                <div className="battle-rating">Rating: {p.rating}</div>
                            </div>
                        </div>
                        <div className="battle-action">
                            <div className="battle-entry">ENTRY: {p.entry}</div>
                            <button className="battle-join-btn" onClick={() => navigate('/play')}>JOIN</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BattleTab;

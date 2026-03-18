import React from 'react';
import { Star, Trophy, Medal } from 'lucide-react';
import './Tabs.css';

const RanksTab = () => {
    const leaderboard = [
        { rank: 1, name: 'Virat_King', points: '124,500' },
        { rank: 2, name: 'MasterBlaster', points: '98,200' },
        { rank: 3, name: 'MSD_Finisher', points: '86,400' },
        { rank: 4, name: 'Hitman45', points: '75,100' },
        { rank: 5, name: 'SirJadeja', points: '62,800' },
        { rank: 6, name: 'BoomBoom', points: '54,300' },
        { rank: 7, name: 'Gabbar', points: '49,900' },
        { rank: 8, name: 'KL_Class', points: '45,200' },
    ];

    const getIcon = (rank) => {
        if (rank === 1) return <Trophy size={20} color="#FFD700" />;
        if (rank === 2) return <Medal size={20} color="#C0C0C0" />;
        if (rank === 3) return <Medal size={20} color="#CD7F32" />;
        return <span className="rank-num">{rank}</span>;
    };

    return (
        <div className="tab-container">
            <h2 className="tab-title"><Star size={20} className="inline-icon" /> GLOBAL LEADERBOARD</h2>

            <div className="rank-list">
                {leaderboard.map((user, i) => (
                    <div key={i} className={`rank-row glass ${user.rank <= 3 ? 'rank-row--top' : ''}`}>
                        <div className="rank-badge">{getIcon(user.rank)}</div>
                        <div className="rank-name">{user.name}</div>
                        <div className="rank-points">{user.points} pts</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RanksTab;

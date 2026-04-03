import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Star, User } from 'lucide-react';
import './LeaderboardOverlay.css';

const LeaderboardOverlay = ({ matchId }) => {
    // Mocking leaderboard data for now
    const [players, setPlayers] = useState([
        { id: 1, name: 'Virat_King', points: 12450, rank: 1, avatar: 'V' },
        { id: 2, name: 'MSD_Finisher', points: 11200, rank: 2, avatar: 'M' },
        { id: 3, name: 'Hitman45', points: 9800, rank: 3, avatar: 'H' },
        { id: 4, name: 'BoomBoom', points: 8400, rank: 4, avatar: 'B' },
        { id: 5, name: 'SirJadeja', points: 7200, rank: 5, avatar: 'S' },
        { id: 6, name: 'You', points: 5400, rank: 12, avatar: 'Y', isMe: true },
        { id: 7, name: 'SkySurfer', points: 4800, rank: 7, avatar: 'S' },
        { id: 8, name: 'Gabbar', points: 4200, rank: 8, avatar: 'G' },
    ]);

    const top3 = players.filter(p => p.rank <= 3).sort((a, b) => a.rank - b.rank);
    // Rearrange top 3 for centered podium: 2, 1, 3
    const podiumOrder = [top3[1], top3[0], top3[2]];

    const [timer, setTimer] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(t => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="leaderboard-overlay">
            <h2 className="leaderboard-title">
                <Star size={24} color="var(--color-primary)" fill="var(--color-primary)" style={{ visibility: 'hidden' }} />
                <span>OVER RANKINGS</span>
            </h2>

            <div className="leaderboard-podium">
                {podiumOrder.map((player, idx) => (
                    player && (
                        <div key={player.id} className={`podium-item podium-item--${player.rank}`}>
                            {player.rank === 1 && <Trophy size={28} color="#FFD700" className="podium-icon" />}
                            {player.rank === 2 && <Medal size={28} color="#C0C0C0" className="podium-icon" />}
                            {player.rank === 3 && <Medal size={28} color="#CD7F32" className="podium-icon" />}
                            <div className="podium-avatar">
                                {player.avatar}
                            </div>
                            <div className="podium-name">{player.name}</div>
                            <div className="podium-points">{player.points}</div>
                        </div>
                    )
                ))}
            </div>

            <div className="leaderboard-list">
                {players.filter(p => p.rank > 3 || p.isMe).map((player, i) => (
                    <div 
                        key={player.id} 
                        className={`leaderboard-row ${player.isMe ? 'leaderboard-row--me' : ''}`}
                        style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                    >
                        <div className="row-rank">{player.rank}</div>
                        <div className="row-name">{player.name}</div>
                        <div className="row-points">{player.points} pts</div>
                    </div>
                ))}
            </div>

            <div className="resume-timer pulsate">
                NEXT OVER RESUMING IN {timer}s...
            </div>
        </div>
    );
};

export default LeaderboardOverlay;

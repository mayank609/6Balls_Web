import React, { useEffect, useMemo, useState } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import './LeaderboardOverlay.css';

function formatUserDisplay(id) {
    if (id == null || id === '') return 'Player';
    const s = String(id);
    if (s.length <= 12) return s;
    return `${s.slice(0, 6)}…${s.slice(-4)}`;
}

function initialFromUserId(id) {
    const s = String(id || '?').trim();
    if (!s) return '?';
    return s.charAt(0).toUpperCase();
}

const LeaderboardOverlay = ({ data }) => {
    const rankedTop = useMemo(() => {
        const raw = data?.top_3 ?? [];
        return raw.slice(0, 3).map((p, idx) => ({
            rank: idx + 1,
            user_id: p.user_id ?? '',
            displayName: formatUserDisplay(p.user_id ?? ''),
            avatar: initialFromUserId(p.user_id ?? ''),
        }));
    }, [data]);

    const podiumOrder = useMemo(() => {
        if (rankedTop.length >= 3) return [rankedTop[1], rankedTop[0], rankedTop[2]];
        if (rankedTop.length === 2) return [rankedTop[1], rankedTop[0], null];
        if (rankedTop.length === 1) return [null, rankedTop[0], null];
        return [null, null, null];
    }, [rankedTop]);

    const yourRank = data?.your_rank;
    const totalPlayers = data?.total_players ?? 0;
    const yourWinnings = data?.your_winnings ?? 0;
    const hasRankings = rankedTop.length > 0;
    const hasYou =
        data != null &&
        (yourRank > 0 || totalPlayers > 0 || yourWinnings > 0 || hasRankings);

    const [timer, setTimer] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="leaderboard-overlay">
            <h2 className="leaderboard-title">
                <Star size={24} color="var(--color-primary)" fill="var(--color-primary)" className="leaderboard-title-icon" />
                <span>OVER RANKINGS</span>
            </h2>

            {!hasYou && <p className="leaderboard-empty">Waiting for rankings…</p>}

            {hasRankings && (
                <div className="leaderboard-podium">
                    {podiumOrder.map((player, slotIdx) =>
                        player ? (
                            <div
                                key={`podium-${player.rank}-${player.user_id}`}
                                className={`podium-item podium-item--${player.rank} ${
                                    yourRank === player.rank ? 'podium-item--you' : ''
                                }`}
                            >
                                {player.rank === 1 && (
                                    <Trophy size={28} color="#FFD700" className="podium-icon" />
                                )}
                                {player.rank === 2 && (
                                    <Medal size={28} color="#C0C0C0" className="podium-icon" />
                                )}
                                {player.rank === 3 && (
                                    <Medal size={28} color="#CD7F32" className="podium-icon" />
                                )}
                                <div className="podium-avatar">{player.avatar}</div>
                                <div className="podium-name" title={player.user_id}>
                                    {player.displayName}
                                </div>
                            </div>
                        ) : (
                            <div key={`podium-slot-${slotIdx}`} className="podium-item podium-item--empty" aria-hidden />
                        )
                    )}
                </div>
            )}

            {data != null && yourRank > 0 && (
                <div className="leaderboard-you glass">
                    <div className="leaderboard-you__label">You</div>
                    <div className="leaderboard-you__stats">
                        <span>
                            Rank <strong>{yourRank}</strong>
                            {totalPlayers > 0 && (
                                <>
                                    {' '}
                                    / {totalPlayers}
                                </>
                            )}
                        </span>
                        <span className="leaderboard-you__dot">·</span>
                        <span>
                            <strong>{yourWinnings}</strong> coins won
                        </span>
                    </div>
                </div>
            )}

            <div className="resume-timer pulsate">NEXT OVER RESUMING IN {timer}s...</div>
        </div>
    );
};

export default LeaderboardOverlay;

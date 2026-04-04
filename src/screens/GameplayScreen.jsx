import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Coins, Gem, Send, CheckCircle2 } from 'lucide-react';
import LeaderboardOverlay from '../components/LeaderboardOverlay';
import './GameplayScreen.css';

const PREDICTION_OPTIONS = [
    { label: 'DOT', mult: '0.5x', color: '#888', pct: 15, img: '/assets/images/img_dot_ball.png', vid: '/assets/videos/dot_anim.mp4' },
    { label: 'WICKET', mult: '3x', color: '#EF4444', pct: 8, img: '/assets/images/img_wicket.png', vid: '/assets/videos/wicket_anim.mp4' },
    { label: 'SINGLE', mult: '1x', color: '#3B82F6', pct: 42, img: '/assets/images/img_one_run.png', vid: '/assets/videos/single_anim.mp4' },
    { label: 'DOUBLE', mult: '1.5x', color: '#FFB800', pct: 12, img: '/assets/images/img_two_run.png', vid: '/assets/videos/double_anim.mp4' },
    { label: 'FOUR', mult: '2x', color: '#FF6B00', pct: 14, img: '/assets/images/img_four_run.png', vid: '/assets/videos/four_anim.mp4' },
    { label: 'SIX', mult: '3x', color: '#FF6B00', pct: 9, img: '/assets/images/img_six_run.png', vid: '/assets/videos/six_anim.mp4' },
];

const DENOMINATIONS = [5, 10, 25, 50];

/** Normalize server BREAK payload (flat or wrapped in PAYLOAD / data). */
const parseBreakLeaderboardPayload = (message) => {
    const inner = message.PAYLOAD ?? message.payload ?? message.data;
    const hasBreakFields = (obj) =>
        obj &&
        typeof obj === 'object' &&
        (Array.isArray(obj.top_3) ||
            obj.your_rank !== undefined ||
            obj.total_players !== undefined ||
            obj.your_winnings !== undefined);
    const src = hasBreakFields(inner)
        ? inner
        : hasBreakFields(message)
          ? message
          : null;
    if (!src) return null;
    return {
        room_id: src.room_id,
        match_id: src.match_id,
        your_rank: Number(src.your_rank) || 0,
        total_players: Number(src.total_players) || 0,
        top_3: Array.isArray(src.top_3) ? src.top_3 : [],
        your_winnings: Number(src.your_winnings) || 0,
    };
};

const GameplayScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const matchId = location.state?.matchId || 'default';
    const [playCoins, setPlayCoins] = useState(200);
    const [profitCoins, setProfitCoins] = useState(0);
    const [currentBall, setCurrentBall] = useState(1);
    const [runs, setRuns] = useState(0);
    const [wickets, setWickets] = useState(0);
    const [ballsBowled, setBallsBowled] = useState(0);
    const [activeDenom, setActiveDenom] = useState(5);
    const [allocations, setAllocations] = useState({});
    const [allocHistory, setAllocHistory] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [resultText, setResultText] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [outcomeVid, setOutcomeVid] = useState(null);
    const [boomWin, setBoomWin] = useState(null);
    const [flyWin, setFlyWin] = useState(null);
    const [gameState, setGameState] = useState('LOCKED'); // 'PLACEBET', 'LOCKED', 'RESULT'
    const [breakLeaderboard, setBreakLeaderboard] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [notification, setNotification] = useState({ msg: '', visible: false, color: '#FF6B00' });
    const [showAdmin, setShowAdmin] = useState(false);
    const [adminInput, setAdminInput] = useState({ outcome: 'SINGLE', multiplier: 1 });
    const videoRef = useRef(null);
    const ws = useRef(null);

    const totalCoins = playCoins + profitCoins;
    const totalAllocated = Object.values(allocations).reduce((s, arr) => s + arr.reduce((a, b) => a + b, 0), 0);

    // New state variables for real-time match data
    const [batsman, setBatsman] = useState('KOHLI');
    const [bowler, setBowler] = useState('BUMRAH');
    const [scoreStr, setScoreStr] = useState('0/0');
    /** From LiveMatchState.status: "live" | "upcoming" | "finished" */
    const [matchStatus, setMatchStatus] = useState('live');
    // We already have currentBall state, we'll update it from server

    // WebSocket Connection — initial match state is delivered as SYNC_STATE (TYPE + PAYLOAD = LiveMatchState).
    useEffect(() => {
        const mapPhaseToGameState = (phaseRaw, isLocked) => {
            const phase = String(phaseRaw || '').toUpperCase();
            let next = 'LOCKED';
            if (phase === 'BETTING') next = 'PLACEBET';
            else if (phase === 'LOCKED') next = 'LOCKED';
            else if (phase === 'RESULT') next = 'RESULT';
            else if (phase === 'BREAK') next = 'BREAK';
            if (isLocked && next === 'PLACEBET') next = 'LOCKED';
            return next;
        };

        const applyLiveMatchState = (data) => {
            if (!data || typeof data !== 'object') return;

            const payloadMatchId = data.match_id ?? data.matchId;
            if (payloadMatchId && String(payloadMatchId) !== String(matchId)) {
                console.warn('[WS] LiveMatchState match_id mismatch:', payloadMatchId, 'expected', matchId);
            }

            const ballStr = String(data.ball ?? '0.1');
            const [overs, ballInOver] = ballStr.includes('.')
                ? ballStr.split('.').map(Number)
                : [0, Number(ballStr) || 0];
            const safeBallInOver = Number.isFinite(ballInOver) && ballInOver > 0 ? ballInOver : 1;
            const safeOvers = Number.isFinite(overs) ? overs : 0;

            setCurrentBall(safeBallInOver);
            setBallsBowled(safeOvers * 6 + (Number.isFinite(ballInOver) ? ballInOver : 0));

            if (data.score != null) setScoreStr(String(data.score));
            if (data.batsman != null) setBatsman(data.batsman);
            if (data.bowler != null) setBowler(data.bowler);

            if (data.status != null && String(data.status).trim() !== '') {
                setMatchStatus(String(data.status).trim().toLowerCase());
            }

            const nextGameState = mapPhaseToGameState(data.phase, data.is_locked === true);
            setGameState(nextGameState);
            if (nextGameState !== 'BREAK') setBreakLeaderboard(null);

            setAllocations({});
            setAllocHistory([]);
            setIsAnimating(false);
            setIsSubmitted(false);

            console.log('[WS] LiveMatchState applied:', data);
        };

        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
        const fullWsUrl = `${wsUrl}/api/ws?matchId=${matchId}`;
        console.log(`[WS] Initializing connection to: ${fullWsUrl}`);
        ws.current = new WebSocket(fullWsUrl); // Adjust URL as needed

        ws.current.onopen = () => {
            console.log("[WS] Connection established successfully");
        };

        ws.current.onerror = (error) => {
            console.error("[WS] WebSocket Error observed:", error);
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const msgType = message.TYPE ?? message.type;
            console.log(`[WS] Received message of type: ${msgType}`, message);

            /* Initial sync on connect + any full-state pushes: TYPE "SYNC_STATE" | "STATE_UPDATE" */
            if (msgType === 'SYNC_STATE' || msgType === 'STATE_UPDATE') {
                const payload = message.PAYLOAD ?? message.payload;
                applyLiveMatchState(payload);
                return;
            }

            if (msgType === 'BREAK' || message.type === 'BREAK') {
                setGameState('BREAK');
                setIsAnimating(false);
                const parsed = parseBreakLeaderboardPayload(message);
                if (parsed) setBreakLeaderboard(parsed);
                return;
            }

            if (message.type === "PLACEBET") {
                setBreakLeaderboard(null);
                setGameState("PLACEBET");
                setIsSubmitted(false);
                setIsAnimating(false);
                setAllocations({});
                setAllocHistory([]);
                setNotification({
                    msg: '🎯 PREDICTION OPEN! MAKE YOUR PICKS',
                    visible: true,
                    color: 'var(--color-primary)',
                    type: 'open'
                });
                setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 2800);

                // Update match data from server payload
                if (message.data) {
                    // Mapping fields (e.g., "0.3" -> ball 3 of current over)
                    const ballStr = String(message.data.ball || "0.1");
                    const [overs, ballInOver] = ballStr.includes('.') ? ballStr.split('.').map(Number) : [0, Number(ballStr)];
                    setCurrentBall(ballInOver || 1);
                    setBallsBowled((overs * 6) + ballInOver);
                    setScoreStr(message.data.score || "0/0");
                    setBatsman(message.data.batsman || "---");
                    setBowler(message.data.bowler || "---");

                    // Sync balances with server source of truth
                    if (message.data.playCoins !== undefined) setPlayCoins(Number(message.data.playCoins));
                    if (message.data.profitCoins !== undefined) setProfitCoins(Number(message.data.profitCoins));
                }
            }
            else if (message.type === "LOCKED") {
                setGameState("LOCKED");
                setNotification({
                    msg: '🔒 SELECTION LOCKED! GOOD LUCK',
                    visible: true,
                    color: '#EF4444',
                    type: 'locked'
                });
                setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 2800);
                // Removed auto-submission as per backend requirements
            }
            else if (msgType === 'RESULT' || message.type === 'RESULT') {
                const live = message.liveState ?? message.live_state;
                const appliedLive = live && typeof live === 'object';
                if (appliedLive) {
                    applyLiveMatchState(live);
                } else {
                    setGameState("RESULT");
                }

                if (message.balance !== undefined && message.balance !== null) {
                    setProfitCoins(Number(message.balance));
                }

                const outcome = message.outcome || (message.data && message.data.outcome);
                const isLeg = message.isLeg !== undefined ? message.isLeg : (message.data && message.data.isLeg);
                const winnings = message.winnings !== undefined ? message.winnings : (message.data && message.data.winnings);

                console.log(`[WS] RESULT Message -> Parsed Outcome: ${outcome}, isLeg: ${isLeg}, Wins: ${winnings}, liveState: ${appliedLive}, balance: ${message.balance}`);

                const normalizedOutcome = normalizeResult(outcome);
                handleServerResult(normalizedOutcome, isLeg, winnings, {
                    authoritativeScoreline: appliedLive,
                    profitSyncedViaBalance: message.balance !== undefined && message.balance !== null,
                });
            }
        };

        ws.current.onclose = (event) => {
            console.log(`[WS] Disconnected from Game Server (Code: ${event.code}, Reason: ${event.reason || 'none'})`);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [matchId]);

    const submitBetsToServer = useCallback(() => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN || isSubmitted) return;

        // Convert allocations { "SIX": [10, 5], "OFF SIDE": [25] } to required array format
        const bets = [];
        Object.entries(allocations).forEach(([selection, amounts]) => {
            const totalAmount = amounts.reduce((a, b) => a + b, 0);
            if (totalAmount > 0) {
                bets.push({ selection: selection, amount: totalAmount });
            }
        });

        if (bets.length > 0) {
            const payload = {
                type: "SUBMIT_BET",
                match_id: matchId,
                room_id: `room_${matchId}_global`,
                bets: bets
            };
            console.log("[WS] Sending Payload:", payload);
            ws.current.send(JSON.stringify(payload));

            // Deduct play coins immediately on submission
            setPlayCoins(p => Math.max(0, p - totalAllocated));
            setIsSubmitted(true);
            console.log("Bets submitted:", payload);
        }
    }, [allocations, totalAllocated, isSubmitted]);

    const normalizeResult = (val) => {
        if (val === undefined || val === null) return 'DOT';
        const s = String(val).trim().toUpperCase();
        console.log(`[WS] Normalizing Result Value: "${val}" -> "${s}"`);

        if (s === '0' || s === 'DOT' || s === '0.0') return 'DOT';
        if (s === '1' || s === 'SINGLE' || s === 'ONE') return 'SINGLE';
        if (s === '2' || s === 'DOUBLE' || s === 'TWO') return 'DOUBLE';
        if (s === '4' || s === 'FOUR') return 'FOUR';
        if (s === '6' || s === 'SIX' || s === '6.0') return 'SIX';
        if (s === 'WICKET' || s === 'W' || s === 'OUT') return 'WICKET';

        // If it's already a valid label, return it
        const validLabels = PREDICTION_OPTIONS.map(o => o.label);
        if (validLabels.includes(s)) return s;

        console.warn(`[WS] Unknown result value received: "${val}". Defaulting to DOT.`);
        return 'DOT';
    };

    const handleServerResult = useCallback((serverOutcome, isLeg, serverWinnings, opts = {}) => {
        const { authoritativeScoreline = false, profitSyncedViaBalance = false } = opts;

        setIsAnimating(true);
        console.log(`[WS] handleServerResult -> Outcome: ${serverOutcome}, Leg: ${isLeg}, Wins: ${serverWinnings}`, opts);

        // Find matching option for video/colors (serverOutcome is already normalized)
        const outcome = PREDICTION_OPTIONS.find(opt =>
            opt.label.toUpperCase() === String(serverOutcome).toUpperCase()
        ) || PREDICTION_OPTIONS[0];

        console.log(`[WS] Selected Animation: ${outcome.label} (${outcome.vid})`);

        const outcomeRuns = { SINGLE: 1, DOUBLE: 2, FOUR: 4, SIX: 6 }[outcome.label] || 0;
        if (!authoritativeScoreline) {
            setRuns(r => r + outcomeRuns);
            if (outcome.label === 'WICKET') setWickets(w => w + 1);
            setBallsBowled(b => b + 1);
        }

        const sideLabel = isLeg ? 'LEG' : 'OFF';
        const bannerText = outcomeRuns > 0 ? `${outcomeRuns} ${sideLabel}` :
            outcome.label === 'WICKET' ? 'WICKET' : 'DOT';

        setResultText(bannerText);
        setOutcomeVid(outcome.vid);
        setShowResult(true);

        // Ensure video is played from the start
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.warn("Video play failed:", e));
        }

        setTimeout(() => {
            setOutcomeVid(null);
            setShowResult(false);

            if (serverWinnings && serverWinnings > 0) {
                setBoomWin(serverWinnings);
                setFlyWin(serverWinnings);
                if (!profitSyncedViaBalance) {
                    setTimeout(() => setProfitCoins(p => p + serverWinnings), 1200);
                }
                setTimeout(() => setFlyWin(null), 1400);
                setTimeout(() => setBoomWin(null), 2500);
            }

            if (!authoritativeScoreline && currentBall < 6) {
                setCurrentBall(b => b + 1);
            }

            setAllocations({});
            setAllocHistory([]);
            // Don't set isAnimating(false) here, wait for next PLACEBET state
        }, 3500);
    }, [currentBall]);

    const addCoin = (label) => {
        // Only allow betting during PLACEBET state
        if (gameState !== 'PLACEBET' || isSubmitted || totalAllocated + activeDenom > totalCoins || isAnimating) return;
        setAllocations(prev => ({
            ...prev,
            [label]: [...(prev[label] || []), activeDenom],
        }));
        setAllocHistory(prev => [...prev, label]);
    };

    const undoLast = () => {
        if (gameState !== 'PLACEBET' || isSubmitted || allocHistory.length === 0) return;
        const lastLabel = allocHistory[allocHistory.length - 1];
        setAllocHistory(prev => prev.slice(0, -1));
        setAllocations(prev => {
            const arr = [...(prev[lastLabel] || [])];
            arr.pop();
            return { ...prev, [lastLabel]: arr };
        });
    };

    const resetAll = () => {
        if (gameState !== 'PLACEBET' || isSubmitted) return;
        setAllocations({});
        setAllocHistory([]);
    };

    // --- Admin Control Functions ---
    const adminStartBetting = () => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        ws.current.send(JSON.stringify({
            type: "ADMIN_COMMAND",
            command: "START_BETTING",
            matchId: matchId,
            data: { batsman, bowler, score: scoreStr, ball: `0.${currentBall}` }
        }));
    };

    const adminLockBall = () => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        ws.current.send(JSON.stringify({
            type: "ADMIN_COMMAND",
            command: "LOCK_BALL",
            matchId: matchId
        }));
    };

    const adminSetResult = () => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        ws.current.send(JSON.stringify({
            type: "ADMIN_COMMAND",
            command: "SET_RESULT",
            matchId: matchId,
            data: { outcome: adminInput.outcome, multiplier: Number(adminInput.multiplier), isLeg: false }
        }));
    };

    const adminOverBreak = () => {
        setGameState("BREAK");
        setBreakLeaderboard(null);
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        ws.current.send(JSON.stringify({
            type: "ADMIN_COMMAND",
            command: "OVER_BREAK",
            matchId: matchId
        }));
    };

    return (
        <div className="game">
            <div className="game__bg" />

            {/* TOP BAR */}
            <header className="game__top">
                <button className="game__back" onClick={() => navigate('/lobby')}>
                    <ArrowLeft size={20} />
                </button>

                <div className="game__score glass">
                    <span className="game__score-runs">{scoreStr}</span>
                    <span className="game__score-overs">({Math.floor(ballsBowled / 6)}.{ballsBowled % 6})</span>
                </div>

                <div className="game__wallets">
                    <div className="game__wallet glass"><Coins size={14} color="#FFD700" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {playCoins}</div>
                    <div className="game__wallet game__wallet--gold glass"><Gem size={14} color="#00F0FF" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {profitCoins}</div>
                </div>
            </header>

            {/* PLAYER AREA */}
            <div className="game__player-area">
                <div className="game__player-placeholder">
                    {outcomeVid ? (
                        <video
                            key={outcomeVid}
                            ref={videoRef}
                            src={outcomeVid}
                            autoPlay
                            muted
                            playsInline
                            className="game__outcome-video"
                            onEnded={() => setShowResult(false)}
                        />
                    ) : (
                        <div className="game__stadium-view">
                            <img src="/assets/images/default_player.png" className="game__player-img" alt="player" />
                        </div>
                    )}
                </div>

                {/* Result Banner Overlay */}
                {showResult && !outcomeVid && (
                    <div className={`game__result ${resultText.includes('SIX') || resultText.includes('4') ? 'game__result--fire' : resultText.includes('WICKET') ? 'game__result--red' : ''}`}>
                        {resultText}
                    </div>
                )}
            </div>

            {/* Ball progress + match info on one row — saves vertical space for the animation */}
            <div className="game__post-video-row">
                <div className="game__balls">
                    {[1, 2, 3, 4, 5, 6].map(ball => (
                        <div
                            key={ball}
                            className={`game__ball ${ball === currentBall + 1 ? 'game__ball--active' : ball <= currentBall ? 'game__ball--done' : ''}`}
                        >
                            {ball}
                        </div>
                    ))}
                </div>
                <div className="game__info-bar">
                    <div className="game__info-bar-inner">
                        <div className="game__info-label">
                            {matchStatus === 'upcoming'
                                ? 'MATCH UPCOMING'
                                : matchStatus === 'finished'
                                  ? 'MATCH ENDED'
                                  : matchStatus === 'live'
                                    ? 'SUPER OVER LOBBY'
                                    : matchStatus.replace(/_/g, ' ').toUpperCase()}
                        </div>
                        <div className="game__info-match">{bowler} vs {batsman}</div>
                    </div>
                </div>
            </div>

            <div className="game__prediction-label glass">
                BALL {currentBall + 1} {gameState === 'PLACEBET' ? 'PREDICTION' : 'RESULT'}
                <div className={`game__state-badge game__state-badge--${gameState.toLowerCase()}`}>
                    {gameState === 'PLACEBET' ? '● LIVE' : gameState === 'LOCKED' ? '● LOCKED' : '● ' + gameState}
                </div>
            </div>

            {/* PREDICTION GRID */}
            <div className="game__grid">
                {PREDICTION_OPTIONS.map(opt => {
                    const coins = allocations[opt.label] || [];
                    const total = coins.reduce((a, b) => a + b, 0);
                    return (
                        <button
                            key={opt.label}
                            className="game__pred-card"
                            style={{ '--accent': opt.color }}
                            onClick={() => addCoin(opt.label)}
                            disabled={isAnimating}
                        >
                            <div className="game__pred-top">
                                <img src={opt.img} className="game__pred-img" alt={opt.label} />
                                <span className="game__pred-mult" style={{ color: opt.color }}>{opt.mult}</span>
                            </div>
                            <div className="game__pred-label">{opt.label}</div>
                            {total > 0 && (
                                <div className="game__pred-coins" style={{ background: opt.color }}>
                                    {total}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>



            {/* COIN SELECTOR */}
            <div className="game__pouch">
                <div className="game__pouch-divider">
                    <span className="game__pouch-line" />
                    <span>POUCH</span>
                    <span className="game__pouch-line" />
                </div>

                <div className="game__pouch-controls">
                    <span className="game__pouch-label">SELECT VALUE</span>
                    <div className="game__pouch-actions">
                        <button className="game__pouch-undo" onClick={undoLast} disabled={allocHistory.length === 0 || isSubmitted}>
                            <RotateCcw size={12} /> UNDO
                        </button>
                        <button className="game__pouch-reset" onClick={resetAll} disabled={isSubmitted}>RESET ALL</button>
                    </div>
                </div>

                <div className="game__denoms">
                    {DENOMINATIONS.map(d => (
                        <button
                            key={d}
                            className={`game__denom ${activeDenom === d ? 'game__denom--active' : ''}`}
                            onClick={() => setActiveDenom(d)}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                <button
                    className={`game__pouch-submit-full ${totalAllocated > 0 && !isSubmitted ? 'game__pouch-submit-full--active' : ''} ${isSubmitted ? 'game__pouch-submit-full--submitted' : ''}`}
                    onClick={submitBetsToServer}
                    disabled={totalAllocated === 0 || isSubmitted || gameState !== 'PLACEBET'}
                >
                    {isSubmitted ? (
                        <>
                            <CheckCircle2 size={18} />
                            <span>PREDICTIONS CONFIRMED</span>
                        </>
                    ) : (
                        <>
                            <Send size={18} className={totalAllocated > 0 ? 'game__icon-pulse' : ''} />
                            <span>CONFIRM & SUBMIT</span>
                        </>
                    )}
                </button>

            </div>

            {/* ADMIN TOGGLE */}
            <button className="game__admin-toggle" onClick={() => setShowAdmin(!showAdmin)}>🛠️</button>

            {/* ADMIN PANEL */}
            {showAdmin && (
                <div className="game__admin-panel glass">
                    <div className="admin-header">ADMIN CONTROLS</div>

                    <div className="admin-section">
                        <label>MATCH DATA (SCORE/BALL/PLAYERS)</label>
                        <input type="text" value={scoreStr} onChange={e => setScoreStr(e.target.value)} placeholder="Score (e.g. 54-2)" />
                        <div className="admin-row">
                            <input type="text" value={batsman} onChange={e => setBatsman(e.target.value)} placeholder="Batsman" />
                            <input type="text" value={bowler} onChange={e => setBowler(e.target.value)} placeholder="Bowler" />
                        </div>
                        <button className="admin-btn admin-btn--green" onClick={adminStartBetting}>🚀 START PREDICTION</button>
                    </div>

                    <div className="admin-section">
                        <button className="admin-btn admin-btn--yellow" onClick={adminLockBall}>🔒 LOCK SELECTION</button>
                    </div>

                    <div className="admin-section">
                        <label>BALL RESULT</label>
                        <div className="admin-row">
                            <select value={adminInput.outcome} onChange={e => setAdminInput({ ...adminInput, outcome: e.target.value })}>
                                {PREDICTION_OPTIONS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                            </select>

                            <input type="number" step="0.1" value={adminInput.multiplier} onChange={e => setAdminInput({ ...adminInput, multiplier: e.target.value })} />
                        </div>
                        <button className="admin-btn admin-btn--orange" onClick={adminSetResult}>🎁 SET RESULT & PAYOUT</button>
                    </div>

                    <div className="admin-section">
                        <button className="admin-btn admin-btn--red" onClick={adminOverBreak}>🚀 OVER BREAK (LEADERBOARD)</button>
                    </div>
                </div>
            )}

            {notification.visible && (
                <div className={`game__status-popup game__status-popup--${notification.type}`}>
                    <div className="game__status-popup-content">
                        {notification.msg}
                    </div>
                </div>
            )}

            {flyWin !== null && (
                <div className="game__fly-coin">+{flyWin}</div>
            )}

            {/* BOOM WIN OVERLAY */}
            {boomWin !== null && (
                <div className="game__boom">
                    <img src="/assets/videos/win.gif" className="game__boom-gif" alt="win" />
                    <div className="game__boom-card">
                        <div className="game__boom-text">YOU WON</div>
                        <div className="game__boom-amount">+{boomWin} COINS</div>
                    </div>
                </div>
            )}

            {/* BREAK / LEADERBOARD OVERLAY */}
            {gameState === 'BREAK' && (
                <div className="game__break-overlay">
                    <div className="game__break-content glass" style={{ padding: 0, overflow: 'hidden' }}>
                        <LeaderboardOverlay data={breakLeaderboard} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameplayScreen;

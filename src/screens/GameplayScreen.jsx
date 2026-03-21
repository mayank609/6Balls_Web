import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
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

const GameplayScreen = () => {
    const navigate = useNavigate();
    const [playCoins, setPlayCoins] = useState(200);
    const [profitCoins, setProfitCoins] = useState(0);
    const [currentBall, setCurrentBall] = useState(1);
    const [runs, setRuns] = useState(0);
    const [wickets, setWickets] = useState(0);
    const [ballsBowled, setBallsBowled] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0); // Driven by server now
    const [activeDenom, setActiveDenom] = useState(5);
    const [allocations, setAllocations] = useState({});
    const [allocHistory, setAllocHistory] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [resultText, setResultText] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [outcomeVid, setOutcomeVid] = useState(null);
    const [boomWin, setBoomWin] = useState(null);
    const [flyWin, setFlyWin] = useState(null);
    const [gameState, setGameState] = useState('LOCKED'); // 'PLACE_BET', 'LOCKED', 'RESULT'
    const videoRef = useRef(null);
    const timerRef = useRef(null);
    const ws = useRef(null);

    const totalCoins = playCoins + profitCoins;
    const totalAllocated = Object.values(allocations).reduce((s, arr) => s + arr.reduce((a, b) => a + b, 0), 0);

    // New state variables for real-time match data
    const [batsman, setBatsman] = useState('KOHLI');
    const [bowler, setBowler] = useState('BUMRAH');
    const [scoreStr, setScoreStr] = useState('0/0');
    // We already have currentBall state, we'll update it from server

    // WebSocket Connection
    useEffect(() => {
        // In a real app, you would pass the matchId and token in the URL or headers
        // e.g. wss://6balls.live/ws/game?matchId=123&token=...
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
        ws.current = new WebSocket(`${wsUrl}/ws/game`); // Adjust URL as needed

        ws.current.onopen = () => {
            console.log("Connected to Game Server");
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            if (message.TYPE === "PLACE_BET") {
                setGameState("PLACE_BET");
                setIsAnimating(false);
                setAllocations({});
                setAllocHistory([]);
                
                // Update match data from server payload
                if (message.DATA) {
                    if (message.DATA.ball) setCurrentBall(parseInt(message.DATA.ball) || 1);
                    if (message.DATA.score) setScoreStr(message.DATA.score);
                    if (message.DATA.batsman) setBatsman(message.DATA.batsman);
                    if (message.DATA.bowler) setBowler(message.DATA.bowler);
                    
                    // Sync balances with server source of truth
                    if (message.DATA.playCoins !== undefined) setPlayCoins(Number(message.DATA.playCoins));
                    if (message.DATA.profitCoins !== undefined) setProfitCoins(Number(message.DATA.profitCoins));
                }

                // Optionally start a local countdown if server sends duration
                if (message.duration) {
                    setTimeLeft(message.duration);
                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = setInterval(() => {
                        setTimeLeft(prev => Math.max(0, prev - 1));
                    }, 1000);
                }
            } 
            else if (message.TYPE === "LOCKED") {
                setGameState("LOCKED");
                if (timerRef.current) clearInterval(timerRef.current);
                setTimeLeft(0);
                
                // When locked, send bets to server
                submitBetsToServer();
            } 
            else if (message.TYPE === "RESULT") {
                setGameState("RESULT");
                // Fallback to empty object if DATA is undefined
                const resultData = message.DATA || {}; 
                handleServerResult(resultData.outcome, resultData.isLeg, resultData.winnings);
            }
            else if (message.TYPE === "BREAK") {
                setGameState("BREAK");
                if (timerRef.current) clearInterval(timerRef.current);
                setTimeLeft(0);
                setIsAnimating(false);
            }
        };

        ws.current.onclose = () => {
            console.log("Disconnected from Game Server");
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const submitBetsToServer = useCallback(() => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

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
                bets: bets
             };
             ws.current.send(JSON.stringify(payload));
             
             // Deduct play coins immediately on submission
             setPlayCoins(p => Math.max(0, p - totalAllocated));
             console.log("Bets submitted:", payload);
        }
    }, [allocations, totalAllocated]);

    const handleServerResult = useCallback((serverOutcome, isLeg, serverWinnings) => {
        setIsAnimating(true);

        // Find matching option for video/colors
        const outcome = PREDICTION_OPTIONS.find(opt => opt.label === serverOutcome) || PREDICTION_OPTIONS[0];

        const outcomeRuns = { SINGLE: 1, DOUBLE: 2, FOUR: 4, SIX: 6 }[outcome.label] || 0;
        setRuns(r => r + outcomeRuns);
        if (outcome.label === 'WICKET') setWickets(w => w + 1);
        setBallsBowled(b => b + 1);

        const sideLabel = isLeg ? 'LEG' : 'OFF';
        const bannerText = outcomeRuns > 0 ? `${outcomeRuns} ${sideLabel}` :
            outcome.label === 'WICKET' ? 'WICKET' : 'DOT';

        setResultText(bannerText);
        setOutcomeVid(outcome.vid);
        setShowResult(true);

        setTimeout(() => {
            setOutcomeVid(null);
            setShowResult(false);

            if (serverWinnings && serverWinnings > 0) {
                setBoomWin(serverWinnings);
                setFlyWin(serverWinnings);
                setTimeout(() => setProfitCoins(p => p + serverWinnings), 1200);
                setTimeout(() => setFlyWin(null), 1400);
                setTimeout(() => setBoomWin(null), 2500);
            }

            if (currentBall < 6) {
                setCurrentBall(b => b + 1);
            }

            setAllocations({});
            setAllocHistory([]);
            // Don't set isAnimating(false) here, wait for next PLACE_BET state
        }, 3500);
    }, [currentBall]);

    const addCoin = (label) => {
        // Only allow betting during PLACE_BET state
        if (gameState !== 'PLACE_BET' || totalAllocated + activeDenom > totalCoins || isAnimating) return;
        setAllocations(prev => ({
            ...prev,
            [label]: [...(prev[label] || []), activeDenom],
        }));
        setAllocHistory(prev => [...prev, label]);
    };

    const undoLast = () => {
        if (gameState !== 'PLACE_BET' || allocHistory.length === 0) return;
        const lastLabel = allocHistory[allocHistory.length - 1];
        setAllocHistory(prev => prev.slice(0, -1));
        setAllocations(prev => {
            const arr = [...(prev[lastLabel] || [])];
            arr.pop();
            return { ...prev, [lastLabel]: arr };
        });
    };

    const resetAll = () => {
        if (gameState !== 'PLACE_BET') return;
        setAllocations({});
        setAllocHistory([]);
    };

    const timerStr = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;

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
                    <div className="game__wallet glass">🎮 {playCoins}</div>
                    <div className="game__wallet game__wallet--gold glass">💰 {profitCoins}</div>
                </div>
            </header>

            {/* PLAYER AREA */}
            <div className="game__player-area">
                <div className="game__player-placeholder">
                    {outcomeVid ? (
                        <video
                            ref={videoRef}
                            src={outcomeVid}
                            autoPlay
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

            {/* BALL PROGRESS */}
            <div className="game__balls">
                {[1, 2, 3, 4, 5, 6].map(ball => (
                    <div
                        key={ball}
                        className={`game__ball ${ball === currentBall ? 'game__ball--active' : ball < currentBall ? 'game__ball--done' : ''}`}
                    >
                        {ball}
                    </div>
                ))}
            </div>

            {/* MATCH INFO + TIMER */}
            <div className="game__info-bar">
                <div>
                    <div className="game__info-label">SUPER OVER LOBBY</div>
                    <div className="game__info-match">{bowler} vs {batsman}</div>
                </div>
                <div className="game__info-right">
                    <div className={`game__timer glass ${timeLeft <= 3 ? 'game__timer--danger' : ''}`}>
                        {timerStr}
                    </div>
                </div>
            </div>

            <div className="game__prediction-label glass">
                BALL {currentBall} PREDICTION
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

            {/* SIDE CARDS */}
            <div className="game__sides">
                {['OFF SIDE', 'LEG SIDE'].map(side => {
                    const coins = allocations[side] || [];
                    const total = coins.reduce((a, b) => a + b, 0);
                    return (
                        <button
                            key={side}
                            className="game__side-card glass"
                            onClick={() => addCoin(side)}
                            disabled={isAnimating}
                        >
                            <span>{side}</span>
                            <span className="game__side-mult">1x</span>
                            {total > 0 && <div className="game__side-coins">{total}</div>}
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
                        <button className="game__pouch-undo" onClick={undoLast} disabled={allocHistory.length === 0}>
                            <RotateCcw size={12} /> UNDO
                        </button>
                        <button className="game__pouch-reset" onClick={resetAll}>RESET ALL</button>
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

            </div>

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

            {/* BREAK / AD OVERLAY */}
            {gameState === 'BREAK' && (
                <div className="game__break-overlay">
                    <div className="game__break-content glass">
                        <h2>OVER BREAK</h2>
                        <p>Match will resume shortly</p>
                        <div className="game__break-ad-placeholder">
                            <span>Ad Placement Area</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameplayScreen;

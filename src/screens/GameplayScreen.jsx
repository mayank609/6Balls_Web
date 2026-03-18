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
    const [timeLeft, setTimeLeft] = useState(15);
    const [activeDenom, setActiveDenom] = useState(5);
    const [allocations, setAllocations] = useState({});
    const [allocHistory, setAllocHistory] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [resultText, setResultText] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [outcomeVid, setOutcomeVid] = useState(null);
    const [boomWin, setBoomWin] = useState(null);
    const videoRef = useRef(null);
    const timerRef = useRef(null);

    const totalCoins = playCoins + profitCoins;
    const totalAllocated = Object.values(allocations).reduce((s, arr) => s + arr.reduce((a, b) => a + b, 0), 0);

    // Timer countdown
    useEffect(() => {
        setTimeLeft(15);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [currentBall]);

    // Auto-lock when timer runs out
    useEffect(() => {
        if (timeLeft === 0 && totalAllocated > 0 && !isAnimating) {
            triggerLock();
        }
    }, [timeLeft]);

    const addCoin = (label) => {
        if (totalAllocated + activeDenom > totalCoins || isAnimating) return;
        setAllocations(prev => ({
            ...prev,
            [label]: [...(prev[label] || []), activeDenom],
        }));
        setAllocHistory(prev => [...prev, label]);
    };

    const undoLast = () => {
        if (allocHistory.length === 0) return;
        const lastLabel = allocHistory[allocHistory.length - 1];
        setAllocHistory(prev => prev.slice(0, -1));
        setAllocations(prev => {
            const arr = [...(prev[lastLabel] || [])];
            arr.pop();
            return { ...prev, [lastLabel]: arr };
        });
    };

    const resetAll = () => {
        setAllocations({});
        setAllocHistory([]);
    };

    const triggerLock = useCallback(() => {
        if (totalAllocated === 0 || isAnimating) return;
        setIsAnimating(true);
        clearInterval(timerRef.current);

        const outcome = PREDICTION_OPTIONS[Math.floor(Math.random() * PREDICTION_OPTIONS.length)];
        const isLeg = Math.random() > 0.5;

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

        // Calculate winnings
        let winnings = 0;
        const exactMatch = allocations[outcome.label];
        if (exactMatch) {
            const mult = parseFloat(outcome.mult.replace('x', ''));
            winnings += Math.round(exactMatch.reduce((a, b) => a + b, 0) * mult);
        }
        const sideKey = isLeg ? 'LEG SIDE' : 'OFF SIDE';
        if (allocations[sideKey]) {
            winnings += allocations[sideKey].reduce((a, b) => a + b, 0) * 2;
        }
        setTimeout(() => {
            setOutcomeVid(null);
            setShowResult(false);
            const cost = totalAllocated;

            if (winnings > 0) {
                setBoomWin(winnings);
                setTimeout(() => setBoomWin(null), 2500);
                setProfitCoins(p => p + winnings);
            }

            setPlayCoins(p => p - Math.min(cost, p));

            if (currentBall < 6) {
                setCurrentBall(b => b + 1);
            } else {
                // Game Over — navigate back
                setTimeout(() => navigate('/lobby'), 2000);
            }

            setAllocations({});
            setAllocHistory([]);
            setIsAnimating(false);
        }, 3500);
    }, [allocations, totalAllocated, isAnimating, currentBall, navigate]);

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
                    <span className="game__score-runs">{runs}/{wickets}</span>
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
                    <div className="game__info-match">BUMRAH vs KOHLI</div>
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
                            <span className="game__side-mult">2x</span>
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

                {/* LOCK BUTTON */}
                <button
                    className={`game__lock-btn ${totalAllocated > 0 && !isAnimating ? 'game__lock-btn--active' : ''}`}
                    onClick={triggerLock}
                    disabled={totalAllocated === 0 || isAnimating}
                >
                    {isAnimating ? 'BOWLING...' : `LOCK PREDICTION (${totalAllocated} coins)`}
                </button>
            </div>

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
        </div>
    );
};

export default GameplayScreen;

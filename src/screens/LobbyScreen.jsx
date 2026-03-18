import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Home, ShoppingCart, List, Star, ChevronRight, User, LogOut, Award, Users, X } from 'lucide-react';
import ShopTab from './tabs/ShopTab';
import PredictionsTab from './tabs/PredictionsTab';
import BattleTab from './tabs/BattleTab';
import RanksTab from './tabs/RanksTab';
import './LobbyScreen.css';

const matches = [
    { t1: 'JB', n1: 'BUMRAH', t2: 'VK', n2: 'KOHLI', info: 'OVER 19.1 • FINAL OVER', time: 'LIVE', hot: true },
    { t1: 'MS', n1: 'SHAMI', t2: 'RG', n2: 'ROHIT', info: 'OVER 15.3 • CRUCIAL', time: '05h 45m', hot: false },
    { t1: 'RK', n1: 'RASHID', t2: 'HP', n2: 'PANDYA', info: 'OVER 12.4 • LIVE', time: 'LIVE', hot: true },
    { t1: 'SS', n1: 'STOKES', t2: 'AB', n2: 'DEVILLIERS', info: 'OVER 8.2 • POWERPLAY', time: '02h 10m', hot: false },
];

const LobbyScreen = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('lobby');

    return (
        <div className="lobby">
            {/* ═══ DRAWER ═══ */}
            <div className={`drawer-overlay ${drawerOpen ? 'drawer-overlay--open' : ''}`} onClick={() => setDrawerOpen(false)} />
            <aside className={`drawer ${drawerOpen ? 'drawer--open' : ''}`}>
                <div className="drawer__header">
                    <div className="drawer__avatar">
                        <User size={32} color="var(--color-primary)" />
                    </div>
                    <div>
                        <div className="drawer__name">Guest User</div>
                        <div className="drawer__id">ID: 20260202</div>
                    </div>
                </div>
                <div className="drawer__divider" />

                {[
                    { icon: <User size={20} />, label: 'MY PROFILE' },
                    { icon: <Star size={20} />, label: 'MY MATCHES' },
                    { icon: <Users size={20} />, label: 'REFER & EARN' },
                    { icon: <Award size={20} />, label: 'LEADERBOARD' },
                    { icon: <span>⚔️</span>, label: 'BATTLES' },
                    { icon: <ShoppingCart size={20} />, label: 'SHOP' },
                ].map((item, i) => (
                    <button key={i} className="drawer__item" onClick={() => setDrawerOpen(false)}>
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}

                <div style={{ flex: 1 }} />
                <div className="drawer__divider" />
                <button className="drawer__item drawer__item--danger" onClick={() => { setDrawerOpen(false); navigate('/'); }}>
                    <LogOut size={20} />
                    <span>LOGOUT</span>
                </button>
            </aside>

            {/* ═══ DYNAMIC BG ═══ */}
            <div className="lobby__bg-orbs">
                <div className="lobby__orb lobby__orb--1" />
                <div className="lobby__orb lobby__orb--2" />
            </div>

            {/* ═══ TOP BAR ═══ */}
            <header className="lobby__top">
                <button className="lobby__menu" onClick={() => setDrawerOpen(true)}>
                    <Menu size={24} />
                </button>
                <h1 className="lobby__title">MATCH LOBBY</h1>
                <button className="lobby__bell">
                    <Bell size={20} color="var(--color-primary)" />
                </button>
            </header>

            {/* ═══ CONTENT ═══ */}
            <main className="lobby__main">
                {activeTab === 'lobby' && (
                    <>
                        <div className="lobby__section-bar">
                            <div className="lobby__accent-bar" />
                            <span>TOP MATCHUPS</span>
                        </div>

                        <div className="lobby__cards">
                            {matches.map((m, i) => (
                                <div key={i} className={`mcard ${m.hot ? 'mcard--hot' : ''}`} onClick={() => navigate('/match-stats')}>
                                    <div className="mcard__top">
                                        <span className="mcard__info">{m.info}</span>
                                        {m.time === 'LIVE' && <span className="mcard__live">LIVE</span>}
                                    </div>

                                    <div className="mcard__teams">
                                        <div className="mcard__team">
                                            <div className="mcard__avatar">{m.t1[0]}</div>
                                            <div>
                                                <div className="mcard__code">{m.t1}</div>
                                                <div className="mcard__name">{m.n1.slice(0, 5)}</div>
                                            </div>
                                        </div>

                                        <div className="mcard__vs">
                                            <span>vs</span>
                                            {m.time !== 'LIVE' && <span className="mcard__time">{m.time}</span>}
                                        </div>

                                        <div className="mcard__team mcard__team--right">
                                            <div>
                                                <div className="mcard__code">{m.t2}</div>
                                                <div className="mcard__name">{m.n2.slice(0, 5)}</div>
                                            </div>
                                            <div className="mcard__avatar">{m.t2[0]}</div>
                                        </div>
                                    </div>

                                    <div className="mcard__footer">
                                        <div className="mcard__prize">
                                            <Star size={14} color="var(--color-secondary)" />
                                            <span>₹50 CRORE PRIZE POOL</span>
                                        </div>
                                        <ChevronRight size={18} color="rgba(255,255,255,0.6)" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {activeTab === 'shop' && <ShopTab />}
                {activeTab === 'predictions' && <PredictionsTab />}
                {activeTab === 'battle' && <BattleTab />}
                {activeTab === 'ranks' && <RanksTab />}
            </main>

            {/* ═══ BOTTOM NAV ═══ */}
            <nav className="lobby__nav">
                {[
                    { id: 'lobby', icon: <Home size={22} />, label: 'Lobby' },
                    { id: 'shop', icon: <ShoppingCart size={22} />, label: 'Shop' },
                    { id: 'predictions', icon: <List size={22} />, label: 'My Predictions' },
                    { id: 'battle', icon: <span style={{ fontSize: 18 }}>⚔️</span>, label: 'Battle' },
                    { id: 'ranks', icon: <Star size={22} />, label: 'Ranks' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`lobby__nav-item ${activeTab === tab.id ? 'lobby__nav-item--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default LobbyScreen;

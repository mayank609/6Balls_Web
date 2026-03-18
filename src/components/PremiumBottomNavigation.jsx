import React from 'react';
import { Home, Star, User } from 'lucide-react';
import './PremiumBottomNavigation.css';

const navItems = [
    { icon: Home, label: 'Lobby', index: 0 },
    { icon: Star, label: 'Matches', index: 1 },
    { icon: User, label: 'Profile', index: 4 },
];

const PremiumBottomNavigation = ({ selectedIndex, onItemSelected }) => {
    return (
        <div className="premium-bottom-nav">
            {navItems.map((item) => {
                const isSelected = selectedIndex === item.index;
                const IconComponent = item.icon;
                return (
                    <button
                        key={item.index}
                        className={`nav-item ${isSelected ? 'nav-item-active' : ''}`}
                        onClick={() => onItemSelected(item.index)}
                    >
                        <IconComponent size={24} />
                        <span className="nav-label">{item.label}</span>
                        {isSelected && <div className="nav-active-dot"></div>}
                    </button>
                );
            })}
        </div>
    );
};

export default PremiumBottomNavigation;

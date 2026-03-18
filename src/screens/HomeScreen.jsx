import React, { useState } from 'react';
import PremiumHomeAppBar from '../components/PremiumHomeAppBar';
import PremiumBottomNavigation from '../components/PremiumBottomNavigation';
import PremiumDynamicBackground from '../components/PremiumDynamicBackground';
import FeaturedMatchCard from '../components/FeaturedMatchCard';
import VividMatchCard from '../components/VividMatchCard';
import './HomeScreen.css';

const HomeScreen = () => {
    const [selectedNavItem, setSelectedNavItem] = useState(0);

    return (
        <div className="home-screen-container">
            {/* Background layer */}
            <PremiumDynamicBackground />
            <div className="home-bg-image"></div>

            {/* Main Scaffold structure */}
            <div className="home-scaffold">
                <PremiumHomeAppBar />

                <div className="home-content">
                    <div className="content-padder">
                        <FeaturedMatchCard />

                        <div className="section-header">
                            <span className="section-title">UPCOMING CONTESTS</span>
                            <span className="filter-text">Filter</span>
                        </div>

                        {/* List of matches */}
                        <div className="matches-list">
                            {[...Array(8)].map((_, index) => (
                                <VividMatchCard key={index} index={index} />
                            ))}
                        </div>
                    </div>
                </div>

                <PremiumBottomNavigation
                    selectedIndex={selectedNavItem}
                    onItemSelected={setSelectedNavItem}
                />
            </div>
        </div>
    );
};

export default HomeScreen;

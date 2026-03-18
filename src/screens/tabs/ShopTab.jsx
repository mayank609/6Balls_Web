import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';
import './Tabs.css';

const ShopTab = () => {
    const packages = [
        { coins: 500, price: '₹50', bonus: '+50 Bonus' },
        { coins: 1200, price: '₹100', bonus: '+200 Bonus' },
        { coins: 3000, price: '₹250', bonus: '+500 Bonus', popular: true },
        { coins: 7000, price: '₹500', bonus: '+1000 Bonus' },
        { coins: 15000, price: '₹1000', bonus: '+2500 Bonus' },
    ];

    return (
        <div className="tab-container">
            <h2 className="tab-title"><ShoppingCart size={20} className="inline-icon" /> COIN SHOP</h2>
            <div className="shop-grid">
                {packages.map((pkg, i) => (
                    <div key={i} className={`shop-card glass ${pkg.popular ? 'shop-card--popular' : ''}`}>
                        {pkg.popular && <div className="shop-badge"><Zap size={12} /> BEST VALUE</div>}
                        <img src="/assets/images/img_coin_50.png" alt="coins" className="shop-coin-img" />
                        <div className="shop-coins">{pkg.coins} <span className="text-sm">COINS</span></div>
                        <div className="shop-bonus">{pkg.bonus}</div>
                        <button className="shop-btn">{pkg.price}</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopTab;

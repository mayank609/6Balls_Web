import React from 'react';
import { List, CheckCircle, XCircle } from 'lucide-react';
import './Tabs.css';

const PredictionsTab = () => {
    const history = [
        { match: 'IND vs AUS', over: 'Super Over', prediction: 'SIX', result: 'WIN', coins: '+300', date: '2 hours ago' },
        { match: 'CSK vs MI', over: '19th Over', prediction: 'WICKET', result: 'WIN', coins: '+150', date: '5 hours ago' },
        { match: 'RCB vs KKR', over: 'Powerplay', prediction: 'FOUR', result: 'LOSS', coins: '-50', date: 'Yesterday' },
        { match: 'ENG vs NZ', over: 'Death Overs', prediction: 'DOUBLE', result: 'WIN', coins: '+75', date: '2 days ago' },
    ];

    return (
        <div className="tab-container">
            <h2 className="tab-title"><List size={20} className="inline-icon" /> MY PREDICTIONS</h2>
            <div className="history-list">
                {history.map((item, i) => (
                    <div key={i} className="history-card glass">
                        <div className="history-top">
                            <div>
                                <div className="history-match">{item.match}</div>
                                <div className="history-over">{item.over}</div>
                            </div>
                            <div className={`history-result ${item.result === 'WIN' ? 'text-green' : 'text-red'}`}>
                                {item.result === 'WIN' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                <span>{item.result}</span>
                            </div>
                        </div>
                        <div className="history-bottom">
                            <div className="history-pred">Predicted: <strong>{item.prediction}</strong></div>
                            <div className="history-right">
                                <span className={`history-coins ${item.result === 'WIN' ? 'text-green' : 'text-danger'}`}>{item.coins} Coins</span>
                                <span className="history-date">{item.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PredictionsTab;

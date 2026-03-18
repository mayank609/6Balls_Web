import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OpeningScreen from './screens/OpeningScreen';
import LoginScreen from './screens/LoginScreen';
import OtpScreen from './screens/OtpScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameplayScreen from './screens/GameplayScreen';
import MatchDetailScreen from './screens/MatchDetailScreen';
import TeamCreationScreen from './screens/TeamCreationScreen';
import ContestsDetailsScreen from './screens/ContestsDetailsScreen';
import MatchStatsScreen from './screens/MatchStatsScreen';
import HeroSelectionScreen from './screens/HeroSelectionScreen';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<OpeningScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/otp" element={<OtpScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/lobby" element={<LobbyScreen />} />
          <Route path="/match-stats" element={<MatchStatsScreen />} />
          <Route path="/hero-selection" element={<HeroSelectionScreen />} />
          <Route path="/play" element={<GameplayScreen />} />
          <Route path="/match-detail" element={<MatchDetailScreen />} />
          <Route path="/create-team" element={<TeamCreationScreen />} />
          <Route path="/contests" element={<ContestsDetailsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
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

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const checkAuthSession = async () => {
  const endpoints = [
    `${apiUrl}/api/auth/player/me`,
    `${apiUrl}/api/matches`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { credentials: 'include' });
      if (response.ok) return true;
      if (response.status === 401 || response.status === 403) return false;
    } catch {
      // Try next endpoint if current one fails.
    }
  }

  return false;
};

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    checkAuthSession()
      .then((authed) => {
        if (mounted) {
          setIsAuthed(authed);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsAuthed(false);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;
  return isAuthed ? children : <Navigate to="/" replace />;
}

function PublicOnlyRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    checkAuthSession()
      .then((authed) => {
        if (mounted) {
          setIsAuthed(authed);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsAuthed(false);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;
  return isAuthed ? <Navigate to="/lobby" replace /> : children;
}

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<PublicOnlyRoute><OpeningScreen /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><LoginScreen /></PublicOnlyRoute>} />
          <Route path="/otp" element={<PublicOnlyRoute><OtpScreen /></PublicOnlyRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingScreen /></ProtectedRoute>} />
          <Route path="/lobby" element={<ProtectedRoute><LobbyScreen /></ProtectedRoute>} />
          <Route path="/match-stats" element={<ProtectedRoute><MatchStatsScreen /></ProtectedRoute>} />
          <Route path="/hero-selection" element={<ProtectedRoute><HeroSelectionScreen /></ProtectedRoute>} />
          <Route path="/play" element={<ProtectedRoute><GameplayScreen /></ProtectedRoute>} />
          <Route path="/match-detail" element={<ProtectedRoute><MatchDetailScreen /></ProtectedRoute>} />
          <Route path="/create-team" element={<ProtectedRoute><TeamCreationScreen /></ProtectedRoute>} />
          <Route path="/contests" element={<ProtectedRoute><ContestsDetailsScreen /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

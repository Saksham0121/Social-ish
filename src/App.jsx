// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import GamesPage from './pages/GamesPage';
import HomePage from './pages/HomePage';
import FeaturesGrid from './components/FeatureCard';
import MoodCarousel from './pages/MoodCarousel';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/features" element={<FeaturesGrid />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/mood" element={<MoodCarousel />} />

    </Routes>
  );
}

export default App;
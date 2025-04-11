// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import GamesPage from './pages/GamesPage';
import HomePage from './pages/Homepage';
import FeaturesGrid from './components/FeatureCard';
import MoodCarousel from './pages/MoodCarousel';
import FriendsPage from './pages/FriendsPage';
import InterestsPage from './pages/InterestsPage';
import ProfileSettings from './pages/ProfileSettings';
import SnakeGame from './Games/snakegame';
import Game2048 from './Games/2048game';
import FlappyBird from './Games/flappybird';
import JigsawPuzzle from './Games/puzzlegame';
import NearbyConnect from './pages/Findpeople';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/features" element={<FeaturesGrid />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/meetpeople" element={< NearbyConnect />} />

      <Route path="/mood" element={<MoodCarousel />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/friendspage" element={<FriendsPage />} />
      <Route path="/interests" element={<InterestsPage />} />
      <Route path="/games/flappy-bird" element={<FlappyBird />} />
      <Route path="/games/puzzle" element={<JigsawPuzzle />} />
      <Route path="/games/2048" element={<Game2048 />} />
      <Route path="/games/snake-game" element={<SnakeGame />} />


      
    </Routes>
  );
}

export default App;
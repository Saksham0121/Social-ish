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
import { AuthProvider } from './contexts/authContext'; // ✅ Import the AuthProvider
import IcebreakersBook from './pages/IcebreakerPage';
import ProfilePage from './pages/ProfileSettings';
import SnakeGame from './Games/snakegame';
import Game2048 from './Games/2048game';
import FlappyBird from './Games/flappybird';
import JigsawPuzzle from './Games/puzzlegame';
import BluetoothFinderPage from './pages/Findpeople';
import ChatComponent from './pages/ChatPage';
import CalmZone from './pages/calmzone';
import AboutUs from './pages/aboutus';
import HelpAndSupport from './pages/helppage';



function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/features" element={<FeaturesGrid />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/findpeople" element={<BluetoothFinderPage />} />
        <Route path="/mood" element={<MoodCarousel />} />
        <Route path="/calmzone" element={<CalmZone />} />
        <Route path="/aboutus" element={<AboutUs />} />        
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help" element={<HelpAndSupport />} />

        <Route path="/friendspage" element={<FriendsPage />} />
        <Route path="/interests" element={<InterestsPage />} />
        <Route path="/games/flappy-bird" element={<FlappyBird />} />
        <Route path="/games/puzzle" element={<JigsawPuzzle />} />
        <Route path="/games/2048" element={<Game2048 />} />
        <Route path="/games/snake-game" element={<SnakeGame />} />
        {/* <Route path="/chatpage/:userId" element={<ChatPage />} /> */}
        <Route path="/icebreakers" element={<IcebreakersBook />} />
        <Route path="/chat" element={<ChatComponent />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext.jsx';
import Welcome from './pages/Welcome.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Home from './pages/Home.jsx';
import Stories from './pages/Stories.jsx';
import StoryChat from './pages/StoryChat.jsx';
import Notes from './pages/Notes.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import InfoPage from './pages/InfoPage.jsx';

function RequireAuth({ children }) {
  const { signedIn } = useGame();
  return signedIn ? children : <Navigate to="/" replace />;
}

function GuestOnly({ children }) {
  const { signedIn } = useGame();
  return signedIn ? <Navigate to="/home" replace /> : children;
}

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<GuestOnly><Welcome /></GuestOnly>} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* App */}
          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/stories" element={<RequireAuth><Stories /></RequireAuth>} />
          <Route path="/stories/:storyId" element={<RequireAuth><StoryChat /></RequireAuth>} />
          <Route path="/notes" element={<RequireAuth><Notes /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
          <Route path="/info/:slug" element={<RequireAuth><InfoPage /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

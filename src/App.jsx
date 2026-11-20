import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext.jsx';
import { firebaseReady } from './firebase.js';
import Welcome from './Pages/Welcome.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/Signup.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import Home from './Pages/Home.jsx';
import Stories from './Pages/Stories.jsx';
import StoryChat from './Pages/StoryChat.jsx';
import Diagnostic from './Pages/Diagnostic.jsx';
import Notes from './Pages/notes.jsx';
import Profile from './Pages/Profile.jsx';
import EditProfile from './Pages/EditProfile.jsx';
import InfoPage from './Pages/Infopage.jsx';

// `placed` = also require the placement diagnostic to be finished (or skipped).
function RequireAuth({ children, placed = false }) {
  const { signedIn, diagnosticDone } = useGame();
  if (!signedIn) return <Navigate to="/" replace />;
  if (placed && !diagnosticDone) return <Navigate to="/diagnostic" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { signedIn } = useGame();
  return signedIn ? <Navigate to="/home" replace /> : children;
}

/** Waits for Firebase to say who is signed in before any screen renders. */
function Gate({ children }) {
  const { authReady, saveError, signedIn } = useGame();

  if (!firebaseReady) {
    return (
      <div className="app splash">
        <h1>Almost there!</h1>
        <p>Firebase isn&apos;t set up yet. Copy <code>.env.example</code> to <code>.env</code>, fill in your Firebase values, and restart.</p>
        <p>See <code>FIREBASE_SETUP.md</code>.</p>
      </div>
    );
  }
  if (!authReady) {
    return <div className="app splash"><p>Loading…</p></div>;
  }
  return (
    <>
      {signedIn && saveError && (
        <div className="banner" role="alert">We couldn&apos;t save your progress. Check your internet connection.</div>
      )}
      {children}
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Gate>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<GuestOnly><Welcome /></GuestOnly>} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* App */}
          <Route path="/diagnostic" element={<RequireAuth><Diagnostic /></RequireAuth>} />
          <Route path="/home" element={<RequireAuth placed><Home /></RequireAuth>} />
          <Route path="/stories" element={<RequireAuth placed><Stories /></RequireAuth>} />
          <Route path="/stories/:storyId" element={<RequireAuth placed><StoryChat /></RequireAuth>} />
          <Route path="/notes" element={<RequireAuth><Notes /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
          <Route path="/info/:slug" element={<RequireAuth><InfoPage /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </Gate>
    </GameProvider>
  );
}

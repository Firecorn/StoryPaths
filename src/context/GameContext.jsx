import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from 'firebase/auth';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import { nextTargetGrade } from '../lib/readability.js';
import { currentStreak, todayKey, weekFlags } from '../lib/streak.js';
import { READING_LEVELS } from '../data/options.js';
import { gradeForBand } from '../lib/bands.js';

// Firebase Auth owns the login. Firestore keeps one document per student at users/{uid}.
// The reducer below is the in-memory copy; every change is saved (debounced) to Firestore.

const initialState = {
  signedIn: false,
  user: { username: 'Reader', email: '', grade: '', readingLevel: '', interests: [] },
  points: 0, // Clarity Points (XP)
  activeDates: [], // days with at least one correct answer -> streaks
  recent: [], // last 10 answers (true/false) -> adaptive engine
  targetGrade: 5.5, // reading-level target the engine aims for
  diagnosticDone: false, // placement diagnostic finished (or skipped)
  words: [], // vocabulary collected from context-clue questions -> Notes
  progress: {}, // storyId -> % complete
  recentStories: [], // most recent first
};

// The fields saved to Firestore (everything except `signedIn`).
const SAVED_KEYS = ['user', 'points', 'activeDates', 'recent', 'targetGrade', 'diagnosticDone', 'words', 'progress', 'recentStories'];
const pickSaved = (s) => Object.fromEntries(SAVED_KEYS.map((k) => [k, s[k]]));

const gradeFor = (level) => READING_LEVELS.find((l) => l.value === level)?.grade;

function reducer(state, a) {
  switch (a.type) {
    case 'hydrate': { // loaded from Firestore (or a brand-new account)
      const { updatedAt, ...saved } = a.data ?? {}; // updatedAt is bookkeeping, not game state
      return {
        ...initialState,
        ...saved,
        user: { ...initialState.user, ...saved.user },
        signedIn: true,
      };
    }
    case 'reset': // signed out
      return initialState;
    case 'updateUser': {
      const user = { ...state.user, ...a.user };
      const seeded = a.user?.readingLevel && a.user.readingLevel !== state.user.readingLevel ? gradeFor(a.user.readingLevel) : undefined;
      return { ...state, user, targetGrade: seeded ?? state.targetGrade };
    }
    case 'answer': {
      const recent = [...state.recent, a.correct].slice(-10);
      const today = todayKey();
      return {
        ...state,
        recent,
        points: state.points + (a.correct ? a.points : 0),
        activeDates: a.correct && !state.activeDates.includes(today) ? [...state.activeDates, today] : state.activeDates,
        targetGrade: nextTargetGrade(state.targetGrade, recent),
      };
    }
    case 'points': {
      // Points without touching the accuracy history (e.g. a correct answer after a retry).
      const today = todayKey();
      return {
        ...state,
        points: state.points + a.points,
        activeDates: state.activeDates.includes(today) ? state.activeDates : [...state.activeDates, today],
      };
    }
    case 'diagnostic':
      // band undefined = skipped: keep whatever level is already set.
      return {
        ...state,
        diagnosticDone: true,
        recent: [],
        user: a.band ? { ...state.user, readingLevel: a.band } : state.user,
        targetGrade: a.band ? gradeForBand(a.band) : state.targetGrade,
      };
    case 'spend':
      return { ...state, points: state.points - a.cost };
    case 'addWord':
      return state.words.some((w) => w.word === a.word.word) ? state : { ...state, words: [...state.words, a.word] };
    case 'progress':
      return {
        ...state,
        progress: { ...state.progress, [a.storyId]: a.percent },
        recentStories: [a.storyId, ...state.recentStories.filter((id) => id !== a.storyId)].slice(0, 8),
      };
    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authReady, setAuthReady] = useState(false); // false until Firebase has told us who (if anyone) is signed in
  const [saveError, setSaveError] = useState(false);

  const uid = useRef(null); // current user's id, once their data has loaded
  const dirty = useRef(false); // true when the state changed because of the player, not because we just loaded it
  const pendingProfile = useRef(null); // sign-up form values, applied once the new account exists

  const send = (action) => {
    if (action.type !== 'hydrate' && action.type !== 'reset') dirty.current = true;
    dispatch(action);
  };

  // 1. Follow Firebase's login state and load that student's document.
  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return undefined;
    }
    return onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        uid.current = null;
        dirty.current = false;
        dispatch({ type: 'reset' });
        setAuthReady(true);
        return;
      }

      let data = {};
      if (pendingProfile.current) {
        // brand-new account: start from what they typed on the sign-up form
        data = { user: pendingProfile.current };
        pendingProfile.current = null;
        dirty.current = true; // make sure the new document gets created
      } else {
        try {
          const snap = await getDoc(doc(db, 'users', fbUser.uid));
          data = snap.exists() ? snap.data() : { user: { email: fbUser.email ?? '' } };
          dirty.current = !snap.exists();
        } catch (err) {
          // Could not load: don't continue, or we might later overwrite their saved progress with an empty one.
          console.error('Could not load your progress', err);
          setSaveError(true);
          await fbSignOut(auth);
          return;
        }
      }
      uid.current = fbUser.uid;
      dispatch({ type: 'hydrate', data });
      setAuthReady(true);
    });
  }, []);

  // 2. Save changes (debounced so a quick run of answers is one write).
  useEffect(() => {
    if (!db || !uid.current || !dirty.current || !state.signedIn) return undefined;
    const timer = setTimeout(async () => {
      try {
        await setDoc(doc(db, 'users', uid.current), { ...pickSaved(state), updatedAt: serverTimestamp() }, { merge: true });
        dirty.current = false;
        setSaveError(false);
      } catch (err) {
        console.error('Could not save progress', err);
        setSaveError(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  const api = useMemo(
    () => ({
      ...state,
      authReady,
      saveError,
      streak: currentStreak(state.activeDates),
      week: weekFlags(state.activeDates),

      // ---- accounts (Firebase Auth). These throw; pages show authMessage(err). ----
      signUp: async ({ email, password, ...profile }) => {
        pendingProfile.current = { ...profile, email };
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
          pendingProfile.current = null;
          throw err;
        }
      },
      logIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
      logOut: async () => {
        // Save anything still waiting in the 500ms debounce before the session ends.
        if (db && uid.current && dirty.current) {
          try {
            await setDoc(doc(db, 'users', uid.current), { ...pickSaved(state), updatedAt: serverTimestamp() }, { merge: true });
          } catch (err) {
            console.error('Could not save before logging out', err);
          }
        }
        await fbSignOut(auth);
      },
      resetPassword: (email) => sendPasswordResetEmail(auth, email),
      /** Re-checks the password (Firebase requires a recent login), then deletes their data and account. */
      deleteAccount: async (password) => {
        const fbUser = auth.currentUser;
        await reauthenticateWithCredential(fbUser, EmailAuthProvider.credential(fbUser.email, password));
        dirty.current = false; // stop the autosave from recreating the document
        await deleteDoc(doc(db, 'users', fbUser.uid));
        await deleteUser(fbUser);
      },

      // ---- game state ----
      updateUser: (user) => send({ type: 'updateUser', user }),
      recordAnswer: (correct, points = 0) => send({ type: 'answer', correct, points }),
      addPoints: (points) => send({ type: 'points', points }),
      completeDiagnostic: (band) => send({ type: 'diagnostic', band }),
      skipDiagnostic: () => send({ type: 'diagnostic' }),
      /** Returns false (and spends nothing) if the player can't afford it. */
      spend: (cost) => {
        if (state.points < cost) return false;
        send({ type: 'spend', cost });
        return true;
      },
      addWord: (word) => send({ type: 'addWord', word }),
      setProgress: (storyId, percent) => send({ type: 'progress', storyId, percent }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, authReady, saveError]
  );

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}

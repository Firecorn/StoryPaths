import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { nextTargetGrade } from '.../lib/readability.js';
import { currentStreak, todayKey, weekFlags } from '.../lib/streak.js';
import { READING_LEVELS } from '../data/options.js';

// Everything lives in localStorage for now. Replace the persistence effect and
// the signIn / signOut / deleteAccount actions with real API calls when you add a backend.
const STORAGE_KEY = 'clarity-quest:v1';

const initialState = {
  signedIn: false,
  user: { username: 'Reader', email: '', grade: '', readingLevel: '', interests: [] },
  points: 0, // Clarity Points (XP)
  activeDates: [], // days with at least one correct answer -> streaks
  recent: [], // last 10 answers (true/false) -> adaptive engine
  targetGrade: 5, // reading-level target the engine aims for
  words: [], // vocabulary collected from context-clue questions -> Notes
  progress: {}, // storyId -> % complete
  recentStories: [], // most recent first
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

const gradeFor = (level) => READING_LEVELS.find((l) => l.value === level)?.grade;

function reducer(state, a) {
  switch (a.type) {
    case 'signIn':
    case 'updateUser': {
      const user = { ...state.user, ...a.user };
      const seeded = a.user?.readingLevel && a.user.readingLevel !== state.user.readingLevel ? gradeFor(a.user.readingLevel) : undefined;
      return {
        ...state,
        signedIn: a.type === 'signIn' ? true : state.signedIn,
        user,
        targetGrade: seeded ?? state.targetGrade,
      };
    }
    case 'signOut':
      return { ...state, signedIn: false };
    case 'reset':
      return initialState;
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
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode etc.): state just won't persist */
    }
  }, [state]);

  const api = useMemo(
    () => ({
      ...state,
      streak: currentStreak(state.activeDates),
      week: weekFlags(state.activeDates),
      signIn: (user) => dispatch({ type: 'signIn', user }),
      signOut: () => dispatch({ type: 'signOut' }),
      deleteAccount: () => dispatch({ type: 'reset' }),
      updateUser: (user) => dispatch({ type: 'updateUser', user }),
      recordAnswer: (correct, points = 0) => dispatch({ type: 'answer', correct, points }),
      /** Returns false (and spends nothing) if the player can't afford it. */
      spend: (cost) => {
        if (state.points < cost) return false;
        dispatch({ type: 'spend', cost });
        return true;
      },
      addWord: (word) => dispatch({ type: 'addWord', word }),
      setProgress: (storyId, percent) => dispatch({ type: 'progress', storyId, percent }),
    }),
    [state]
  );

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}

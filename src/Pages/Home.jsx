import { Link } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import Landscape from '../components/Avatar.jsx';
import { useGame } from '../context/GameContext.jsx';
import { STORIES, getStory } from '../data/stories.js';

const DAYS = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];

/** Semi-circle gauge. `percent` 0-100. */
function QuestGauge({ percent }) {
  const p = Math.max(0, Math.min(100, percent));
  const d = 'M 45 170 A 125 125 0 0 1 295 170';
  return (
    <div className="gauge" role="img" aria-label={`${p}% of your current quest completed`}>
      <svg viewBox="0 0 340 175">
        <path d={d} pathLength="100" fill="none" stroke="var(--red-deep)" strokeWidth="70" />
        <path d={d} pathLength="100" fill="none" stroke="var(--red)" strokeWidth="70" strokeDasharray={`${p} 100`} />
      </svg>
      <div className="gauge__label">
        <strong>{p}%</strong>
        <span>Quest Completion</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, progress, recentStories, streak, week } = useGame();

  const currentId = recentStories[0] ?? STORIES[0].id;
  const current = getStory(currentId) ?? STORIES[0];
  const percent = progress[current.id] ?? 0;

  const recent = recentStories.map(getStory).filter(Boolean);

  return (
    <Screen title="Home">
      <h2 className="home__hello">Hello {user.username || 'Reader'}!</h2>

      <QuestGauge percent={percent} />

      <Link to={`/stories/${current.id}`} className="btn btn--solid btn--stack">
        Continue Reading Quest
        <small>{current.title}</small>
      </Link>

      <ol className="week" aria-label="This week">
        {DAYS.map((d, i) => (
          <li key={d} className={week[i] ? 'is-done' : ''}>
            <span className="sr-only">{week[i] ? 'Played: ' : 'Not played: '}</span>
            {d}
          </li>
        ))}
      </ol>
      <p className="pill pill--butter">{streak > 0 ? 'Keep your streak going!' : 'Start a new Streak'}</p>
      <p className="home__streak">Your Current streak: {streak} {streak === 1 ? 'day' : 'days'}</p>

      <h3 className="section-title section-title--light">Recently played Stories</h3>
      <div className="carousel">
        {recent.length === 0 && <p className="empty">Stories you play will show up here.</p>}
        {recent.map((s) => (
          <Link key={s.id} to={`/stories/${s.id}`} className="card card--tall">
            <Landscape rounded={false} className="card__art" />
            <span>{s.title}</span>
          </Link>
        ))}
      </div>
    </Screen>
  );
}

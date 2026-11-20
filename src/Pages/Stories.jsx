import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import Landscape from '../components/Avatar.jsx';
import { FilterIcon, SearchIcon } from '../components/Icons.jsx';
import { useGame } from '../context/GameContext.jsx';
import { CATEGORIES, STORIES, getStory } from '../data/stories.js';

// Design: Stories browse
export default function Stories() {
  const { recentStories, progress } = useGame();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [playableOnly, setPlayableOnly] = useState(false);

  const resume = getStory(recentStories[0]) ?? STORIES[0];

  const results = useMemo(
    () =>
      STORIES.filter(
        (s) =>
          (!category || s.category === category) &&
          (!playableOnly || s.available) &&
          s.title.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query, category, playableOnly]
  );

  return (
    <Screen title="Stories">
      <Link to={`/stories/${resume.id}`} className="resume">
        <div>
          <h2>Continue Story</h2>
          <p>{resume.title}{progress[resume.id] ? ` · ${progress[resume.id]}%` : ''}</p>
        </div>
        <Landscape rounded={false} className="resume__art" />
      </Link>

      <div className="search">
        <SearchIcon width={26} height={26} />
        <input type="search" placeholder="Search..." aria-label="Search stories" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button
          type="button"
          className={playableOnly ? 'is-on' : ''}
          aria-pressed={playableOnly}
          aria-label="Hide stories that are coming soon"
          onClick={() => setPlayableOnly((v) => !v)}
        >
          <FilterIcon width={30} height={30} />
        </button>
      </div>

      <h3 className="section-title">Categories</h3>
      <div className="categories">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`category${category === c.id ? ' is-active' : ''}`}
            aria-pressed={category === c.id}
            onClick={() => setCategory(category === c.id ? null : c.id)}
          >
            <span aria-hidden="true">{c.emoji}</span>
            <small>{c.label}</small>
          </button>
        ))}
      </div>

      <h3 className="section-title">Recommendation For You</h3>
      <div className="grid-2">
        {results.map((s) =>
          s.available ? (
            <Link key={s.id} to={`/stories/${s.id}`} className="card">
              <span>{s.title}</span>
            </Link>
          ) : (
            <div key={s.id} className="card card--locked" aria-disabled="true">
              <span>{s.title}</span>
              <small>Coming soon</small>
            </div>
          )
        )}
        {results.length === 0 && <p className="empty">No stories match yet.</p>}
      </div>
    </Screen>
  );
}

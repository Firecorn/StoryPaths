import { useState } from 'react';
import Screen from '../components/Screen.jsx';
import { ArrowCircleLeft, ArrowCircleRight } from '../components/Icons.jsx';
import { useGame } from '../context/GameContext.jsx';
import { NOTE_TOPICS } from '../data/stories.js';

const TILTS = [2, -1.5, -2, 1.5, 1, -1];

// Design: Notes (word of the day card + sticky-note topics)
export default function Notes() {
  const { words } = useGame();
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(null);

  const word = words.length ? words[Math.min(i, words.length - 1)] : null;
  const step = (d) => setI((n) => (n + d + words.length) % words.length);
  const topic = NOTE_TOPICS.find((t) => t.id === open);

  return (
    <Screen title="Notes">
      <section className="wordcard" aria-live="polite">
        <h2>{word ? word.word : 'New word'}</h2>
        <p>{word ? word.definition : 'Answer a context-clue question to collect your first word.'}</p>
        <div className="wordcard__nav">
          <button type="button" aria-label="Previous word" disabled={words.length < 2} onClick={() => step(-1)}>
            <ArrowCircleLeft width={26} height={26} />
          </button>
          <button type="button" aria-label="Next word" disabled={words.length < 2} onClick={() => step(1)}>
            <ArrowCircleRight width={26} height={26} />
          </button>
        </div>
      </section>

      <div className="stickies">
        {NOTE_TOPICS.map((t, idx) => (
          <button
            key={t.id}
            type="button"
            className={`sticky${open === t.id ? ' is-open' : ''}`}
            style={{ '--tilt': `${TILTS[idx % TILTS.length]}deg` }}
            aria-pressed={open === t.id}
            onClick={() => setOpen(open === t.id ? null : t.id)}
          >
            <span className="sticky__tape sticky__tape--l" />
            <span className="sticky__tape sticky__tape--r" />
            <span className="sticky__title">{t.title}</span>
          </button>
        ))}
      </div>

      {topic && (
        <aside className="tip" role="note">
          <strong>{topic.title}</strong>
          <p>{topic.tip}</p>
        </aside>
      )}
    </Screen>
  );
}

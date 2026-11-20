import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import Landscape from '../components/Avatar.jsx';
import { SendIcon } from '../components/Icons.jsx';
import { useGame } from '../context/GameContext.jsx';
import { getStory } from '../data/stories.js';
import { nextTargetGrade, pickVariant } from '../lib/readability.js';

const HINT_COST = 10;
let uid = 0;
const msg = (from, text, extra = {}) => ({ id: ++uid, from, text, ...extra });

// Design: Stories > chat with NPC.
// NPC bubbles deliver the passage (at the learner's current reading level);
// the player's answer choices drive which node comes next.
export default function StoryChat() {
  const { storyId } = useParams();
  const story = getStory(storyId);
  if (!story || !story.available) return <Navigate to="/stories" replace />;
  return <Chat key={story.id} story={story} />;
}

function Chat({ story }) {
  const game = useGame();
  const [nodeId, setNodeId] = useState(story.start);
  const [removed, setRemoved] = useState([]); // option ids eliminated by the hint perk
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(() => [
    npcMessage(story.nodes[story.start], game.targetGrade),
  ]);
  const endRef = useRef(null);

  const node = story.nodes[nodeId];
  const question = node.question;

  // Report progress for the Home gauge once on mount, then on each node change.
  useEffect(() => {
    game.setProgress(story.id, node.progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  function enter(id, extra = [], grade = game.targetGrade) {
    const next = story.nodes[id];
    setNodeId(id);
    setRemoved([]);
    setMessages((m) => [...m, ...extra, npcMessage(next, grade)]);
  }

  function answer(option) {
    const q = question;
    const correct = !!option.correct;
    game.recordAnswer(correct, q.points);
    // The context updates on the next render, so compute the new target here too:
    // the very next passage should already reflect this answer.
    const grade = nextTargetGrade(game.targetGrade, [...game.recent, correct].slice(-10));
    const player = msg('player', option.text);

    if (correct) {
      if (q.vocab) game.addWord(q.vocab);
      enter(q.onCorrect, [player, msg('npc', `${q.correctFeedback} (+${q.points} XP)`, { speaker: node.speaker })], grade);
    } else {
      enter(q.onWrong, [player, msg('npc', q.explain, { speaker: node.speaker })], grade);
    }
  }

  function removeWrongAnswer() {
    const wrong = question.options.filter((o) => !o.correct && !removed.includes(o.id));
    if (!wrong.length || !game.spend(HINT_COST)) return;
    const pick = wrong[Math.floor(Math.random() * wrong.length)];
    setRemoved((r) => [...r, pick.id]);
  }

  function sendDraft(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, msg('player', text)]);
    setDraft('');
  }

  const options = question?.options.filter((o) => !removed.includes(o.id)) ?? [];
  const canHint = question && game.points >= HINT_COST && options.length > 2;

  return (
    <Screen title="Stories" subtitle={story.title} className="screen--chat">
      <div className="chat" role="log" aria-live="polite">
        {messages.map((m) =>
          m.from === 'npc' ? (
            <div key={m.id} className="bubble-row">
              <Landscape className="bubble-row__avatar" />
              <div className="bubble bubble--npc">
                {m.speaker && <strong className="bubble__speaker">{m.speaker}</strong>}
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="bubble-row bubble-row--player">
              <div className="bubble bubble--player">{m.text}</div>
            </div>
          )
        )}
        <div ref={endRef} />
      </div>

      <div className="chat__footer">
        {question && (
          <section className="choices" aria-label="Your answer">
            <p className="choices__prompt">
              <span className="pill pill--butter">{question.type}</span> {question.prompt}
            </p>
            {options.map((o) => (
              <button key={o.id} type="button" className="bubble bubble--player bubble--choice" onClick={() => answer(o)}>
                {o.text}
              </button>
            ))}
            <button type="button" className="perk" disabled={!canHint} onClick={removeWrongAnswer}>
              ✨ Remove a wrong answer (−{HINT_COST} XP)
            </button>
          </section>
        )}

        {!question && !node.end && (
          <button type="button" className="btn btn--solid" onClick={() => enter(node.next)}>
            Continue
          </button>
        )}

        {node.end && (
          <div className="choices">
            <p className="choices__prompt">Quest complete! 🎉</p>
            <Link className="btn btn--solid" to="/stories">Back to Stories</Link>
          </div>
        )}

        <form className="composer" onSubmit={sendDraft}>
          <label className="sr-only" htmlFor="chat-input">Write your message</label>
          <input id="chat-input" placeholder="Write your message here" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" aria-label="Send message"><SendIcon width={26} height={26} /></button>
        </form>
      </div>
    </Screen>
  );
}

function npcMessage(node, targetGrade) {
  const { text } = pickVariant(node.variants, targetGrade);
  return msg('npc', text, { speaker: node.speaker });
}

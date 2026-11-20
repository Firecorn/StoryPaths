import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ChatView, { msg } from '../components/ChatView.jsx';
import { useGame } from '../context/GameContext.jsx';
import { getStory } from '../data/stories.js';
import { nextTargetGrade } from '../lib/readability.js';
import { pickBandVariant, shuffle } from '../lib/bands.js';

const POINTS_FIRST_TRY = 10;
const POINTS_RETRY = 5;
const HINT_COST = 10;

// Story chat. NPC bubbles deliver the passage (at the learner's current reading band);
// answers move the story along. Wrong answers show the scaffold hint and let the student retry.
export default function StoryChat() {
  const { storyId } = useParams();
  const story = getStory(storyId);
  if (!story) return <Navigate to="/stories" replace />;
  return <Chat key={story.id} story={story} />;
}

/** Everything the chat needs to show one node: the right band's text, with options shuffled. */
function openNode(story, nodeId, grade) {
  const node = story.nodes[nodeId];
  const variant = pickBandVariant(node.variants, grade);
  const options = shuffle(variant.options.map((o, i) => ({ ...o, key: i })));
  const choice = variant.options.filter((o) => o.isCorrect).length > 1; // "choose your path"
  return { nodeId, speaker: node.speaker, variant, options, choice };
}

const npcBubble = (cur) => msg('npc', cur.variant.passage, { speaker: cur.speaker });

function Chat({ story }) {
  const game = useGame();
  const [cur, setCur] = useState(() => openNode(story, story.start, game.targetGrade));
  const [messages, setMessages] = useState(() => [npcBubble(cur)]);
  const [visited, setVisited] = useState(1);
  const [wrongKeys, setWrongKeys] = useState([]); // options already tried and wrong
  const [missed, setMissed] = useState(false); // missed at least once on this question
  const [hinted, setHinted] = useState(false);
  const [finished, setFinished] = useState(false);

  // Drives the "Quest Completion" gauge on Home.
  useEffect(() => {
    game.setProgress(story.id, finished ? 100 : Math.min(95, Math.round((visited / story.length) * 100)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visited, finished]);

  function advance(nextId, bubbles, grade) {
    if (!story.nodes[nextId]) {
      // "victory" (or any id that isn't a node) ends the quest
      setMessages((m) => [...m, ...bubbles, msg('npc', `Quest complete! You finished "${story.title}" like a pro.🎉`)]);
      setFinished(true);
      return;
    }
    const next = openNode(story, nextId, grade);
    setCur(next);
    setVisited((v) => v + 1);
    setWrongKeys([]);
    setMissed(false);
    setHinted(false);
    setMessages((m) => [...m, ...bubbles, npcBubble(next)]);
  }

  function choose(option) {
    const player = msg('player', option.text);

    if (!option.isCorrect) {
      if (!missed) game.recordAnswer(false); // first miss counts toward the adaptive engine
      setMissed(true);
      setWrongKeys((k) => [...k, option.key]);
      setMessages((m) => [
        ...m,
        player,
        msg('npc', option.scaffoldHint ?? 'Not quite. Read the passage again and try another answer.', { speaker: cur.speaker }),
      ]);
      return;
    }

    // Correct
    let grade = game.targetGrade;
    if (!cur.choice) {
      if (!missed) {
        game.recordAnswer(true, POINTS_FIRST_TRY);
        grade = nextTargetGrade(game.targetGrade, [...game.recent, true].slice(-10));
      } else {
        game.addPoints(POINTS_RETRY);
      }
      Object.entries(cur.variant.vocabulary ?? {}).forEach(([word, definition]) => game.addWord({ word, definition }));
    }
    advance(option.nextNodeId, [player], grade);
  }

  function useHint() {
    // Spend points to reveal the hint for a wrong answer without having to guess it.
    const wrong = cur.options.find((o) => !o.isCorrect && o.scaffoldHint);
    if (!wrong || hinted || !game.spend(HINT_COST)) return;
    setHinted(true);
    setMessages((m) => [...m, msg('npc', wrong.scaffoldHint, { speaker: cur.speaker })]);
  }

  const remaining = cur.options.filter((o) => !wrongKeys.includes(o.key));
  const canHint = !cur.choice && !hinted && game.points >= HINT_COST;

  return (
    <ChatView
      title="Stories"
      subtitle={story.title}
      messages={messages}
      onSend={(text) => setMessages((m) => [...m, msg('player', text)])}
    >
      {!finished && (
        <section className="choices" aria-label="Your answer">
          <p className="choices__prompt">
            {cur.choice ? (
              <span className="pill pill--butter">Choose your path</span>
            ) : (
              <span className="pill pill--butter">{labelFor(cur.variant.skillType)}</span>
            )}{' '}
            {cur.variant.question}
          </p>
          {remaining.map((o) => (
            <button key={o.key} type="button" className="bubble bubble--player bubble--choice" onClick={() => choose(o)}>
              {o.text}
            </button>
          ))}
          {!cur.choice && (
            <button type="button" className="perk" disabled={!canHint} onClick={useHint}>
              ✨ Get a hint (−{HINT_COST} XP)
            </button>
          )}
        </section>
      )}

      {finished && (
        <div className="choices">
          <Link className="btn btn--solid" to="/stories">Back to Stories</Link>
        </div>
      )}
    </ChatView>
  );
}

const labelFor = (skill = '') =>
  skill.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()) || 'Question';

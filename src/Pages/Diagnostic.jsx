import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatView, { msg } from '../components/ChatView.jsx';
import { useGame } from '../context/GameContext.jsx';
import { DIAGNOSTIC } from '../data/stories.js';
import { bandForScore, shuffle } from '../lib/bands.js';

const questions = DIAGNOSTIC.questions;
const GUIDE = 'Guide';

const intro = () =>
  msg('npc', "Welcome, explorer! Before we climb, I'll show you a few short passages. Read each one carefully and pick the best answer. There's no penalty, it just helps me find the right trail for you.", { speaker: GUIDE });

const passage = (i) =>
  msg('npc', questions[i].passage, { speaker: GUIDE });

// Placement diagnostic: same chat UI as the stories, but no points, no hints and
// no feedback on individual answers. The total score sets the starting reading band.
export default function Diagnostic() {
  const game = useGame();
  const navigate = useNavigate();

  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [band, setBand] = useState(null); // set once all questions are answered
  const [options, setOptions] = useState(() => shuffle(questions[0].options));
  const [messages, setMessages] = useState(() => [intro(), passage(0)]);

  function answer(option) {
    const total = score + (option.isCorrect ? 1 : 0);
    const player = msg('player', option.text);
    setScore(total);

    if (i + 1 < questions.length) {
      setI(i + 1);
      setOptions(shuffle(questions[i + 1].options));
      setMessages((m) => [...m, player, passage(i + 1)]);
    } else {
      const result = bandForScore(total, DIAGNOSTIC.scoringRules);
      setBand(result);
      setMessages((m) => [
        ...m,
        player,
        msg('npc', `All done! I'll start you on Grades ${result} stories. As you read, the trail will adjust to you.`, { speaker: GUIDE }),
      ]);
    }
  }

  function finish() {
    game.completeDiagnostic(band);
    navigate('/home', { replace: true });
  }

  function skip() {
    game.skipDiagnostic();
    navigate('/home', { replace: true });
  }

  return (
    <ChatView title="Placement" subtitle={DIAGNOSTIC.title} messages={messages} hideNav>
      {band === null ? (
        <section className="choices" aria-label="Your answer">
          <p className="choices__prompt">
            <span className="pill pill--butter">Question {i + 1} of {questions.length}</span>{' '}
            {questions[i].question}
          </p>
          {options.map((o) => (
            <button key={o.text} type="button" className="bubble bubble--player bubble--choice" onClick={() => answer(o)}>
              {o.text}
            </button>
          ))}
          <button type="button" className="linkbtn" onClick={skip}>Skip for now</button>
        </section>
      ) : (
        <div className="choices">
          <button type="button" className="btn btn--solid" onClick={finish}>Start exploring</button>
        </div>
      )}
    </ChatView>
  );
}

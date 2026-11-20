import { useEffect, useRef, useState } from 'react';
import Screen from './Screen.jsx';
import Landscape from './Avatar.jsx';
import { SendIcon } from './Icons.jsx';

let uid = 0;
/** Message factory: from = 'npc' | 'player'. */
export const msg = (from, text, extra = {}) => ({ id: ++uid, from, text, ...extra });

/**
 * The chat screen shared by stories and the placement diagnostic.
 * - `messages`  NPC / player bubbles
 * - `children`  the footer area (answer choices, Continue button...)
 * - `onSend`    optional; when given, shows the "Write your message here" box
 */
export default function ChatView({ title, subtitle, messages, children, onSend, hideNav = false }) {
  const endRef = useRef(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  const submit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
  };

  return (
    <Screen title={title} subtitle={subtitle} className="screen--chat" hideNav={hideNav}>
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
        {children}
        {onSend && (
          <form className="composer" onSubmit={submit}>
            <label className="sr-only" htmlFor="chat-input">Write your message</label>
            <input id="chat-input" placeholder="Write your message here" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button type="submit" aria-label="Send message"><SendIcon width={26} height={26} /></button>
          </form>
        )}
      </div>
    </Screen>
  );
}

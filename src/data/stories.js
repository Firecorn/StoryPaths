// Stories are plain JSON files in src/Stories/ (story1.json, story2.json, ...).
// Drop in a new story*.json and it appears in the Stories grid automatically.
//
// JSON shape (per story):
//   questId, title, startingNodeId, [category]
//   nodes[id].speaker
//   nodes[id].variants["3-4" | "5-6" | "7-8"] = { passage, vocabulary, question, skillType, options[] }
//   option = { text, isCorrect, nextNodeId?, scaffoldHint? }
//     - one correct option  -> comprehension question (earns Clarity Points, wrong answers show the hint)
//     - several correct     -> "choose your path" node (no points, each option leads to a different node)
//     - nextNodeId "victory" (any id that isn't a node) ends the quest.

import diagnostic from '../Stories/diagnostictest.json';

const files = import.meta.glob('../Stories/story*.json', { eager: true, import: 'default' });

export const CATEGORIES = [
  { id: 'adventure', label: 'Adventure', emoji: '🧭' },
  { id: 'mystery', label: 'Mystery', emoji: '🔍' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🐉' },
];

// Used only if a story JSON has no "category" field.
const CATEGORY_BY_ID = {
  quest_01_mountain: 'adventure',
  quest_02_beach: 'mystery',
  quest_03_observatory: 'science',
};

/** Longest route through the story, so progress % = nodes visited / this. */
function longestPath(nodes, id, memo = {}) {
  if (!nodes[id]) return 0;
  if (id in memo) return memo[id];
  memo[id] = 0; // guards against cycles
  const first = Object.values(nodes[id].variants)[0];
  const next = first.options.filter((o) => o.isCorrect).map((o) => o.nextNodeId);
  memo[id] = 1 + Math.max(0, ...next.map((n) => longestPath(nodes, n, memo)));
  return memo[id];
}

export const STORIES = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, d]) => ({
    id: d.questId,
    title: d.title,
    category: d.category ?? CATEGORY_BY_ID[d.questId] ?? 'adventure',
    available: true,
    start: d.startingNodeId,
    nodes: d.nodes,
    length: longestPath(d.nodes, d.startingNodeId),
  }));

export const getStory = (id) => STORIES.find((s) => s.id === id);

export const DIAGNOSTIC = diagnostic;

export const NOTE_TOPICS = [
  { id: 'main-idea', title: 'Main Idea', tip: 'Ask: what is this passage mostly about? Details support the main idea; they are not the main idea.' },
  { id: 'context-clues', title: 'Context Clues', tip: 'When a word is new, read the sentences around it. Look for examples, opposites, or explanations.' },
  { id: 'inference', title: 'Inference', tip: 'Combine clues in the text with what you already know to work out what the author did not say.' },
  { id: 'structure', title: 'Text Structure', tip: 'Is it cause and effect, compare and contrast, or a sequence? Signal words like "because" and "first" help.' },
  { id: 'vocabulary', title: 'Vocabulary', tip: 'Collect new words here. Try using each one in a sentence of your own.' },
  { id: 'summary', title: 'Summarize', tip: 'Retell the most important events or ideas in 2–3 sentences, in your own words.' },
];

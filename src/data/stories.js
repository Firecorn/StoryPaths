// Branching story content.
//
// node.variants  -> the same passage written at several reading levels; the adaptive engine picks one.
// node.question  -> text-dependent question. `type` is main idea / context clue / inference.
//   onCorrect / onWrong are node ids, so the branch depends on reading accuracy, not chance.
// node.progress  -> 0-100, drives the "Quest Completion" gauge on Home.
// node.end       -> true on the final node.

export const CATEGORIES = [
  { id: 'adventure', label: 'Adventure', emoji: '🧭' },
  { id: 'mystery', label: 'Mystery', emoji: '🔍' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🐉' },
];

export const STORIES = [
  {
    id: 'mount-quill',
    title: 'The Peak of Mount Quill',
    category: 'adventure',
    available: true,
    start: 'peak',
    nodes: {
      peak: {
        speaker: 'Wren',
        progress: 10,
        variants: [
          "Welcome, climber! You are on top of Mount Quill. The wind is strong up here. It blows snow and leaves all around. Many climbers turn back because of the wind. But the wind also keeps the path clear. It pushes loose rocks off the trail.",
          "Welcome to the peak of Mount Quill, traveler. The wind up here howls day and night, and most climbers believe it is their enemy. Yet the wind is also the mountain's sweeper: it carries away loose stones and snow, leaving the ridge path safe for anyone who knows how to read it.",
          "Welcome to the summit of Mount Quill, traveler. Climbers have long cursed the relentless wind that scours this peak, regarding it as an adversary to be endured. Experienced guides, however, recognize it as the mountain's caretaker, since it continually sweeps away loose rubble and fresh snow, preserving a navigable ridge for those perceptive enough to use it.",
        ],
        question: {
          type: 'Main idea',
          prompt: 'What is the main idea of what Wren told you?',
          options: [
            { id: 'a', text: 'The wind is dangerous, so climbers should turn back.' },
            { id: 'b', text: 'Although climbers dislike the wind, it helps keep the path safe.', correct: true },
            { id: 'c', text: 'Mount Quill is the tallest mountain in the world.' },
          ],
          points: 20,
          correctFeedback: 'Sharp reading! The wind clears the path. The ridge route is open to you.',
          explain: 'Not quite. Wren says the wind clears loose rocks and snow. Ask yourself what the whole passage is mostly about.',
          onCorrect: 'ridge',
          onWrong: 'trail',
        },
      },

      ridge: {
        speaker: 'Wren',
        progress: 55,
        variants: [
          'The ridge path is narrow and treacherous. One wrong step and you could slip off the edge. Walk slowly, and keep your eyes on your feet. A careful climber is a safe climber.',
          "Ahead lies the ridge, a treacherous path barely wider than your boots. One careless step could send you tumbling down the slope, so move slowly and test each stone before trusting it.",
          "Ahead stretches the ridge, a treacherous spine of rock scarcely wider than a climber's boots. A single careless step could send you plummeting down the slope, so proceed deliberately and test each stone before entrusting your weight to it.",
        ],
        question: {
          type: 'Context clue',
          prompt: 'Using clues from the passage, what does "treacherous" most likely mean?',
          options: [
            { id: 'a', text: 'Dangerous, with hidden risks', correct: true },
            { id: 'b', text: 'Warm and comfortable' },
            { id: 'c', text: 'Very short' },
          ],
          points: 25,
          correctFeedback: 'Yes! Clues like "one wrong step" and "slip off the edge" point to danger.',
          explain: 'Look at the clues around the word: "one wrong step", "slip off the edge". They all describe danger.',
          vocab: { word: 'treacherous', definition: 'Dangerous, especially in a way that is hard to see coming.' },
          onCorrect: 'summit',
          onWrong: 'cave',
        },
      },

      trail: {
        speaker: 'Wren',
        progress: 35,
        variants: [
          'The lower trail is slow, but it passes an old stone hut. Smoke curls from the chimney. Two mugs sit steaming on the table. Nobody is inside.',
          'The lower trail is slow, but it passes an old stone hut. Smoke still curls from the chimney, and two mugs sit steaming on the table. The door hangs open, yet nobody is inside.',
          'The lower trail is laborious, but it passes an abandoned-looking stone hut. Smoke still curls from the chimney, two mugs sit steaming on the table, and the door hangs ajar, yet not a soul is visible within.',
        ],
        question: {
          type: 'Inference',
          prompt: 'What can you infer from the hut?',
          options: [
            { id: 'a', text: 'Someone was here very recently.', correct: true },
            { id: 'b', text: 'The hut has been empty for years.' },
            { id: 'c', text: 'The mugs were left for you.' },
          ],
          points: 20,
          correctFeedback: 'Nice inference! Steam and smoke mean someone just left. You find a shortcut back to the ridge.',
          explain: 'The text never says who was here, but steaming mugs and smoking chimneys are clues that someone left only moments ago.',
          onCorrect: 'ridge',
          onWrong: 'cave',
        },
      },

      cave: {
        speaker: 'Wren',
        progress: 70,
        variants: [
          'Wren leads you into a quiet cave to rest. "Slow and steady," Wren says. "Read the clues again before you climb." You feel ready for the last stretch to the top.',
        ],
        next: 'summit',
      },

      summit: {
        speaker: 'Wren',
        progress: 100,
        end: true,
        variants: [
          'You made it! From the summit you can see every valley below. Wren smiles. "Every good climber reads the mountain first. You read it well."',
        ],
      },
    },
  },

  // Placeholders so the Stories grid has content. Flip `available` once you add nodes.
  { id: 'lantern-cave', title: 'The Lantern Cave', category: 'mystery', available: false },
  { id: 'river-of-clocks', title: 'River of Clocks', category: 'fantasy', available: false },
  { id: 'sky-garden', title: 'The Sky Garden', category: 'science', available: false },
];

export const getStory = (id) => STORIES.find((s) => s.id === id);

export const NOTE_TOPICS = [
  { id: 'main-idea', title: 'Main Idea', tip: 'Ask: what is this passage mostly about? Details support the main idea; they are not the main idea.' },
  { id: 'context-clues', title: 'Context Clues', tip: 'When a word is new, read the sentences around it. Look for examples, opposites, or explanations.' },
  { id: 'inference', title: 'Inference', tip: 'Combine clues in the text with what you already know to work out what the author did not say.' },
  { id: 'structure', title: 'Text Structure', tip: 'Is it cause and effect, compare and contrast, or a sequence? Signal words like "because" and "first" help.' },
  { id: 'vocabulary', title: 'Vocabulary', tip: 'Collect new words here. Try using each one in a sentence of your own.' },
  { id: 'summary', title: 'Summarize', tip: 'Retell the most important events or ideas in 2–3 sentences, in your own words.' },
];

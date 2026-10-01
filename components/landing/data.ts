export type DocId = "novel" | "notes" | "paper" | "report" | "manual";

export type SampleDoc = {
  id: DocId;
  file: string;
  label: string;
  pages: number;
  /** Length of the full recording, in seconds. */
  total: number;
  /** Where in the recording the sample page starts, in seconds. */
  start: number;
  /** What the browser voice reads aloud. */
  text: string;
  /** Shown under the hero's "Hear a page" button. */
  title: string;
};

export const DOCS: Record<DocId, SampleDoc> = {
  novel: {
    id: "novel",
    file: "the-long-way-home.pdf",
    label: "Novel",
    pages: 312,
    total: 33160,
    start: 9668,
    text: "The harbour was quiet when Anya came back. The boats sat where she had left them, ropes slack, paint a shade paler than she remembered. Somewhere a radio was playing, low enough to be a rumour.",
    title: "The Long Way Home, chapter 7",
  },
  notes: {
    id: "notes",
    file: "bio101-week3-notes.pdf",
    label: "Class notes",
    pages: 6,
    total: 554,
    start: 112,
    text: "Photosynthesis, part two. Light reactions happen in the thylakoid membranes. Water is split, oxygen is released, and the energy is stored as A T P and N A D P H.",
    title: "BIO 101, week 3 notes",
  },
  paper: {
    id: "paper",
    file: "dawn-chorus-survey.pdf",
    label: "Research paper",
    pages: 14,
    total: 2465,
    start: 0,
    text: "Abstract. We recorded the dawn chorus in forty city parks over two years. In noisier parks, birds began singing earlier and sang at a higher pitch than birds in quiet ones.",
    title: "Dawn chorus survey",
  },
  report: {
    id: "report",
    file: "q3-report.pdf",
    label: "Work report",
    pages: 48,
    total: 5530,
    start: 2290,
    text: "Customer support. Average response time fell from nine hours to just under four. Most of the gain came from the new weekend rota, not from extra staff.",
    title: "Q3 report, page 20",
  },
  manual: {
    id: "manual",
    file: "kettle-k2-manual.pdf",
    label: "Manual",
    pages: 20,
    total: 1490,
    start: 185,
    text: "Before first use. Fill the kettle to the max line, boil it, and pour the water away. Do this twice more to clear any taste from the factory.",
    title: "Kettle K2 user guide",
  },
};

export const SHELF_ORDER: DocId[] = ["novel", "notes", "paper", "report", "manual"];

/** The sample library, newest first. The first row is the one that animates through its statuses. */
export const LIBRARY: { id: DocId; added: string }[] = [
  { id: "notes", added: "Just now" },
  { id: "paper", added: "Yesterday" },
  { id: "report", added: "29 Sep" },
  { id: "manual", added: "12 Sep" },
  { id: "novel", added: "30 Aug" },
];

export const CHAPTER_LABELS = [
  "A listening app for any PDF",
  "Chapter one · It doesn’t have to be a book",
  "Chapter two · Upload it now",
  "Chapter three · Notes",
  "Chapter four · Some nights",
];

export const TICKER: { line: string; file: string }[] = [
  { line: "the harbour was quiet when Anya came back", file: "the-long-way-home.pdf" },
  { line: "light reactions happen in the thylakoid membranes", file: "bio101-week3-notes.pdf" },
  { line: "average response time fell from nine hours to just under four", file: "q3-report.pdf" },
  { line: "birds began singing earlier and sang at a higher pitch", file: "dawn-chorus-survey.pdf" },
  { line: "fill the kettle to the max line, boil it, and pour the water away", file: "kettle-k2-manual.pdf" },
];

export const SHELF_INTRO =
  "The paper due on Thursday, a 48-page report, your notes from week three, the manual for the new kettle. If it has words in it, Audio Book can read it to you. Pick one from the shelf and press play.";

/** The page in the "how it works" scene, one entry per printed line. */
export const STORY_LINES = [
  "Light reactions happen in the",
  "thylakoid membranes. Water is",
  "split, oxygen is released, and",
  "the energy is stored as ATP and",
  "NADPH. The Calvin cycle runs in",
  "the stroma and uses that energy",
  "to turn carbon dioxide into sugar.",
  "Rubisco grabs the CO₂. Slow, but",
  "there is a lot of it.",
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Does it have to be a book?",
    a: "No. Any PDF with text in it works: a paper for class, a work report, your own notes, a manual. Books too.",
  },
  { q: "How big can my PDF be?", a: "Up to 10 MB is recommended." },
  {
    q: "Can I follow along with the words?",
    a: "Yes. The text from each page sits beside the player, so you can read along whenever you want to.",
  },
  {
    q: "Where do my PDFs go?",
    a: "Into your library. Each one shows its status and the day you added it, and the original PDF is always one click away.",
  },
  {
    q: "How do I sign in?",
    a: "With your Google account, or with an email and a password. If you forget the password, you can reset it from the sign-in page.",
  },
];

export const EVENING: { time: string; text: string }[] = [
  { time: "9:12 pm", text: "You open q3-report.pdf. 48 pages, and the meeting is at nine." },
  { time: "10:05 pm", text: "Page 19. The lines start to swim." },
  { time: "10:31 pm", text: "You read the same paragraph a third time." },
  { time: "10:32 pm", text: "You upload it to Audio Book instead." },
];

// ---------------------------------------------------------------- decoration

/** A rising music note: [left %, horizontal drift px, size px, duration s, delay s, glyph]. */
export type NoteSpec = [left: number, dx: number, size: number, dur: number, delay: number, glyph: 1 | 2];

/** Notes that always drift up from the hero book. */
export const HERO_NOTES_IDLE: NoteSpec[] = [
  [40, -46, 20, 11, -1.5, 1],
  [55, 38, 16, 13, -6, 2],
  [47, -18, 14, 12, -9.5, 1],
  [60, 64, 22, 14, -3.2, 1],
  [36, -70, 16, 15, -11, 2],
  [52, 10, 12, 10, -4.4, 1],
];

/** Extra notes while the sample is playing. */
export const HERO_NOTES_PLAYING: NoteSpec[] = [
  [44, -40, 24, 7.5, -0.5, 2],
  [58, 52, 26, 8, -2.5, 1],
  [50, -6, 20, 7, -4.2, 1],
  [38, -84, 20, 8.5, -6.1, 1],
  [63, 90, 22, 7.8, -1.2, 2],
  [48, 30, 28, 9, -5.4, 1],
  [54, -60, 22, 7.2, -3.3, 1],
  [41, 70, 18, 8.8, -7.4, 2],
];

/** Notes above the shelf page that is playing. */
export const SHELF_NOTES: NoteSpec[] = [
  [18, -22, 22, 3.4, 0, 1],
  [36, 14, 18, 3.9, 1.3, 2],
  [55, -10, 24, 3.2, 0.6, 1],
  [72, 20, 19, 4.1, 2, 2],
  [86, -16, 17, 3.6, 2.7, 1],
];

/** Sparkles on the hero art: [left %, top %, width %, delay s]. */
export const HERO_TWINKLES: [number, number, number, number][] = [
  [50.6, 6.4, 6.4, 0],
  [41.6, 18.8, 4.2, 1.7],
  [66.9, 36.6, 4.6, 3.1],
];

/** Notes that lift off the page in the "how it works" scene: [dx px, dy px, top px, left px, glyph]. */
export const STORY_NOTES: [number, number, number, number, 1 | 2][] = [
  [430, -130, 114, 150, 1],
  [480, -80, 134, 110, 2],
  [410, -160, 154, 170, 1],
  [520, -110, 174, 90, 1],
  [460, -50, 194, 160, 2],
  [550, -140, 214, 120, 1],
  [440, -100, 234, 70, 1],
  [500, -70, 254, 140, 2],
  [570, -120, 274, 60, 1],
];

/** Gold specks: [left %, top %, size px, duration s, delay s]. */
export type SpeckSpec = [left: number, top: number, size: number, dur: number, delay: number];

export const DUST: SpeckSpec[] = [
  [24.8, 51.9, 2.7, 8.6, -6.3],
  [8.3, 5.2, 3.7, 6.6, -2.3],
  [97.6, 45.4, 3.7, 7.9, -6.4],
  [16.5, 59.9, 3.7, 8.1, -7.4],
  [66.5, 9.6, 3.5, 8.5, -3],
  [5, 80.2, 2.9, 9.3, -8.8],
  [70.6, 85.1, 2.8, 9.8, -4.4],
  [91.8, 81.3, 2.2, 5.8, -2.2],
  [94.7, 42.4, 3.3, 6.8, -5.1],
  [39, 34.9, 3.2, 8.5, -9],
  [67.5, 85.7, 3.7, 10.9, -6.7],
  [17.7, 79.7, 3.9, 10.4, -5.7],
  [70.5, 22.6, 3.7, 8.4, -2.8],
  [8.1, 79.1, 4, 5.5, -8],
  [41.4, 17.3, 2.6, 9.6, -8.7],
  [6.2, 58.1, 2.1, 9.3, -3.3],
];

export const STARS: SpeckSpec[] = [
  [45.4, 36.5, 3.3, 7.8, -5.1],
  [58.4, 14.7, 2.5, 8.8, -7.9],
  [11, 21.6, 1.8, 9.9, -6.9],
  [6, 61, 3.3, 8.9, -6.2],
  [17.1, 4.9, 2.6, 5.4, -1.9],
  [25.2, 5.7, 2.4, 7.6, -8.4],
  [51.8, 41.1, 2.5, 9, -4.6],
  [28.7, 61.9, 3.4, 10, -7.1],
  [32.3, 17.3, 2.1, 5.4, -7.7],
  [40.4, 53.1, 2.3, 10.7, -8.5],
  [2.1, 16.2, 3.2, 7.8, -9.8],
  [40.2, 8.2, 2.7, 9.7, -2.7],
  [10.4, 23.3, 3.3, 9.5, -1.2],
  [25.7, 9.9, 1.7, 9.8, -1.8],
  [55.7, 30, 1.9, 9.4, -1.3],
  [63.8, 10.8, 2.4, 6.3, -2.7],
  [95.2, 50.6, 2.1, 10.3, -2.1],
  [39.9, 53.6, 2.8, 5.6, -9.9],
  [22.5, 19, 3, 7, -3],
  [9, 9.2, 2.6, 6.5, -6],
  [37.7, 30.3, 3.3, 7.9, -5.7],
  [85.2, 14.6, 1.9, 10.5, -8.2],
  [26, 15, 2.9, 10.6, -2],
  [93.2, 55.2, 2.7, 7.5, -1],
  [5.7, 59.8, 2, 9.2, -2.6],
  [81.1, 38.6, 2.1, 6.1, -7.2],
];

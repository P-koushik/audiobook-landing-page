import { DOCS, type DocId } from "./data";

export type PlayerState = {
  cur: DocId;
  playing: boolean;
  /** Seconds into the sample. */
  t: number;
  ended: boolean;
};

type Timeline = {
  sentences: string[];
  /** Start time of each sentence, plus the end time as the last entry. */
  marks: number[];
  duration: number;
};

const WORDS_PER_SECOND = 2.55;

function buildTimeline(text: string): Timeline {
  const sentences = (text.match(/[^.!?]+[.!?]+/g) ?? [text]).map((s) => s.trim());
  const marks = [0];
  let acc = 0;
  for (const s of sentences) {
    acc += s.split(/\s+/).length / WORDS_PER_SECOND + 0.35;
    marks.push(acc);
  }
  return { sentences, marks, duration: acc };
}

const TIMELINES = Object.fromEntries(
  Object.values(DOCS).map((d) => [d.id, buildTimeline(d.text)]),
) as Record<DocId, Timeline>;

// Preferred voices, best first. Voices installed on the device are always tried before
// online ones (like Chrome's "Google …" voices), which often start late or not at all.
const VOICE_PREFS = [
  /Samantha/i,
  /Serena/i,
  /Daniel/i,
  /Karen/i,
  /Moira/i,
  /natural/i,
  /Aria/i,
  /Jenny/i,
  /Libby/i,
  /Sonia/i,
  /Zira/i,
  /Google UK English Female/i,
  /Google US English/i,
];

function sentenceAt(tl: Timeline, t: number) {
  let i = 0;
  while (i < tl.sentences.length - 1 && tl.marks[i + 1] <= t) i++;
  return i;
}

/**
 * Plays the sample pages with the browser's speech synthesis, and keeps a clock
 * running alongside it so the player UI moves even when no voice is available.
 * Exposes a `subscribe`/`getSnapshot` pair for `useSyncExternalStore`.
 */
export class SamplePlayer {
  private state: PlayerState = { cur: "novel", playing: false, t: 0, ended: false };
  private listeners = new Set<() => void>();

  private voices: SpeechSynthesisVoice[] = [];
  /** Voices that failed to speak; skipped from then on. */
  private badVoices = new Set<string>();
  /** Held so Chrome doesn't garbage-collect it mid-sentence and drop its `end` event. */
  private utterance?: SpeechSynthesisUtterance;
  private token = 0;
  private sentence = 0;
  private speaking = false;
  private started = false;
  private spokeAt = 0;
  private lastTick = 0;
  private clock?: ReturnType<typeof setInterval>;
  private watchdog?: ReturnType<typeof setTimeout>;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  private set(patch: Partial<PlayerState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  /** Call once the page is in the browser. Returns the cleanup. */
  mount() {
    const synth = window.speechSynthesis;
    if (synth) {
      this.loadVoices();
      synth.addEventListener("voiceschanged", this.loadVoices);
    }
    return () => {
      this.stop();
      this.set({ playing: false });
      synth?.removeEventListener("voiceschanged", this.loadVoices);
    };
  }

  private loadVoices = () => {
    try {
      this.voices = window.speechSynthesis.getVoices() ?? [];
    } catch {}
  };

  // ------------------------------------------------------------ controls

  toggle = () => {
    if (this.state.playing) this.pause();
    else this.play();
  };

  skip = (dir: 1 | -1) => {
    const tl = TIMELINES[this.state.cur];
    const { playing, ended } = this.state;
    const t = ended ? tl.duration : this.state.t;
    const si = sentenceAt(tl, t);
    const target = dir < 0 ? (t - tl.marks[si] > 1.5 ? si : Math.max(0, si - 1)) : si + 1;
    if (target >= tl.sentences.length) {
      this.end();
      return;
    }
    this.sentence = target;
    this.set({ t: tl.marks[target], ended: false });
    if (playing) {
      this.speaking = this.speakFrom(target);
      this.startClock();
    }
  };

  /** Play `id`, or toggle it if it is already the current sample. */
  pick = (id: DocId) => {
    if (this.state.cur === id) {
      this.toggle();
      return;
    }
    this.stop();
    this.set({ cur: id, t: 0, ended: false, playing: false });
    this.play();
  };

  // ------------------------------------------------------------ engine

  private play() {
    const tl = TIMELINES[this.state.cur];
    let t = this.state.t;
    if (this.state.ended || t >= tl.duration - 0.1) t = 0;
    const si = sentenceAt(tl, t);
    this.sentence = si;
    this.set({ playing: true, ended: false, t: tl.marks[si] });
    this.speaking = this.speakFrom(si);
    this.startClock();
  }

  private pause() {
    this.stop();
    this.set({ playing: false });
  }

  private end() {
    const tl = TIMELINES[this.state.cur];
    this.stop();
    this.set({ playing: false, ended: true, t: tl.duration });
  }

  private stop() {
    this.token++;
    clearInterval(this.clock);
    clearTimeout(this.watchdog);
    try {
      window.speechSynthesis?.cancel();
    } catch {}
    this.utterance = undefined;
    this.speaking = false;
  }

  private voiceAvailable() {
    return (
      typeof window !== "undefined" &&
      !!window.speechSynthesis &&
      typeof SpeechSynthesisUtterance !== "undefined"
    );
  }

  private pickVoice() {
    const all = this.voices.length ? this.voices : window.speechSynthesis.getVoices();
    const en = all.filter((v) => /^en([-_]|$)/i.test(v.lang || "") && !this.badVoices.has(v.voiceURI));
    const local = en.filter((v) => v.localService);
    for (const pool of [local, en]) {
      for (const pref of VOICE_PREFS) {
        const v = pool.find((x) => pref.test(x.name));
        if (v) return v;
      }
      const v = pool.find((x) => x.default) ?? pool[0];
      if (v) return v;
    }
    return null;
  }

  /** Speak from sentence `i` onwards. Returns false when there is no voice to use. */
  private speakFrom(i: number) {
    if (!this.voiceAvailable()) return false;
    const synth = window.speechSynthesis;
    const tl = TIMELINES[this.state.cur];
    const token = ++this.token;
    try {
      if (synth.speaking || synth.pending) synth.cancel();
      // Chrome can get stuck paused, e.g. after the tab was in the background.
      synth.resume();
    } catch {}
    // One voice for the whole sample, so it doesn't change mid-page.
    const voice = this.pickVoice();

    const say = (k: number) => {
      if (token !== this.token) return;
      if (k >= tl.sentences.length) {
        this.end();
        return;
      }
      this.sentence = k;
      const u = new SpeechSynthesisUtterance(tl.sentences[k]);
      u.rate = 0.94;
      u.pitch = 1;
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      } else {
        u.lang = "en-GB";
      }
      u.onstart = () => {
        if (token !== this.token) return;
        this.started = true;
        this.spokeAt = performance.now();
      };
      u.onend = () => {
        if (token !== this.token) return;
        this.spokeAt = performance.now();
        if (this.state.t < tl.marks[k + 1]) this.set({ t: tl.marks[k + 1] });
        say(k + 1);
      };
      u.onerror = (e) => {
        if (token !== this.token || e.error === "interrupted" || e.error === "canceled") return;
        if (voice) this.badVoices.add(voice.voiceURI);
        this.speaking = false;
      };
      this.utterance = u;
      try {
        synth.speak(u);
      } catch {
        this.speaking = false;
      }
    };

    this.started = false;
    this.spokeAt = performance.now();
    // Speak straight away, inside the click: Safari and iOS refuse speech that starts later.
    say(i);
    clearTimeout(this.watchdog);
    // Some voices are listed but never speak. Skip that voice next time and let the
    // silent clock carry this play to the end.
    this.watchdog = setTimeout(() => {
      if (token !== this.token || this.started) return;
      if (voice) this.badVoices.add(voice.voiceURI);
      this.speaking = false;
      try {
        synth.cancel();
      } catch {}
    }, 2200);
    return true;
  }

  private startClock() {
    clearInterval(this.clock);
    this.lastTick = performance.now();
    this.clock = setInterval(() => {
      const now = performance.now();
      const dt = (now - this.lastTick) / 1000;
      this.lastTick = now;
      const tl = TIMELINES[this.state.cur];
      let t = this.state.t + dt;
      if (this.speaking && this.started && now - this.spokeAt > 12000) this.speaking = false;
      if (this.speaking) {
        // While the voice is speaking, never run ahead of the sentence it is on.
        const cap = tl.marks[Math.min(this.sentence + 1, tl.marks.length - 1)] - 0.05;
        if (t > cap) t = cap;
      } else {
        this.sentence = sentenceAt(tl, t);
        if (t >= tl.duration) {
          this.end();
          return;
        }
      }
      this.set({ t });
    }, 200);
  }
}

function formatTime(sec: number, long: boolean) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const p2 = (x: number) => String(x).padStart(2, "0");
  return long ? `${h}:${p2(m)}:${p2(s)}` : `${p2(m)}:${p2(s)}`;
}

/** What the player UI shows: the sample sits inside a longer recording. */
export function playbackView(state: PlayerState) {
  const doc = DOCS[state.cur];
  const elapsed = Math.min(doc.total, doc.start + state.t);
  const long = doc.total >= 3600;
  return {
    doc,
    elapsed: formatTime(elapsed, long),
    total: formatTime(doc.total, long),
    progress: elapsed / doc.total,
  };
}

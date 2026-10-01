"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { cx, SvgDefs } from "./decor";
import { MiniPlayer } from "./MiniPlayer";
import { SamplePlayer, type PlayerState } from "./player";

export type Mode = {
  /** False on the server and during hydration. */
  ready: boolean;
  /** Scroll and reveal motion, off for prefers-reduced-motion. */
  motion: boolean;
  /** Wide enough for the pinned, scroll-driven "how it works" scene. */
  wide: boolean;
  /** A fine pointer on a wide screen: the hero art follows the cursor. */
  parallax: boolean;
};

type Landing = {
  player: SamplePlayer;
  playback: PlayerState;
  mode: Mode;
  setPlayerInView: (v: boolean) => void;
  setHearInView: (v: boolean) => void;
};

const LandingContext = createContext<Landing | null>(null);

export function useLanding() {
  const value = useContext(LandingContext);
  if (!value) throw new Error("useLanding must be used inside <LandingRoot>");
  return value;
}

// ---------------------------------------------------------------- mode, as a bitmask snapshot

const READY = 1;
const MOTION = 2;
const WIDE = 4;
const PARALLAX = 8;

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_QUERY = "(pointer: fine)";

function subscribeMode(onChange: () => void) {
  const queries = [matchMedia(REDUCE_QUERY), matchMedia(FINE_QUERY)];
  window.addEventListener("resize", onChange);
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => {
    window.removeEventListener("resize", onChange);
    queries.forEach((q) => q.removeEventListener("change", onChange));
  };
}

function modeSnapshot() {
  const motion = !matchMedia(REDUCE_QUERY).matches;
  const w = window.innerWidth;
  let bits = READY;
  if (motion) bits |= MOTION;
  if (w > 960) bits |= WIDE;
  if (motion && w > 999 && matchMedia(FINE_QUERY).matches) bits |= PARALLAX;
  return bits;
}

function useMode(): Mode {
  const bits = useSyncExternalStore(subscribeMode, modeSnapshot, () => 0);
  return {
    ready: !!(bits & READY),
    motion: !!(bits & MOTION),
    wide: !!(bits & WIDE),
    parallax: !!(bits & PARALLAX),
  };
}

// ---------------------------------------------------------------- root

/** Fades and lifts `[data-reveal]` elements in as they scroll into view. */
function useReveal(root: RefObject<HTMLElement | null>, motion: boolean) {
  useEffect(() => {
    const el = root.current;
    if (!el || !motion) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    el.querySelectorAll("[data-reveal]:not([data-in])").forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [root, motion]);
}

export function LandingRoot({ children }: { children: ReactNode }) {
  const [player] = useState(() => new SamplePlayer());
  const playback = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);
  useEffect(() => player.mount(), [player]);

  const mode = useMode();
  const [playerInView, setPlayerInView] = useState(false);
  const [hearInView, setHearInView] = useState(false);
  const showMini = playback.playing && !playerInView && !hearInView;

  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef, mode.motion);

  return (
    <LandingContext value={{ player, playback, mode, setPlayerInView, setHearInView }}>
      <div ref={rootRef} data-root="" className={cx("ab", mode.motion && "m-on", showMini && "mini-on")}>
        <SvgDefs />
        {children}
        <MiniPlayer show={showMini} />
      </div>
    </LandingContext>
  );
}

"use client";

import { cx } from "./decor";
import { PlayPauseIcon } from "./icons";
import { useLanding } from "./LandingRoot";
import { playbackView } from "./player";

/** Follows the visitor down the page while a sample plays and the main controls are off screen. */
export function MiniPlayer({ show }: { show: boolean }) {
  const { player, playback } = useLanding();
  const view = playbackView(playback);
  return (
    <div className={cx("mini", playback.playing && "is-playing", show && "show")} role="group" aria-label="Now playing">
      <button
        type="button"
        className="pb"
        onClick={player.toggle}
        aria-label={playback.playing ? "Pause" : `Play ${view.doc.file}`}
      >
        <PlayPauseIcon size={20} />
      </button>
      <span className="mtext">
        <span className="mfile">{view.doc.file}</span>
        <span className="ts">
          {view.elapsed} / {view.total}
        </span>
      </span>
    </div>
  );
}

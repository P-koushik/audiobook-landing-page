"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { DOCS, DUST, SHELF_INTRO, SHELF_NOTES, SHELF_ORDER, type DocId } from "./data";
import { cx, MossEdge, RisingNote, Specks, type Vars } from "./decor";
import { onInView, onScrollFrame, unit } from "./dom";
import { ArrowLeftIcon, ArrowRightIcon, PlayPauseIcon, SkipBackIcon, SkipForwardIcon } from "./icons";
import { useLanding } from "./LandingRoot";
import { playbackView } from "./player";
import { SHELF_PAGES } from "./ShelfPages";

const SHELF_GAP = 48;
const INTRO_WORDS = SHELF_INTRO.split(" ");

/** The intro paragraph, which inks in word by word as it scrolls up. */
function FillParagraph({ motion }: { motion: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fill = ref.current;
    if (!fill || !motion) return;
    const stop = onScrollFrame(() => {
      const vh = window.innerHeight;
      const r = fill.getBoundingClientRect();
      const p = unit((vh * 0.9 - r.top) / (r.height + vh * 0.32));
      fill.style.setProperty("--k", (p * (INTRO_WORDS.length + 3) - 1).toFixed(2));
    });
    return () => {
      stop();
      fill.style.removeProperty("--k");
    };
  }, [motion]);

  return (
    <p ref={ref} className="dropcap fill">
      {INTRO_WORDS.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="cw" style={{ "--i": i } as Vars}>
            {w}
          </span>
        </Fragment>
      ))}
    </p>
  );
}

function ShelfItem({ id, index, onPick }: { id: DocId; index: number; onPick: (id: DocId) => void }) {
  const { playback } = useLanding();
  const doc = DOCS[id];
  const on = playback.cur === id;
  const PageArt = SHELF_PAGES[id];
  return (
    <div className="sitem" role="listitem">
      <button
        type="button"
        className={cx("spg", on && "on", on && playback.playing && "is-playing")}
        onClick={() => onPick(id)}
        aria-pressed={on}
        aria-label={`${doc.label}: ${doc.file}, ${doc.pages} pages`}
      >
        <span className="snotes" aria-hidden="true">
          {SHELF_NOTES.map((spec, i) => (
            <RisingNote key={i} spec={spec} />
          ))}
        </span>
        <span className="bm" aria-hidden="true" />
        <PageArt />
      </button>
      <p className="slab">
        <span className="sno">No. {index + 1}</span>
        <span className="sty">{doc.label}</span>
        <span className="spg2">{doc.pages} pages</span>
      </p>
    </div>
  );
}

function Dock() {
  const { player, playback, setPlayerInView } = useLanding();
  const ref = useRef<HTMLDivElement>(null);
  const view = playbackView(playback);

  useEffect(() => {
    const dock = ref.current;
    if (dock) return onInView(dock, setPlayerInView);
  }, [setPlayerInView]);

  return (
    <div ref={ref} className="dock">
      <div className={cx("player", playback.playing && "is-playing")} role="group" aria-label="Sample player">
        <div className="pctl">
          <button type="button" className="skip" onClick={() => player.skip(-1)} aria-label="Skip back">
            <SkipBackIcon />
          </button>
          <button
            type="button"
            className="pb"
            onClick={player.toggle}
            aria-label={playback.playing ? "Pause" : `Play ${view.doc.file}`}
          >
            <PlayPauseIcon size={24} />
          </button>
          <button type="button" className="skip" onClick={() => player.skip(1)} aria-label="Skip forward">
            <SkipForwardIcon />
          </button>
        </div>
        <div className="pinfo">
          <div className="prow">
            <span className="eq" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="pfile">{view.doc.file}</span>
            <span className="pg">{view.doc.pages} pages</span>
          </div>
          <div className="prow2">
            <span className="ts">{view.elapsed}</span>
            <span className="ptrack" aria-hidden="true">
              <span className="bar" style={{ transform: `scaleX(${view.progress.toFixed(4)})` }} />
            </span>
            <span className="ts">{view.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Chapter one: a shelf of sample PDFs on the moss-green band, with a player under it. */
export function Listen() {
  const { player, mode } = useLanding();
  const bandRef = useRef<HTMLElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [seen, setSeen] = useState(false);

  // The shelf slides in the first time the band comes into view.
  useEffect(() => {
    const band = bandRef.current;
    if (!band || !mode.motion || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.12 },
    );
    io.observe(band);
    return () => io.disconnect();
  }, [mode.motion, seen]);

  // Drag the shelf with a mouse. Touch and trackpads scroll it natively.
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;
    let pointer = -1;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = 0;
      startX = e.clientX;
      startLeft = shelf.scrollLeft;
      pointer = e.pointerId;
    };
    const onMove = (e: PointerEvent) => {
      if (!down || e.pointerId !== pointer) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) {
        moved = Math.abs(dx);
        shelf.classList.add("dragging");
      }
      shelf.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      shelf.classList.remove("dragging");
      // Swallow the click that ends a drag, so it doesn't start a sample.
      dragged.current = moved > 6;
      clearTimeout(timer);
      timer = setTimeout(() => (dragged.current = false), 60);
    };
    shelf.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      shelf.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      clearTimeout(timer);
    };
  }, []);

  const pick = (id: DocId) => {
    if (!dragged.current) player.pick(id);
  };

  const scrollShelf = (dir: 1 | -1) => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const item = shelf.querySelector(".sitem");
    const step = item ? item.getBoundingClientRect().width + SHELF_GAP : 380;
    shelf.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      ref={bandRef}
      id="listen"
      className={cx("band on-moss", seen && "seen")}
      data-moss=""
      data-chapter="1"
      aria-labelledby="listen-title"
    >
      <MossEdge side="top" />
      <MossEdge side="bottom" />
      <div className="dust" aria-hidden="true">
        <Specks specks={DUST} className="dd" />
      </div>
      <div className="wrap g12 bandhead">
        <div className="bh-l" data-reveal="">
          <p className="chap">Chapter one</p>
          <h2 id="listen-title" className="h2xl fx">
            It doesn’t have to be a book.
          </h2>
        </div>
        <div className="bh-r">
          <FillParagraph motion={mode.motion} />
        </div>
      </div>
      <div ref={shelfRef} className="shelf" aria-label="Sample PDFs">
        <div className="strack" role="list">
          {SHELF_ORDER.map((id, i) => (
            <ShelfItem key={id} id={id} index={i} onPick={pick} />
          ))}
        </div>
      </div>
      <div className="wrap shelfbar">
        <Dock />
        <div className="arrows">
          <p className="shint">Drag the shelf, or use the arrows. The preview uses your browser’s voice.</p>
          <button type="button" className="arr" onClick={() => scrollShelf(-1)} aria-label="Previous PDF">
            <ArrowLeftIcon />
          </button>
          <button type="button" className="arr" onClick={() => scrollShelf(1)} aria-label="Next PDF">
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

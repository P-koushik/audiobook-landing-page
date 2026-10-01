"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { DOCS, HERO_NOTES_IDLE, HERO_NOTES_PLAYING, HERO_TWINKLES } from "./data";
import { cx, RisingNote, type Vars } from "./decor";
import { onInView, onScrollFrame, unit } from "./dom";
import { PlayPauseIcon, Sparkle, UploadIcon } from "./icons";
import { useLanding } from "./LandingRoot";

const ART_SIZES = "(max-width: 999px) min(92vw, 480px), min(620px, 43vw)";

/** One layer of the hero watercolour. All layers share the same 960×1035 canvas. */
function Art({ src }: { src: string }) {
  return <Image className="pimg" src={src} alt="" width={960} height={1035} sizes={ART_SIZES} preload />;
}

function Word({ i, children }: { i: number; children: ReactNode }) {
  return (
    <span className="w" aria-hidden="true">
      <span className="wi" style={{ "--d": i } as Vars}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const { player, playback, mode, setHearInView } = useLanding();
  const coverRef = useRef<HTMLElement>(null);
  const hearRef = useRef<HTMLButtonElement>(null);
  const { playing, cur } = playback;
  const doc = DOCS[cur];

  useEffect(() => {
    const hear = hearRef.current;
    if (hear) return onInView(hear, setHearInView);
  }, [setHearInView]);

  // The title and art drift apart as the cover scrolls away.
  useEffect(() => {
    const cover = coverRef.current;
    if (!cover || !mode.motion) return;
    const stop = onScrollFrame(() => {
      const r = cover.getBoundingClientRect();
      cover.style.setProperty("--hs", unit(-r.top / Math.max(1, r.height)).toFixed(3));
    });
    return () => {
      stop();
      cover.style.removeProperty("--hs");
    };
  }, [mode.motion]);

  // The layers of the art lean towards the cursor.
  useEffect(() => {
    const cover = coverRef.current;
    if (!cover || !mode.parallax) return;
    let raf = 0;
    let mx = 0;
    let my = 0;
    const toRange = (v: number) => Math.max(-1, Math.min(1, (v - 0.5) * 2));
    const onMove = (e: PointerEvent) => {
      const r = cover.getBoundingClientRect();
      mx = toRange((e.clientX - r.left) / Math.max(1, r.width));
      my = toRange((e.clientY - r.top) / Math.max(1, r.height));
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          cover.style.setProperty("--mx", mx.toFixed(3));
          cover.style.setProperty("--my", my.toFixed(3));
        });
    };
    const reset = () => {
      cover.style.removeProperty("--mx");
      cover.style.removeProperty("--my");
    };
    cover.addEventListener("pointermove", onMove);
    cover.addEventListener("pointerleave", reset);
    return () => {
      cover.removeEventListener("pointermove", onMove);
      cover.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf);
      reset();
    };
  }, [mode.parallax]);

  return (
    <section ref={coverRef} id="top" className="cover" data-chapter="0" aria-labelledby="hero-title">
      <h1 id="hero-title" className="giant" aria-label="Rest your eyes. Let the page read to you.">
        <span className="g1 fx">
          <Word i={0}>Rest</Word> <Word i={1}>your</Word> <Word i={2}>eyes.</Word>
        </span>
        <span className="g2 gl fx" aria-hidden="true">
          Let the page
        </span>
        <span className="g2 gr fx" aria-hidden="true">
          read to you.
        </span>
      </h1>

      <div className={cx("pop", playing && "is-playing")} aria-hidden="true">
        <div className="pl pl-base">
          <div className="mm">
            <Art src="/images/hero-book.webp" />
          </div>
        </div>
        <div className="pl pl-leaf pl-leafL">
          <div className="mm">
            <div className="pin">
              <Art src="/images/hero-leaf-left.webp" />
            </div>
          </div>
        </div>
        <div className="pl pl-leaf pl-leafR">
          <div className="mm">
            <div className="pin">
              <Art src="/images/hero-leaf-right.webp" />
            </div>
          </div>
        </div>
        <div className="pl pl-music">
          <div className="mm">
            <div className="mlift">
              <div className="mfloat">
                <div className="mrise">
                  <Art src="/images/hero-music.webp" />
                  {HERO_TWINKLES.map(([left, top, width, delay]) => (
                    <span
                      key={`${left}-${top}`}
                      className="tw"
                      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, animationDelay: `${delay}s` }}
                    >
                      <Sparkle />
                    </span>
                  ))}
                  <div className={cx("rise", playing && "is-playing")}>
                    {HERO_NOTES_IDLE.map((spec, i) => (
                      <RisingNote key={`a${i}`} spec={spec} className="nt nt-a" />
                    ))}
                    {HERO_NOTES_PLAYING.map((spec, i) => (
                      <RisingNote key={`b${i}`} spec={spec} className="nt nt-b" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="corner cl">
        <p className="lede">Upload any PDF, not just books, and Audio Book reads it aloud, page by page.</p>
        <div className="ctas">
          <a className="btn btn-p btn-lg" href="#signup">
            <UploadIcon />
            Upload your first PDF
          </a>
        </div>
        <p className="cap">Sign in with Google or email.</p>
      </div>

      <div className="corner cr">
        <button
          ref={hearRef}
          type="button"
          className={cx("hear", playing && "is-on")}
          onClick={player.toggle}
          aria-label={playing ? "Pause the sample" : `Hear a page from ${doc.file}`}
        >
          <span className="hp">
            <PlayPauseIcon size={18} />
          </span>
          <span className="hl">
            <b>{playing ? "Pause" : "Hear a page"}</b>
            <small>{doc.title}</small>
          </span>
          <span className="eq" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
        <p className="cap">The sample uses your browser’s voice.</p>
      </div>
    </section>
  );
}

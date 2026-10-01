import type { CSSProperties } from "react";
import type { NoteSpec, SpeckSpec } from "./data";
import { NoteGlyph } from "./icons";

/** `style` that also accepts CSS custom properties. */
export type Vars = CSSProperties & Record<`--${string}`, string | number>;

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** The gold gradient and the watercolour edge filter, referenced by id across the page. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D8B55E" />
          <stop offset="1" stopColor="#B98A2C" />
        </linearGradient>
        <filter id="wcEdge" x="-5%" y="-60%" width="110%" height="220%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.0028 0.009" numOctaves={3} seed={21} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={38} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation={1.1} result="shape" />
          <feGaussianBlur in="shape" stdDeviation={7} result="inner" />
          <feComposite in="shape" in2="inner" operator="arithmetic" k1={0} k2={1} k3={-1} k4={0} result="rim" />
          <feColorMatrix in="rim" type="matrix" values="0.8 0 0 0 0  0 0.8 0 0 0  0 0 0.8 0 0  0 0 0 0.5 0" result="rimDark" />
          <feMerge>
            <feMergeNode in="shape" />
            <feMergeNode in="rimDark" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/** The painted edge where a moss-green section meets the paper. */
export function MossEdge({ side }: { side: "top" | "bottom" }) {
  return (
    <svg className={`edge edge-${side === "top" ? "top" : "bot"}`} viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
      <g filter="url(#wcEdge)">
        <path
          d={
            side === "top"
              ? "M-80 70C120 44 270 92 430 70S700 36 880 62S1180 96 1300 68S1440 48 1540 58V460H-80Z"
              : "M-80 -260H1540V150C1360 136 1220 176 1010 158S700 130 520 162S200 176 -80 152Z"
          }
          fill="#3E4A28"
        />
      </g>
    </svg>
  );
}

export function RisingNote({ spec, className = "nt" }: { spec: NoteSpec; className?: string }) {
  const [left, dx, size, dur, delay, glyph] = spec;
  const style: Vars = {
    left: `${left}%`,
    "--dx": `${dx}px`,
    width: size,
    height: size,
    animationDuration: `${dur}s`,
    animationDelay: `${delay}s`,
  };
  return (
    <span className={className} style={style}>
      <i>
        <NoteGlyph glyph={glyph} />
      </i>
    </span>
  );
}

/** Drifting gold dust (`dd`) or twinkling stars (`st`). */
export function Specks({ specks, className }: { specks: SpeckSpec[]; className: "dd" | "st" }) {
  return specks.map(([left, top, size, dur, delay], i) => (
    <span
      key={i}
      className={className}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
      }}
    />
  ));
}

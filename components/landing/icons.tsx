import type { ReactNode } from "react";

function Stroke({
  size,
  className,
  children,
}: {
  size: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Both glyphs are rendered; CSS shows one based on `.is-playing` / `.is-on`. */
export function PlayPauseIcon({ size }: { size: number }) {
  return (
    <>
      <Stroke size={size} className="ic-play">
        <path
          d="M8.5 5.6v12.8a.9.9 0 0 0 1.37.77l10.2-6.4a.9.9 0 0 0 0-1.54L9.87 4.83A.9.9 0 0 0 8.5 5.6z"
          fill="currentColor"
          stroke="none"
        />
      </Stroke>
      <Stroke size={size} className="ic-pause">
        <rect x="6.5" y="5" width="4" height="14" rx="1.3" fill="currentColor" stroke="none" />
        <rect x="13.5" y="5" width="4" height="14" rx="1.3" fill="currentColor" stroke="none" />
      </Stroke>
    </>
  );
}

export function UploadIcon() {
  return (
    <Stroke size={18}>
      <path d="M12 15.5v-11" />
      <path d="m7.5 9 4.5-4.5L16.5 9" />
      <path d="M5 19.5h14" />
    </Stroke>
  );
}

export function SkipBackIcon({ size = 20 }: { size?: number }) {
  return (
    <Stroke size={size}>
      <path d="M4.2 12a7.8 7.8 0 1 0 2.5-5.7" />
      <path d="M4.6 3.9v4.4H9" />
    </Stroke>
  );
}

export function SkipForwardIcon() {
  return (
    <Stroke size={20}>
      <path d="M19.8 12a7.8 7.8 0 1 1-2.5-5.7" />
      <path d="M19.4 3.9v4.4H15" />
    </Stroke>
  );
}

export function ArrowLeftIcon() {
  return (
    <Stroke size={20}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </Stroke>
  );
}

export function ArrowRightIcon() {
  return (
    <Stroke size={20}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Stroke>
  );
}

export function SearchIcon() {
  return (
    <Stroke size={18}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </Stroke>
  );
}

export function FileIcon() {
  return (
    <Stroke size={18}>
      <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
      <path d="M14 3.5V8h4.5" />
    </Stroke>
  );
}

export function SparkIcon() {
  return (
    <Stroke size={16}>
      <path
        d="M12 2.5c.75 5.1 3.4 7.75 8.5 8.5-5.1.75-7.75 3.4-8.5 8.5-.75-5.1-3.4-7.75-8.5-8.5 5.1-.75 7.75-3.4 8.5-8.5z"
        fill="currentColor"
        stroke="none"
      />
    </Stroke>
  );
}

// ---------------------------------------------------------------- gold glyphs
// These fill with the `#gold` gradient defined once in <SvgDefs />.

export function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        d="M12 1.5c.8 5.6 3.9 8.7 10.5 10.5-6.6 1.8-9.7 4.9-10.5 10.5C11.2 16.9 8.1 13.8 1.5 12 8.1 10.2 11.2 7.1 12 1.5z"
        fill="url(#gold)"
      />
    </svg>
  );
}

/** A single quaver (1) or a pair of beamed quavers (2). */
export function NoteGlyph({ glyph }: { glyph: 1 | 2 }) {
  return glyph === 1 ? (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <ellipse cx="8.4" cy="17.8" rx="4.3" ry="3.1" transform="rotate(-24 8.4 17.8)" fill="url(#gold)" />
      <path
        d="M11.9 16.6V3.4c2.3 1.4 4.8 2.7 5.5 5.6.4 1.7-.2 3.3-1.3 4.4"
        fill="none"
        stroke="url(#gold)"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <ellipse cx="5.7" cy="19" rx="3.5" ry="2.6" transform="rotate(-24 5.7 19)" fill="url(#gold)" />
      <ellipse cx="17.2" cy="16.8" rx="3.5" ry="2.6" transform="rotate(-24 17.2 16.8)" fill="url(#gold)" />
      <path d="M8.7 18V6.4M20.2 15.8V4.2" fill="none" stroke="url(#gold)" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M8.7 6.4 20.2 4.2v2.9L8.7 9.3z" fill="url(#gold)" />
    </svg>
  );
}

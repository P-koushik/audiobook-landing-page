"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type DragEvent } from "react";
import { DOCS, LIBRARY, STORY_LINES, STORY_NOTES, type DocId } from "./data";
import { cx, type Vars } from "./decor";
import { onScrollFrame, unit } from "./dom";
import { FileIcon, NoteGlyph, PlayPauseIcon, SearchIcon, SkipBackIcon, SparkIcon, UploadIcon } from "./icons";
import { useLanding } from "./LandingRoot";

const LINE = "1px solid #E4DCC4";
const META: CSSProperties = { fontSize: "13px", lineHeight: "18px", fontWeight: 500, color: "#615E45" };
const STORY_MS = 7700;
const MAX_MB = 10;

type Status = "up" | "proc" | "done";

const CHIP: Record<Status, { label: string; style: CSSProperties; dot?: string }> = {
  up: { label: "Uploaded", style: { background: "#FFFDF7", border: LINE, color: "#615E45" }, dot: "#8D8B5A" },
  proc: { label: "Processing", style: { background: "#F2E1BA", color: "#2B2A1C" } },
  done: { label: "Completed", style: { background: "#FAF6EC", border: LINE, color: "#2B2A1C" }, dot: "#3E4A28" },
};

function StatusChip({ status, className }: { status: Status; className: string }) {
  const { label, style, dot } = CHIP[status];
  return (
    <span className={`chip ${className}`} style={style}>
      {dot ? <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: dot }} /> : <span className="spin" />}
      {label}
    </span>
  );
}

/** All three chips stacked in one cell; CSS cross-fades them as the story plays. */
function StatusStack({ prefix, className }: { prefix: "w" | "st"; className: string }) {
  return (
    <span className={className} aria-hidden={prefix === "w" || undefined}>
      <StatusChip status="up" className={`${prefix}-up`} />
      <StatusChip status="proc" className={`${prefix}-proc`} />
      <StatusChip status="done" className={`${prefix}-done`} />
    </span>
  );
}

function FileCell({ name, meta, own }: { name: string; meta: string; own?: boolean }) {
  return (
    <span className="c-file" style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
      <span
        className="ficon"
        style={{
          display: "flex",
          flex: "none",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "40px",
          borderRadius: "6px",
          background: own ? "#FFFDF7" : "#FAF6EC",
          border: LINE,
          color: own ? "#7E5A12" : "#615E45",
        }}
      >
        <FileIcon />
      </span>
      <span style={{ display: "block", minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: "15px",
            lineHeight: "20px",
            fontWeight: 600,
            color: "#2B2A1C",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </span>
        <span style={{ ...META, display: "block" }}>{meta}</span>
      </span>
    </span>
  );
}

function LibraryRow({ id, added, fresh, hidden }: { id: DocId; added: string; fresh: boolean; hidden: boolean }) {
  const { player, playback } = useLanding();
  const doc = DOCS[id];
  const on = playback.playing && playback.cur === id;
  const row = (
    <div className="lrow lgrid" hidden={hidden} style={{ padding: "12px 20px", borderTop: LINE }}>
      <FileCell name={doc.file} meta={`${doc.pages} pages`} />
      <span className="c-status" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {fresh ? (
          <>
            <StatusStack prefix="st" className="stack" />
            <span className="spark" aria-hidden="true" style={{ color: "#C9A045" }}>
              <SparkIcon />
            </span>
          </>
        ) : (
          <StatusChip status="done" className="st-done" />
        )}
      </span>
      <span className="ldate" style={META}>
        {added}
      </span>
      <span className={cx("c-play", fresh && "rp-new")} style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className={cx("rp", on && "is-on")}
          onClick={() => player.pick(id)}
          aria-label={`${on ? "Pause" : "Play"} ${doc.file}`}
        >
          <PlayPauseIcon size={18} />
        </button>
      </span>
    </div>
  );
  return fresh ? <div className="newrow">{row}</div> : row;
}

type OwnFile = { name: string; size: string; status: string; note: string; canHear: boolean };

/** Reads only the name and size of a file the visitor picks. Nothing is uploaded. */
function describeFile(f: File): OwnFile {
  const isPdf = /\.pdf$/i.test(f.name) || f.type === "application/pdf";
  const mb = f.size / 1048576;
  const size = mb >= 0.1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1024))} KB`;
  const name = f.name || "your-file.pdf";
  if (!isPdf)
    return { name, size, status: "Not a PDF", note: "Audio Book reads PDFs. Try one of those instead.", canHear: false };
  if (mb > MAX_MB)
    return {
      name,
      size,
      status: `Over ${MAX_MB} MB`,
      note: `The recommended size is up to ${MAX_MB} MB. Nothing has been uploaded.`,
      canHear: true,
    };
  return { name, size, status: "Ready to upload", note: "Only the name and size were read. Nothing has been uploaded.", canHear: true };
}

function Library() {
  const [q, setQ] = useState("");
  const [own, setOwn] = useState<OwnFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const query = q.trim().toLowerCase();
  const hidden = (id: DocId) => !!query && !DOCS[id].file.toLowerCase().includes(query);
  const noMatch = !!query && LIBRARY.every((r) => hidden(r.id));

  const take = (f: File | undefined) => {
    if (f) setOwn(describeFile(f));
    setDragging(false);
  };

  return (
    <div
      className={cx("lib", dragging && "is-dragging")}
      onDragOver={(e: DragEvent) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e: DragEvent) => {
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        setDragging(false);
      }}
      onDrop={(e: DragEvent) => {
        e.preventDefault();
        take(e.dataTransfer.files[0]);
      }}
      style={{ position: "relative", border: LINE, borderRadius: "12px", background: "#FFFDF7" }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", padding: "16px 20px" }}>
        <label htmlFor="lib-search" style={{ position: "relative", display: "flex", alignItems: "center", flex: "1 1 220px", minWidth: 0 }}>
          <span className="sr">Search your library</span>
          <span style={{ position: "absolute", left: "12px", display: "flex", color: "#615E45" }}>
            <SearchIcon />
          </span>
          <input
            id="lib-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by file name"
            autoComplete="off"
            style={{
              width: "100%",
              height: "44px",
              padding: "0 12px 0 40px",
              border: LINE,
              borderRadius: "6px",
              background: "#FAF6EC",
              color: "#2B2A1C",
              fontSize: "15px",
            }}
          />
        </label>
        <label className="btn btn-p up">
          <UploadIcon />
          Upload PDF
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="sr"
            onChange={(e) => {
              take(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <div
        className="lgrid lhead"
        style={{ padding: "10px 20px", borderTop: LINE, fontSize: "12px", lineHeight: "16px", fontWeight: 600, letterSpacing: "0.02em", color: "#615E45" }}
      >
        <span>File</span>
        <span className="c-status">Status</span>
        <span className="ldate">Uploaded</span>
        <span />
      </div>
      {own && (
        <>
          <div className="lrow lgrid mine" style={{ padding: "12px 20px", borderTop: LINE, background: "#FBF4E2" }}>
            <FileCell name={own.name} meta={own.size} own />
            <span className="c-status">
              <span className="chip" style={{ background: "#FFFDF7", border: LINE, color: "#2B2A1C" }}>
                {own.status}
              </span>
            </span>
            <span className="ldate" style={META}>
              On your computer
            </span>
            <span className="c-play" />
          </div>
          <p style={{ ...META, margin: 0, padding: "10px 20px 14px", background: "#FBF4E2" }}>
            {own.note}
            {own.canHear && (
              <>
                {" "}
                <a href="#signup" style={{ fontWeight: 600, color: "#7E5A12" }}>
                  Make an account to hear it
                </a>
              </>
            )}
          </p>
        </>
      )}
      {LIBRARY.map((r, i) => (
        <LibraryRow key={r.id} id={r.id} added={r.added} fresh={i === 0} hidden={hidden(r.id)} />
      ))}
      {noMatch && (
        <p style={{ margin: 0, padding: "18px 20px", borderTop: LINE, fontSize: "15px", color: "#615E45" }}>
          No file names match “{q}”.
        </p>
      )}
      <div className="dropov" aria-hidden="true">
        Let go to add it to the list
      </div>
    </div>
  );
}

type Story = "static" | "scroll" | "wait" | "run" | "done";

/** Chapter two: a page turns into sound while its library row goes Uploaded → Processing → Completed. */
export function HowItWorks() {
  const { mode } = useLanding();
  const scrubRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const [replays, setReplays] = useState(0);

  // Wide screens scrub the story with the scroll; narrow ones play it once when it comes into view.
  let story: Story;
  if (phase === "run") story = "run";
  else if (!mode.ready) story = "static";
  else if (mode.motion && mode.wide) story = "scroll";
  else if (!mode.motion || phase === "done") story = "done";
  else story = "wait";

  const runStory = useCallback(() => {
    clearTimeout(timer.current);
    setPhase("run");
    setReplays((n) => n + 1);
    timer.current = setTimeout(() => setPhase("done"), STORY_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const scrub = scrubRef.current;
    if (!scrub || story !== "wait") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) runStory();
      },
      { threshold: 0.35 },
    );
    io.observe(scrub);
    return () => io.disconnect();
  }, [story, runStory]);

  useEffect(() => {
    const scrub = scrubRef.current;
    if (!scrub || story !== "scroll") return;
    const stage = scrub.firstElementChild as HTMLElement | null;
    const stop = onScrollFrame(() => {
      const r = scrub.getBoundingClientRect();
      const span = Math.max(1, r.height - (stage?.offsetHeight ?? 0));
      scrub.style.setProperty("--p", unit((76 - r.top) / span).toFixed(4));
    });
    return () => {
      stop();
      scrub.style.removeProperty("--p");
    };
  }, [story]);

  return (
    <section id="how" className="ch2" data-chapter="2" aria-labelledby="how-title">
      <div className="wrap g12 chhead">
        <div className="ch-l" data-reveal="">
          <p className="chap">Chapter two</p>
          <h2 id="how-title" className="h2xl fx">
            Upload it now. Listen when it’s ready.
          </h2>
        </div>
        <div className="ch-r" data-reveal="" style={{ "--rd": "120ms" } as Vars}>
          <p className="dropcap">
            Audio Book takes the text from each page of your PDF and turns it into audio. Your library shows how each file is doing, keeps
            everything you add, and lets you search it by file name.
          </p>
        </div>
      </div>
      <div ref={scrubRef} className={cx("scrub", `story-${story}`, replays % 2 ? "rA" : "rB")}>
        <div className="stage">
          <div className="wrap">
            <div className="statusline" aria-hidden="true">
              <span className="sw sw1 fx">
                Uploaded
                <i />
              </span>
              <span className="sarr">→</span>
              <span className="sw sw2 fx">
                Processing
                <i />
              </span>
              <span className="sarr">→</span>
              <span className="sw sw3 fx">
                Completed
                <i />
              </span>
            </div>
            <div className="pgrid2">
              <div className="scene">
                <Image className="sleaf" src="/images/leaf.webp" alt="" width={188} height={320} />
                <Image className="sleaf sleaf2" src="/images/leaf.webp" alt="" width={188} height={320} />
                <div
                  className="spage"
                  style={{
                    background: "#FFFDF7",
                    border: LINE,
                    borderRadius: "6px",
                    boxShadow: "0 1px 2px rgba(43,42,28,0.06), 0 22px 44px -24px rgba(43,42,28,0.42)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "8.5px",
                      lineHeight: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: "#615E45",
                    }}
                  >
                    <span>BIO 101 · Week 3</span>
                    <span>2 / 6</span>
                  </span>
                  <span style={{ display: "block", marginTop: "10px", fontSize: "15px", lineHeight: "20px", fontWeight: 700, color: "#2B2A1C" }}>
                    Photosynthesis, part 2
                  </span>
                  <span className="slines">
                    {STORY_LINES.map((line, i) => (
                      <span key={i} className="sl" style={{ "--i": i } as Vars}>
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
                {STORY_NOTES.map(([dx, dy, top, left, glyph], i) => (
                  <span key={i} className="sn" style={{ "--i": i, "--dx": `${dx}px`, "--dy": `${dy}px`, top, left } as Vars}>
                    <i>
                      <NoteGlyph glyph={glyph} />
                    </i>
                  </span>
                ))}
                <div className="sfoot">
                  <StatusStack prefix="w" className="sstack" />
                  <button type="button" className="replay" onClick={runStory}>
                    <SkipBackIcon size={16} />
                    Watch it again
                  </button>
                </div>
              </div>
              <div className="libcol">
                <Library />
                <p className="figcap fx">
                  Fig. 2. Drop a PDF on the library, or choose one. Only its name and size are read, and it stays on your computer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

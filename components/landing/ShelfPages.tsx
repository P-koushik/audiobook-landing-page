import type { CSSProperties, ReactNode } from "react";
import type { DocId } from "./data";

// One printed page from each sample PDF, drawn at 340×481.

const INK = "#2B2A1C";
const MUTED = "#615E45";
const LINE = "#E4DCC4";
const PARCHMENT = "#F2E1BA";
const GOLD_DEEP = "#7E5A12";
const SERIF = "var(--font-fraunces), Georgia, 'Times New Roman', serif";
const SANS = "var(--font-figtree), sans-serif";

const PAGE: CSSProperties = {
  background: "#FFFDF7",
  border: `1px solid ${LINE}`,
  borderRadius: "6px",
  boxShadow: "0 1px 2px rgba(43,42,28,0.06), 0 18px 40px -22px rgba(43,42,28,0.38)",
};

function Page({ children }: { children: ReactNode }) {
  return (
    <span className="page" style={PAGE}>
      {children}
    </span>
  );
}

function B({ style, children }: { style: CSSProperties; children?: ReactNode }) {
  return <span style={{ display: "block", ...style }}>{children}</span>;
}

// ---------------------------------------------------------------- novel

const NOVEL_PARAGRAPHS = [
  "The harbour was quiet when Anya came back. The boats sat where she had left them, ropes slack, paint a shade paler than she remembered. Somewhere a radio was playing, low enough to be a rumour.",
  "She stood at the end of the pier until the light went orange, then grey. Her uncle’s café still had its chairs out. Nobody had told it the season was over.",
  "Inside, the clock above the counter was nine minutes fast, as it had always been. “You came back,” Rafi said, as if she had only stepped out for milk.",
  "She did not take the milk. She sat by the window and watched the boats, the way she used to, until the lamps came on along the harbour wall.",
];

const novelText: CSSProperties = {
  fontFamily: SERIF,
  fontSize: "10.5px",
  lineHeight: 1.62,
  color: INK,
  textAlign: "justify",
  hyphens: "auto",
  fontVariationSettings: "'SOFT' 30",
};

function NovelPage() {
  return (
    <Page>
      <B style={{ padding: "30px 30px 0" }}>
        <B style={{ textAlign: "center", fontSize: "7.5px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>
          The Long Way Home
        </B>
        <B style={{ textAlign: "center", marginTop: "24px", fontFamily: SERIF, fontSize: "30px", lineHeight: 1, fontWeight: 400, color: INK }}>
          7
        </B>
        <B style={{ textAlign: "center", marginTop: "6px", fontFamily: SERIF, fontStyle: "italic", fontSize: "14px", color: MUTED }}>
          The Harbour
        </B>
        <B style={{ width: "28px", height: "1px", margin: "16px auto 18px", background: "#8D8B5A" }} />
        {NOVEL_PARAGRAPHS.map((p, i) => (
          <B key={i} style={i ? { ...novelText, textIndent: "1.4em" } : novelText}>
            {p}
          </B>
        ))}
        <B style={{ position: "absolute", left: 0, right: 0, bottom: "18px", textAlign: "center", fontSize: "8.5px", fontWeight: 500, color: MUTED }}>
          118
        </B>
      </B>
    </Page>
  );
}

// ---------------------------------------------------------------- class notes

const noteLine: CSSProperties = { fontSize: "10.5px", lineHeight: "22px", color: INK };
const boxed: CSSProperties = { padding: "3px 7px", border: `1.5px solid ${INK}`, borderRadius: "6px" };

function NotesPage() {
  return (
    <Page>
      <B
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 21px, #EEE7D3 21px, #EEE7D3 22px)",
          backgroundPosition: "0 70px",
        }}
      />
      <B style={{ position: "absolute", top: 0, bottom: 0, left: "30px", width: "1px", background: "#D9CFA9" }} />
      <B style={{ position: "relative", padding: "26px 24px 0 44px" }}>
        <span style={{ display: "flex", justifyContent: "space-between", fontSize: "8.5px", fontWeight: 600, color: MUTED, letterSpacing: "0.04em" }}>
          <span>BIO 101 · Week 3</span>
          <span>Tue 16 Sep</span>
        </span>
        <B style={{ marginTop: "12px", fontSize: "17px", lineHeight: "22px", fontWeight: 700, color: INK }}>Photosynthesis, part 2</B>
        <B style={{ ...noteLine, marginTop: "22px" }}>
          Light reactions happen in the thylakoid membranes. Water is split, oxygen is released, and the energy is stored as ATP and NADPH.
        </B>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", margin: "11px 0", fontSize: "9px", fontWeight: 600, color: INK }}>
          <span style={boxed}>Light reactions</span>
          <span style={{ color: MUTED }}>ATP, NADPH →</span>
          <span style={boxed}>Calvin cycle</span>
          <span style={{ color: MUTED }}>→ sugar</span>
        </span>
        <B style={noteLine}>The Calvin cycle runs in the stroma and uses that energy to turn carbon dioxide into sugar.</B>
        <B style={noteLine}>– Rubisco grabs the CO₂. Slow, but there is a lot of it.</B>
        <B style={noteLine}>– No light needed for the cycle itself, but it stops once the ATP runs out.</B>
        <B style={{ ...noteLine, marginTop: "22px" }}>
          <span style={{ background: PARCHMENT, padding: "2px 4px", borderRadius: "3px", fontWeight: 600 }}>
            Exam: know which stage needs light directly.
          </span>
        </B>
      </B>
      <B style={{ position: "absolute", right: "22px", bottom: "16px", fontSize: "8.5px", fontWeight: 500, color: MUTED }}>2 / 6</B>
    </Page>
  );
}

// ---------------------------------------------------------------- research paper

const paperText: CSSProperties = { fontSize: "8.4px", lineHeight: 1.5, color: INK, textAlign: "justify", hyphens: "auto" };

function PaperPage() {
  return (
    <Page>
      <B style={{ padding: "26px 26px 0" }}>
        <B style={{ fontSize: "7.5px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED }}>
          Preprint · Field survey
        </B>
        <B style={{ marginTop: "10px", fontFamily: SERIF, fontSize: "15px", lineHeight: 1.22, fontWeight: 600, color: INK }}>
          Dawn chorus in a noisy city: a two-year survey of 40 parks
        </B>
        <B style={{ marginTop: "7px", fontSize: "8.5px", fontWeight: 500, color: MUTED }}>A. Rahman, J. Silva, M. Okafor</B>
        <B style={{ marginTop: "14px", fontSize: "7.5px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: INK }}>
          Abstract
        </B>
        <B style={{ marginTop: "4px", fontSize: "9.4px", lineHeight: 1.5, color: INK, textAlign: "justify" }}>
          We recorded the dawn chorus in forty city parks over two years. In noisier parks, birds began singing earlier and sang at a
          higher pitch than birds in quiet ones. The shift was largest for small songbirds and smallest for crows.
        </B>
        <B style={{ height: "1px", margin: "12px 0", background: LINE }} />
        <B style={{ columnCount: 2, columnGap: "14px" }}>
          <B style={{ ...paperText, fontWeight: 700 }}>1 Introduction</B>
          <B style={paperText}>
            Cities are loud at dawn. Traffic, deliveries and air conditioning fill the same hours that many birds use to sing. Earlier
            studies found that some species adjust, singing louder or higher, but most looked at a few sites for a single season.
          </B>
          <B style={{ ...paperText, fontWeight: 700, marginTop: "6px" }}>2 Methods</B>
          <B style={paperText}>
            Recorders were placed at the centre of each park, at least 50 m from the nearest road, and ran from an hour before sunrise
            until two hours after it, every third day from February to July.
          </B>
        </B>
        <svg width="100%" height="74" viewBox="0 0 280 74" aria-hidden="true" style={{ display: "block", marginTop: "10px" }}>
          <path d="M24 6V60H276" fill="none" stroke={MUTED} strokeWidth="0.8" />
          <path d="M28 50C70 47 100 40 140 33S220 18 270 12" fill="none" stroke={GOLD_DEEP} strokeWidth="1.6" strokeLinecap="round" />
          <path
            d="M28 56C70 54 100 51 140 47S220 40 270 37"
            fill="none"
            stroke="#8D8B5A"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="3 3"
          />
          <text x="4" y="12" fontSize="7" fill={MUTED} style={{ fontFamily: SANS }}>
            Hz
          </text>
          <text x="236" y="71" fontSize="7" fill={MUTED} style={{ fontFamily: SANS }}>
            noise, dB
          </text>
        </svg>
        <B style={{ marginTop: "4px", fontSize: "7.6px", color: MUTED }}>
          Fig. 1. Song pitch against park noise. Solid: small songbirds. Dashed: crows.
        </B>
      </B>
      <B style={{ position: "absolute", left: 0, right: 0, bottom: "16px", textAlign: "center", fontSize: "8.5px", fontWeight: 500, color: MUTED }}>
        1
      </B>
    </Page>
  );
}

// ---------------------------------------------------------------- work report

const reportText: CSSProperties = { fontSize: "9.6px", lineHeight: 1.55, color: INK };

const RESPONSE_HOURS: [month: string, width: string, hours: string][] = [
  ["Jul", "100%", "9.0"],
  ["Aug", "68%", "6.1"],
  ["Sep", "42%", "3.8"],
];

function ReportPage() {
  return (
    <Page>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "18px 26px 12px",
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <span style={{ fontSize: "9px", fontWeight: 700, color: INK }}>
          Q3 Report <span style={{ fontWeight: 500, color: MUTED }}>· Operations</span>
        </span>
        <span style={{ fontSize: "9px", fontWeight: 600, color: MUTED }}>20</span>
      </span>
      <B style={{ padding: "18px 26px 0" }}>
        <B style={{ fontSize: "14px", fontWeight: 700, color: INK }}>4.2 Customer support</B>
        <B style={{ ...reportText, marginTop: "8px" }}>
          Average response time fell from nine hours to just under four. Most of the gain came from the new weekend rota, not from extra
          staff.
        </B>
        <B style={{ marginTop: "14px", fontSize: "8px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: MUTED }}>
          Average first response, hours
        </B>
        <span style={{ display: "grid", gap: "7px", marginTop: "8px" }}>
          {RESPONSE_HOURS.map(([month, width, hours]) => (
            <span
              key={month}
              style={{
                display: "grid",
                gridTemplateColumns: "26px 1fr 30px",
                alignItems: "center",
                gap: "8px",
                fontSize: "8.5px",
                fontWeight: 600,
                color: MUTED,
              }}
            >
              <span>{month}</span>
              <B style={{ height: "10px", borderRadius: "3px", background: PARCHMENT }}>
                <B style={{ height: "100%", width, borderRadius: "3px", background: GOLD_DEEP }} />
              </B>
              <span style={{ color: INK }}>{hours}</span>
            </span>
          ))}
        </span>
        <B style={{ ...reportText, marginTop: "14px" }}>
          We expect a smaller improvement next quarter as the rota settles. The bigger risk is the October release, which usually doubles
          ticket volume for two weeks.
        </B>
        <B style={{ marginTop: "14px", fontSize: "12px", fontWeight: 700, color: INK }}>4.3 Returns</B>
        <B style={{ ...reportText, marginTop: "6px" }}>
          Returns held at 2.1% of orders. Most came back within the first week, and most were the wrong size rather than a fault.
        </B>
      </B>
      <B
        style={{
          position: "absolute",
          left: "26px",
          bottom: "16px",
          fontSize: "7.5px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        Internal · Do not forward
      </B>
    </Page>
  );
}

// ---------------------------------------------------------------- manual

const KETTLE_STEPS = [
  "Fill the kettle to the max line, boil it, and pour the water away.",
  "Do this twice more to clear any taste from the factory.",
  "Place the kettle on its base. The light turns amber while it heats.",
];

function ManualPage() {
  return (
    <Page>
      <B style={{ padding: "24px 26px 0" }}>
        <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: INK }}>
            Kettle K2 <span style={{ fontWeight: 500, color: MUTED }}>· User guide</span>
          </span>
          <span style={{ fontSize: "9px", fontWeight: 600, color: MUTED }}>4</span>
        </span>
        <B style={{ height: "1px", margin: "12px 0 16px", background: LINE }} />
        <B style={{ fontSize: "16px", fontWeight: 700, color: INK }}>Before first use</B>
        {KETTLE_STEPS.map((step, i) => (
          <span key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: "10px", alignItems: "start", marginTop: "10px" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                borderRadius: "999px",
                border: `1.5px solid ${GOLD_DEEP}`,
                fontSize: "9px",
                fontWeight: 700,
                color: GOLD_DEEP,
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: "10px", lineHeight: 1.5, color: INK, paddingTop: "2px" }}>{step}</span>
          </span>
        ))}
        <svg width="132" height="112" viewBox="0 0 132 112" aria-hidden="true" style={{ display: "block", margin: "16px auto 0" }}>
          <g fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M34 34h58l8 56H26z" />
            <path d="M44 34c0-8 6-12 19-12s19 4 19 12" />
            <path d="M56 18h14" />
            <path d="M92 44c16 0 22 10 20 22s-8 16-18 16" />
            <path d="M34 44 18 36c-4-2-8 2-5 5l14 13" />
            <path d="M20 98h92" />
            <path d="M24 90h84" />
          </g>
          <path d="M36 48h40" stroke={GOLD_DEEP} strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="80" y="51" fontSize="7.5" fontWeight="700" fill={GOLD_DEEP} style={{ fontFamily: SANS }}>
            MAX
          </text>
        </svg>
        <B
          style={{
            marginTop: "16px",
            padding: "10px 12px",
            border: `1px solid ${LINE}`,
            borderRadius: "6px",
            fontSize: "9.5px",
            lineHeight: 1.45,
            color: INK,
          }}
        >
          <span style={{ fontWeight: 700 }}>Note</span> {" "}Never open the lid while the water is boiling.
        </B>
      </B>
    </Page>
  );
}

export const SHELF_PAGES: Record<DocId, () => ReactNode> = {
  novel: NovelPage,
  notes: NotesPage,
  paper: PaperPage,
  report: ReportPage,
  manual: ManualPage,
};

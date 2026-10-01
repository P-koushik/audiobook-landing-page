import Image from "next/image";
import { EVENING, STARS } from "./data";
import { MossEdge, Specks, type Vars } from "./decor";
import { UploadIcon } from "./icons";

function DiaryRow({ time, text, delay, night }: { time: string; text: string; delay: number; night?: boolean }) {
  return (
    <li className={night ? "drow dnight" : "drow"} data-reveal="" style={{ "--rd": `${delay}ms` } as Vars}>
      <span className="dt fx">
        <span>{time}</span>
      </span>
      <span className="dx fx">
        <span>{text}</span>
      </span>
    </li>
  );
}

/** Chapter four: a diary of the evening. */
export function Evening() {
  return (
    <section id="evening" className="evening" data-chapter="4" aria-labelledby="evening-title">
      <div className="wrap">
        <div className="g12">
          <div className="e-head" data-reveal="">
            <p className="chap">Chapter four</p>
            <h2 id="evening-title" className="h2xl fx">
              Some nights, reading is too much.
            </h2>
          </div>
        </div>
        <ol className="diary">
          {EVENING.map((row, i) => (
            <DiaryRow key={row.time} {...row} delay={i * 70} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Night falls: the last diary entry, the closing call to action and the colophon. */
export function Night() {
  return (
    <section id="start" className="night on-moss" data-moss="" data-chapter="4" aria-labelledby="night-title">
      <MossEdge side="top" />
      <div className="stars" aria-hidden="true">
        <Specks specks={STARS} className="st" />
      </div>
      <div className="wrap">
        <ol className="diary diary-night">
          <DiaryRow time="Later" text="Lamp off, eyes closed. Page 20 is read to you." delay={0} night />
        </ol>
      </div>
      <div className="nstage">
        <div className="nart" aria-hidden="true">
          <div className="nfloat">
            <Image className="pimg" src="/images/night-notes.webp" alt="" width={960} height={1035} sizes="min(560px, 78vw)" />
          </div>
        </div>
        <h2 id="night-title" className="h2night fx" data-reveal="">
          Tonight, listen instead.
        </h2>
        <p className="nlede" data-reveal="" style={{ "--rd": "120ms" } as Vars}>
          Make an account with Google or email, then upload the PDF you were going to read tonight.
        </p>
        <div className="nctas" data-reveal="" style={{ "--rd": "220ms" } as Vars}>
          <a className="btn btn-g btn-lg" href="#signup">
            <UploadIcon />
            Upload your first PDF
          </a>
          <a className="lm" href="#signin">
            Already have an account? Sign in
          </a>
        </div>
      </div>
      <footer className="colophon foot">
        <div className="wrap g12">
          <div className="co-l">
            <span className="wm fx" style={{ color: "#FAF6EC" }}>
              Audio Book
            </span>
            <p className="colo">
              <span className="chap" style={{ display: "block", margin: "0 0 6px" }}>
                Colophon
              </span>
              Set in Fraunces and Figtree. Coloured with paper, parchment, gold, sage and moss, taken from the Audio Book watercolour. Made
              for tired eyes.
            </p>
          </div>
          <nav aria-label="Footer" className="co-r">
            <a className="lm" href="#signin">
              Sign in
            </a>
            <a className="lm" href="#signup">
              Create an account
            </a>
            <span className="copy">© 2026 Audio Book</span>
          </nav>
        </div>
      </footer>
    </section>
  );
}

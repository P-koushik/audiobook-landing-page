"use client";

import { useState } from "react";
import { FAQ } from "./data";
import { cx } from "./decor";

/** Chapter three: the FAQ, set like a table of contents. One answer is open at a time. */
export function Notes() {
  const [open, setOpen] = useState(0);

  return (
    <section id="notes" className="notes" data-chapter="3" aria-labelledby="notes-title">
      <div className="wrap g12">
        <div className="n-l" data-reveal="">
          <p className="chap">Chapter three</p>
          <h2 id="notes-title" className="h2xl fx">
            <em>Notes</em>
          </h2>
          <p className="nintro fx">The small print, in plain words. All of it is true of Audio Book today.</p>
        </div>
        <div className="n-r">
          <div className="toc">
            {FAQ.map(({ q, a }, i) => (
              <div key={q} className="ti">
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="tq"
                    aria-expanded={open === i}
                    aria-controls={`faq${i}`}
                    onClick={() => setOpen(open === i ? -1 : i)}
                  >
                    <span className="tn" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="tt fx">{q}</span>
                    <span className="tl" aria-hidden="true" />
                    <span className="pm" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`faq${i}`} className={cx("qp", open === i && "open")} role="region" aria-label={q}>
                  <div>
                    <p className="ta">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

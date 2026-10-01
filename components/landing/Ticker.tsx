import { Fragment } from "react";
import { TICKER } from "./data";
import { Sparkle } from "./icons";

function Lines({ hidden }: { hidden?: boolean }) {
  return (
    <span className="tgroup" aria-hidden={hidden || undefined}>
      {TICKER.map(({ line, file }) => (
        <Fragment key={file}>
          <span className="tf">
            <em className="fx">…{line}…</em>
            <small>{file}</small>
          </span>
          <span className="tsep" aria-hidden="true">
            <Sparkle />
          </span>
        </Fragment>
      ))}
    </span>
  );
}

/** A slow marquee of lines from the sample PDFs. The second copy makes the loop seamless. */
export function Ticker() {
  return (
    <div className="ticker" role="region" aria-label="Lines from the sample PDFs">
      <div className="ttrack">
        <Lines />
        <Lines hidden />
      </div>
    </div>
  );
}

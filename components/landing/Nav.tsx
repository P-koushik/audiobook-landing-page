"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTER_LABELS } from "./data";
import { onScrollFrame } from "./dom";

/** The running head: hides on scroll down, turns green over the moss sections, names the chapter. */
export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const greens = Array.from(document.querySelectorAll("[data-moss]"));
    const toggle = (name: string, on: boolean) => nav.toggleAttribute(name, on);
    let lastY = 0;

    const stopScroll = onScrollFrame(() => {
      const y = window.scrollY;
      const nh = nav.offsetHeight;
      toggle("data-scrolled", y > 8);
      toggle(
        "data-dark",
        greens.some((g) => {
          const r = g.getBoundingClientRect();
          return r.top < nh * 0.6 && r.bottom > nh * 0.5;
        }),
      );
      if (y < 140) {
        toggle("data-hide", false);
        lastY = y;
      } else if (y > lastY + 6) {
        toggle("data-hide", true);
        lastY = y;
      } else if (y < lastY - 6) {
        toggle("data-hide", false);
        lastY = y;
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setChapter(Number(e.target.getAttribute("data-chapter")));
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    document.querySelectorAll("[data-chapter]").forEach((el) => io.observe(el));

    return () => {
      stopScroll();
      io.disconnect();
    };
  }, []);

  return (
    <header ref={ref} className="nav">
      <div className="navin">
        <a href="#top" className="wm fx">
          Audio Book
        </a>
        <span className="rh" aria-hidden="true">
          {CHAPTER_LABELS[chapter]}
        </span>
        <nav aria-label="Main" className="navr">
          <a className="nl hide-sm" href="#listen">
            Try a page
          </a>
          <a className="nl" href="#signin">
            Sign in
          </a>
          <a className="btn btn-p" href="#signup">
            Upload a PDF
          </a>
        </nav>
      </div>
    </header>
  );
}

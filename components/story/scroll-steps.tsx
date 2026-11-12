"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Holds a visual in view while the reader scrolls through steps beside it.
 * Pass `visuals` with one chart per step so the chart changes as each step arrives,
 * or one `visual` if it should stay the same. Keep the visual shorter than one screen.
 * Below the md breakpoint it stacks: the chart first, then the steps.
 */
export function ScrollSteps({ visual, visuals, steps, label }: { visual?: ReactNode; visuals?: ReactNode[]; steps: ReactNode[]; label?: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    // Compare every step at the same reading line. Observer callback order can
    // skip the middle step when several compact notes enter its band together.
    const update = () => {
      frame = 0;
      const readingLine = window.innerHeight * 0.45;
      let nearest = 0;
      let distance = Infinity;
      refs.current.forEach((element, index) => {
        if (!element) return;
        const bounds = element.getBoundingClientRect();
        const nextDistance = Math.abs(bounds.top + bounds.height / 2 - readingLine);
        if (nextDistance < distance) {
          distance = nextDistance;
          nearest = index;
        }
      });
      setActive(nearest);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const shown = visuals?.[active] ?? visual;

  return (
    <div className="grid items-start gap-8 md:grid-cols-12" role="group" aria-label={label}>
      <div className="flex min-w-0 flex-col gap-3 md:sticky md:top-8 md:col-span-8 md:self-start">
        {shown}
      </div>
      <div className="flex min-w-0 flex-col gap-4 md:col-span-4">
      <ol className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <li
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            data-step={i}
            aria-current={active === i ? "step" : undefined}
            className="flex"
          >
            <div className={`w-full border bg-card p-6 text-lg leading-8 transition-colors ${active === i ? "border-2 border-foreground text-foreground" : "border-border text-muted-foreground"}`}>
              {step}
            </div>
          </li>
        ))}
      </ol>
      <p className="text-sm leading-6 text-muted-foreground" aria-hidden="true">Scroll step {active + 1} of {steps.length}. The chart stays in view while the steps pass.</p>
      </div>
    </div>
  );
}

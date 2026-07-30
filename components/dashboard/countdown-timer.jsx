"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { GATE_END_DATE } from "@/lib/utils/constants";

function getRemaining() {
  const diff = Math.max(0, GATE_END_DATE.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function Unit({ value, label }) {
  const ref = useRef(null);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      gsap.fromTo(
        ref.current,
        { y: -6, opacity: 0.4 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
      );
      prev.current = value;
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <span
        ref={ref}
        className="font-mono text-2xl font-semibold tabular-nums text-foreground sm:text-3xl"
      >
        {pad(value)}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer() {
  // Start null so server and first client render match exactly (both render
  // the placeholder); the real Date.now()-based value only appears after
  // mount, avoiding a hydration mismatch on the seconds digit.
  const [remaining, setRemaining] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Intentional: this is the client-only value that must NOT be computed
    // during SSR, so setting it here (not during render) is what avoids the
    // hydration mismatch rather than causing one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(getRemaining());
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  const r = remaining ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-gate/25 bg-gate/10 px-5 py-4"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-gate">
        GATE 2027 countdown
      </p>
      <div className="mt-2 flex items-center gap-3 sm:gap-4">
        <Unit value={r.days} label="days" />
        <span className="pb-4 text-xl text-muted-foreground">:</span>
        <Unit value={r.hours} label="hrs" />
        <span className="pb-4 text-xl text-muted-foreground">:</span>
        <Unit value={r.minutes} label="min" />
        <span className="pb-4 text-xl text-muted-foreground">:</span>
        <Unit value={r.seconds} label="sec" />
      </div>
    </div>
  );
}

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
  const [remaining, setRemaining] = useState(getRemaining);
  const containerRef = useRef(null);

  useEffect(() => {
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

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-gate/25 bg-gate/10 px-5 py-4"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-gate">
        GATE 2027 countdown
      </p>
      <div className="mt-2 flex items-center gap-3 sm:gap-4">
        <Unit value={remaining.days} label="days" />
        <span className="pb-4 text-xl text-muted-foreground">:</span>
        <Unit value={remaining.hours} label="hrs" />
        <span className="pb-4 text-xl text-muted-foreground">:</span>
        <Unit value={remaining.minutes} label="min" />
        <span className="pb-4 text-xl text-muted-foreground">:</span>
        <Unit value={remaining.seconds} label="sec" />
      </div>
    </div>
  );
}

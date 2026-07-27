"use client";

import { useState } from "react";
import { todayKey } from "@/lib/utils/date-helpers";
import { DateNav } from "@/components/dashboard/date-nav";
import { GateSyllabus } from "@/components/gate/gate-syllabus";

export default function GatePage() {
  const [date, setDate] = useState(todayKey());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">GATE Syllabus</h1>
        <p className="text-sm text-muted-foreground">
          Track theory and practice per subtopic. Marks you make here are recorded
          against the date below.
        </p>
      </div>
      <DateNav date={date} onChange={setDate} />
      <GateSyllabus date={date} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { todayKey } from "@/lib/utils/date-helpers";
import { DateNav } from "@/components/dashboard/date-nav";
import { SebiSyllabus } from "@/components/sebi/sebi-syllabus";

export default function SebiPage() {
  const [date, setDate] = useState(todayKey());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">SEBI Grade A</h1>
        <p className="text-sm text-muted-foreground">
          Phase → Paper → Subject syllabus, with topics you track per subject.
        </p>
      </div>
      <DateNav date={date} onChange={setDate} />
      <SebiSyllabus date={date} />
    </div>
  );
}

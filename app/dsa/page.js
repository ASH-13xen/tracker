"use client";

import { useState } from "react";
import { todayKey } from "@/lib/utils/date-helpers";
import { DateNav } from "@/components/dashboard/date-nav";
import { DsaSyllabus } from "@/components/dsa/dsa-syllabus";

export default function DsaPage() {
  const [date, setDate] = useState(todayKey());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">DSA</h1>
        <p className="text-sm text-muted-foreground">
          Track practice per topic. Weekends are for revision and question practice.
        </p>
      </div>
      <DateNav date={date} onChange={setDate} />
      <DsaSyllabus date={date} />
    </div>
  );
}

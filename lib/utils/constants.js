export const GATE_END_DATE = new Date("2027-02-05T00:00:00");

export const REVISION_CYCLE_DAYS = 7;
export const CALENDAR_REMINDER_LEAD_DAYS = 1;

export const SCHEDULE = {
  gate: { weekday: "2.5hrs", weekend: "Question practice" },
  dsa: { weekday: "1.5 hrs", weekend: "Revision + question practice" },
  exercise: { weekday: "30 min", weekend: "Off" },
  skill: { weekday: "1 hr", weekend: "Development time" },
};

export const DASHBOARD_ACTIVITIES = [
  "gate",
  "dsa",
  "exercise",
  "skill",
  "foodLogged",
];

export const HEATMAP_CATEGORIES = ["gate", "dsa", "exercise", "skill"];

export const GATE_END_DATE = new Date("2027-02-05T00:00:00");

export const REVISION_CYCLE_DAYS = 7;
export const CALENDAR_REMINDER_LEAD_DAYS = 1;

export const SCHEDULE = {
  gate: {
    weekday: "2.5hrs",
    saturday: "Question practice",
    sunday: "Recovery day — free",
  },
  dsa: {
    weekday: "1.5 hrs",
    saturday: "Revision + question practice",
    sunday: "Recovery day — free",
  },
  exercise: { weekday: "30 min", saturday: "30 min", sunday: "Off" },
  skill: {
    weekday: "1 hr",
    saturday: "Development time",
    sunday: "Recovery day — free",
  },
};

export const DASHBOARD_ACTIVITIES = [
  "gate",
  "dsa",
  "exercise",
  "skill",
  "foodLogged",
];

export const HEATMAP_CATEGORIES = ["gate", "dsa", "exercise", "skill"];

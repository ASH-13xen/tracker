import * as repo from "@/lib/repositories/sebi.repository";
import { todayKey } from "@/lib/utils/date-helpers";

export async function getSyllabus() {
  return repo.getTree();
}

export const addPhase = (data) => repo.createPhase(data);
export const renamePhase = (id, data) => repo.updatePhase(id, data);
export const removePhase = (id) => repo.deletePhase(id);

export const addPaper = (data) => repo.createPaper(data);
export const renamePaper = (id, data) => repo.updatePaper(id, data);
export const removePaper = (id) => repo.deletePaper(id);

export const addSubject = (data) => repo.createSubject(data);
export const updateSubject = (id, data) => repo.updateSubject(id, data);
export const removeSubject = (id) => repo.deleteSubject(id);

export const addTopic = (data) => repo.createTopic(data);
export const renameTopic = (id, data) => repo.updateTopic(id, data);
export const removeTopic = (id) => repo.deleteTopic(id);

export async function markTopic(id, done, dateKey = todayKey()) {
  const now = new Date();
  const isBackdated = dateKey !== todayKey();
  return repo.updateTopic(id, {
    done,
    doneAt: done ? now : null,
    markedLater: done ? isBackdated : false,
  });
}

// The exact SEBI Grade A (IT stream) syllabus, seeded once so it doesn't
// have to be typed in by hand. Safe to call repeatedly — no-ops if data
// already exists.
const SEED_DATA = [
  {
    phase: "Phase 1",
    papers: [
      {
        paper: "Paper 1 — Aptitude & General Awareness",
        subjects: [
          {
            name: "General Awareness",
            syllabus:
              "Current affairs (sports, awards, summits), financial sector awareness, and static GK.",
          },
          {
            name: "Quantitative Aptitude",
            syllabus:
              "Data Interpretation, Number Series, Quadratic Equations, Simple & Compound Interest, Time & Work, Mensuration.",
          },
          {
            name: "Reasoning Ability",
            syllabus: "Puzzles, Syllogisms, Blood Relations, Direction Sense, Inequalities.",
          },
          {
            name: "English Language",
            syllabus: "Reading comprehension, error spotting, cloze test, jumbled words.",
          },
        ],
      },
      {
        paper: "Paper 2 — Core IT Fundamentals",
        subjects: [
          {
            name: "Programming Concepts (C/C++/Java)",
            syllabus:
              "OOP concepts (Inheritance, Polymorphism), Variable scope, Exception handling, Recursion.",
            weightage: "30%",
          },
          {
            name: "Database Concepts",
            syllabus:
              "ER-Model, Normal Forms, Indexing (B/B+ Trees), Transactions, Concurrency control.",
            weightage: "10%",
          },
          {
            name: "SQL Queries",
            syllabus: "JOINS (Inner/Outer), Aggregate functions, Nested queries, UNION/EXCEPT.",
            weightage: "10%",
          },
          {
            name: "Data Analytics (Python/R)",
            syllabus: "DataFrames, Regex, Slicing, Data Mining, Pandas/NumPy basics.",
            weightage: "10%",
          },
          {
            name: "Algorithms",
            syllabus:
              "Tree/Graph traversals, Shortest paths, Sorting, Searching, Dynamic Programming.",
            weightage: "10%",
          },
          {
            name: "Networking Concepts",
            syllabus: "ISO/OSI Model, TCP/UDP, DNS, HTTP, Firewalls, Routers, LAN Technologies.",
            weightage: "10%",
          },
          {
            name: "Cyber Security",
            syllabus: "CIA Triad, Cyber Attacks, Authentication, Network/System Audit.",
            weightage: "10%",
          },
          {
            name: "Data Warehousing & Shell",
            syllabus: "ETL process, Data Marts, Shell scripting basics, UNIX commands.",
            weightage: "10%",
          },
        ],
      },
    ],
  },
  {
    phase: "Phase 2",
    papers: [
      {
        paper: "Paper 1 — Descriptive English",
        subjects: [
          {
            name: "Essay Writing",
            syllabus:
              "Usually topics related to finance, technology, cyber security, or current social issues.",
          },
          {
            name: "Precis Writing",
            syllabus: "Summarizing a given passage effectively while retaining its core message.",
          },
          {
            name: "Reading Comprehension",
            syllabus: "Answering logical, descriptive questions based on a provided text.",
          },
        ],
      },
      {
        paper: "Paper 2 — Practical Coding Test",
        subjects: [
          {
            name: "Data Structures",
            syllabus:
              "Arrays, Linked Lists, Stacks, Queues, Binary Trees, Heaps, Hashing, Matrices, JSON Objects.",
            weightage: "40%",
          },
          {
            name: "Algorithms",
            syllabus:
              "Sorting, Searching, Greedy Algorithms, Dynamic Programming, Backtracking, Divide & Conquer.",
            weightage: "30%",
          },
          {
            name: "Object-Oriented Programming",
            syllabus: "Abstraction, Encapsulation, Polymorphism, Inheritance.",
            weightage: "20%",
          },
          {
            name: "String Manipulation",
            syllabus: "Substrings, Regular Expressions (Regex), Pattern Matching.",
            weightage: "10%",
          },
        ],
      },
    ],
  },
];

export async function seedDefaultSyllabus() {
  const existing = await repo.countPhases();
  if (existing > 0) return { seeded: false };

  for (let pi = 0; pi < SEED_DATA.length; pi++) {
    const phaseData = SEED_DATA[pi];
    const phase = await repo.createPhase({ name: phaseData.phase, order: pi });
    for (let pj = 0; pj < phaseData.papers.length; pj++) {
      const paperData = phaseData.papers[pj];
      const paper = await repo.createPaper({
        phaseId: phase._id,
        name: paperData.paper,
        order: pj,
      });
      for (let si = 0; si < paperData.subjects.length; si++) {
        const subjectData = paperData.subjects[si];
        await repo.createSubject({
          paperId: paper._id,
          name: subjectData.name,
          syllabus: subjectData.syllabus,
          weightage: subjectData.weightage || "",
          order: si,
        });
      }
    }
  }
  return { seeded: true };
}

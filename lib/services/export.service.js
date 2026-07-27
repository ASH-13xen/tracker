import { connectDB } from "@/lib/db/connect";
import DailyLog from "@/lib/models/daily-log";
import ActivityLog from "@/lib/models/activity-log";
import { GateSubject, GateTopic, GateSubtopic } from "@/lib/models/gate";
import { DsaTopic, DsaSubtopic } from "@/lib/models/dsa";
import { Skill, SkillTopic, SkillSubtopic } from "@/lib/models/skill";
import { Project, ProjectTask, ProjectTimeLog } from "@/lib/models/project";
import FoodEntry from "@/lib/models/food-entry";
import StudyMaterial from "@/lib/models/study-material";
import CalendarEvent from "@/lib/models/calendar-event";

// Full-database dump for backup purposes — intentionally bypasses the
// per-domain repositories since it needs every record, unfiltered.
export async function exportAll() {
  await connectDB();
  const [
    dailyLogs,
    activityLogs,
    gateSubjects,
    gateTopics,
    gateSubtopics,
    dsaTopics,
    dsaSubtopics,
    skills,
    skillTopics,
    skillSubtopics,
    projects,
    projectTasks,
    projectTimeLogs,
    foodEntries,
    studyMaterials,
    calendarEvents,
  ] = await Promise.all([
    DailyLog.find().lean(),
    ActivityLog.find().lean(),
    GateSubject.find().lean(),
    GateTopic.find().lean(),
    GateSubtopic.find().lean(),
    DsaTopic.find().lean(),
    DsaSubtopic.find().lean(),
    Skill.find().lean(),
    SkillTopic.find().lean(),
    SkillSubtopic.find().lean(),
    Project.find().lean(),
    ProjectTask.find().lean(),
    ProjectTimeLog.find().lean(),
    FoodEntry.find().lean(),
    StudyMaterial.find().lean(),
    CalendarEvent.find().lean(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    dailyLogs,
    activityLogs,
    gate: { subjects: gateSubjects, topics: gateTopics, subtopics: gateSubtopics },
    dsa: { topics: dsaTopics, subtopics: dsaSubtopics },
    skills: { skills, topics: skillTopics, subtopics: skillSubtopics },
    projects: { projects, tasks: projectTasks, timeLogs: projectTimeLogs },
    foodEntries,
    studyMaterials,
    calendarEvents,
  };
}

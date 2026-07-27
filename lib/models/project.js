import mongoose from "mongoose";

const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    kanbanStatus: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    archiveStatus: {
      type: String,
      enum: ["active", "on-hold", "completed", "archived"],
      default: "active",
    },
    techStack: { type: [String], default: [] },
    links: {
      repo: { type: String, default: "" },
      demo: { type: String, default: "" },
      deploy: { type: String, default: "" },
      design: { type: String, default: "" },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProjectTaskSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true },
    dueDate: { type: Date, default: null },
    done: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProjectTimeLogSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    date: { type: String, required: true },
    hours: { type: Number, required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export const ProjectTask =
  mongoose.models.ProjectTask || mongoose.model("ProjectTask", ProjectTaskSchema);
export const ProjectTimeLog =
  mongoose.models.ProjectTimeLog || mongoose.model("ProjectTimeLog", ProjectTimeLogSchema);

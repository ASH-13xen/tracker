import mongoose from "mongoose";

const { Schema } = mongoose;

const ResourceLinkSchema = new Schema(
  { label: { type: String, required: true }, url: { type: String, required: true } },
  { _id: false }
);

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ["active", "paused", "mastered"], default: "active" },
    resourceLinks: { type: [ResourceLinkSchema], default: [] },
    targetGoal: {
      description: { type: String, default: "" },
      deadline: { type: Date, default: null },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SkillTopicSchema = new Schema(
  {
    skillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true, index: true },
    name: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SkillSubtopicSchema = new Schema(
  {
    topicId: { type: Schema.Types.ObjectId, ref: "SkillTopic", required: true, index: true },
    name: { type: String, required: true },
    theoryDone: { type: Boolean, default: false },
    theoryDoneAt: { type: Date, default: null },
    theoryMarkedLater: { type: Boolean, default: false },
    practiceDone: { type: Boolean, default: false },
    practiceDoneAt: { type: Date, default: null },
    practiceMarkedLater: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
export const SkillTopic =
  mongoose.models.SkillTopic || mongoose.model("SkillTopic", SkillTopicSchema);
export const SkillSubtopic =
  mongoose.models.SkillSubtopic || mongoose.model("SkillSubtopic", SkillSubtopicSchema);

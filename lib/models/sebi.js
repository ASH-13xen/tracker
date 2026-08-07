import mongoose from "mongoose";

const { Schema } = mongoose;

const SebiPhaseSchema = new Schema(
  { name: { type: String, required: true }, order: { type: Number, default: 0 } },
  { timestamps: true }
);

const SebiPaperSchema = new Schema(
  {
    phaseId: { type: Schema.Types.ObjectId, ref: "SebiPhase", required: true, index: true },
    name: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SebiSubjectSchema = new Schema(
  {
    paperId: { type: Schema.Types.ObjectId, ref: "SebiPaper", required: true, index: true },
    name: { type: String, required: true },
    syllabus: { type: String, default: "" },
    weightage: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SebiTopicSchema = new Schema(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "SebiSubject", required: true, index: true },
    name: { type: String, required: true },
    done: { type: Boolean, default: false },
    doneAt: { type: Date, default: null },
    markedLater: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SebiPhase = mongoose.models.SebiPhase || mongoose.model("SebiPhase", SebiPhaseSchema);
export const SebiPaper = mongoose.models.SebiPaper || mongoose.model("SebiPaper", SebiPaperSchema);
export const SebiSubject =
  mongoose.models.SebiSubject || mongoose.model("SebiSubject", SebiSubjectSchema);
export const SebiTopic = mongoose.models.SebiTopic || mongoose.model("SebiTopic", SebiTopicSchema);

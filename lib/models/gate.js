import mongoose from "mongoose";

const { Schema } = mongoose;

const GateSubjectSchema = new Schema(
  { name: { type: String, required: true }, order: { type: Number, default: 0 } },
  { timestamps: true }
);

const GateTopicSchema = new Schema(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "GateSubject", required: true, index: true },
    name: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GateSubtopicSchema = new Schema(
  {
    topicId: { type: Schema.Types.ObjectId, ref: "GateTopic", required: true, index: true },
    name: { type: String, required: true },
    theoryDone: { type: Boolean, default: false },
    theoryDoneAt: { type: Date, default: null },
    theoryMarkedLater: { type: Boolean, default: false },
    practiceDone: { type: Boolean, default: false },
    practiceDoneAt: { type: Date, default: null },
    practiceMarkedLater: { type: Boolean, default: false },
    lastRevisedAt: { type: Date, default: null },
    nextRevisionDue: { type: Date, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const GateSubject =
  mongoose.models.GateSubject || mongoose.model("GateSubject", GateSubjectSchema);
export const GateTopic =
  mongoose.models.GateTopic || mongoose.model("GateTopic", GateTopicSchema);
export const GateSubtopic =
  mongoose.models.GateSubtopic || mongoose.model("GateSubtopic", GateSubtopicSchema);

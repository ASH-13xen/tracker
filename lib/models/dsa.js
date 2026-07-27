import mongoose from "mongoose";

const { Schema } = mongoose;

const DsaTopicSchema = new Schema(
  { name: { type: String, required: true }, order: { type: Number, default: 0 } },
  { timestamps: true }
);

const DsaSubtopicSchema = new Schema(
  {
    topicId: { type: Schema.Types.ObjectId, ref: "DsaTopic", required: true, index: true },
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

export const DsaTopic = mongoose.models.DsaTopic || mongoose.model("DsaTopic", DsaTopicSchema);
export const DsaSubtopic =
  mongoose.models.DsaSubtopic || mongoose.model("DsaSubtopic", DsaSubtopicSchema);

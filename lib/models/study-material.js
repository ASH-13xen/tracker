import mongoose from "mongoose";

const { Schema } = mongoose;

const StudyMaterialSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["file", "text", "link"], required: true },
    content: { type: String, default: "" },
    filePath: { type: String, default: "" },
    fileName: { type: String, default: "" },
    attachedTo: {
      kind: { type: String, enum: ["skill", "project"], required: true },
      id: { type: Schema.Types.ObjectId, required: true },
    },
  },
  { timestamps: true }
);

StudyMaterialSchema.index({ "attachedTo.kind": 1, "attachedTo.id": 1 });

export default mongoose.models.StudyMaterial ||
  mongoose.model("StudyMaterial", StudyMaterialSchema);

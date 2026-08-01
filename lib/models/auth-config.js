import mongoose from "mongoose";

const AuthConfigSchema = new mongoose.Schema(
  {
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AuthConfig || mongoose.model("AuthConfig", AuthConfigSchema);

// In tweets model we will have content, createdAt,updatedAt, its owner //
import mongoose from "mongoose";

const tweetsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetsSchema);

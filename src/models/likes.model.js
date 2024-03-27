// The likes model will seem a little bit complex here first is comment if there is a like on a comment then we will push comment id in likes then createdAt,updatedAt then video ka like hai toh video id isme push kardenge likedBy(users) aur agar tweet pe like hai toh tweet add kardenege usme //

import mongoose, { mongo } from "mongoose";

const likesSchema = new mongoose.Schema(
  {
    // Now first aapne suppose video like kia ho
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likesSchema);

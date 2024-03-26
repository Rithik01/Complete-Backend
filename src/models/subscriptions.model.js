// Understanding the subscription schema below //
// Suppose you have some users let's say User => a,b,c,d,e //
// And suppose you have channels CAC, HCC, FCC //
//  Now if user A subscribes to channel CAC a new document will be created then suppose user B subscribes the same channel again a new document will be created and again and again a new document will be created so note a channel can have multiple subscribers and now suppose user C subscribes a channel CAC then a document will be created then he subscribes some other channel let's say FCC then a new different document will be generated so a user can subscribe multiple channels so now suppose you want to count the subscribers of a specific channel then we will select those documents which will be having channel CAC instead of subscriber count. You will match channels so basically we will count that documents jaha pe channel humara CAC hai so here basically there are three documents meaning there are 3 subscribers //

//// Now suppose you want to know that aapne kin channels ko subscribe kar rakha hai then suppose u are User C then you will then Subscriber ki value c usko select karlo aur voh c value jin jin channels me hai usme se channel ki list nikal ke le aoo that's it ////

import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);

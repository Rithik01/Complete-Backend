// Aggregate middleware is for MyModel.aggregate(). Aggregate middleware executes when you call exec() on an aggregate object. In aggregate middleware, this refers to the aggregation object. //
/* In Mongoose, plugins are reusable pieces of code that provide additional functionality to your schemas and models. They allow you to encapsulate commonly used functionalities, validations, and hooks, making your code more modular, maintainable, and reusable.

Plugins in Mongoose are typically defined as functions that accept a schema as a parameter and then extend or modify that schema. These functions can add new schema methods, static methods, virtuals, middleware hooks, validators, and more. */
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String,
      required: [true, "Video is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // This duration will come from cloudinary //
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Now we can write aggregation queries //
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);

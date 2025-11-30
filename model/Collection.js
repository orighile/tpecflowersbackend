import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Limit images to max 5
collectionSchema.pre("save", function (next) {
  if (this.images.length > 5) {
    return next(new Error("A collection cannot have more than 5 images"));
  }
  next();
});

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;

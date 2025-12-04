import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false } // Prevent Mongoose from creating _id for each image subdocument
);

const collectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    images: {
      type: [imageSchema],
      validate: {
        validator: function (v) {
          return v.length > 0 && v.length <= 5;
        },
        message: "A collection must have between 1 and 5 images",
      },
      required: [true, "Images are required"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: pre-save hook to double-check max 5 images
collectionSchema.pre("save", function (next) {
  if (this.images.length > 5) {
    return next(new Error("A collection cannot have more than 5 images"));
  }
  next();
});

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;

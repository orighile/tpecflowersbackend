import Collection from "../model/Collection.js";
import cloudinary from "../config/cloudinary.js";
import { getPublicIdFromUrl } from "../utils/cloudinary.js";

// ------------------------------------------------
// CREATE COLLECTION
// ------------------------------------------------
export const createCollection = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required." });
    if (!req.files?.length) return res.status(400).json({ message: "Images required." });
    if (req.files.length > 5) return res.status(400).json({ message: "Max 5 images allowed." });

    const uploadedImages = [];

    for (let file of req.files) {
      const upload = await cloudinary.uploader.upload(file.path, { folder: "collections" });
      uploadedImages.push(upload.secure_url);
    }

    const collection = await Collection.create({
      title,
      images: uploadedImages,
      user: req.user.id,
    });

    res.status(201).json({ message: "Collection created", collection });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// UPDATE COLLECTION (DELETE OLD IMAGES)
// ------------------------------------------------
export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const collection = await Collection.findById(id);
    if (!collection) return res.status(404).json({ message: "Not found" });

    if (collection.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    let finalImages = collection.images;

    // If user uploaded new files
    if (req.files?.length) {
      if (req.files.length > 5) return res.status(400).json({ message: "Max 5 allowed." });

      // 🧹 DELETE OLD IMAGES FROM CLOUDINARY
      for (let img of collection.images) {
        const publicId = getPublicIdFromUrl(img);
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload fresh images
      finalImages = [];
      for (let file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path, { folder: "collections" });
        finalImages.push(upload.secure_url);
      }
    }

    collection.title = title || collection.title;
    collection.images = finalImages;

    await collection.save();

    res.status(200).json({ message: "Collection updated", collection });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// DELETE COLLECTION + IMAGES
// ------------------------------------------------
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);
    if (!collection) return res.status(404).json({ message: "Not found" });

    if (collection.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    // 🧹 DELETE ALL IMAGES FROM CLOUDINARY
    for (let img of collection.images) {
      const publicId = getPublicIdFromUrl(img);
      await cloudinary.uploader.destroy(publicId);
    }

    // Remove collection from DB
    await collection.deleteOne();

    res.status(200).json({ message: "Collection + images deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// FETCH PUBLIC
// ------------------------------------------------
export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(collections);
  } catch (err) {
    console.error("Fetch All Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// FETCH SINGLE
// ------------------------------------------------
export const getSingleCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate("user", "name email");

    if (!collection) return res.status(404).json({ message: "Not found" });

    res.status(200).json(collection);
  } catch (err) {
    console.error("Fetch Single Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

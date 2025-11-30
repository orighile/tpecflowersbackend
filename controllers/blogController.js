// controllers/blogController.js

import Blog from "../model/Blog.js";
import cloudinary from "../config/cloudinary.js";
import { getPublicIdFromUrl } from "../utils/cloudinary.js";

// Helper: Upload image buffer directly to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blog_headers",
        transformation: [
          { width: 1200, height: 675, crop: "limit" }, 
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// -------------------------------
// CREATE BLOG
// -------------------------------
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Header image is required." });
    }

    // Upload image from memory
    const uploadResult = await uploadToCloudinary(req.file.buffer);

    // Create blog
    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      headerImage: uploadResult.secure_url,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (err) {
    console.error("Create Blog Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// -------------------------------
// UPDATE BLOG
// -------------------------------
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let headerImageUrl = blog.headerImage;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (blog.headerImage) {
        const publicId = getPublicIdFromUrl(blog.headerImage);
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      headerImageUrl = uploadResult.secure_url;
    }

    // Update only provided fields
    blog.title = title?.trim() || blog.title;
    blog.content = content?.trim() || blog.content;
    blog.headerImage = headerImageUrl;

    await blog.save();

    res.json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (err) {
    console.error("Update Blog Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// -------------------------------
// DELETE BLOG
// -------------------------------
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete image from Cloudinary
    if (blog.headerImage) {
      const publicId = getPublicIdFromUrl(blog.headerImage);
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await blog.deleteOne();

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete Blog Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------
// GET ALL BLOGS (Public)
// -------------------------------
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.error("Get All Blogs Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------
// GET SINGLE BLOG (Public)
// -------------------------------
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user", "name");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (err) {
    console.error("Get Single Blog Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
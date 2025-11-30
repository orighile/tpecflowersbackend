import express from "express";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
} from "../controllers/blogController.js";

const BlogRouter = express.Router();

// PUBLIC
BlogRouter.get("/", getAllBlogs);
BlogRouter.get("/:id", getSingleBlog);

// AUTH REQUIRED
BlogRouter.post("/create", auth, upload.single("headerImage"), createBlog);
BlogRouter.put("/:id", auth, upload.single("headerImage"), updateBlog);
BlogRouter.delete("/:id", auth, deleteBlog);

export default BlogRouter;

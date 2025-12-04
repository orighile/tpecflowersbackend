import express from "express";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  getAllCollections,
  getSingleCollection,
} from "../controllers/collectionsController.js";

const CollectionRouter = express.Router();

CollectionRouter.get("/", getAllCollections);
CollectionRouter.get("/:id", getSingleCollection);

CollectionRouter.post("/", auth, upload.array("images", 5), createCollection);
CollectionRouter.put("/:id", auth, upload.array("images", 5), updateCollection);
CollectionRouter.delete("/:id", auth, deleteCollection);

export default CollectionRouter;

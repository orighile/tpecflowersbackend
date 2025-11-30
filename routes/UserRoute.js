import express from "express";
import { signup, login } from "../controllers/authController.js";
import User from "../model/User.js";

const UserRouter = express.Router();


UserRouter.post("/signup", signup);
UserRouter.post("/login", login);

export default UserRouter;

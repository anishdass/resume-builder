import express from "express";
import {
  getUserById,
  loginUser,
  registerUser,
} from "../controllers/UserController.js";
import protect from "../middlewares/authMiddleware.js";

// Initiate userRouter
const userRouter = express.Router();

// define different path for userAPIs
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/data", protect, getUserById);

export default userRouter;

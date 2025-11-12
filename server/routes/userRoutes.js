import express from "express";
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
} from "../controllers/UserController.js";
import protect from "../middlewares/authMiddleware.js";

// Initiate userRouter
const userRouter = express.Router();

// define different path for userAPIs
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);

export default userRouter;

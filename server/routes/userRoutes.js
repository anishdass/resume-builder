import express from "express";
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

// Initiate userRouter
const userRouter = express.Router();

// define different path for userAPIs
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/data", protect, getUserById);
userRouter.post("/resumes", protect, getUserResumes);

export default userRouter;

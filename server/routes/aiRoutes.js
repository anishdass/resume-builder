import express from "express";
import {
  enhanceJobDesc,
  enhanceProSummary,
  uploadResume,
} from "../controllers/aiController.js";
import protect from "../middlewares/authMiddleware.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-summary", protect, enhanceProSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDesc);
aiRouter.post("/upload-resume", protect, uploadResume);

export default aiRouter;

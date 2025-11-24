import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// Database connection
await connectDB();

app.use(express.json());

const vercelPattern = /^https:\/\/resume-builder-.*\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === "http://localhost:5173" ||
        vercelPattern.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.get("/", (req, res) => res.send("Server is Live"));
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/image", imageRouter);
app.use("/api/ai", aiRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

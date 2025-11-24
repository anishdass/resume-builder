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

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow non-browser requests (like Postman)

    const allowedExactOrigins = [
      "http://localhost:5173",
      "https://resume-builder-flame-ten.vercel.app",
    ];

    const isAllowed =
      allowedExactOrigins.includes(origin) || origin.endsWith(".vercel.app");

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Database connection
await connectDB();

app.use(express.json());

app.get("/", (req, res) => res.send("Server is Live"));
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/image", imageRouter);
app.use("/api/ai", aiRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

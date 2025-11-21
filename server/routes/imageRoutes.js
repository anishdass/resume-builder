import express from "express";
import removeBackground from "../controllers/imageController.js";
import upload from "../configs/multer.js";

const imageRouter = express.Router();

imageRouter.post("/removeBg", upload.single("image"), removeBackground);

export default imageRouter;

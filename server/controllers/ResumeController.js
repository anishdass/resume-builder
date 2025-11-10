// Controller for creating a new resume

import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs, { createReadStream } from "fs";

// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    // Get user id from the request, and title from body
    const userId = req.userId;
    const { title } = req.body;
    console.log(req.body);

    // Create new Resume
    const newResume = await Resume.create({ userId, title });

    // Return success message and the resume
    return res
      .status(200)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    // Error message on catch block
    return res.status(200).json({ message: error.message });
  }
};

// Controller for updating a resume
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy = JSON.parse(JSON.stringify(resumeData));

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imagekit.files.upload({
        file: fs.createReadStream(imageBufferData),
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300, h-300, fo-face, z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });

      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      {
        new: true,
      }
    );

    return res.status(200).json({ message: "Saved Successfully", resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for deleting a new resume
// POST: /api/resumes/create
export const deleteResume = async (req, res) => {
  try {
    // Get user id from the request, and resume from params
    const userId = req.userId;
    const { resumeId } = req.params;

    // Delete the Resume
    await Resume.findByIdAndDelete({ userId, _id: resumeId });

    // Return success message and the resume
    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    // Error message on catch block
    return res.status(400).json({ message: error.message });
  }
};

// Get user resume by Id
// GET: /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    // Get user id from the request, and resume from params
    const userId = req.userId;
    const { resumeId } = req.params;

    // get Resume
    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(200).json({ message: "Resume unavailable" });
    }

    // Return success message and the resume
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(404).json({ resume });
  } catch (error) {
    // Error message on catch block
    return res.status(200).json({ message: error.message });
  }
};

// Get resume by id: public
// GET: /api/resume/public
export const getPublicResumeById = async (req, res) => {
  try {
    const resumeId = req.params;
    const resume = await Resume.findOne({ _id: resumeId, public: true });

    if (!resume) {
      return res.status(404).json({ message: "Resume unavailable" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

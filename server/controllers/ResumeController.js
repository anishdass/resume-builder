import client from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import FormData from "form-data";
import axios from "axios";

// Controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    // Get user id from the request, and title from body
    const userId = req.userId;
    const { title } = req.body;

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

    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = await JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    // if (image) {
    //   const response = await client.files.upload({
    //     file: fs.createReadStream(image.path),
    //     fileName: "resume.png",
    //     folder: "user-resumes",
    //   });

    //   const transformedUrl = client.helper.buildSrc({
    //     src: response.url,
    //     transformation: [
    //       {
    //         width: 300,
    //         height: 300,
    //         focus: "face",
    //         zoom: 0.75,
    //       },
    //     ],
    //   });

    //   resumeDataCopy.personal_info.image = transformedUrl;
    // }

    if (image) {
      // Read the image buffer
      const imageBuffer = image.buffer;

      // Prepare form data
      const formData = new FormData();
      formData.append("image_file", imageBuffer, {
        filename: image.originalname,
        contentType: image.mimetype,
      });
      formData.append("size", "auto");

      // Send request to remove.bg API
      const removeBgResponse = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "X-Api-Key": process.env.REMOVE_BG_API_KEY,
          },
          responseType: "arraybuffer", // important to get the binary data
        }
      );

      // You could store the returned image somewhere (ex: cloud storage)
      // For demo, let's convert buffer to base64 string and send a data URL
      const base64Image = Buffer.from(removeBgResponse.data, "binary").toString(
        "base64"
      );
      const mimeType = removeBgResponse.headers["content-type"];
      let url = `data:${mimeType};base64,${base64Image}`;

      // Upload the base64 data URL to ImageKit and apply the transformation
      // First, upload the image from the data URL to ImageKit
      const uploadResponse = await client.files.upload({
        file: url, // url is a data url
        fileName: image.originalname || "image-removed-bg.png",
        useUniqueFileName: true,
        folder: "user-images-bgremoved",
      });

      // Transform the uploaded image as in updateResume controller
      const transformedUrl = client.helper.buildSrc({
        src: uploadResponse.url,
        transformation: [
          {
            width: 300,
            height: 300,
            focus: "face",
            zoom: 0.75,
            effect: "bgremove",
          },
        ],
      });

      // Overwrite url with the transformed version, so the response will send it

      resumeDataCopy.personal_info.image = transformedUrl;
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
      return res.status(404).json({ message: "Resume unavailable" });
    }

    // Return success message and the resume
    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    // Error message on catch block
    return res.status(400).json({ message: error.message });
  }
};

// Get resume by id: public
// GET: /api/resume/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ _id: resumeId, public: true });

    if (!resume) {
      return res.status(404).json({ message: "Resume unavailable" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

import axios from "axios";
import FormData from "form-data";
import client from "../configs/imageKit.js";

const removeBackground = async (req, res) => {
  try {
    // Check if file exists in req.file
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    // Read the image buffer
    const imageBuffer = req.file.buffer;

    // Prepare form data
    const formData = new FormData();
    formData.append("image_file", imageBuffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
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
      fileName: req.file.originalname || "image-removed-bg.png",
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
    url = transformedUrl;

    return res.status(200).json({ url });
  } catch (error) {
    let errMsg =
      error.response && error.response.data
        ? error.response.data
        : error.message;
    return res
      .status(500)
      .json({ message: "Failed to remove background", error: errMsg });
  }
};

export default removeBackground;

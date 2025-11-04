// Controller for enhancing resume's professional summary
// POST: /api/ai/enhance-pro-summary

export const enhanceProSummary = async (req, res) => {
  try {
    // Get content from the request
    const { userContent } = req.body;
    // if user content is not present return status 400 and the message would be missing required field

    if (!userContent) {
      return res.status(404).json({ message: "Required fields missing" });
    }
    // Get the response from openai documentation
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS friendly. and only return text no options or anyhting else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message;
    return res.status(200).json({ enhancedContent });

    // return the response
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-description

export const enhanceJobDesc = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(404).json({ message: "Missing Required fields" });
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS friendly and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message;
    return res.json(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

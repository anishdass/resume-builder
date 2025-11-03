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

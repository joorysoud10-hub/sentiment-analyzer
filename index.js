const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

module.exports = async (req, res) => {
  
  if (req.method === 'POST') {
    try {
      const { text } = req.body || {};

      if (!text || !text.trim()) {
        return res.status(400).json({
          error: 'Please enter a sentence.'
        });
      }

      const msg = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 50,
        messages: [
          {
            role: "user",
            content: `Classify the sentiment strictly as "Positive" or "Negative". Return ONLY one word.

Text: ${text}`
          }
        ]
      });

      const result = msg.content?.[0]?.text?.trim();

      return res.status(200).json({
        result: result === "Positive" || result === "Negative"
          ? result
          : "Unknown"
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: error.message || "Something went wrong."
      });
    }
  }

  return res.status(405).json({
    error: "Method Not Allowed"
  });
};

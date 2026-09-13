const http = require('http');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      maxTokens: 100,
      messages: [{ role: "user", content: "Analyze the sentiment of: I love building apps with Vercel!" }]
    });
    res.end(JSON.stringify({ status: "success", analysis: msg.content }));
  } catch (error) {
    res.end(JSON.stringify({ status: "error", message: error.message }));
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});

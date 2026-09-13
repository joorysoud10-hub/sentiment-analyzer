const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { text } = JSON.parse(body);
        const msg = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          maxTokens: 50,
          messages: [{ role: "user", content: `Classify the sentiment strictly as "Positive" or "Negative": "${text}"` }]
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result: msg.content[0].text }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
};

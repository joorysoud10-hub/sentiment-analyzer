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
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ result: msg.content[0].text }));
      } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Sentiment Analyzer</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .card { background: #1e293b; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); width: 100%; max-width: 400px; box-sizing: border-box; }
    input { width: 100%; padding: 0.75rem; margin: 1rem 0; border-radius: 0.5rem; border: 1px solid #475569; background: #0f172a; color: #fff; box-sizing: border-box; }
    button { width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; font-weight: bold; cursor: pointer; }
    button:hover { background: #2563eb; }
    #result { margin-top: 1rem; font-size: 1.2rem; text-align: center; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h2>AI Sentiment Analyzer</h2>
    <input type="text" id="textInput" placeholder="Enter a sentence...">
    <button onclick="analyze()">Analyze</button>
    <div id="result"></div>
  </div>
  <script>
    async function analyze() {
      const text = document.getElementById('textInput').value;
      const resDiv = document.getElementById('result');
      resDiv.innerText = "Analyzing...";
      const response = await fetch(window.location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      resDiv.innerText = data.result || data.error;
    }
  </script>
</body>
</html>`);
  }
};

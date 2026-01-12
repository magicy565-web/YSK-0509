import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

const API_ENDPOINT = "https://api.nova-oss.com/v1/chat/completions";

app.post('/api/proxy', async (req, res) => {
  const { model, messages } = req.body;

  if (!model || !messages) {
    return res.status(400).json({ error: 'Missing model or messages in request body' });
  }

  // MODIFIED: Switched to NOVAI_API_KEY to match Vercel environment variable.
  const apiKey = process.env.NOVAI_API_KEY;
  if (!apiKey) {
    // Updated the error message to reflect the new variable name.
    return res.status(500).json({ error: 'NOVAI_API_KEY is not configured. Please check your .env file and Vercel settings.' });
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });

    // Forward the exact response from NOVA AI, whether it's a success or an error.
    // This gives the frontend the full context.
    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Proxy Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend proxy server listening at http://localhost:${port}`);
});

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

// The API endpoint for the OpenAI-compatible service.
// You can change this to your specific NOVA AI provider's URL.
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

app.post('/api/proxy', async (req, res) => {
  const { model, messages } = req.body;

  if (!model || !messages) {
    return res.status(400).json({ error: 'Missing model or messages in request body' });
  }

  // IMPORTANT: Switched to use NOVA_API_KEY
  const apiKey = process.env.NOVA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NOVA_API_KEY is not configured. Please add it to your .env file.' });
  }

  try {
    // Construct the request to the OpenAI-compatible API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // OpenAI-compatible APIs use a Bearer token for authorization.
        'Authorization': `Bearer ${apiKey}`
      },
      // Pass the body from the frontend directly to the target API
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Provider Error:', errorBody);
      return res.status(response.status).json({ error: `API request failed: ${errorBody}` });
    }
    
    // The frontend expects the standard OpenAI response format, which we are just passing through.
    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Proxy Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend proxy server listening at http://localhost:${port}`);
});

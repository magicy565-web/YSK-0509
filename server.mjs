import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

// MODIFIED: Switched to the correct NOVA AI API endpoint.
const API_ENDPOINT = "https://api.nova-oss.com/v1/chat/completions";

app.post('/api/proxy', async (req, res) => {
  const { model, messages } = req.body;

  if (!model || !messages) {
    return res.status(400).json({ error: 'Missing model or messages in request body' });
  }

  const apiKey = process.env.NOVA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NOVA_API_KEY is not configured. Please add it to your .env file.' });
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

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('NOVA AI API Error:', errorBody);
      return res.status(response.status).json({ error: `API request failed: ${errorBody}` });
    }
    
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

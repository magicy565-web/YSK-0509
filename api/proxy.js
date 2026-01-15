
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_ENDPOINT = "https://api.nova-oss.com/v1/chat/completions";
const START_TIMEOUT = 30000;

export default async function handler(req, res) {

  // 1. Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or your frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }


  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { model, messages, stream } = req.body;

  if (!model || !messages) {
    return res.status(400).json({ error: 'Missing model or messages in request body' });
  }

  const apiKey = process.env.NOVAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'NOVAI_API_KEY is not configured.' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`AI request timed out after ${START_TIMEOUT / 1000}s`);
    controller.abort();
  }, START_TIMEOUT);

  try {
    const aiResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, stream }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (stream) {
      res.setHeader('Content-Type', aiResponse.headers.get('Content-Type') || 'text/event-stream');
      aiResponse.body.pipe(res);
    } else {
      const data = await aiResponse.json();
      res.status(aiResponse.status).json(data);
    }

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        error: 'Gateway Timeout', 
        message: `The AI service failed to send a response within ${START_TIMEOUT / 1000} seconds.`
      });
    }
    
    console.error('Proxy Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

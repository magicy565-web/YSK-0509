
// /api/proxy.js
const API_ENDPOINT = 'https://api.nova-oss.com/v1/chat/completions';
const START_TIMEOUT = 1000 * 30; // 30 seconds

export default async function handler(req, res) {
  // 1. Set up CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Ensure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 4. Main proxy logic
  const { model, messages, stream } = req.body;

  if (!model || !messages) {
    return res.status(400).json({ error: 'Missing model or messages in request body' });
  }

  const apiKey = process.env.NOVAI_API_KEY;
  if (!apiKey) {
    console.error("NOVAI_API_KEY is not configured on the server.");
    return res.status(500).json({ error: 'Server configuration error.' });
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

    // Correctly handle the JSON response (non-streaming)
    const aiData = await aiResponse.json();

    // If the AI service returned an error, forward it
    if (!aiResponse.ok) {
      console.error("Error from NovAI API:", aiData);
      return res.status(aiResponse.status).json(aiData);
    }
    
    // Send the successful JSON response back to the client
    res.status(200).json(aiData);

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        error: 'Gateway Timeout', 
        message: `The AI service failed to respond within ${START_TIMEOUT / 1000} seconds.`
      });
    }
    
    console.error('Proxy Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

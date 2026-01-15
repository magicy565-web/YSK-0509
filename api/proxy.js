
// /api/proxy.js

// RADICAL FIX: Bypassing the initial endpoint and going directly to the redirect target host discovered via cURL.
const API_ENDPOINT = 'https://ww38.api.nova-oss.com/v1/chat/completions';

const START_TIMEOUT = 1000 * 60; // 60 seconds

const fetchWithRetry = async (url, options, retries = 1, delay = 1000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      // Set a specific timeout for the fetch attempt itself
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), START_TIMEOUT);
      options.signal = controller.signal;

      const response = await fetch(url, options);
      clearTimeout(timeoutId);
      return response;

    } catch (error) {
      const isConnectTimeout = error.cause && error.cause.code === 'UND_ERR_CONNECT_TIMEOUT';
      const isAbortError = error.name === 'AbortError';

      if ((isConnectTimeout || isAbortError) && i < retries) {
        console.warn(`Attempt ${i + 1} failed due to timeout. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Throw the final error
      }
    }
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { model, messages, stream } = req.body;
  if (!model || !messages) return res.status(400).json({ error: 'Missing model or messages' });

  const apiKey = process.env.NOVAI_API_KEY;
  if (!apiKey) {
    console.error("NOVAI_API_KEY is not configured.");
    return res.status(500).json({ error: 'Server configuration error: NOVAI_API_KEY is missing.' });
  }

  try {
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, stream }),
      // We no longer need the redirect option as we are hitting the target directly.
    };

    const aiResponse = await fetchWithRetry(API_ENDPOINT, fetchOptions);

    const responseBodyText = await aiResponse.text();

    if (!aiResponse.ok) {
      console.error("Error from NovAI API. Status:", aiResponse.status, "Body:", responseBodyText);
      return res.status(aiResponse.status).json({ error: "AI service returned an error.", details: responseBodyText });
    }

    try {
      const aiData = JSON.parse(responseBodyText);
      return res.status(200).json(aiData);
    } catch (e) {
      console.error("Could not parse AI response as JSON.", responseBodyText);
      return res.status(502).json({ error: 'Bad Gateway: Invalid JSON from AI service.' });
    }

  } catch (error) {
    console.error('--- PROXY CATCH BLOCK ---', { name: error.name, message: error.message, cause: error.cause });
    return res.status(500).json({
        error: 'Proxy failed during fetch operation.',
        details: {
            name: error.name,
            message: error.message,
            cause: error.cause ? { code: error.cause.code, message: error.cause.message } : null
        }
    });
  }
}

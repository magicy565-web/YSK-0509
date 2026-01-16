
// api/proxy.js
import fetch from 'node-fetch';

// Use the environment variables, with defaults for the URLs
const primaryBaseUrl = process.env.NOVAI_BASE_URL || "https://once-cf.novai.su/v1/chat/completions";
const fallbackBaseUrl = "https://openrouter.ai/api/v1/chat/completions";

// A helper function to try making the request
const tryRequest = async (url, headers, body) => {
    console.log(`[Proxy] Attempting to forward request to ${url}`);
    // Use the model from the original body, or a fallback for OpenRouter
    const effectiveBody = url.includes('openrouter.ai')
      ? { ...body, model: 'gryphe/mythomax-l2-13b' }
      : body;

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(effectiveBody),
        timeout: 15000, // 15-second timeout
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.warn(`[Proxy] Request to ${url} failed with status ${response.status}:`, errorBody.substring(0, 500));
        throw new Error(`Upstream request to ${url} failed with status ${response.status}`);
    }

    console.log(`[Proxy] Request to ${url} was successful.`);
    return response;
};


export default async function handler(req, res) {
  // 1. Handle CORS preflight requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Get API Key from environment
  // IMPORTANT: The API key is hardcoded here as it was in the previous version.
  // For better security, you should set this as an environment variable.
  const apiKey = 'sk-LIs2MGKmDuGZhcfHbvLs1EiWHPwm2ELf3E8JkJXlFXgFLPBM';
  
  if (!apiKey) {
    console.error('[Proxy Error] NOVAI_API_KEY is not set.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 3. Get body from the Vercel request object (already parsed)
    const { model, messages, stream } = req.body;

    if (!model || !messages) {
      return res.status(400).json({ error: 'Missing required fields: model and messages' });
    }

    // 4. Set up headers for the backend request
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        // Add required headers for OpenRouter fallback
        'HTTP-Referer': 'https://your-app-name.com', // Replace with your app's name or domain
        'X-Title': 'Your App Title', // Replace with your app's title
    };
    
    const body = { model, messages, stream, temperature: 0.7 };

    let backendResponse;
    try {
        // 5. Try the primary URL first
        backendResponse = await tryRequest(primaryBaseUrl, headers, body);
    } catch (error) {
        console.warn('[Proxy] Primary URL failed. Trying fallback...');
        try {
            // 6. If primary fails, try the fallback URL
            backendResponse = await tryRequest(fallbackBaseUrl, headers, body);
        } catch (fallbackError) {
            console.error("[Server Error] All fallbacks failed.", fallbackError.message);
            return res.status(502).json({ error: "Proxy failed after all fallbacks", details: fallbackError.message });
        }
    }
    
    // 7. Stream the response back to the client
    // Set the headers from the successful backend response
    res.setHeader('Content-Type', backendResponse.headers.get('Content-Type'));
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Pipe the body of the backend response to our response
    backendResponse.body.pipe(res);

  } catch (error) {
    console.error("[Server Error] An unexpected error occurred.", error);
    return res.status(500).json({ error: "An unexpected proxy error occurred", details: error.message });
  }
}

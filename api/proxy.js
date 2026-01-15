
export const config = {
  runtime: 'edge',
};

// A more robust proxy for NovAI with streaming and better error handling
export default async function handler(req) {
  // 1. Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // 2. Basic validation
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Get API Key and define Base URLs
  const apiKey = process.env.NOVAI_API_KEY;
  const primaryBaseUrl = process.env.NOVAI_BASE_URL || "https://once-cf.novai.su/v1/chat/completions";
  // [NEW] Add a fallback URL. This is a public test endpoint.
  const fallbackBaseUrl = "https://openrouter.ai/api/v1/chat/completions"; 

  if (!apiKey) {
    console.error('[Proxy Error] NOVAI_API_KEY is not set.');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tryRequest = async (url, headers, body) => {
    console.log(`[Proxy] Attempting to forward request to ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.warn(`[Proxy] Request to ${url} failed with status ${response.status}:`, errorBody);
        throw new Error(`Upstream request failed with status ${response.status}`);
    }
    
    console.log(`[Proxy] Request to ${url} was successful.`);
    return response;
  };

  try {
    const { model, messages, stream } = await req.json();

    if (!model || !messages) {
      return new Response(JSON.stringify({ error: 'Missing required fields: model and messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        // [NEW] OpenRouter requires this header
        'HTTP-Referer': 'https://your-app-name.com', 
        'X-Title': 'Your App Name',
    };
    const body = { model, messages, stream, temperature: 0.7 };

    let backendResponse;
    try {
        // Try primary URL first
        backendResponse = await tryRequest(primaryBaseUrl, headers, body);
    } catch (error) {
        console.warn('[Proxy] Primary URL failed. Trying fallback...');
        // If primary fails, try the fallback
        // Note: The model might need to be adjusted for the fallback service.
        // For OpenRouter, you can use models like "gryphe/mythomax-l2-13b".
        const fallbackBody = { ...body, model: 'gryphe/mythomax-l2-13b' }; 
        backendResponse = await tryRequest(fallbackBaseUrl, headers, fallbackBody);
    }
    
    // 6. Handle streaming or non-streaming responses
    if (stream && backendResponse.body) {
        return new Response(backendResponse.body, {
            status: backendResponse.status,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } else {
        const data = await backendResponse.json();
        return new Response(JSON.stringify(data), {
            status: backendResponse.status,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        });
    }

  } catch (error) {
    console.error("[Server Error]", error);
    return new Response(JSON.stringify({ error: "Proxy failed after all fallbacks", details: error.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}

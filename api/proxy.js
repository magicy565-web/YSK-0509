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

  // 3. Get API Key and Base URL from environment variables
  const apiKey = process.env.NOVAI_API_KEY;
  const baseUrl = process.env.NOVAI_BASE_URL || "https://once-cf.novai.su/v1/chat/completions";

  if (!apiKey) {
    console.error('[Proxy Error] NOVAI_API_KEY is not set.');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 4. Parse request body and validate
    const { model, messages, stream } = await req.json();

    if (!model || !messages) {
      return new Response(JSON.stringify({ error: 'Missing required fields: model and messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[Proxy] Forwarding request to ${baseUrl}. Model: ${model}, Stream: ${stream}`);

    // 5. Forward the request to the NovAI backend
    const backendResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, stream, temperature: 0.7 }),
    });

    // 6. Handle streaming or non-streaming responses
    if (stream && backendResponse.body) {
        // If streaming, pipe the response body directly to our response
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
        // If not streaming, parse the JSON and return it
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
    return new Response(JSON.stringify({ error: "Proxy failed", details: error.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = 3001;
const START_TIMEOUT = 30000;

// --- SECURITY FIX 1: Rate Limiting --- 
const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 20, // Limit each IP to 20 requests per window
	message: 'Too many requests from this IP, please try again after a minute',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// --- End of Security Fix ---

app.use(express.json());

const API_ENDPOINT = "https://api.nova-oss.com/v1/chat/completions";

// UPGRADED WITH SECURITY: Endpoint is now protected by rate limiting and a startup timeout.
app.post('/api/proxy', apiLimiter, async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Backend proxy server listening at http://localhost:${port}`);
});

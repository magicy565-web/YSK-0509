import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { Client } from '@hubspot/api-client';

dotenv.config();

const app = express();
const port = 3001;
const START_TIMEOUT = 30000;
// Correctly use HUBSPOT_API_KEY from .env file
const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_API_KEY });

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

app.post('/api/submit-application', async (req, res) => {
  const { companyName, contactPerson, contactPhone } = req.body;

  try {
    // 1. 在 HubSpot 创建 Deal (代表申请)
    const dealResponse = await hubspotClient.crm.deals.basicApi.create({
      properties: {
        dealname: `${companyName} - 入驻申请`,
        pipeline: 'default', // 或者是您刚才新建管道的 ID
        dealstage: 'appointmentscheduled', // 对应 "New Application" 阶段 ID
        factory_name: companyName // 您可能需要在 HubSpot Deal 属性里建一个自定义字段存这个，或者直接存标题
      }
    });

    // 2. 生成 "伪" 动态链接 (指向刚才发布的 HubSpot 页面)
    // 注意：这里我们在 URL 里埋入了工厂名
    const landingPageUrl = `https://244873556.hs-sites-na2.com/factory-profile-template?name=${encodeURIComponent(companyName)}&id=${dealResponse.id}`;

    res.json({
      success: true,
      crmId: dealResponse.id,
      landingPageUrl: landingPageUrl
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Backend proxy server listening at http://localhost:${port}`);
});
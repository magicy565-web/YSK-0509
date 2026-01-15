// api/proxy.js
import fetch from 'node-fetch'; // 1. 显式引入 node-fetch，确保底层请求库稳定

// 2. 改回标准的主接口地址 (不要用 ww38 这种临时子域名)
// 如果这个地址在你的网络下仍然慢，你需要确保你的 VPN 开启了“全局模式”
const API_ENDPOINT = 'https://api.nova-oss.com/v1/chat/completions';

export default async function handler(req, res) {
  // CORS 配置：允许前端跨域访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { model, messages, stream } = req.body;
  const apiKey = process.env.NOVAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: NOVAI_API_KEY is missing.' });
  }

  // 3. 设置超时控制 (60秒)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    console.log(`[Proxy] Sending request to: ${API_ENDPOINT}`);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, stream }),
      signal: controller.signal // 绑定超时信号
    });

    clearTimeout(timeoutId); // 请求成功，清除超时计时器

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Proxy] Upstream Error: ${response.status}`, errorText);
      return res.status(response.status).json({ 
        error: "AI Provider Error", 
        details: errorText 
      });
    }

    // 4. 处理流式响应 (Stream) 或 普通响应
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      // 将上游的流直接管道传输给前端
      response.body.pipe(res);
    } else {
      const data = await response.json();
      return res.status(200).json(data);
    }

  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[Proxy] Request Failed:', error);

    // 5. 区分错误类型返回给前端
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Gateway Timeout', message: '请求 AI 服务超时 (60s)，请检查网络连接。' });
    }
    
    return res.status(500).json({ 
      error: 'Proxy Error', 
      message: error.message,
      cause: error.cause 
    });
  }
}
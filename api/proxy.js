// api/proxy.js
import fetch from 'node-fetch';

// 1. 改回 Nova-OSS 的官方标准地址
const API_ENDPOINT = 'https://api.nova-oss.com/v1/chat/completions';

export default async function handler(req, res) {
  // CORS 配置
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.NOVAI_API_KEY;
  const { model, messages, stream } = req.body;

  try {
    console.log(`[Proxy] 正在连接官方地址: ${API_ENDPOINT}`);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        // 2. 关键伪装：模拟浏览器请求，防止被 WAF 拦截
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ model, messages, stream }),
    });

    // 先获取文本内容，以防返回的是 HTML
    const responseText = await response.text();

    // 3. 安全解析 JSON
    try {
      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        console.error('[Proxy] 上游服务报错:', data);
        return res.status(response.status).json(data);
      }
      
      return res.status(200).json(data);

    } catch (jsonError) {
      // 如果解析失败，说明返回的是 HTML 错误页
      console.error('------------------------------------------------');
      console.error('[Proxy] 严重错误: 上游返回了 HTML 而不是 JSON');
      console.error('[Proxy] 错误内容预览:', responseText.substring(0, 200)); // 打印前200个字符看原因
      console.error('------------------------------------------------');
      
      return res.status(502).json({
        error: 'Bad Gateway',
        message: 'Nova AI 服务端返回了无效响应 (可能是 403 验证页或 503 维护页)。',
        details: 'Upstream returned HTML instead of JSON.'
      });
    }

  } catch (error) {
    console.error('[Proxy] 网络请求失败:', error);
    return res.status(500).json({ error: 'Network Error', message: error.message });
  }
}
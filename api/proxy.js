// api/proxy.js
// 这是一个运行在 Vercel 服务器端的函数，专门用来绕过 CORS
export default async function handler(req, res) {
  // 1. 设置允许跨域的头 (让浏览器不报错)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理预检请求 (浏览器自动发的探测包)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. 准备发给 NovAI 的数据
  const { prompt, model } = req.body;
  
  // 🔴 你的 Key (为了确保能通，我先帮你写死在这里，测试通了再换环境变量)
  const apiKey = "sk-LycDc2maWsAZfEvH59T06iRIFlToKfnhHdWeJLtu7cSN1mhP";
  const baseUrl = "https://once-cf.novai.su/v1/chat/completions";

  try {
    console.log(`[Proxy] Forwarding request to ${baseUrl} using model ${model}`);

    // 3. 由 Vercel 服务器代发请求 (服务器之间没有 CORS 限制)
    const backendResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || "gemini-1.5-flash",
        messages: [
           { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await backendResponse.json();

    // 4. 把结果原封不动地还给前端
    if (!backendResponse.ok) {
        console.error("[Proxy Error]", data);
        return res.status(backendResponse.status).json(data);
    }
    
    return res.status(200).json(data);

  } catch (error) {
    console.error("[Server Error]", error);
    return res.status(500).json({ error: "Proxy Failed", details: error.message });
  }
}

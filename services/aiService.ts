import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

// 1. 读取 API Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// 🔍 调试日志：请在浏览器的 Console 里查看这一行
// 如果打印出来是 "AIza..." 说明你的 .env.local 没改成功！
// 如果是 "sk-Lyc..." 说明 Key 读取正确。
console.log("【Debug】Current Key:", apiKey ? `${apiKey.substring(0, 8)}******` : "MISSING");

// 2. 配置中转地址
const BASE_URL = "https://once-cf.novai.su/v1/chat/completions";

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let prompt = "";
  // ... (Switch 逻辑保持不变，为了节省篇幅省略，请保留你原来的 prompt 内容) ...
  switch (step) {
    case 'init':
      prompt = `你是一个外贸B2B全托管系统的后端 AI。请分析产品的北美市场潜力。要求返回纯 JSON 格式：{"leads": 215, "profit": "$150,000", "market": "北美", "topKeywords": ["Steel", "Heavy Duty"]}`;
      break;
    case 'start':
      prompt = `请生成营销策略。要求返回纯 JSON 格式：{"tactic": "低价策略", "subject": "报价单", "emailBody": "内容...", "channels": ["Email"]}`;
      break;
    case 'quote':
      prompt = `请生成报价单。要求返回纯 JSON 格式：{"clientName": "Turner", "clientRating": "AAA", "productName": "H-Beam", "quantity": "500", "unitPrice": "$850", "totalPrice": "$425k", "shippingCost": "$2k", "term": "DDP"}`;
      break;
    case 'sign':
       return { step: 'success', data: null };
  }

  try {
    // 3. 发送请求
    console.log("【Debug】Sending request to:", BASE_URL);
    
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // 确保这里没有多余空格
        },
        body: JSON.stringify({
            // ⚠️ 临时修改：先用 gpt-3.5-turbo 测试，因为这是所有中转站都支持的基础模型
            // 如果这个能通，我们再换回 gemini-1.5-flash
            model: "gpt-3.5-turbo", 
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        })
    });

    // 4. 详细的错误处理
    if (!response.ok) {
        const errorText = await response.text();
        console.error("【API Error 详情】:", errorText); // 👈 这一行非常关键！看控制台输出了什么
        
        let errorJson;
        try {
            errorJson = JSON.parse(errorText);
        } catch (e) {
            errorJson = { error: { message: errorText } };
        }
        
        // 抛出具体的错误信息
        throw new Error(`API请求失败 (${response.status}): ${errorJson?.error?.message || "未知错误"}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    
    // 清理 JSON
    const cleanJsonStr = text.replace(/```json|```/g, "").trim();
    
    // 尝试解析，防止 AI 返回非 JSON 内容
    let jsonData;
    try {
        jsonData = JSON.parse(cleanJsonStr);
    } catch (e) {
        console.error("JSON Parse Error. AI Response:", text);
        // 如果解析失败，给一个默认的假数据防止页面崩溃
        jsonData = { error: "AI返回格式错误", raw: text };
        if(step === 'init') jsonData = { leads: 0, profit: "Error", market: "Error", topKeywords: [] };
    }

    let nextStep = '';
    if (step === 'init') nextStep = 'analysis';
    if (step === 'start') nextStep = 'strategy';
    if (step === 'quote') nextStep = 'deal';

    return {
      step: nextStep,
      data: jsonData
    };

  } catch (error: any) {
    console.error("AI Service Error:", error);
    alert(`连接失败: ${error.message}。\n请按 F12 查看控制台【API Error 详情】`);
    throw error;
  }
};

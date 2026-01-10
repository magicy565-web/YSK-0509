import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

// 1. 读取 API Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
console.log("Debug Key Status:", apiKey ? `Key Loaded (${apiKey.substring(0, 5)}...)` : "Key Missing");

// 2. 配置中转商的 OpenAI 兼容地址
// 注意：对于 NovAI 这类中转，通常使用 /v1/chat/completions 接口
const BASE_URL = "https://once-cf.novai.su/v1/chat/completions";

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  // 模拟思考延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let prompt = "";

  // 3. 构建 Prompt (保持不变)
  switch (step) {
    case 'init':
      prompt = `你是一个外贸B2B全托管系统的后端 AI。用户刚上传了一个产品（假设是工业/机械类）。
      请分析该产品的北美市场潜力。
      
      要求：
      1. 返回纯 JSON 格式，不要包含Markdown标记。
      2. 必须严格符合以下 JSON 结构:
      {
        "leads": 215,
        "profit": "$150,000",
        "market": "北美 (建筑与基建)",
        "topKeywords": ["Structural Steel", "Heavy Duty"]
      }`;
      break;

    case 'start':
      prompt = `用户批准了获客计划。请生成激进的营销策略。
      
      要求：
      1. 返回纯 JSON 格式，不要包含Markdown标记。
      2. 必须严格符合以下 JSON 结构:
      {
        "tactic": "竞品低价截胡策略",
        "subject": "Re: 您的供应链成本优化方案 (降低 15%)",
        "emailBody": "尊敬的采购经理，我们注意到贵司正在采购...我们是源头工厂...",
        "channels": ["LinkedIn Direct", "Cold Email"]
      }`;
      break;

    case 'quote':
      prompt = `收到高意向询盘（客户 Turner Construction Co., AAA级）。请生成报价单数据。
      
      要求：
      1. 返回纯 JSON 格式，不要包含Markdown标记。
      2. 必须严格符合以下 JSON 结构:
      {
        "clientName": "Turner Construction Co.",
        "clientRating": "AAA (Dun & Bradstreet)",
        "productName": "H-Beam 200x200 (ASTM A36)",
        "quantity": "500 Tons",
        "unitPrice": "$850.00",
        "totalPrice": "$425,000.00",
        "shippingCost": "$2,100 (Ocean Freight)",
        "term": "DDP (Delivered Duty Paid)"
      }`;
      break;

    case 'sign':
       return { step: 'success', data: null };
  }

  try {
    // 4. 使用 fetch 发送标准 OpenAI 格式请求
    // 这种方式对 sk- 开头的 Key 兼容性最好
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // 这里放入你的 sk- Key
        },
        body: JSON.stringify({
            model: "gemini-1.5-flash", // 中转商通常支持这个模型名
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        })
    });

    // 5. 处理错误
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Detail:", errorData);
        throw new Error(`API Request Failed: ${response.status} ${response.statusText}`);
    }

    // 6. 解析响应
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    
    // 7. 清理 JSON 字符串
    const cleanJsonStr = text.replace(/```json|```/g, "").trim();
    const jsonData = JSON.parse(cleanJsonStr);

    let nextStep = '';
    if (step === 'init') nextStep = 'analysis';
    if (step === 'start') nextStep = 'strategy';
    if (step === 'quote') nextStep = 'deal';

    return {
      step: nextStep,
      data: jsonData
    };

  } catch (error) {
    console.error("AI Service Error:", error);
    alert(`连接失败: ${error instanceof Error ? error.message : '未知错误'}。请检查 API Key 余额或网络。`);
    throw error;
  }
};

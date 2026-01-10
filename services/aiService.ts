import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

// 1. 读取 .env.local 里的 Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
console.log("Debug Key Status:", apiKey ? `Key Loaded (${apiKey.substring(0, 5)}...)` : "Key Missing"); 

// 2. 初始化 SDK
const genAI = new GoogleGenerativeAI(apiKey);

// 🔴 关键修改：添加 customHeaders 适配第三方中转商
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", // 你购买的中转服务通常支持这个最新模型
}, {
    baseUrl: "https://once-cf.novai.su", // 中转地址
    customHeaders: {
        // 👇 强制把 Key 放入 Authorization 头，适配 sk- 开头的 Key
        'Authorization': `Bearer ${apiKey}`
    }
});

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  // 模拟思考延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let prompt = "";

  // ... (switch case 逻辑保持不变) ...
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
    // 发送请求
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
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
    alert("AI 服务连接失败 (401)。请检查控制台 Network 面板，确认 Key 是否正确发送。");
    throw error;
  }
};

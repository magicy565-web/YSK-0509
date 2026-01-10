import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

// 初始化 AI 客户端
// 确保 .env.local 里的变量名是 VITE_GEMINI_API_KEY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// 调试日志：如果控制台打印 Key Missing，请检查 Vercel 环境变量设置
console.log("Debug Key Status:", apiKey ? `Key Loaded (${apiKey.substring(0, 5)}...)` : "Key Missing"); 

const genAI = new GoogleGenerativeAI(apiKey);

// 🔴 修改点：强制使用 'gemini-pro' (1.0 版本)
// 这是最稳定的版本，如果这个还报错，那就一定是 API Key 本身的问题了
const model = genAI.getGenerativeModel({ 
    model: "gemini-pro" 
});

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  // 1. 模拟一点网络延迟体验
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let prompt = "";

  // 2. 根据步骤构建 Prompt
  switch (step) {
    case 'init':
      prompt = `你是一个外贸B2B全托管系统的后端 AI。用户刚上传了一个产品（假设是工业/机械类）。
      请分析该产品的北美市场潜力。
      
      要求：
      1. 返回纯 JSON 格式，不要包含Markdown标记。
      2. 数据要真实、商业化。
      3. 必须严格符合以下 JSON 结构:
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
    // 3. 发送给 Google
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // 4. 清理数据 (Gemini Pro 有时候比较喜欢加 Markdown，所以这一步很重要)
    const cleanJsonStr = text.replace(/```json|```/g, "").trim();
    const jsonData = JSON.parse(cleanJsonStr);

    // 5. 确定下一步
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
    alert("AI 连接失败。如果多次重试不行，请检查 API Key 额度或是否过期。");
    throw error;
  }
};

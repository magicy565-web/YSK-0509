import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
console.log("Debug Key Status:", apiKey ? `Key Loaded (${apiKey.substring(0, 5)}...)` : "Key Missing"); 

const genAI = new GoogleGenerativeAI(apiKey);

// 🔴 修改点：使用精确版本号，不要用通用别名
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-001" 
});

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  // 1. 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let prompt = "";

  // 2. 根据步骤构建 Prompt
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
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // 清理 JSON
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
    // 弹窗提示用户更详细的信息
    alert("AI 连接失败。请检查 API Key 或尝试更换模型名称 (gemini-pro)");
    throw error;
  }
};

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

// 初始化 AI 客户端
// 注意：Vite 要求环境变量必须以 VITE_ 开头才能在前端代码中访问
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// 调试日志：部署后按 F12 如果看到 Key Missing，说明 .env.local 配置不对
console.log("Debug Key Status:", apiKey ? `Key Loaded (${apiKey.substring(0, 5)}...)` : "Key Missing"); 

const genAI = new GoogleGenerativeAI(apiKey);

// 修改点：使用具体版本号 'gemini-1.5-flash-latest' 以避免 404 错误
// 如果仍然报错，可以尝试改为 'gemini-pro' (1.0版本，最稳定)
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest" 
});

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  // 1. 模拟一点延迟，让用户觉得 AI 在思考
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let prompt = "";

  // 2. 根据用户点击的按钮，决定发什么指令给 AI
  switch (step) {
    case 'init':
      // 对应：启动获客引擎
      prompt = `你是一个外贸B2B全托管系统的后端 AI。用户刚上传了一个产品（假设是工业/机械类）。
      请分析该产品的北美市场潜力。
      
      要求：
      1. 返回纯 JSON 格式，不要包含Markdown标记（如 \`\`\`json）。
      2. 数据要真实、商业化，让工厂老板看到商机。
      3. 必须严格符合以下 JSON 结构:
      {
        "leads": 215,
        "profit": "$150,000",
        "market": "北美 (建筑与基建)",
        "topKeywords": ["Structural Steel", "Heavy Duty"]
      }`;
      break;

    case 'start':
      // 对应：批准执行
      prompt = `用户批准了获客计划。请生成激进的营销策略。
      
      要求：
      1. 返回纯 JSON 格式，不要包含Markdown标记。
      2. 策略要激进（如低价截胡）。
      3. 必须严格符合以下 JSON 结构:
      {
        "tactic": "竞品低价截胡策略",
        "subject": "Re: 您的供应链成本优化方案 (降低 15%)",
        "emailBody": "尊敬的采购经理，我们注意到贵司正在采购...我们是源头工厂...",
        "channels": ["LinkedIn Direct", "Cold Email"]
      }`;
      break;

    case 'quote':
      // 对应：批准报价
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
       // 签约步骤直接返回成功，不需要 AI
       return { step: 'success', data: null };
  }

  try {
    // 3. 发送给 Google 并等待结果
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // 4. 清理 AI 返回的数据 (去掉可能存在的代码块标记)
    const cleanJsonStr = text.replace(/```json|```/g, "").trim();
    const jsonData = JSON.parse(cleanJsonStr);

    // 5. 告诉前端下一步去哪
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
    alert("AI 连接失败，请检查控制台日志。可能原因：API Key 无效或网络问题。");
    throw error;
  }
};

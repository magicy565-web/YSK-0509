import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

const PROMPTS = {
  init: `你是一个外贸B2B全托管系统的后端 AI。请分析产品的北美市场潜力。要求返回纯 JSON 格式：{"leads": 215, "profit": "$150,000", "market": "北美", "topKeywords": ["Steel", "Heavy Duty"]}`,
  start: `请生成营销策略。要求返回纯 JSON 格式：{"tactic": "低价策略", "subject": "报价单", "emailBody": "内容...", "channels": ["Email"]}`,
  quote: `请生成报价单。要求返回纯 JSON 格式：{"clientName": "Turner", "clientRating": "AAA", "productName": "H-Beam", "quantity": "500", "unitPrice": "$850", "totalPrice": "$425k", "shippingCost": "$2k", "term": "DDP"}`,
};

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  // 模拟思考延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (step === 'sign') {
    return { step: 'success', data: null };
  }

  const prompt = PROMPTS[step];

  try {
    console.log("【Debug】Calling local proxy...");
    
    const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            model: "[vertex]gemini-3-pro-preview" 
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("【Proxy Error】:", errorData);
        throw new Error(`API请求失败: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    
    const cleanJsonStr = text.replace(/```json|```/g, "").trim();
    
    let jsonData;
    try {
        jsonData = JSON.parse(cleanJsonStr);
    } catch (e) {
        console.error("JSON Parse Error, using fallback.");
        switch (step) {
            case 'init':
                jsonData = { leads: 0, profit: "$0", market: "N/A", topKeywords: ["Error"], error: "Format Error" };
                break;
            case 'start':
                jsonData = { tactic: "AI Strategy (Fallback)", subject: "Offer", emailBody: text, channels: ["Email"], error: "Format Error" };
                break;
            case 'quote':
                jsonData = { clientName: "N/A", clientRating: "N/A", productName: "N/A", quantity: "0", unitPrice: "$0", totalPrice: "$0", shippingCost: "$0", term: "N/A", error: "Format Error" };
                break;
            default:
                jsonData = { error: "Format Error" };
        }
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
    throw error;
  }
};

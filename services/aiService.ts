import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

// ✅ 继续保留硬编码 Key，先跑通再说
const apiKey = "sk-LycDc2maWsAZfEvH59T06iRIFlToKfnhHdWeJLtu7cSN1mhP";

// 中转地址
const BASE_URL = "https://once-cf.novai.su/v1/chat/completions";

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let prompt = "";
  // ... (Switch 逻辑保持不变) ...
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
    console.log("【Debug】Request Model: [vertex]gemini-3-pro-preview");
    
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` 
        },
        body: JSON.stringify({
            // 🔴 关键修改：使用你看到的那个特殊模型名
            model: "[vertex]gemini-3-pro-preview", 
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("【API Error 详情】:", errorText);
        
        let errorMsg = errorText;
        try {
            const errJson = JSON.parse(errorText);
            errorMsg = errJson.error?.message || errorText;
        } catch(e) {}

        throw new Error(`API请求失败 (${response.status}): ${errorMsg}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    
    // 清理 JSON
    const cleanJsonStr = text.replace(/```json|```/g, "").trim();
    
    let jsonData;
    try {
        jsonData = JSON.parse(cleanJsonStr);
    } catch (e) {
        console.error("JSON Parse Error:", text);
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
    alert(`连接失败: ${error.message}`);
    throw error;
  }
};

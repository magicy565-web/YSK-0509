import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  // 模拟思考延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let prompt = "";
  
  // --- Prompt 生成逻辑 (保持不变) ---
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
    console.log("【Debug】Calling local proxy...");
    
    // 🔴 关键修改：请求我们刚创建的 Vercel 代理接口
    // 浏览器 -> /api/proxy -> NovAI
    const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: prompt,
            // 既然 NovAI 的 gemini 可能缺货，我们暂时用 vertex 版本或 gpt-4o-mini 保底
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
    
    // 清理 JSON
    const cleanJsonStr = text.replace(/```json|```/g, "").trim();
    
    let jsonData;
    try {
        jsonData = JSON.parse(cleanJsonStr);
    } catch (e) {
        // 如果 AI 返回的不是完美 JSON，给一个兜底数据防止页面白屏
        console.error("JSON Parse Error, using fallback.");
        if(step === 'start') jsonData = { tactic: "AI Strategy (Fallback)", subject: "Offer", emailBody: text, channels: ["Email"] };
        else jsonData = { error: "Format Error" };
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

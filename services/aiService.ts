import { AnalysisData, StrategyData, DealData, ApiResponse, InfoFormData } from '../types';

const PROMPTS = {
  init: (productName: string, targetCountry: string) => 
    `你是一个外贸B2B全托管系统的后端 AI。请为产品 \"${productName}\" 分析在 \"${targetCountry}\" 市场的潜力。要求返回纯 JSON 格式, 结构如下: 
    {
      "potentialBuyers": {
        "total": 150, 
        "top10": [
          {"name": "Buyer 1", "address": "Address 1", "contact": "Contact 1"},
          {"name": "Buyer 2", "address": "Address 2", "contact": "Contact 2"},
          {"name": "Buyer 3", "address": "Address 3", "contact": "Contact 3"},
          {"name": "Buyer 4", "address": "Address 4", "contact": "Contact 4"},
          {"name": "Buyer 5", "address": "Address 5", "contact": "Contact 5"},
          {"name": "Buyer 6", "address": "Address 6", "contact": "Contact 6"},
          {"name": "Buyer 7", "address": "Address 7", "contact": "Contact 7"},
          {"name": "Buyer 8", "address": "Address 8", "contact": "Contact 8"},
          {"name": "Buyer 9", "address": "Address 9", "contact": "Contact 9"},
          {"name": "Buyer 10", "address": "Address 10", "contact": "Contact 10"}
        ]
      },
      "nicheMarkets": [
        {"name": "Niche 1", "volume": "$5M"},
        {"name": "Niche 2", "volume": "$3M"},
        {"name": "Niche 3", "volume": "$1.5M"}
      ],
      "topCompetitors": [
        {"name": "Competitor 1", "website": "www.competitor1.com"},
        {"name": "Competitor 2", "website": "www.competitor2.com"},
        {"name": "Competitor 3", "website": "www.competitor3.com"},
        {"name": "Competitor 4", "website": "www.competitor4.com"},
        {"name": "Competitor 5", "website": "www.competitor5.com"}
      ],
      "b2bStrategies": [
        "Strategy 1",
        "Strategy 2",
        "Strategy 3",
        "Strategy 4",
        "Strategy 5"
      ]
    }`,
  start: `请生成营销策略。要求返回纯 JSON 格式：{\"tactic\": \"低价策略\", \"subject\": \"报价单\", \"emailBody\": \"内容...\", \"channels\": [\"Email\"]}`,
  quote: `请生成报价单。要求返回纯 JSON 格式：{\"clientName\": \"Turner\", \"clientRating\": \"AAA\", \"productName\": \"H-Beam\", \"quantity\": \"500\", \"unitPrice\": \"$850\", \"totalPrice\": \"$425k\", \"shippingCost\": \"$2k\", \"term\": \"DDP\"}`,
};

export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign', formData?: InfoFormData): Promise<ApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (step === 'sign') {
    return { step: 'success', data: null };
  }

  let prompt: string;
  if (step === 'init' && formData) {
    prompt = PROMPTS.init(formData.productName, formData.targetCountry);
  } else if (step === 'start' || step === 'quote') {
    prompt = PROMPTS[step];
  } else {
    throw new Error('Invalid step or missing form data for init step');
  }

  try {
    console.log("【Debug】Calling local proxy with prompt:", prompt);
    
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
        jsonData = {
          potentialBuyers: { total: 0, top10: [] },
          nicheMarkets: [],
          topCompetitors: [],
          b2bStrategies: [],
          error: "Format Error"
        };
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

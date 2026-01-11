import { AnalysisData, StrategyData, DealData, ApiResponse, InfoFormData } from '../types';

const PROMPTS = {
  init: (productName: string, targetCountry: string) => 
    `你是一个外贸B2B全托管系统的后端 AI。请为产品 \"${productName}\" 分析在 \"${targetCountry}\" 市场的潜力。
    重要提示：在潜在采购商名录 (potentialBuyers) 中, 请专注于识别独立的、中小型采购商或分销商，避免那些大型的、审核严格的头部公司。这些线索对于小型工厂来说应该是切实可行的。
    请返回纯 JSON 格式, 结构如下: 
    {
      "potentialBuyers": {
        "total": 150, 
        "top10": [
          {"name": "Independent Buyer A", "address": "123 Main St, Anytown, USA", "contact": "purchase@buyer-a.com"},
          {"name": "Regional Distributor B", "address": "456 Oak Ave, Sometown, USA", "contact": "sourcing@distributor-b.net"}
        ]
      },
      "nicheMarkets": [
        {"name": "Niche 1", "volume": "$5M"},
        {"name": "Niche 2", "volume": "$3M"}
      ],
      "topCompetitors": [
        {"name": "Competitor 1", "website": "www.competitor1.com", "advantages": ["Specializes in eco-friendly materials", "Strong brand recognition in North America"]},
        {"name": "Competitor 2", "website": "www.competitor2.com", "advantages": ["Offers lowest prices in the segment", "Wide range of product variations"]}
      ],
      "b2bStrategies": [
        "Strategy 1: Focus on niche e-commerce platforms.",
        "Strategy 2: Offer flexible minimum order quantities (MOQs)."
      ]
    }`,
  start: `你是一个外贸B2B全托管系统的后端 AI。请为产品生成三种不同的营销策略邮件。要求返回一个包含三个 JSON 对象的数组，每个对象代表一种策略。每个对象结构如下:
    {
      "id": "strategy-1",
      "title": "策略1：OEM工厂通用策略",
      "description": "介绍工厂，产品，经营范围和资质许可等常规外贸通用熟悉。",
      "subject": "【询盘】来自[你的公司名]的优质[产品名]供应",
      "emailBody": "尊敬的采购经理，\n\n我们是来自中国的[你的公司名]，一家专业的OEM/ODM工厂...（此处省略详细介绍）"
    },
    {
      "id": "strategy-2",
      "title": "策略2：免费样品策略",
      "description": "以提供免费样品为策略，主要围绕产品的介绍。",
      "subject": "免费样品 | 体验我们的高质量[产品名]",
      "emailBody": "尊敬的[客户公司名]，\n\n您是否正在寻找可靠的[产品名]供应商？我们愿意提供免费样品...（此处省略详细介绍）"
    },
    {
      "id": "strategy-3",
      "title": "策略3：服务与折扣策略",
      "description": "以服务和折扣的吸引策略，适用于贸易商的开发信。",
      "subject": "合作共赢 | [你的公司名]为您提供专属折扣与增值服务",
      "emailBody": "尊敬的合作伙伴，\n\n作为一家领先的贸易商，您一定在寻找能提供稳定利润空间和可靠服务的供应商...（此处省略详细介绍）"
    }
  ]`,
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

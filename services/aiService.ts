import { AnalysisData, StrategyData, DealData, ApiResponse, InfoFormData, PotentialBuyer } from '../types';

const PROMPTS = {
  init: (productName: string, targetCountry: string) => 
    `你是一个外贸B2B全托管系统的后端 AI。请为产品 \"${productName}\" 分析在 \"${targetCountry}\" 市场的潜力。
    请返回纯 JSON 格式, 结构如下: 
    {
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
      "emailBody": "尊敬的采购经理，\\n\\n我们是来自中国的[你的公司名]，一家专业的OEM/ODM工厂...（此处省略详细介绍）"
    },
    {
      "id": "strategy-2",
      "title": "策略2：免费样品策略",
      "description": "以提供免费样品为策略，主要围绕产品的介绍。",
      "subject": "免费样品 | 体验我们的高质量[产品名]",
      "emailBody": "尊敬的[客户公司名]，\\n\\n您是否正在寻找可靠的[产品名]供应商？我们愿意提供免费样品...（此处省略详细介绍）"
    },
    {
      "id": "strategy-3",
      "title": "策略3：服务与折扣策略",
      "description": "以服务和折扣的吸引策略，适用于贸易商的开发信。",
      "subject": "合作共赢 | [你的公司名]为您提供专属折扣与增值服务",
      "emailBody": "尊敬的合作伙伴，\\n\\n作为一家领先的贸易商，您一定在寻找能提供稳定利润空间和可靠服务的供应商...（此处省略详细介绍）"
    }
  ]`,
  quote: `你是一个外贸B2B全托管系统的后端 AI。请根据以下信息生成一份报价单。
    产品: H-Beam
    客户: Turner Inc.

    要求返回纯 JSON 格式, 结构如下:
    {
      "clientName": "Turner Inc.",
      "clientRating": "AAA",
      "productName": "H-Beam",
      "quantity": "500 MT",
      "unitPrice": "$850",
      "totalPrice": "$425,000",
      "shippingCost": "$2,000",
      "term": "DDP (Delivered Duty Paid)"
    }`,
};

// Mock data simulating a database fetch
const mockPotentialBuyers: { total: number; top10: PotentialBuyer[] } = {
  total: 68,
  top10: [
    {
      id: 'buyer-001',
      avatarUrl: 'https://i.pravatar.cc/150?u=buyer001',
      name: 'Global Construction Supplies',
      joinDate: '2022-08-15',
      industry: 'Construction & Building Materials',
      businessModel: 'Wholesale Distributor',
      historicalInquiries: 12,
      intendedProducts: ['H-Beam Steel', 'Rebar', 'Structural Tubing'],
      location: 'Houston, TX, USA',
      website: 'www.globalconstructionsupplies.com'
    },
    {
      id: 'buyer-002',
      avatarUrl: 'https://i.pravatar.cc/150?u=buyer002',
      name: 'Euro Steel Traders B.V.',
      joinDate: '2021-03-20',
      industry: 'Industrial Manufacturing',
      businessModel: 'Importer/Agent',
      historicalInquiries: 8,
      intendedProducts: ['Steel Coils', 'Sheet Metal', 'Pipes'],
      location: 'Rotterdam, Netherlands',
      website: 'www.eurosteeltraders.com'
    },
    {
      id: 'buyer-003',
      avatarUrl: 'https://i.pravatar.cc/150?u=buyer003',
      name: 'Southeast Asia Metal Co.',
      joinDate: '2023-01-10',
      industry: 'Metal Fabrication',
      businessModel: 'Direct Importer',
      historicalInquiries: 5,
      intendedProducts: ['H-Beam Steel', 'Angle Iron'],
      location: 'Singapore',
      website: 'www.seametals.com.sg'
    },
    {
      id: 'buyer-004',
      avatarUrl: 'https://i.pravatar.cc/150?u=buyer004',
      name: 'Canada Infrastructure Inc.',
      joinDate: '2020-11-05',
      industry: 'Infrastructure Development',
      businessModel: 'Project Contractor',
      historicalInquiries: 15,
      intendedProducts: ['Structural Steel', 'Guard Rails'],
      location: 'Toronto, ON, Canada',
      website: 'www.canadainfrastructure.ca'
    },
     {
      id: 'buyer-005',
      avatarUrl: 'https://i.pravatar.cc/150?u=buyer005',
      name: 'AUS Steel Solutions',
      joinDate: '2022-06-21',
      industry: 'Mining & Resources',
      businessModel: 'Equipment Supplier',
      historicalInquiries: 7,
      intendedProducts: ['Heavy-duty Steel Beams', 'Plate Steel'],
      location: 'Perth, WA, Australia',
      website: 'www.aussteelsolutions.com.au'
    },
  ]
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
        jsonData = step === 'init' 
            ? { nicheMarkets: [], topCompetitors: [], b2bStrategies: [], error: "Format Error" }
            : [];
    }

    let nextStep = '';
    let finalData: AnalysisData | StrategyData | DealData | null = jsonData;

    if (step === 'init') {
      nextStep = 'analysis';
      // Combine AI results with mock buyer data
      finalData = {
        ...jsonData,
        potentialBuyers: mockPotentialBuyers,
      };
    }
    if (step === 'start') nextStep = 'strategy';
    if (step === 'quote') nextStep = 'deal';

    return {
      step: nextStep,
      data: finalData
    };

  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

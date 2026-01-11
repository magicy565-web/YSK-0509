import { AnalysisData, InfoFormData, StrategyData, DealData, ApiResponse, PotentialBuyer, Competitor, NicheMarket } from "../types";
import { fetchBuyers } from "./buyerService";

// --- HYBRID REALISM ENGINE: ZOMBIE CODE REMOVED & LOGIC CORRECTED ---

const generateCompetitors = (productName: string): Competitor[] => {
    const baseName = productName.split(' ').pop() || 'Global';
    const nameKeywords = ['Solutions', 'Tech', 'Industries', 'Group', 'Enterprises'];
    const prefixes = ['Apex', 'Pioneer', 'Nova', 'Quantum', 'Vertex'];
    
    return Array.from({ length: 4 }, (_, i) => {
        const name = `${prefixes[i]} ${baseName} ${nameKeywords[i]}`;
        return {
            name: name,
            website: `${name.toLowerCase().replace(/\s+/g, '-')}.com`,
            advantages: [
                i === 0 ? "拥有欧洲分销网络" : "通过 ISO 9001 认证",
                i === 1 ? "专注于高能量密度型号" : "提供定制化解决方案",
            ],
        };
    });
};

// AI-powered buyer recommendation
const recommendBuyers = (productName: string): PotentialBuyer[] => {
    const productKeywords = productName.toLowerCase().split(' ');
    const industries = ['Electronics', 'Automotive', 'Construction', 'Energy', 'Manufacturing'];
    const buyerTypes: ('trader' | 'ecommerce' | 'project_contractor' | 'distributor')[] = ['distributor', 'trader', 'ecommerce', 'project_contractor'];
    
    const recommendations: PotentialBuyer[] = Array.from({ length: 5 }, (_, i) => {
        const industry = industries[i % industries.length];
        const buyerType = buyerTypes[i % buyerTypes.length];
        const companyName = `Global ${productKeywords[0] || 'Solutions'} ${industry} Corp ${i + 1}`;

        return {
            id: `rec-${i + 1}`,
            name: companyName,
            avatarUrl: `https://avatar.vercel.sh/${companyName}.png?text=GSC`,
            website: `${companyName.toLowerCase().replace(/\s+/g, '-')}.com`,
            country: 'USA',
            location: 'New York, USA',
            buyerType: buyerType,
            industry: industry,
            joinDate: '2023',
            monthlyPurchaseAmount: Math.floor(Math.random() * 50000) + 10000,
            sourcingPreference: 'factory',
            purchasingPreference: i % 2 === 0 ? 'quality' : 'price',
            historicalInquiries: Math.floor(Math.random() * 20) + 5,
            intendedProducts: [productName],
        };
    });

    return recommendations;
};


// FINAL LOGIC CORRECTION: Function now accepts the total buyer count for accurate analysis.
const analyzeBuyers = (buyersSample: PotentialBuyer[], totalBuyers: number, productName: string): { nicheMarkets: NicheMarket[], b2bStrategies: string[] } => {
    if (buyersSample.length === 0) return { nicheMarkets: [], b2bStrategies: [] };

    // 1. Market Volume Calculation (Extrapolated from sample to total)
    const sampleMonthlyPurchase = buyersSample.reduce((sum, buyer) => sum + buyer.monthlyPurchaseAmount, 0);
    const avgMonthlyPurchase = sampleMonthlyPurchase / buyersSample.length;
    const totalEstimatedAnnualMarket = Math.round((avgMonthlyPurchase * totalBuyers * 12) / 1_000_000);
    const marketVolumeMsg = totalEstimatedAnnualMarket > 1 ? `~$${totalEstimatedAnnualMarket}M / 年 (估算)` : "新兴潜力市场";

    // 2. Profit Margin Analysis (Based on sample)
    const qualitySeekers = buyersSample.filter(p => p.purchasingPreference === 'quality').length;
    let profitMarginMsg = "中等";
    if (qualitySeekers > buyersSample.length * 0.5) profitMarginMsg = "高 (多数买家重视质量)";

    // 3. Buyer Persona Analysis (Based on sample)
    const typeCounts = buyersSample.reduce((acc, { buyerType }) => ({ ...acc, [buyerType]: (acc[buyerType] || 0) + 1 }), {} as { [key: string]: number });
    const mostCommonBuyerType = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0] || '综合类型';

    // 4. Consolidate Insights with correct numbers
    const nicheMarkets: NicheMarket[] = [
        { name: `基于 ${totalBuyers} 家已匹配买家的年采购额估算`, volume: marketVolumeMsg },
        { name: `基于买家样本的利润空间分析`, volume: profitMarginMsg },
    ];

    const b2bStrategies: string[] = [
        `核心客户画像: 主要为“${mostCommonBuyerType}”，应重点研究其采购模式。`,
        `价值主张: 市场利润空间为“${profitMarginMsg}”，应突出产品质量与附加值。`,
        `渠道策略: ${buyersSample.filter(s => s.sourcingPreference === 'factory').length > buyersSample.length / 2 ? "多数买家偏好与工厂直接合作，可主打'Factory-Direct'模式。" : "买家采购渠道多样，建议结合线上平台和线下代理。"}`
    ];

    return { nicheMarkets, b2bStrategies };
};

const getAnalysis = async (formData: InfoFormData): Promise<AnalysisData> => {
    const { total, top10 } = await fetchBuyers(formData.productName);

    if (total === 0) {
        const recommendedBuyers = recommendBuyers(formData.productName);
        const analysis = analyzeBuyers(recommendedBuyers, recommendedBuyers.length, formData.productName);
        const competitors = generateCompetitors(formData.productName);
        return {
            potentialBuyers: {
                total: recommendedBuyers.length,
                top10: recommendedBuyers,
            },
            nicheMarkets: analysis.nicheMarkets,
            topCompetitors: competitors,
            b2bStrategies: analysis.b2bStrategies,
        };
    }

    // FINAL LOGIC CORRECTION: Pass the 'total' count to the analysis function.
    const realDataAnalysis = analyzeBuyers(top10, total, formData.productName);
    const simulatedCompetitors = generateCompetitors(formData.productName);

    return {
        potentialBuyers: { total, top10 },
        nicheMarkets: realDataAnalysis.nicheMarkets,
        topCompetitors: simulatedCompetitors,
        b2bStrategies: realDataAnalysis.b2bStrategies,
    };
};

const getStrategy = async (formData: InfoFormData, analysisData: AnalysisData): Promise<StrategyData> => {
    const topBuyer = analysisData.potentialBuyers.top10[0];
    if (!topBuyer) return []; // Return empty array if no top buyer

    const productName = formData.productName;
    const buyerName = topBuyer.name;
    const buyerIndustry = topBuyer.industry;

    return [
        {
            id: 'value-prop',
            title: '价值主张策略',
            description: '强调产品的核心优势和给客户带来的直接价值。',
            subject: `合作提案：为您提升${productName}采购效益`,
            emailBody: `尊敬的 ${buyerName} 采购经理，\n\n您好！\n\n了解到贵公司在${buyerIndustry}领域追求高品质标准，我写信向您推荐我们的${productName}。我们的产品专门为...[此处插入产品核心优势，例如：采用最新技术/拥有独家专利/通过XX认证]，能够为贵公司带来...[此处插入给客户带来的价值，例如：显著提高生产效率/降低30%的维护成本/增强终端用户体验]。\n\n我们拥有服务[提及类似知名客户或行业]的经验，深知贵公司的需求。附件是我们的产品手册，期待有机会为您提供一个定制化的样品。\n\n顺祝商祺！\n\n[您的姓名]\n[您的公司]`,
        },
        {
            id: 'relationship-building',
            title: '建立关系策略',
            description: '侧重于建立长期合作关系，而非单次交易。',
            subject: `关于${productName}合作的初步探讨`,
            emailBody: `尊敬的 ${buyerName} 采购经理，\n\n您好！\n\n通过[您了解对方的渠道，例如：行业展会/领英]，我关注贵公司很久了，非常欣赏贵公司在${buyerIndustry}领域的声誉。\n\n我来自[您的公司]，我们专注于为像贵公司这样的行业领导者提供高可靠性的${productName}。我们相信，成功的合作建立在相互信任和共同发展之上。\n\n我们不仅仅是供应商，更希望成为您供应链中值得信赖的合作伙伴，共同应对市场挑战。不知您是否方便在近期进行一个简短的线上交流，让我们互相了解，探讨未来合作的可能性？\n\n期待您的回复！\n\n[您的姓名]\n[您的公司]`,
        },
        {
            id: 'problem-solving',
            title: '解决问题策略',
            description: '从客户的痛点出发，提供针对性的解决方案。',
            subject: `一个关于优化${productName}供应链的建议`,
            emailBody: `尊敬的 ${buyerName} 采购经理，\n\n您好！\n\n在与许多${buyerIndustry}的同行交流时，我们发现他们普遍面临着...[此处插入客户的痛点，例如：供应链不稳定/现有产品故障率高/采购成本居高不下]等挑战。\n\n如果贵公司也存在类似的困扰，我们的${productName}及配套服务或许能为您提供一个有效的解决方案。我们通过...[此处插入您的解决方案，例如：全球仓储网络确保稳定供货/产品经过5轮额外质检/规模化生产实现成本优势]，成功帮助客户...[此处插入成功案例结果]。\n\n我们非常乐意为您提供一份免费的供应链优化分析。如果您感兴趣，请告知我们您方便的时间。\n\n祝好！\n\n[您的姓名]\n[您的公司]`,
        },
    ];
};

const getDeal = async (formData: InfoFormData, analysisData: AnalysisData): Promise<DealData> => {
    const topBuyer = analysisData.potentialBuyers.top10[0];
    if (!topBuyer) throw new Error("无法在没有顶级买家数据的情况下生成交易模拟。");
    const estimatedUnitPrice = Math.max(10, topBuyer.monthlyPurchaseAmount / (topBuyer.historicalInquiries * 8 + 150));
    const trialQuantity = Math.floor(Math.min(topBuyer.monthlyPurchaseAmount / 4, 50000) / estimatedUnitPrice);
    const totalPrice = trialQuantity * estimatedUnitPrice;
    return {
        clientName: topBuyer.name,
        clientRating: topBuyer.purchasingPreference === 'quality' ? "A+" : "A",
        productName: formData.productName,
        quantity: `${trialQuantity.toLocaleString()} 件 (模拟试订单)`,
        unitPrice: `$${estimatedUnitPrice.toFixed(2)}`,
        totalPrice: `$${totalPrice.toLocaleString()}`,
        shippingCost: `$${(totalPrice * 0.06).toLocaleString()}`,
        term: `CIF, ${topBuyer.location.split(', ')[1] || 'Main Port'}`,
    };
};

export const aiService = async (
  step: string,
  formData: InfoFormData,
  analysisData?: AnalysisData,
  strategyData?: StrategyData
): Promise<ApiResponse> => {
  switch (step) {
    case "analysis":
      return { step, data: await getAnalysis(formData) };
    case "strategy":
      if (!analysisData || !formData) throw new Error("分析数据和表单数据是策略步骤所必需的。");
      return { step, data: await getStrategy(formData, analysisData) };
    case "deal":
      if (!analysisData || !formData) throw new Error("表单和分析数据是交易步骤所必需的。");
      return { step, data: await getDeal(formData, analysisData) };
    default:
      throw new Error(`无效的步骤: ${step}`);
  }
};

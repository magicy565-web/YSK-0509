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
        `渠道策略: ${buyersSample.filter(s => s.sourcingPreference === 'factory').length > buyersSample.length / 2 ? "多数买家偏好与工厂直接合作，可主打'Factory-Direct'模式。" : "买家采购渠道多样，建议结合线上平台和线下代理。"}`,
    ];

    return { nicheMarkets, b2bStrategies };
};

const getAnalysis = async (formData: InfoFormData): Promise<AnalysisData> => {
    const { total, top10 } = await fetchBuyers(formData.productName);

    if (total === 0) {
        return {
            potentialBuyers: { total, top10 },
            nicheMarkets: [], topCompetitors: [], b2bStrategies: [],
            error: `数据库中未找到“${formData.productName}”的潜在买家。请尝试其他产品。`
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
    if (!topBuyer) return [];
    return [
        {
            id: 'cold-email',
            title: `生成给 ${topBuyer.name} 的开发信`,
            description: "系统将根据其采购特点，为您生成一封个性化的买家开发信。",
            subject: `关于 ${topBuyer.intendedProducts[0] || formData.productName} 的合作咨询`,
            emailBody: `尊敬的 ${topBuyer.name} 采购经理，...`,
        },
        {
            id: 'linkedin-outreach',
            title: `生成领英 (LinkedIn) 开发信`,
            description: "通过领英，与关键决策人建立更私人的联系。",
            subject: "",
            emailBody: `您好 [请替换为对方职位，如'采购总监'或具体姓名]，...`,
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

import { AnalysisData, InfoFormData, StrategyData, DealData, ApiResponse, PotentialBuyer } from "../types";
import { fetchBuyers } from "./buyerService";

// --- LOCAL TYPE DEFINITIONS ---
interface Competitor {
    name: string;
    website: string;
    advantages: string[];
}

interface NicheMarket {
    name: string;
    volume: string;
}

// --- LLM Communication Layer ---
async function talkToAI(prompt: string, model: string = 'gemini-pro'): Promise<any> {
    const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    if (data.choices && data.choices[0]) {
        try {
            return JSON.parse(data.choices[0].message.content);
        } catch (e) {
            console.error("AI response was not valid JSON:", data.choices[0].message.content);
            throw new Error("AI returned invalid data format.");
        }
    }
    throw new Error("Invalid AI response from proxy");
}

// --- Business Logic Path: AI-Powered Analysis ---
// This path is now the only one used for analysis.

const getAiAnalysis = async (formData: InfoFormData): Promise<AnalysisData> => {
    const { productName, targetCountry } = formData;

    const potentialBuyerSchema = {
        id: "<string>",
        name: "<string>",
        avatarUrl: "<string>",
        website: "<string>",
        country: "<string>",
        location: "<string>",
        buyerType: "<'trader' | 'ecommerce' | 'project_contractor' | 'distributor'>",
        industry: "<string>",
        joinDate: "<string> (YYYY-MM-DD)",
        monthlyPurchaseAmount: "<number>",
        sourcingPreference: "<'factory' | 'trader'>",
        purchasingPreference: "<'price' | 'quality' | 'stability'>",
        historicalInquiries: "<number>",
        intendedProducts: "<string[]>",
    };

    const prompt = `
        You are a world-class B2B market analyst. Analyze the market for "${productName}" in "${targetCountry}".
        Provide the output in a single valid JSON object.

        **JSON Schema:**
        {
          "potentialBuyers": {
             "total": <number>,
             "top10": <PotentialBuyer[]>
          },
          "nicheMarkets": <{ name: string, volume: string }[]>,
          "topCompetitors": <{ name: string, website: string, advantages: string[] }[]>,
          "b2bStrategies": <string[]>
        }

        **PotentialBuyer Schema:**
        ${JSON.stringify(potentialBuyerSchema, null, 2)}

        **Instructions:**
        1. **potentialBuyers**: Generate 10 fictional but realistic buyer profiles based on the schema. Estimate the total number of buyers in the market.
        2. **nicheMarkets**: Generate 2-3 specific niche market suggestions.
        3. **topCompetitors**: Generate 3 fictional but realistic competitors.
        4. **b2bStrategies**: Generate 3 actionable B2B strategy recommendations.
        
        **Return ONLY the raw JSON object.**
    `;
    try {
        return await talkToAI(prompt, 'gemini-pro');
    } catch (error) {
        console.error("AI analysis failed:", error);
        throw new Error("AI分析服务暂时不可用，请稍后重试。");
    }
};

// --- Main Service Logic ---

// NOTE: The getAnalysis function has been simplified to ONLY use the AI path
// to test the hypothesis that the hybrid logic was causing the issue.
const getAnalysis = async (formData: InfoFormData): Promise<AnalysisData> => {
    return getAiAnalysis(formData);
};

const getStrategy = async (formData: InfoFormData, analysisData: AnalysisData): Promise<StrategyData> => {
    const topBuyer = analysisData.potentialBuyers?.top10?.[0];
    if (!topBuyer) return [];

    const marketInsights = JSON.stringify({
        niches: analysisData.nicheMarkets,
        competitors: analysisData.topCompetitors.map(c => c.name),
        strategies: analysisData.b2bStrategies,
    });

    const prompt = `
        You are a B2B sales expert. Write 3 distinct cold email outreach strategies for "${formData.productName}".
        Target Customer: ${JSON.stringify(topBuyer)}
        Market Insights: ${marketInsights}
        Output a valid JSON array of 3 objects, each with { id, title, description, subject, emailBody }.
        The emailBody must be in Chinese and include placeholders "[您的姓名]" and "[您的公司]".
        Return ONLY the raw JSON array.
    `;

    try {
        return await talkToAI(prompt, 'gemini-pro');
    } catch (error) {
        console.error("AI strategy generation failed:", error);
        throw new Error("AI策略服务暂时不可用，请稍后重试。");
    }
};

const getDeal = async (formData: InfoFormData): Promise<DealData> => {
    // This logic remains unchanged.
    return {
        clientInfo: { companyName: '', contactPerson: '', email: '', phone: '' },
        quotation: [{
            id: Date.now(),
            productName: formData.productName,
            model: '', unit: 'pcs', exwPrice: '', moq: ''
        }],
    };
};

export const aiService = async (
  step: string,
  formData: InfoFormData,
  analysisData?: AnalysisData,
): Promise<ApiResponse> => {
  switch (step) {
    case "analysis":
      return { step, data: await getAnalysis(formData) };
    case "strategy":
      if (!analysisData || !formData) throw new Error("Analysis data and form data are required for the strategy step.");
      return { step, data: await getStrategy(formData, analysisData) };
    case "deal":
      if (!formData) throw new Error("Form data is required for the deal step.");
      return { step, data: await getDeal(formData) };
    default:
      throw new Error(`Invalid step: ${step}`);
  }
};

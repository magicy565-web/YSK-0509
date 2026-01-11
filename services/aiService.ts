import { AnalysisData, InfoFormData, StrategyData, DealData, ApiResponse, PotentialBuyer } from "../types";

// --- LLM Communication Layer ---
// The model is now configurable via environment variables
const AI_MODEL = import.meta.env.VITE_AI_MODEL_NAME;

async function talkToAI(prompt: string): Promise<any> {
    // We read the model from the environment variable.
    // If it's not set, we throw a clear error to the developer.
    if (!AI_MODEL) {
        throw new Error("Configuration error: VITE_AI_MODEL_NAME is not set. Please create a .env.local file and add VITE_AI_MODEL_NAME=your_model_name.");
    }

    const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: AI_MODEL }), // Pass the configured model
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    if (data.choices && data.choices[0]) {
        try {
            // The AI's response is a JSON string in the content field
            return JSON.parse(data.choices[0].message.content);
        } catch (e) {
            console.error("AI response was not valid JSON:", data.choices[0].message.content);
            throw new Error("AI returned invalid data format.");
        }
    }
    throw new Error("Invalid AI response from proxy");
}


// --- Business Logic Path: AI-Powered Analysis ---

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
             "total": "<number>",
             "top10": "<PotentialBuyer[]>"
          },
          "nicheMarkets": "<{ name: string, volume: string }[]>",
          "topCompetitors": "<{ name: string, website: string, advantages: string[] }[]>",
          "b2bStrategies": "<string[]>"
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
        return await talkToAI(prompt);
    } catch (error) {
        console.error("AI analysis failed:", error);
        // Re-throw a more user-friendly error
        throw new Error("AI分析服务暂时不可用，请检查模型配置或稍后重试。");
    }
};

// --- Main Service Logic ---

const getAnalysis = async (formData: InfoFormData): Promise<AnalysisData> => {
    // Simplified to always use the AI path
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
        return await talkToAI(prompt);
    } catch (error) {
        console.error("AI strategy generation failed:", error);
        throw new Error("AI策略服务暂时不可用，请检查模型配置或稍后重试。");
    }
};

const getDeal = async (formData: InfoFormData): Promise<DealData> => {
    // This logic remains local and does not call the AI.
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

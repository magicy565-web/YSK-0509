import { InfoFormData, AnalysisData, DealData } from "../types";

// --- 1. 定义高价值 Prompt ---
const generateAnalysisPrompt = (formData: InfoFormData) => `
You are an expert Global Sourcing Specialist.
User context: A Chinese factory selling "${formData.productName}".
Key Features: "${formData.productDetails}".
Target Market: "${formData.targetMarket}".

Task: Analyze the real supply chain for this specific product in the target market and generate a structured JSON report of potential buyers.

CRITICAL REQUIREMENTS FOR "top10" BUYERS:
1. **Names**: Do NOT use random names like "Acme Corp". Use descriptive aliases that sound like REAL opportunities.
   - Example for Auto Parts: "Major Aftermarket Distributor (AutoZ*ne Competitor)"
   - Example for Textiles: "High-End Fashion Retailer (NY Based)"
2. **Relevance**: The buyers must be logically correct for "${formData.productName}".
3. **Locations**: Use real commercial hub cities in ${formData.targetMarket}.

OUTPUT JSON FORMAT (No markdown, just raw JSON):
{
  "potentialBuyers": {
    "total": number, // Estimate total potential buyers (e.g. 240, 1500)
    "top10": [
      {
        "id": number,
        "name": string, 
        "location": string,
        "country": "${formData.targetMarket}",
        "industry": string,
        "buyerType": string
      }
    ]
  }
}
`;

// --- 2. API 调用工具 ---
const callGenAI = async (prompt: string, onChunk?: (text: string) => void): Promise<any> => {
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // MODIFIED: Switched to a standard OpenAI-compatible model name.
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`API Request Failed: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

// --- 3. 业务逻辑导出 ---
export const aiService = {
  getAnalysis: async (
    formData: InfoFormData,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ) => {
    try {
      console.log(`[AI Analysis] Starting for: ${formData.productName} -> ${formData.targetMarket}`);
      
      const prompt = generateAnalysisPrompt(formData);
      
      const result = await callGenAI(prompt);
      
      onChunk(JSON.stringify(result));
      onComplete();
      
    } catch (error: any) {
      console.error("Analysis Failed:", error);
      
      const fallbackData: AnalysisData = {
        potentialBuyers: {
          total: 850,
          top10: [
            { id: 1, name: `Leading ${formData.targetMarket} Distributor`, location: "Commercial Hub", country: formData.targetMarket, industry: "General Trading", buyerType: "Wholesaler" },
            { id: 2, name: "Specialized Chain Store", location: "Capital City", country: formData.targetMarket, industry: "Retail", buyerType: "Retailer" },
            { id: 3, name: "Large Scale Importer", location: "Port City", country: formData.targetMarket, industry: "Import/Export", buyerType: "Importer" }
          ]
        }
      };
      onChunk(JSON.stringify(fallbackData));
      onComplete();
    }
  },

  getStrategy: async (
    onComplete: () => void,
    onError: (error: Error) => void
  ) => {
    setTimeout(onComplete, 1500);
  },

  submitApplication: async (dealData: DealData): Promise<{ success: boolean }> => {
    console.log("--- 收到新的工厂资质申请 ---");
    console.log("Company:", dealData.companyName);
    console.log("Contact:", dealData.contactPerson);
    
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1500);
    });
  }
};
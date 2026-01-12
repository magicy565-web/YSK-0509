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

// --- 2. API 调用工具 (CORRECTED MODEL BASED ON USER'S ACCOUNT) ---
const callGenAI = async (prompt: string): Promise<any> => {
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // FINAL FIX: Using the exact model name confirmed from the user's NOVA AI account settings.
      model: "[vertex]gemini-3-pro-preview",
      messages: [{ role: "user", content: prompt }],
      stream: false
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json();
    throw new Error(`[Proxy Error] API request failed with status ${response.status}: ${JSON.stringify(errorPayload)}`);
  }

  const data = await response.json();
  
  if (data.error) {
      throw new Error(`[API Provider Error] ${data.error.message || JSON.stringify(data.error)}`);
  }
  
  let content = data.choices?.[0]?.message?.content || "";
  
  content = content.replace(/```json/g, '').replace(/```/g, '').trim();
  
  if (!content) {
      throw new Error("Received empty content from AI API.");
  }
  
  return JSON.parse(content);
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
      console.error("======================================================");
      console.error("🔴 AI ANALYSIS FAILED - DISPLAYING FALLBACK DATA 🔴");
      console.error("======================================================");
      console.error("DETAILED ERROR REPORT:");
      console.error(error);
      console.error("------------------------------------------------------");
      console.error("If this still fails, please double-check the model name in your NOVA AI dashboard and ensure your account has a positive balance.");
      console.error("======================================================");
      
      onError(error);
      
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
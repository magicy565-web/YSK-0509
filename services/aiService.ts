
import { InfoFormData, AnalysisData, DealData } from "./types";

const streamResponse = async (text: string, onChunk: (chunk: string) => void) => {
  // Simulate a streaming response by breaking the text into chunks.
  const chunks = text.match(/.{1,100}/g) || [];
  for (let i = 0; i < chunks.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
    onChunk(chunks[i]);
  }
};

// Dummy data for AI responses
const dummyAnalysis: AnalysisData = {
    potentialBuyers: {
      total: 1240,
      top10: [
        { id: 1, name: "Global Imports Corp", location: "Los Angeles", country: "USA", industry: "Electronics", buyerType: "Distributor" },
        { id: 2, name: "EuroTrade Solutions", location: "Hamburg", country: "Germany", industry: "Automotive", buyerType: "Wholesaler" },
        { id: 3, name: "Rising Sun Trading", location: "Tokyo", country: "Japan", industry: "Consumer Goods", buyerType: "Retailer" },
        { id: 4, name: "Oceanic Distribution", location: "Sydney", country: "Australia", industry: "Building Materials", buyerType: "Importer" },
        { id: 5, name: "Maple Leaf Merchants", location: "Toronto", country: "Canada", industry: "Medical Supplies", buyerType: "Distributor" },
        { id: 6, name: "Union Jack Exporters", location: "London", country: "UK", industry: "Fashion", buyerType: "Wholesaler" },
        { id: 7, name: "Sahara Gateway", location: "Dubai", country: "UAE", industry: "Luxury Goods", buyerType: "Importer" },
        { id: 8, name: "Singapore Sourcing", location: "Singapore", country: "Singapore", industry: "Electronics", buyerType: "Distributor" },
        { id: 9, name: "Nordic Ventures", location: "Stockholm", country: "Sweden", industry: "Home & Garden", buyerType: "Retailer" },
        { id: 10, name: "Latin America Logistica", location: "São Paulo", country: "Brazil", industry: "Agriculture", buyerType: "Distributor" },
      ],
    },
};


export const aiService = {
  getAnalysis: async (
    formData: InfoFormData,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ) => {
    try {
      console.log("--- Simulating AI Market Analysis ---");
      console.log("Input: ", formData);
      const responseText = JSON.stringify(dummyAnalysis, null, 2);
      await streamResponse(responseText, onChunk);
      onComplete();
    } catch (error) {
      console.error("Analysis simulation failed:", error);
      onError(new Error("Failed to get AI analysis."));
    }
  },

  getStrategy: async (
    onComplete: () => void,
    onError: (error: Error) => void
  ) => {
    try {
      console.log("--- Simulating Strategy Generation (No AI call) ---");
      // No data is actually generated; the frontend shows a static SOP.
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
    } catch (error) {
      console.error("Strategy simulation failed:", error);
      onError(new Error("Failed to get AI strategy."));
    }
  },

  // BUG FIX 3: Removed misleading comment. This function is actively used.
  submitApplication: async (dealData: DealData): Promise<{ success: boolean }> => {
    console.log("--- Simulating Submission of Application ---");
    console.log("Submitting Data: ", dealData);
    
    // Simulate a network request that might fail.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          console.log("Submission successful.");
          resolve({ success: true });
        } else {
          console.error("Submission failed.");
          reject(new Error("A network error occurred during submission."));
        }
      }, 1500);
    });
  }
};
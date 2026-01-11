import { AnalysisData, InfoFormData, StrategyData, DealData, ApiResponse } from "../types";
import { fetchBuyers } from "./buyerService";

// A mapping of product keywords to their corresponding industries.
const productToIndustryMap: { [key: string]: string } = {
  'steel': 'Construction',
  'rebar': 'Construction',
  'cement': 'Construction',
  'gloves': 'Healthcare',
  'mask': 'Healthcare',
  'tires': 'Automotive',
  'fertilizer': 'Agriculture',
  'chips': 'Technology',
  'fabric': 'Textiles',
  'coffee': 'Food & Beverage',
  'solar': 'Energy',
  'bearings': 'Manufacturing',
  'pos': 'Retail',
};

/**
 * Finds the most likely industry for a given product name.
 * @param productName The name of the product.
 * @returns The matched industry or a default value.
 */
const getIndustryFromProduct = (productName: string): string => {
  const lowerCaseProduct = productName.toLowerCase();
  for (const keyword in productToIndustryMap) {
    if (lowerCaseProduct.includes(keyword)) {
      return productToIndustryMap[keyword];
    }
  }
  return 'General'; // Default industry if no keyword matches
};

/**
 * Simulates an AI analyzing the user's input to generate a market analysis.
 * This function now fetches real, filtered data from the buyer service.
 * 
 * @param formData - The user's input from the information form.
 * @returns A promise that resolves to the analysis data.
 */
const getAnalysis = async (formData: InfoFormData): Promise<AnalysisData> => {
  console.log(`AI Service: Analyzing for product: ${formData.productName}`);

  // Fetch buyers based on the user-provided product name.
  const potentialBuyers = await fetchBuyers(formData.productName);

  // If no buyers are found, return a specific message.
  if (potentialBuyers.total === 0) {
    return {
      potentialBuyers,
      nicheMarkets: [],
      topCompetitors: [],
      b2bStrategies: [],
      error: `No potential buyers found for "${formData.productName}". Try a different product, like "Steel" or "Gloves".`
    };
  }

  // Dynamically generate other analysis sections based on the fetched data.
  const industry = getIndustryFromProduct(formData.productName);

  return {
    potentialBuyers,
    nicheMarkets: [
      { name: `High-demand for ${formData.productName} in the ${industry} sector`, volume: "High" },
      { name: `B2B E-commerce for ${industry} parts`, volume: "Medium" },
    ],
    topCompetitors: [
      { name: "Global Sourcing Inc.", website: "globalsourcing.com", advantages: ["Strong logistics network", "Competitive pricing"] },
      { name: "SupplyChain Masters", website: "supplychainmasters.com", advantages: ["AI-powered matching", "Excellent customer service"] },
    ],
    b2bStrategies: [
      `Target large distributors in the ${formData.targetCountry} ${industry} market.`,
      "Develop a strong online presence with a focus on SEO for product keywords.",
      "Attend major industry trade shows to network with potential buyers.",
    ],
  };
};


/**
 * Simulates an AI generating personalized outreach strategies.
 * @param analysisData - The market analysis data.
 * @returns A promise that resolves to the strategy data.
 */
const getStrategy = async (analysisData: AnalysisData): Promise<StrategyData> => {
  // This function can be expanded to generate more dynamic strategies.
  const topBuyer = analysisData.potentialBuyers.top10[0];
  if (!topBuyer) return [];

  return [
    {
      id: 'cold-email',
      title: `Cold Email Outreach to ${topBuyer.name}`,
      description: "Craft a compelling cold email to introduce your products and company.",
      subject: `Inquiry regarding ${topBuyer.intendedProducts[0]} for ${topBuyer.name}`,
      emailBody: `Dear Purchasing Manager at ${topBuyer.name},...`,
    },
    {
      id: 'linkedin-outreach',
      title: `LinkedIn Connection Request to Key Personnel at ${topBuyer.name}`,
      description: "Connect with key decision-makers on LinkedIn to build a professional relationship.",
      subject: "", // Not applicable for LinkedIn
      emailBody: `Hi, I came across ${topBuyer.name} and was impressed by your work in the ${topBuyer.industry} industry. I'd like to connect...`,
    },
  ];
};

/**
 * Simulates the final step of closing a deal.
 * @param _strategyData - The chosen strategy.
 * @returns A promise that resolves to the deal data.
 */
const getDeal = async (_strategyData: StrategyData): Promise<DealData> => {
  // This function can be expanded to be more dynamic.
  return {
    clientName: "Global Construction Supplies",
    clientRating: "A+",
    productName: "H-Beam Steel",
    quantity: "1000 tons",
    unitPrice: "$800/ton",
    totalPrice: "$800,000",
    shippingCost: "$50,000",
    term: "CIF, Port of Houston",
  };
};

/**
 * Main AI service function to handle requests based on the current app state.
 * @param step - The current step in the application flow.
 * @param formData - The data from the information form.
 * @param analysisData - The data from the analysis step.
 * @param strategyData - The data from the strategy step.
 * @returns A promise that resolves to the API response for the current step.
 */
export const aiService = async (
  step: string,
  formData: InfoFormData,
  analysisData?: AnalysisData,
  strategyData?: StrategyData
): Promise<ApiResponse> => {
  switch (step) {
    case "analysis":
      const analysisResult = await getAnalysis(formData);
      return { step, data: analysisResult };
    case "strategy":
      if (!analysisData) throw new Error("Analysis data is required for the strategy step.");
      const strategyResult = await getStrategy(analysisData);
      return { step, data: strategyResult };
    case "deal":
      if (!strategyData) throw new Error("Strategy data is required for the deal step.");
      const dealResult = await getDeal(strategyData);
      return { step, data: dealResult };
    default:
      throw new Error(`Invalid step: ${step}`);
  }
};

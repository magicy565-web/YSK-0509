import { AnalysisData, StrategyData, DealData, ApiResponse } from '../types';

/**
 * Simulates a backend POST request.
 * In a real Next.js app, this would be `app/api/action/route.ts`.
 */
export const performAction = async (step: 'init' | 'start' | 'quote' | 'sign'): Promise<ApiResponse> => {
  // Simulate network latency (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  switch (step) {
    case 'init':
      return {
        step: 'analysis',
        data: {
          leads: 215,
          profit: "$152,400",
          market: "North America (Construction & Infra)",
          topKeywords: ["Structural Steel", "Heavy Duty", "ASTM A36"]
        } as AnalysisData
      };

    case 'start':
      return {
        step: 'strategy',
        data: {
          tactic: "Competitor Price Undercutting (Low-Margin Penetration)",
          channels: ["LinkedIn Direct", "Cold Email", "WhatsApp Business"],
          subject: "Project Supply: Structural Steel Beams @ $850/ton (Valid 48h)",
          emailBody: `Dear Purchase Manager,\n\nI noticed Turner Construction is currently bidding on the 'Midtown Expansion' project. \n\nWe can supply ASTM A36 Steel Beams at $850/ton (DDP New York) - approximately 15% below the current market average, with a 3-week lead time guaranteed.\n\nAttached is our ISO 9001 certification and a sample mill test report.\n\nBest regards,\n[Your Name]`
        } as StrategyData
      };

    case 'quote':
      return {
        step: 'deal',
        data: {
          clientName: "Turner Construction Co.",
          clientRating: "AAA (Dun & Bradstreet)",
          productName: "H-Beam 200x200 (ASTM A36)",
          quantity: "500 Tons",
          unitPrice: "$850.00",
          shippingCost: "$2,100 (Ocean Freight + Insurance)",
          term: "DDP (Delivered Duty Paid)",
          totalPrice: "$427,100.00"
        } as DealData
      };
      
    case 'sign':
        return {
            step: 'success',
            data: null
        };

    default:
      throw new Error("Invalid step");
  }
};

import { AnalysisResult, ApplicationPayload, Buyer } from '../types';

const mockBuyer = (id: number, country: string, countryCode: string): Buyer => ({
  id,
  name: `Buyer #${id}`,
  country,
  countryCode,
  product: `Product ${id}`,
  revenue: Math.floor(Math.random() * 1000000),
  interest: Math.floor(Math.random() * 100),
});

const getYearNumber = (yearString: string): number => {
    if (!yearString) return 0;
    if (yearString.includes('>')) {
        return parseInt(yearString.replace(/[^0-9]/g, ''), 10);
    }
    const yearMatch = yearString.match(/^[0-9]+/);
    return yearMatch ? parseInt(yearMatch[0], 10) : 0;
};

const aiService = {
  getAnalysis: async (productName: string): Promise<AnalysisResult> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockBuyers: Buyer[] = [
      mockBuyer(1, "United States", "US"),
      mockBuyer(2, "Germany", "DE"),
      mockBuyer(3, "Japan", "JP"),
      mockBuyer(4, "Brazil", "BR"),
      mockBuyer(5, "Australia", "AU"),
      mockBuyer(6, "Canada", "CA"),
      mockBuyer(7, "France", "FR"),
      mockBuyer(8, "India", "IN"),
    ];

    return {
      buyers: mockBuyers,
      summary: `Based on your product, ${productName}, we have identified 8 potential buyers in 8 countries. The strongest interest is from North America and Europe.`,
    };
  },

  submitApplication: async (payload: ApplicationPayload): Promise<{ success: boolean }> => {
    console.log("--- 正在向 HubSpot 提交最终申请 ---");

    const apiBody = {
      companyName: payload.companyName,
      keywords: payload.productName,
      contactPerson: payload.contactPerson,
      phone: payload.contactPhone,
      advantages: payload.productDetails,
      establishedYear: getYearNumber(payload.establishedYear),
      annualRevenue: payload.annualRevenue,
    };

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '提交失败');
      }

      await response.json();
      return { success: true };

    } catch (error) {
      console.error("HubSpot Submit Error:", error);
      throw error;
    }
  }
};

export default aiService;

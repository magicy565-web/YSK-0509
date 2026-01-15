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

const aiService = {
  getAnalysis: async (productName: string): Promise<AnalysisResult> => {
    // In a real application, you would make an API call here
    // and the AI would generate the analysis based on the product name.
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

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

    // 1. 数据映射 (把前端变量名 转换成 后端API需要的名字)
    const apiBody = {
      companyName: payload.companyName,
      keywords: payload.productName,       // 前端叫 productName -> 后端叫 keywords
      contactPerson: payload.contactPerson,
      phone: payload.contactPhone,         // 前端叫 contactPhone -> 后端叫 phone
      advantages: payload.productDetails,  // 前端叫 productDetails -> 后端叫 advantages
      
      // 你还可以把第四步收集的资质数据也加进去 (如果后端支持)
      establishedYear: payload.establishedYear, 
      annualRevenue: payload.annualRevenue
    };

    // 2. 发送真实请求
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

      const data = await response.json();
      return { success: true };

    } catch (error) {
      console.error("HubSpot C:", error);
      throw error;
    }
  }
};

export default aiService;

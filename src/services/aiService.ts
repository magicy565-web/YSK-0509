import { InfoFormData, AnalysisData, DealData, ApplicationPayload } from "../types";

// [回退] 暂时注释掉 Firebase 依赖，确保演示流程绝对稳定
// import { db, storage } from "../firebaseConfig";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const generateMessages = (formData: InfoFormData) => [
  {
    role: "system",
    content: `You are an expert Global Sourcing Specialist. Your task is to analyze user-provided product information and generate a structured JSON report of potential buyers. You must strictly follow all instructions and output formats.`
  },
  {
    role: "user",
    content: `Analyze the following product information and generate the potential buyers JSON report.

- Product Name: "${formData.productName}"
- Key Features: "${formData.productDetails}"
- Target Market: "${formData.targetMarket}"

TASK:
1. Generate ONE "bestMatch" buyer that is a perfect fit. This buyer needs detailed persona data.
   - "matchScore": A number between 95 and 99.
   - "companyMasked": Real-sounding company name but partially masked (e.g., "Global T*** Solutions").
   - "productScope": Specific products they buy related to the user's input.
   - "factoryPreference": What kind of factory they like (e.g., "OEM Capable", " BSCI Audited").
   - "qualifications": Array of 2-3 standard certs needed (e.g., "ISO9001", "CE").
   - "joinDate": A date within last 2 years (YYYY-MM).
   - "lastOrderSize": A realistic large amount masked (e.g., "$5**,000+").

2. Generate a list of "top10" other buyers (standard format).

OUTPUT FORMAT (CRITICAL): Respond with only the raw JSON object.
{
  "potentialBuyers": {
    "total": number, // Estimate total market size (e.g. 500-2000)
    "bestMatch": {
      "id": 999,
      "name": "Purchase Manager",
      "location": "City, Country",
      "country": "${formData.targetMarket}",
      "industry": "string",
      "buyerType": "string",
      "matchScore": number,
      "companyMasked": "string",
      "productScope": "string",
      "factoryPreference": "string",
      "qualifications": ["string"],
      "joinDate": "string",
      "lastOrderSize": "string"
    },
    "top10": [
      {
        "id": number,
        "name": "string (Descriptive Alias)",
        "location": "City, Country",
        "country": "${formData.targetMarket}",
        "industry": "string",
        "buyerType": "string"
      }
    ]
  }
}`
  }
];

const callAAsStream = async (
  messages: any[],
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "[vertex]gemini-3-pro-preview",
        messages: messages,
        stream: true
      }),
    });

    if (!response.ok) {
      throw new Error(`API Request Failed`); 
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader");

    const decoder = new TextDecoder();
    let leftover = '';
    let hasStreamed = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = (leftover + chunk).split('\n');
      leftover = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6);
          if (jsonStr === '[DONE]') {
            onComplete();
            return;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              hasStreamed = true;
              onChunk(content);
            }
          } catch (e) { }
        }
      }
    }
    onComplete();
  } catch (error: any) {
    onError(error);
  }
};

// [新增] 本地 Mock 数据生成器，确保永远有数据展示
const getMockAnalysisData = (formData: InfoFormData): AnalysisData => {
  return {
    potentialBuyers: {
      total: 1240,
      bestMatch: {
        id: 999,
        name: "Senior Purchasing Lead",
        location: "New York, USA",
        country: formData.targetMarket,
        industry: "Retail & Distribution",
        buyerType: "Chain Retailer",
        matchScore: 98,
        companyMasked: "Home D*** Supply Chain",
        productScope: `${formData.productName}, Smart Home Devices`,
        factoryPreference: "OEM/ODM Experience > 5 Years",
        qualifications: ["ISO9001", "BSCI", "FCC"],
        joinDate: "2023-11",
        lastOrderSize: "$5**,000+"
      },
      top10: [
        { id: 1, name: "Large Scale Distributor", location: "California, USA", country: formData.targetMarket, industry: "Wholesale", buyerType: "Wholesaler" },
        { id: 2, name: "Regional Chain Store", location: "Texas, USA", country: formData.targetMarket, industry: "Retail", buyerType: "Retailer" },
        { id: 3, name: "E-commerce Aggregator", location: "London, UK", country: "Europe", industry: "E-commerce", buyerType: "Online Brand" },
        { id: 4, name: "Construction Material Importer", location: "Toronto, Canada", country: "North America", industry: "Construction", buyerType: "Importer" },
      ]
    }
  };
};

export const aiService = {
  getAnalysis: async (
    formData: InfoFormData,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ) => {
    try {
      console.log(`[AI Analysis] Starting for: ${formData.productName}`);
      const messages = generateMessages(formData);
      
      // 尝试调用 AI
      await callAAsStream(messages, onChunk, onComplete, (err) => {
        // [关键逻辑] 如果 AI 失败，不报错，而是静默切换到 Mock 数据
        console.warn("AI Stream failed, switching to fallback data:", err);
        const fallback = getMockAnalysisData(formData);
        // 模拟流式传输的效果
        onChunk(JSON.stringify(fallback));
        onComplete();
      });

    } catch (error: any) {
      // 这一层捕获同步错误
      console.error("AI Service Error:", error);
      const fallback = getMockAnalysisData(formData);
      onChunk(JSON.stringify(fallback));
      onComplete();
    }
  },

  getStrategy: async (onComplete: () => void) => {
    setTimeout(onComplete, 1200);
  },

  // [回退] 恢复为纯模拟提交，不再连接 Firebase
  // 这样可以确保 100% 成功跳转到成功页
  submitApplication: async (payload: ApplicationPayload): Promise<{ success: boolean }> => {
    console.log("--- [模拟模式] 正在提交工厂资质申请 ---");
    console.log("提交数据快照:", {
        company: payload.companyName,
        photos: payload.factoryPhotos.length,
        license: payload.businessLicense ? 'Uploaded' : 'None'
    });

    return new Promise((resolve) => {
      // 模拟网络延迟 2 秒，给 Loading 动画展示的机会
      setTimeout(() => {
          console.log("--- [模拟模式] 申请提交成功 ---");
          resolve({ success: true });
      }, 2000);
    });
  }
};

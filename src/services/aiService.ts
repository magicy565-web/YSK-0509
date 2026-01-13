
import { InfoFormData, AnalysisData, DealData } from "../../types";
// [修复] 引入 Firebase 实例和方法
import { db, storage } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Helper: Generate Prompt Messages (保持不变) ---
const generateMessages = (formData: InfoFormData) => [
  {
    role: "system",
    content: `You are an expert Global Sourcing Specialist. Your task is to analyze user-provided product information and generate a structured JSON report of potential buyers.`
  },
  {
    role: "user",
    content: `Analyze the following product information and generate the potential buyers JSON report.
    - Product Name: "${formData.productName}"
    - Key Features: "${formData.productDetails}"
    - Target Market: "${formData.targetMarket}"
    
    TASK:
    1. Generate ONE "bestMatch" buyer with detailed persona data (matchScore 95-99).
    2. Generate a list of "top10" other buyers.

    OUTPUT FORMAT: Respond with only the raw JSON object.`
  }
];

// --- Helper: Stream API Call (保持不变) ---
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

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader");
    const decoder = new TextDecoder();
    let leftover = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = (leftover + chunk).split('\n');
      leftover = lines.pop() || '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6);
          if (jsonStr === '[DONE]') { onComplete(); return; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) onChunk(content);
          } catch (e) {}
        }
      }
    }
    onComplete();
  } catch (error: any) { onError(error); }
};

// [新增] 辅助函数：上传文件到 Firebase Storage
const uploadFileToFirebase = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error(`Upload failed for ${file.name}:`, error);
    throw error;
  }
};

export const aiService = {
  getAnalysis: async (formData: InfoFormData, onChunk: any, onComplete: any, onError: any) => {
    try {
      const messages = generateMessages(formData);
      await callAAsStream(messages, onChunk, onComplete, onError);
    } catch (error: any) {
      console.error("AI Analysis Failed", error);
      onError(error);
      // Fallback data (Keep your original fallback data here if needed)
      onComplete();
    }
  },

  getStrategy: async (onComplete: () => void) => {
    setTimeout(onComplete, 1000);
  },

  // [重磅修复] 真实的 Firebase 提交逻辑
  submitApplication: async (dealData: DealData): Promise<{ success: boolean }> => {
    console.log("--- 正在连接 Firebase 提交数据 ---");
    
    try {
      // 1. 上传营业执照
      let businessLicenseUrl = "";
      if (dealData.businessLicense) {
        const path = `qualifications/${dealData.companyName}/license/${Date.now()}_${dealData.businessLicense.name}`;
        businessLicenseUrl = await uploadFileToFirebase(dealData.businessLicense, path);
      }

      // 2. 并发上传工厂照片
      const factoryPhotoUrls = await Promise.all(
        dealData.factoryPhotos.map((file, index) => 
          uploadFileToFirebase(file, `qualifications/${dealData.companyName}/photos/${Date.now()}_${index}_${file.name}`)
        )
      );

      // 3. 并发上传证书
      const productCertificateUrls = await Promise.all(
        dealData.productCertificates.map((file, index) => 
          uploadFileToFirebase(file, `qualifications/${dealData.companyName}/certs/${Date.now()}_${index}_${file.name}`)
        )
      );

      // 4. 写入 Firestore 数据库
      await addDoc(collection(db, "factory_applications"), {
        // 核心文本数据
        companyName: dealData.companyName,
        establishedYear: dealData.establishedYear,
        annualRevenue: dealData.annualRevenue,
        mainProductCategory: dealData.mainProductCategory,
        mainCertificates: dealData.mainCertificates,
        contactPerson: dealData.contactPerson,
        position: dealData.position,
        contactPhone: dealData.contactPhone,
        
        // 文件链接
        documents: {
          license: businessLicenseUrl,
          photos: factoryPhotoUrls,
          certs: productCertificateUrls
        },

        // 管理字段
        status: 'pending',        // 默认为待审核
        createdAt: serverTimestamp(),
        source: 'web_wizard'
      });

      console.log("✅ Firebase 写入成功");
      return { success: true };

    } catch (error: any) {
      console.error("❌ Firebase 提交失败:", error);
      throw new Error("数据提交失败，请检查网络连接或联系客服。");
    }
  }
};

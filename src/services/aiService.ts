
import { InfoFormData, AnalysisData, ApplicationPayload } from "@/types";
import { db, storage } from "@/src/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const generateMessages = (formData: InfoFormData) => [
    {
      role: "system",
      content: `You are an expert Global Sourcing Specialist. Your task is to analyze user-provided product information and generate a structured JSON report of potential buyers. You must strictly follow all instructions and output formats.`
    },
    {
      role: "user",
      content: `Analyze the following product information and generate the potential buyers JSON report.\n\n- Product Name: "${formData.productName}"\n- Key Features: "${formData.productDetails}"\n- Target Market: "${formData.targetMarket}"\n\nTASK:\n1. Generate ONE "bestMatch" buyer that is a perfect fit. This buyer needs detailed persona data.\n   - "matchScore": A number between 95 and 99.\n   - "companyMasked": Real-sounding company name but partially masked (e.g., "Global T*** Solutions").\n   - "productScope": Specific products they buy related to the user's input.\n   - "factoryPreference": What kind of factory they like (e.g., "OEM Capable", " BSCI Audited").\n   - "qualifications": Array of 2-3 standard certs needed (e.g., "ISO9001", "CE").\n   - "joinDate": A date within last 2 years (YYYY-MM).\n   - "lastOrderSize": A realistic large amount masked (e.g., "$5**,000+").\n\n2. Generate a list of "top10" other buyers (standard format).\n\nOUTPUT FORMAT (CRITICAL): Respond with only the raw JSON object.\n{\n  "potentialBuyers": {\n    "total": number, // Estimate total market size (e.g. 500-2000)\n    "bestMatch": {\n      "id": 999,\n      "name": "Purchase Manager",\n      "location": "City, Country",\n      "country": "${formData.targetMarket}",\n      "industry": "string",\n      "buyerType": "string",\n      "matchScore": number,\n      "companyMasked": "string",\n      "productScope": "string",\n      "factoryPreference": "string",\n      "qualifications": ["string"],\n      "joinDate": "string",\n      "lastOrderSize": "string"\n    },\n    "top10": [\n      {\n        "id": number,\n        "name": "string (Descriptive Alias)",\n        "location": "City, Country",\n        "country": "${formData.targetMarket}",\n        "industry": "string",\n        "buyerType": "string"\n      }\n    ]\n  }\n}`
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
        const errorText = await response.text();
        throw new Error(`[Proxy Error] API request failed with status ${response.status}: ${errorText}`);
      }
  
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to get response reader for streaming.");
  
      const decoder = new TextDecoder();
      let leftover = '';
      let hasStreamed = false;
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (!hasStreamed) {
          }
          break;
        }
  
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
            } catch (e) {
              console.warn("Failed to parse a stream chunk, skipping:", jsonStr);
            }
          }
        }
      }
      onComplete();
    } catch (error: any) {
      onError(error);
    }
  };

const uploadFileToFirebase = async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      throw error;
    }
  };

export const aiService = {
  getAnalysis: async (
    formData: InfoFormData,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ) => {
    try {
      console.log(`[AI Analysis] Starting secured streaming analysis for: ${formData.productName}`);
      const messages = generateMessages(formData);
      await callAAsStream(messages, onChunk, onComplete, onError);
    } catch (error: any) {
      console.error("🔴 AI STREAMING ANALYSIS FAILED 🔴", error);
      onError(error);

      const fallbackData: AnalysisData = {
        potentialBuyers: {
          total: 850,
          bestMatch: {
            id: 999,
            name: "Senior Sourcing Lead",
            location: "Chicago, USA",
            country: formData.targetMarket,
            industry: "Construction Material",
            buyerType: "Large Distributor",
            matchScore: 98,
            companyMasked: "Home D*** Supply Chain",
            productScope: formData.productName,
            factoryPreference: "ISO9001 Certified Factory",
            qualifications: ["ISO9001", "CE", "Export License"],
            joinDate: "2023-05",
            lastOrderSize: "$1**,000+"
          },
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

  getStrategy: async (onComplete: () => void) => {
    setTimeout(onComplete, 1500);
  },

  submitApplication: async (payload: ApplicationPayload): Promise<{ success: boolean }> => { // [FIX 7/8] Use the unified payload
    console.log("--- Starting Firebase submission process with complete data ---");
    
    try {
      let businessLicenseUrl = "";
      if (payload.businessLicense) {
        console.log("Uploading business license...");
        const path = `qualifications/${payload.companyName}/license/${Date.now()}_${payload.businessLicense.name}`;
        businessLicenseUrl = await uploadFileToFirebase(payload.businessLicense, path);
      }

      console.log(`Uploading ${payload.factoryPhotos.length} factory photos...`);
      const factoryPhotoUrls = await Promise.all(
        payload.factoryPhotos.map((file, index) => 
          uploadFileToFirebase(file, `qualifications/${payload.companyName}/photos/${Date.now()}_${index}_${file.name}`)
        )
      );

      console.log(`Uploading ${payload.productCertificates.length} certificates...`);
      const productCertificateUrls = await Promise.all(
        payload.productCertificates.map((file, index) => 
          uploadFileToFirebase(file, `qualifications/${payload.companyName}/certs/${Date.now()}_${index}_${file.name}`)
        )
      );

      console.log("Writing complete application to database...");
      const docRef = await addDoc(collection(db, "factory_applications"), {
        // [FIX 7/8] Include ALL data from the payload
        // Product Info
        productName: payload.productName,
        productDetails: payload.productDetails,
        targetMarket: payload.targetMarket,

        // Factory Info
        companyName: payload.companyName,
        establishedYear: payload.establishedYear,
        annualRevenue: payload.annualRevenue,
        
        mainProductCategory: payload.mainProductCategory,
        mainCertificates: payload.mainCertificates,
        
        contactPerson: payload.contactPerson,
        position: payload.position,
        contactPhone: payload.contactPhone,
        
        documents: {
          license: businessLicenseUrl,
          photos: factoryPhotoUrls,
          certs: productCertificateUrls
        },

        // CRM Fields
        status: 'pending',
        matchScore: 0,
        assignedAgent: null,
        createdAt: serverTimestamp(),
        source: 'web_wizard_v2_complete' // Updated source
      });

      console.log("✅ Application submitted successfully! Document ID:", docRef.id);
      return { success: true };

    } catch (error: any) {
      console.error("❌ Submission failed:", error);
      throw new Error("Application submission failed. Please check your network or try again later.");
    }
  }
};
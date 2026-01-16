
import { AnalysisData, ApplicationPayload } from '../types';

const getYearNumber = (yearString: string): number => {
    if (!yearString) return 0;
    if (yearString.includes('>')) {
        return parseInt(yearString.replace(/[^0-9]/g, ''), 10);
    }
    const yearMatch = yearString.match(/^[0-9]+/);
    return yearMatch ? parseInt(yearMatch[0], 10) : 0;
};

const aiService = {
  getAnalysis: async (productName: string): Promise<AnalysisData> => {
    console.log(`[aiService] Fetching analysis for: ${productName}`);
    const systemPrompt = `
      You are a world-class market analyst AI for a global trade company.
      Your goal is to identify high-quality potential buyers for a given product.
      You must generate a response in JSON format, adhering strictly to the following structure:
      {
        "potentialBuyers": {
          "total": <A number representing the total estimated buyers in the global market>,
          "bestMatch": {
            "name": "<The buyer's full name>",
            "companyMasked": "<The company name, with parts masked for privacy (e.g., 'A*** B.V.')>",
            "location": "<City, Country>",
            "productScope": "<A concise summary of the products they are interested in>",
            "factoryPreference": "<The preferred type of factory (e.g., 'OEM/ODM, Verified Supplier')>",
            "qualifications": ["<List of required certifications>", "<e.g., ISO 9001>", "<e.g., CE Certified>"],
            "lastOrderSize": "<Estimated size of their recent orders (e.g., '$500,000 - $1M')>",
            "joinDate": "<The year they joined the platform (e.g., '2018')>",
            "matchScore": <A number between 90 and 98>
          },
          "top10": [
            {
              "id": "<A unique identifier, e.g., 'BUYER-001'>",
              "name": "<The buyer's full name, masked for privacy (e.g., 'J*** S***')>",
              "location": "<City>",
              "country": "<Country>"
            },
          ]
        }
      }
      Do not include any text, notes, or explanations outside of the JSON structure.
      The data should be realistic, diverse, and tailored to the product.
    `;
    const userPrompt = `Product: "${productName}"`;
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: '[vertex]gemini-3-pro-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('AI API Error Response:', errorBody);
        throw new Error(`The AI service failed with status ${response.status}.`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0].message.content) {
        const jsonString = data.choices[0].message.content;
        const cleanedJsonString = jsonString.replace(/^```json\n|\n```$/g, '');
        const analysisData: AnalysisData = JSON.parse(cleanedJsonString);
        console.log('[aiService] Successfully parsed analysis data.');
        return analysisData;
      } else {
        throw new Error('The AI response format was invalid.');
      }

    } catch (error) {
      console.error('[aiService] Failed to fetch or parse AI analysis:', error);
      throw error;
    }
  },

  submitApplication: async (payload: ApplicationPayload): Promise<{ success: boolean }> => {
    console.log("[aiService] Submitting application with files...");

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'businessLicense' || key === 'factoryPhotos' || key === 'productCertificates') {
      } else if (key === 'mainCertificates' && Array.isArray(value)) {
        value.forEach(cert => formData.append('mainCertificates[]', cert));
      } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        formData.append(key, String(value));
      }
    });
    
    if (payload.businessLicense) {
      formData.append('businessLicense', payload.businessLicense);
    }
    if (payload.factoryPhotos && payload.factoryPhotos.length > 0) {
      payload.factoryPhotos.forEach(file => formData.append('factoryPhotos', file));
    }
    if (payload.productCertificates && payload.productCertificates.length > 0) {
      payload.productCertificates.forEach(file => formData.append('productCertificates', file));
    }

    formData.set('establishedYear', String(getYearNumber(payload.establishedYear)));

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Service] Submission Error Response:", errorText);
        throw new Error(errorText || `Submission failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('[aiService] Application submitted successfully.');
      return result;

    } catch (error) {
      console.error("[aiService] Application submission error:", error);
      throw error;
    }
  }
};

export default aiService;
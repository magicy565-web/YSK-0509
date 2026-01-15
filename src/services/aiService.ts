
import { AnalysisData, ApplicationPayload } from '../types';

// Helper function to extract a valid year number from a string.
const getYearNumber = (yearString: string): number => {
    if (!yearString) return 0;
    // Handles formats like "> 5 years"
    if (yearString.includes('>')) {
        return parseInt(yearString.replace(/[^0-9]/g, ''), 10);
    }
    // Extracts leading numbers from formats like "5-10 years"
    const yearMatch = yearString.match(/^[0-9]+/);
    return yearMatch ? parseInt(yearMatch[0], 10) : 0;
};

// --- AI Service Definition ---
const aiService = {
  /**
   * Fetches a market analysis from the AI service based on a product name.
   * This function now makes a real API call to the backend proxy.
   */
  getAnalysis: async (productName: string): Promise<AnalysisData> => {
    console.log(`[aiService] Fetching analysis for: ${productName}`);

    // System prompt that instructs the AI on how to behave and what to generate.
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
            // ... (Generate 9 more similar objects)
          ]
        }
      }
      Do not include any text, notes, or explanations outside of the JSON structure.
      The data should be realistic, diverse, and tailored to the product.
    `;

    // The user's query to the AI.
    const userPrompt = `Product: "${productName}"`;

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4-turbo', // Using a powerful model for quality results
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: false, // We expect a single JSON object back, not a stream
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('AI API Error Response:', errorBody);
        throw new Error(`The AI service failed with status ${response.status}.`);
      }

      const data = await response.json();
      
      // The AI might return the JSON as a string within the 'content' field.
      if (data.choices && data.choices[0].message.content) {
        const jsonString = data.choices[0].message.content;
        // Clean up potential markdown code block fences.
        const cleanedJsonString = jsonString.replace(/^```json\n|\n```$/g, '');
        const analysisData: AnalysisData = JSON.parse(cleanedJsonString);
        console.log('[aiService] Successfully parsed analysis data.');
        return analysisData;
      } else {
        throw new Error('The AI response format was invalid.');
      }

    } catch (error) {
      console.error('[aiService] Failed to fetch or parse AI analysis:', error);
      // Re-throwing the error to be caught by the calling component (App.tsx)
      throw error;
    }
  },

  /**
   * Submits the final application payload to the backend.
   */
  submitApplication: async (payload: ApplicationPayload): Promise<{ success: boolean }> => {
    console.log("[aiService] Submitting application to backend...");

    const apiBody = {
        ...payload,
        establishedYear: getYearNumber(payload.establishedYear),
    };

    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed due to a server error.');
      }

      await response.json();
      console.log('[aiService] Application submitted successfully.');
      return { success: true };

    } catch (error) {
      console.error("[aiService] Application submission error:", error);
      throw error;
    }
  }
};

export default aiService;

import { AnalysisData, InfoFormData, StrategyData, DealData, ApiResponse } from "../types";

const AI_MODEL = import.meta.env.VITE_AI_MODEL_NAME;

// A more powerful function to stream AI responses, which will be used by our custom hook.
async function streamAI(messages: any[], onChunk: (chunk: string) => void, onReady: () => void, onError: (error: any) => void) {
    if (!AI_MODEL) {
        throw new Error("VITE_AI_MODEL_NAME is not set.");
    }

    const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, model: AI_MODEL, stream: true }),
    });

    if (!response.ok) {
        onError(await response.text());
        return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // This function recursively reads from the stream
    const read = async () => {
        const { done, value } = await reader.read();
        if (done) {
            onReady();
            return;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // The streaming API sends data in chunks prefixed by "data: "
        const parts = buffer.split("\n\n");

        parts.slice(0, -1).forEach(part => {
            if (part.startsWith('data: ')) {
                const content = part.substring(6);
                if (content !== '[DONE]') {
                    try {
                        const json = JSON.parse(content);
                        if (json.choices && json.choices[0].delta.content) {
                            onChunk(json.choices[0].delta.content);
                        }
                    } catch(e) {
                        console.error('Error parsing stream chunk', e);
                    }
                }
            }
        });

        buffer = parts[parts.length - 1];
        read(); // Continue reading
    };

    read();
}

// --- Prompt Generation Layer ---

const createAnalysisPrompt = ({ productName, targetCountry }: InfoFormData) => ([
    {
        role: "system",
        content: `You are a world-class B2B market analyst. Analyze the market for "${productName}" in "${targetCountry}". Return a single valid JSON object. JSON schema: { potentialBuyers: { total: number, top10: ... }, nicheMarkets: ..., topCompetitors: ..., b2bStrategies: ... }`,
    },
    { role: "user", content: "Please provide the analysis." }
]);

const createStrategyPrompt = (formData: InfoFormData, analysisData: AnalysisData) => ([
    {
        role: "system",
        content: `You are a B2B sales expert. Create 3 distinct cold email strategies for "${formData.productName}". Output a valid JSON array of 3 objects, each with { id, title, description, subject, emailBody }. The emailBody must be in Chinese and include placeholders "[您的姓名]" and "[您的公司]".`,
    },
    { role: "user", content: `Target Customer: ${JSON.stringify(analysisData.potentialBuyers?.top10?.[0])}` }
]);


// --- Service Layer ---

const getDeal = async (formData: InfoFormData): Promise<DealData> => {
    // This logic remains local and does not call the AI.
    return {
        clientInfo: { companyName: '', contactPerson: '', email: '', phone: '' },
        quotation: [{
            id: Date.now(),
            productName: formData.productName,
            model: '', unit: 'pcs', exwPrice: '', moq: ''
        }],
    };
};

export const aiService = {
    getAnalysis: (formData: InfoFormData, onChunk: (chunk: string) => void, onReady: () => void, onError: (error: any) => void) => {
        const messages = createAnalysisPrompt(formData);
        return streamAI(messages, onChunk, onReady, onError);
    },
    getStrategy: (formData: InfoFormData, analysisData: AnalysisData, onChunk: (chunk: string) => void, onReady: () => void, onError: (error: any) => void) => {
        const messages = createStrategyPrompt(formData, analysisData);
        return streamAI(messages, onChunk, onReady, onError);
    },
    getDeal: getDeal, // This one is not async
};

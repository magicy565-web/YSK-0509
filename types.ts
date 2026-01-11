export enum AppState {
  IDLE = 'idle',
  FORM = 'form',
  ANALYSIS = 'analysis',
  STRATEGY = 'strategy',
  DEAL = 'deal',
  SUCCESS = 'success',
}

// --- UPDATED FOR DUAL-MODE ANALYSIS ---
export interface InfoFormData {
  productName: string;
  targetCountry: string;
  analysisType: 'database' | 'ai'; // User's choice of analysis
}
// --- END OF UPDATE ---

export interface PotentialBuyer {
  id: string;
  name: string;
  avatarUrl: string;
  website: string;
  country: string;
  location: string;
  buyerType: 'trader' | 'ecommerce' | 'project_contractor' | 'distributor';
  industry: string;
  joinDate: string;
  monthlyPurchaseAmount: number;
  sourcingPreference: 'factory' | 'trader';
  purchasingPreference: 'price' | 'quality' | 'stability';
  historicalInquiries: number;
  intendedProducts: string[];
}

export interface AnalysisData {
  potentialBuyers: {
    total: number;
    top10: PotentialBuyer[];
  };
  nicheMarkets: {
    name: string;
    volume: string;
  }[];
  topCompetitors: {
    name: string;
    website: string;
    advantages: string[];
  }[];
  b2bStrategies: string[];
}

export type StrategyOption = {
  id: string;
  title: string;
  description: string;
  subject: string;
  emailBody: string;
}

export type StrategyData = StrategyOption[];

export interface ClientCompanyInfo {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface ProductQuotation {
  id: number;
  productName: string;
  model: string;
  unit: string;
  exwPrice: string;
  moq: string;
}

export interface DealData {
  clientInfo: ClientCompanyInfo;
  quotation: ProductQuotation[];
}

export interface ApiResponse {
  step: string;
  data: AnalysisData | StrategyData | DealData | null;
}

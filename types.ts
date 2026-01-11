export enum AppState {
  IDLE = 'idle',
  FORM = 'form',
  ANALYSIS = 'analysis',
  STRATEGY = 'strategy',
  DEAL = 'deal',
  SUCCESS = 'success',
}

export interface InfoFormData {
  productName: string;
  targetCountry: string;
}

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

// --- NEW TYPES FOR STEP 4 ---

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

// DealData is now the commission form
export interface DealData {
  clientInfo: ClientCompanyInfo;
  quotation: ProductQuotation[];
}

// --- END OF NEW TYPES ---

export interface ApiResponse {
  step: string;
  data: AnalysisData | StrategyData | DealData | null;
}

export enum AppState {
  FORM = 'FORM',
  IDLE = 'IDLE',
  ANALYSIS = 'ANALYSIS',
  STRATEGY = 'STRATEGY',
  DEAL = 'DEAL',
  SUCCESS = 'SUCCESS'
}

// 1. 潜在采购商
export interface PotentialBuyer {
  name: string;
  address: string;
  contact: string;
}

// 2. 细分利基市场
export interface NicheMarket {
  name: string;
  volume: string;
}

// 3. 主要竞争企业
export interface Competitor {
  name: string;
  website: string;
  advantages: string[]; // Key advantages of the competitor
}

// Redefined AnalysisData to match the new structure
export interface AnalysisData {
  potentialBuyers: {
    total: number;
    top10: PotentialBuyer[];
  };
  nicheMarkets: NicheMarket[];
  topCompetitors: Competitor[];
  b2bStrategies: string[];
}

export interface StrategyData {
  tactic: string;
  subject: string;
  emailBody: string;
  channels: string[];
}

export interface DealData {
  clientName: string;
  clientRating: string;
  productName: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  shippingCost: string;
  term: string;
}

export interface ApiResponse {
  step: string;
  data: AnalysisData | StrategyData | DealData | null;
}

export interface InfoFormData {
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  productName: string;
  targetCountry: string;
  productBrochure: File | null;
  productImages: FileList | null;
  auxiliaryFiles: FileList | null;
}

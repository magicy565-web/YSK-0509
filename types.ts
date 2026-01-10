export enum AppState {
  IDLE = 'IDLE',
  ANALYSIS = 'ANALYSIS',
  STRATEGY = 'STRATEGY',
  DEAL = 'DEAL',
  SUCCESS = 'SUCCESS'
}

export interface AnalysisData {
  leads: number;
  profit: string;
  market: string;
  topKeywords: string[];
}

export interface StrategyData {
  tactic: string;
  subject: string;
  emailBody: string;
  channels: string[];
}

export interface DealData {
  clientName: string;
  clientRating: string; // e.g., 'AAA'
  productName: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  shippingCost: string;
  term: string; // e.g., 'DDP'
}

export interface ApiResponse {
  step: string;
  data: AnalysisData | StrategyData | DealData | null;
}
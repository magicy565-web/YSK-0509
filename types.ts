
// This defines the possible states of the application.
export enum AppState {
  FORM = 'FORM',
  ANALYSIS = 'ANALYSIS',
  STRATEGY = 'STRATEGY',
  DEAL = 'DEAL',
  SUCCESS = 'SUCCESS',
}

// --- Data Structures for each state ---

// 1. Initial form data
export interface InfoFormData {
  productName: string;
  productDetails: string;
  targetMarket: string;
}

// 2. Analysis state data
export interface PotentialBuyer {
  id: number;
  name: string;
  location: string;
  country: string;
  industry: string;
  buyerType: string; // e.g., 'Distributor', 'Retailer'
}

export interface AnalysisData {
  potentialBuyers: {
    total: number;
    top10?: PotentialBuyer[];
  };
}

// 3. Strategy state data - This is now static in the UI, so no complex type needed.
export type StrategyData = any; // Simplified as it's no longer fetched from AI.

// 4. Deal state data
export interface FactoryQualification {
    companyName: string;
    website: string;
    contactPerson: string;
    annualExportValue: string;
    mainProductAdvantage: string;
    certificates?: File[];
    hasCommitment: boolean;
}

export interface ProductQuotation {
    id: number;
    productName: string;
    model: string;
    unit: string;
    exwPrice: string;
    moq: string;
    leadTime: string;
}

export interface DealData {
    factoryInfo: FactoryQualification;
    quotation: ProductQuotation[];
}

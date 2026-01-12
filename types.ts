
// Defines the possible states of the application.
export enum AppState {
  FORM = 'FORM',
  ANALYSIS = 'ANALYSIS',
  STRATEGY = 'STRATEGY',
  DEAL = 'DEAL',
  SUCCESS = 'SUCCESS',
}

// --- Data Structures ---

// 1. Initial form data from the user
export interface InfoFormData {
  productName: string;
  productDetails: string;
  targetMarket: string;
}

// 2. Data for the Analysis/Results state
export interface PotentialBuyer {
  id: number;
  name: string;
  location: string;
  country: string;
  industry: string;
  buyerType: string;
}

export interface AnalysisData {
  potentialBuyers: {
    total: number;
    top10?: PotentialBuyer[];
  };
}

// 3. Strategy state is now a static SOP, so no complex type is needed.

// 4. Deal state data - REBUILT FOR V2.1
// This interface now matches the new, simplified, high-conversion qualification form.
export interface FactoryQualification {
  companyName: string;
  contactPerson: string;
  position: 'owner' | 'manager' | 'other'; // Position is now a required, specific field
  hasExportRights: boolean | null; // Changed to boolean for Yes/No logic
  accepts30PercentDeposit: boolean | null; // Changed to boolean for Yes/No logic
  factoryPicture: File | null; // For the factory picture upload
}

// DealData is now a direct representation of the qualification form.
export type DealData = FactoryQualification;


// 5. Success state - NEW FOR V2.1
// Data structure for the success stories shown on the Deal page.
export interface SuccessCase {
  id: string;
  title: string;          // e.g., "浙江某纺织厂 3天对接德国超市"
  tags: string[];         // e.g., ["纺织", "德国", "订单额$50k"]
  imageUrl: string;       // URL for the testimonial image (e.g., chat screenshot)
  description: string;    // Short success story
  metrics: {
    label: string;      // e.g., "获客成本"
    value: string;      // e.g., "0"
  }[];
}

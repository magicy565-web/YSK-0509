
// types.ts - Unified Type Definitions

// Represents the different states or pages of the application workflow.
export enum AppState {
  FORM = 'FORM',
  ANALYSIS = 'ANALYSIS',
  STRATEGY = 'STRATEGY',
  DEAL = 'DEAL',
  SUCCESS = 'SUCCESS',
}

// Basic information about the user's product and company.
export interface InfoFormData {
  productName: string;
  productDetails: string;
  targetMarket: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
}

// Represents a potential buyer lead.
export interface PotentialBuyer {
  id: string; // Changed to string for flexibility (e.g., 'BUYER-001')
  name: string;
  location: string;
  country: string;
}

// Detailed profile for the best-matched recommended buyer.
export interface RecommendedBuyer {
  name: string;
  companyMasked: string;
  location: string;
  productScope: string;
  factoryPreference: string;
  qualifications: string[];
  joinDate: string;
  lastOrderSize: string;
  matchScore: number;
}

// The main data structure for the AI-generated market analysis.
export interface AnalysisData {
  potentialBuyers: {
    total: number;
    bestMatch?: RecommendedBuyer;
    top10?: PotentialBuyer[];
  };
}

// Detailed information about a factory's qualifications, submitted by the user.
export interface FactoryQualification {
  companyName: string;
  establishedYear: string; // Kept as string to match form input
  annualRevenue: string;
  mainProductCategory: string;
  mainCertificates: string[];
  businessLicense: File;
  factoryPhotos: File[];
  productCertificates: File[];
  contactPerson: string;
  position: 'owner' | 'manager' | 'other';
  contactPhone: string;
}

// Alias for FactoryQualification, used in the DEAL state.
export type DealData = FactoryQualification;

// A unified payload combining form data for the final application submission.
// This resolves the previous type conflicts.
export type ApplicationPayload = InfoFormData & Omit<FactoryQualification, 'companyName' | 'contactPerson' | 'contactPhone'>;


// Constants for form dropdowns.
export const CERTIFICATES = ["ISO9001", "BSCI", "CE", "UL", "FDA", "其他"];
export const ESTABLISHED_YEARS = ["1-3年", "3-5年", "5-10年", "10年以上"];
export const ANNUAL_REVENUES = ["<100万", "100-500万", "500-1000万", ">1000万"];

// Represents a success case study.
export interface SuccessCase {
  id: string;
  title: string;
  tags: string[];
  imageUrl: string;
  description: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

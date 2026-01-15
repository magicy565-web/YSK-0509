
// types.ts

export enum AppState {
  FORM = 'FORM',
  ANALYSIS = 'ANALYSIS',
  STRATEGY = 'STRATEGY',
  DEAL = 'DEAL',
  SUCCESS = 'SUCCESS',
}

export interface InfoFormData {
  productName: string;
  productDetails: string;
  targetMarket: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
}

export interface PotentialBuyer {
  id: number;
  name: string;
  location: string;
  country: string;
  industry: string;
  buyerType: string;
}

export interface RecommendedBuyer extends PotentialBuyer {
  matchScore: number;
  companyMasked: string;
  productScope: string;
  factoryPreference: string;
  qualifications: string[];
  joinDate: string;
  lastOrderSize: string;
}

export interface AnalysisData {
  potentialBuyers: {
    total: number;
    bestMatch?: RecommendedBuyer;
    top10?: PotentialBuyer[];
  };
}

export const CERTIFICATES = ["ISO9001", "BSCI", "CE", "UL", "FDA", "其他"];
export const ESTABLISHED_YEARS = ["1-3年", "3-5年", "5-10年", "10年以上"];
export const ANNUAL_REVENUES = ["<100万", "100-500万", "500-1000万", ">1000万"];

export interface FactoryQualification {
  companyName: string;
  establishedYear: string; 
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

export type DealData = FactoryQualification;

// [FIX 6/8] Create a unified payload type for submission
export type ApplicationPayload = FactoryQualification & InfoFormData;

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

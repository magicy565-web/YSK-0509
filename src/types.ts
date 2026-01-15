export interface InfoFormData {
  productName: string;
  productDetails: string;
  targetMarket: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
}

export interface InfoFormProps {
  onSubmit: (data: InfoFormData) => void;
}

export interface Buyer {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  product: string;
  revenue: number;
  interest: number;
}

export interface AnalysisResult {
  buyers: Buyer[];
  summary: string;
}

export interface ApplicationPayload extends InfoFormData {
  establishedYear?: number;
  annualRevenue?: number;
}

export interface SuccessCase {
  id: string;
  title: string;
  tags: string[];
  imageUrl: string;
  description: string;
  metrics: { label: string; value: string }[];
}

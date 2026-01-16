export interface SuccessCase {
  id: string;
  title: string;
  tags: string[];
  imageUrl: string;
  description: string;
  metrics: { label: string; value: string }[];
}

export interface AnalysisData {
  potentialBuyers: {
    total: number;
    bestMatch: {
      name: string;
      companyMasked: string;
      location: string;
      productScope: string;
      factoryPreference: string;
      qualifications: string[];
      lastOrderSize: string;
      joinDate: string;
      matchScore: number;
    };
    top10: {
      id: string;
      name: string;
      location: string;
      country: string;
    }[];
  };
}

export interface ApplicationPayload {
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  mainProducts: string;
  establishedYear: string;
  employeeCount: string;
  mainCertificates: string[];
  businessLicense?: File;
  factoryPhotos?: File[];
  productCertificates?: File[];
  hasB2BExperience: boolean;
  b2bPlatforms: string;
  annualExportVolume: string;
  majorMarkets: string;
}

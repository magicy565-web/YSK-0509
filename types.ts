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
}

// 基础买家信息 (用于普通列表)
export interface PotentialBuyer {
  id: number;
  name: string;
  location: string;
  country: string;
  industry: string;
  buyerType: string;
}

// [新增] 推荐买家详细信息 (用于高亮展示)
export interface RecommendedBuyer extends PotentialBuyer {
  matchScore: number;       // 匹配度 (例如 98)
  companyMasked: string;    // 模糊处理的公司名 (例如 "North Am*** Trading")
  productScope: string;     // 意向采购范围
  factoryPreference: string;// 偏好的工厂类型 (例如 "有OEM经验", "源头工厂")
  qualifications: string[]; // 需要的资质 (例如 ["ISO9001", "UL"])
  joinDate: string;         // 加入平台时间
  lastOrderSize: string;    // 最近一次采购规模 (模糊处理)
}

export interface AnalysisData {
  potentialBuyers: {
    total: number;
    // [修改] 增加 bestMatch 字段
    bestMatch?: RecommendedBuyer;
    top10?: PotentialBuyer[];
  };
}

// --- TASK 4: "Industrial-Grade" Qualification Form ---

export const CERTIFICATES = ["ISO9001", "BSCI", "CE", "UL", "FDA", "其他"];
export const ESTABLISHED_YEARS = ["1-3年", "3-5年", "5-10年", "10年以上"];
export const ANNUAL_REVENUES = ["<100万", "100-500万", "500-1000万", ">1000万"];

export interface FactoryQualification {
  // Step 1: 企业硬实力
  companyName: string;
  establishedYear: string; 
  annualRevenue: string;
  
  // Step 2: 合规与认证
  mainProductCategory: string;
  mainCertificates: string[];

  // Step 3: 决策人对接
  contactPerson: string;
  position: 'owner' | 'manager' | 'other';
  contactPhone: string;
}


export type DealData = FactoryQualification;

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

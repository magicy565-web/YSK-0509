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
  id: string; // 唯一ID
  name: string; // 公司名称
  avatarUrl: string; // 公司Logo/头像
  website: string; // 公司网站
  country: string; // 国家
  location: string; // 详细地址
  buyerType: 'trader' | 'ecommerce' | 'project_contractor' | 'distributor'; // 采购商类型
  industry: string; // 所属行业
  joinDate: string; // 平台加入日期
  monthlyPurchaseAmount: number; // 月度采购订单金额 (美金)
  sourcingPreference: 'factory' | 'trader'; // 采购类型偏好
  purchasingPreference: 'price' | 'quality' | 'stability'; // 采购方向偏好
  historicalInquiries: number; // 历史询盘次数
  intendedProducts: string[]; // 意向产品
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

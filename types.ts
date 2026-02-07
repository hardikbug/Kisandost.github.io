
export enum AppTab {
  HOME = 'home',
  MARKETS = 'markets',
  SCAN = 'scan',
  COMMUNITY = 'community',
  PROFILE = 'profile',
  GUIDES = 'guides'
}

export interface MandiPrice {
  crop: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  emoji: string;
  verified?: boolean;
  anomaly?: boolean;
}

export interface VerificationResult {
  status: 'success' | 'failure';
  productName: string;
  brand: string;
  batchNumber: string;
  expiryDate: string;
  verificationTime: string;
  serial?: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  content?: string;
}

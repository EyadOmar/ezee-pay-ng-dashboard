export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export type PricingMethod = 'fixed' | 'average' | 'actual_cost';
export type SalesStrategy = 'fifo' | 'filo' | 'fefo';
export type ImageDestination = 'web' | 'mobile' | 'print';

export interface CategoryImage {
  id: string;
  url: string;
  destination: ImageDestination;
  isDefault: boolean;
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  parentId: string | null;
  pricingMethod: PricingMethod;
  salesStrategy: SalesStrategy;
  inactive: boolean;
  images: CategoryImage[];
  createdAt: Date;
  updatedAt: Date;
  children?: Category[];
}

export const PRICING_METHODS: { label: string; labelAr: string; value: PricingMethod }[] = [
  { label: 'Fixed', labelAr: 'ثابت', value: 'fixed' },
  { label: 'Average', labelAr: 'متوسط', value: 'average' },
  { label: 'Actual Cost', labelAr: 'التكلفة الفعلية', value: 'actual_cost' },
];

export const SALES_STRATEGIES: { label: string; labelAr: string; value: SalesStrategy }[] = [
  { label: 'First In First Out (FIFO)', labelAr: 'الأول دخولاً الأول خروجاً', value: 'fifo' },
  { label: 'First In Last Out (FILO)', labelAr: 'الأول دخولاً الأخير خروجاً', value: 'filo' },
  { label: 'First Expiry First Out (FEFO)', labelAr: 'الأقرب انتهاءً الأول خروجاً', value: 'fefo' },
];

export const IMAGE_DESTINATIONS: { label: string; value: ImageDestination }[] = [
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Print', value: 'print' },
];

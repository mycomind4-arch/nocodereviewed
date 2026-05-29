export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logoUrl: string;
  websiteUrl: string;
  affiliateUrl: string;
  category: string[];
  ratingOverall: number;
  ratingEase: number;
  ratingFeatures: number;
  ratingPricing: number;
  ratingSupport: number;
  verdict: string;
  reviewBody: string;
  pros: string[];
  cons: string[];
  pricingTiers: PricingTier[];
  bestFor: string[];
  featured: boolean;
  sponsored: boolean;
  sponsoredUntil?: string;
  metaTitle: string;
  metaDescription: string;
  imageUrl: string;
}

export interface PricingTier {
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  body: string;
  excerpt: string;
  articleType: 'review' | 'comparison' | 'tutorial' | 'best-of' | 'guide' | 'news';
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  featuredImageUrl: string;
  author: string;
  wordCount: number;
  readingTimeMins: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  updatedAt: string;
  viewCount: number;
  featured: boolean;
}

export interface Comparison {
  id: string;
  slug: string;
  title: string;
  toolA: Tool;
  toolB: Tool;
  body: string;
  winnerOverall?: string;
  seoTitle: string;
  seoDescription: string;
  viewCount: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  updatedAt: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  subscribedAt: string;
  source: string;
  tags: string[];
}

export interface AffiliateClick {
  id: string;
  toolId: string;
  articleId?: string;
  pageUrl: string;
  clickedAt: string;
}

export interface SponsoredSlot {
  id: string;
  toolId: string;
  slotName: string;
  slotPosition: string;
  startDate: string;
  endDate: string;
  monthlyFee: number;
  active: boolean;
}

export interface UserRating {
  id: string;
  toolId: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  submittedAt: string;
  approved: boolean;
}

export interface AdminStats {
  totalTools: number;
  publishedArticles: number;
  activeSubscribers: number;
  affiliateClicks30d: number;
  sponsoredRevenue: number;
}

export interface EngineStatus {
  name: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  nextRun: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

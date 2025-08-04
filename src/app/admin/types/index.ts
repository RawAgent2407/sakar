export interface GalleryItem {
  url: string;
  name: string;
  data?: string; // base64 image data
}

export interface VideoItem {
  url: string;
  name: string;
}

export interface Property {
  _id?: string;
  name: string;
  tagline: string;
  propertyType: string;
  location: string; // area
  priceRange: {
    from: { value: string; unit: 'Lac' | 'Cr' };
    to: { value: string; unit: 'Lac' | 'Cr' };
  };
  builder: {
    developerName: string;
    websiteUrl: string;
  };
  keyHighlights: {
    reraApproved: boolean;
    reraNumber?: string;
    /** Possession date in YYYY-MM-DD format */
    possessionDate: string;
    unitConfiguration: string;
    carpetArea: { from: string; to: string; unit: string };
    otherAmenities: string[];
    igbcGoldCertified: boolean;
    igbcLevel?: 'Certified' | 'Silver' | 'Gold' | 'Platinum';
  };
  gallery: GalleryItem[];
  videos: VideoItem[];
  locationAdvantage: {
    address: string;
    addressUrl: string;
    advantages: string[];
  };
  featuredDevelopment: {
    text: string;
    images: GalleryItem[];
  };
  otherProjects: string[];
  trendingScore?: number;
  featured: boolean;
  home?: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  interestedIn: string;
  propertyId?: string;
  propertyName?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  source: 'website' | 'phone' | 'email' | 'walk-in';
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  general: {
    siteName: string;
    language: string;
    timezone: string;
  };
  preferences: {
    theme: 'dark' | 'light';
    notifications: boolean;
  };
  security: {
    twoFA: boolean;
    sessionTimeout: number;
  };
  properties: {
    defaultType: string;
    customFields: string[];
    statusTypes: string[];
  };
  integrations: {
    apiKey: string;
    webhooks: string[];
  };
}
// Common types used across the application

export type SocialIconType = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'location' | 'phone' | 'email' | 'time' | 'search' | 'dropdown' | 'bedroom' | 'price';

export interface LinkItem {
  label: string;
  href: string;
}

export interface SocialLink extends Omit<LinkItem, 'label'> {
  label: string;
  icon: SocialIconType;
  bgColor: string;
}

export interface ContactInfo {
  icon: SocialIconType;
  text: string;
  type: 'text' | 'email' | 'phone' | 'address' | 'hours';
  href?: string;
}

export interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

export interface InfoChip {
  icon: SocialIconType;
  text: string;
}

export interface CTAButton {
  text: string;
  variant: 'primary' | 'secondary' | 'outline';
  href: string;
}

export interface SearchFilter {
  id: string;
  label: string;
  placeholder: string;
  icon: SocialIconType;
  type: 'text' | 'select' | 'number' | 'date';
  options?: string[];
}

export interface HeroData {
  backgroundImage: string;
  badge?: string;
  title: string;
  infoChips: InfoChip[];
  ctaButtons: CTAButton[];
  searchFilters: SearchFilter[];
  filterChips: FilterChip[];
}

export interface NavigationData {
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  links: LinkItem[];
  search: {
    placeholder: string;
    icon: SocialIconType;
  };
}

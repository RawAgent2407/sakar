import { LinkItem } from './types';

export const navigationData = {
  logo: {
    src: '/Logo.png',
    alt: 'THE REAL ESTATE UNIVERSE',
    width: 178.57,
    height: 60,
  },
  links: [
    { label: 'Residential', href: '/residential' },
    { label: 'Commercial', href: '/commercial' },
    { label: 'Land', href: '/land' },
    { label: 'Luxury', href: '/luxury' },
    { label: 'Articles', href: '/articles' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact Us', href: '/contact' },
  ] as LinkItem[],
  search: {
    placeholder: 'Search properties...',
    icon: 'search' as const,
  },
};

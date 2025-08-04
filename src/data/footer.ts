import { SocialLink, ContactInfo, LinkItem } from './types';

interface FooterData {
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  description: string;
  socialLinks: Array<SocialLink>;
  quickLinks: Array<LinkItem>;
  contactInfo: Array<ContactInfo>;
  copyright: string;
  legalLinks: Array<LinkItem>;
}

export const footerData: FooterData = {
  logo: {
    src: '/Logo.png',
    alt: 'THE REAL ESTATE UNIVERSE',
    width: 162.67,
    height: 60,
  },
  description: 'Discover your dream property with our real estate platform. Browse, explore, and find your perfect home.',
  
  socialLinks: [
    { 
      label: 'Facebook', 
      href: '#', 
      icon: 'facebook' as const, 
      bgColor: '#333333' 
    },
    { 
      label: 'Twitter', 
      href: '#', 
      icon: 'twitter' as const, 
      bgColor: '#333333' 
    },
    { 
      label: 'Instagram', 
      href: '#', 
      icon: 'instagram' as const, 
      bgColor: '#333333' 
    },
    { 
      label: 'LinkedIn', 
      href: '#', 
      icon: 'linkedin' as const, 
      bgColor: '#333333' 
    },
  ] as SocialLink[],
  
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Articles', href: '/articles' },
  ] as LinkItem[],
  
  contactInfo: [
    { 
      icon: 'location' as const, 
      text: '919, Swati Clover, Shilaj Circle, S.P. Ring Road, Thaltej, Ahmedabad, Gujarat – 380054',
      type: 'address' as const
    },
    { 
      icon: 'phone' as const, 
      text: '063599 26999',
      type: 'phone' as const,
      href: 'tel:06359926999'
    },
    { 
      icon: 'email' as const, 
      text: 'connect@sakargroup.in',
      type: 'email' as const,
      href: 'mailto:connect@sakargroup.in'
    },
    { 
      icon: 'time' as const, 
      text: 'Mon-Fri: 9AM-6PM',
      type: 'hours' as const
    },
  ] as ContactInfo[],
  
  copyright: '© 2025 the real estate universe. All rights reserved.',
  legalLinks: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ] as LinkItem[],
};

import React, { Fragment, ReactElement } from 'react';
import Image from 'next/image';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaSearch,
  FaChevronDown,
  FaBed,
  FaPoundSign 
} from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime } from 'react-icons/md';
import { footerData } from '@/data/footer';
import type { SocialIconType } from '@/data/types';

/**
 * Maps icon types to their corresponding React components.
 * 
 * @param {SocialIconType} icon - The type of icon to retrieve
 * @param {string} [className='w-5 h-5 text-[#F7F7F7]'] - Optional CSS classes to apply to the icon
 * @returns {ReactElement | null} The corresponding icon component or null if not found
 * 
 * @example
 * ```tsx
 * const icon = getIconComponent('facebook', 'w-6 h-6');
 * ```
 */
export const getIconComponent = (icon: SocialIconType, className: string = 'w-5 h-5 text-[#F7F7F7]'): ReactElement | null => {
  const iconMap: Record<SocialIconType, ReactElement> = {
    facebook: <FaFacebookF className={className} />,
    twitter: <FaTwitter className={className} />,
    instagram: <FaInstagram className={className} />,
    linkedin: <FaLinkedinIn className={className} />,
    location: <MdLocationOn className={className} />,
    phone: <MdPhone className={className} />,
    email: <MdEmail className={className} />,
    time: <MdAccessTime className={className} />,
    search: <FaSearch className={className} />,
    dropdown: <FaChevronDown className={className} />,
    bedroom: <FaBed className={className} />,
    price: <FaPoundSign className={className} />
  };

  return iconMap[icon] || null;
};

/**
 * The main footer component that displays site-wide navigation, contact information,
 * social media links, and copyright information.
 * 
 * @component
 * @returns {JSX.Element} The rendered Footer component
 * 
 * @example
 * ```tsx
 * <Footer />
 * ```
 * 
 * @description
 * This component provides:
 * - Company logo and description
 * - Quick links to important pages
 * - Contact information with icons
 * - Social media links
 * - Copyright and legal information
 * - Responsive design for all screen sizes
 */
const Footer = () => {
  const { logo, description, socialLinks, quickLinks, contactInfo, copyright, legalLinks } = footerData;

  return (
    <footer className="flex flex-col items-center pt-16 pb-5 md:pt-24 md:pb-6 bg-[#0A0A0A] w-full">
      <div className="flex flex-col w-full max-w-[1280px] gap-12 px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-10 lg:gap-8">
          {/* Left Column - Logo and Description */}
          {/* Left Column - Logo and Description */}
          <div className="flex flex-col gap-6 w-full lg:w-[288px]">
            <div className="w-[162.67px] h-[60px] relative">
              <Image 
                src={logo.src} 
                alt={logo.alt} 
                width={logo.width}
                height={logo.height}
                className="object-contain"
              />
            </div>
            <p className="font-['Bricolage_Grotesque'] font-light text-base leading-6 text-[#F7F7F7] tracking-[0.02em]">
              {description}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                // Use style attribute for dynamic background color since Tailwind can't handle dynamic classes at runtime
                const style = { backgroundColor: social.bgColor };
                return (
                  <a 
                    key={index} 
                    href={social.href} 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                    style={style}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getIconComponent(social.icon, 'w-4 h-4')}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Middle Column - Quick Links */}
          <div className="flex flex-col gap-4 w-full sm:w-auto">
            <h3 className="font-['Bricolage_Grotesque'] font-semibold text-lg leading-7 text-white tracking-[0.02em]">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="font-['Inter'] font-normal text-base leading-6 text-[#F7F7F7] hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Contact Info */}
          <div className="flex flex-col gap-4 w-full sm:w-auto">
            <h3 className="font-['Bricolage_Grotesque'] font-semibold text-lg leading-7 text-white tracking-[0.02em]">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3.5">
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className={`flex ${info.type === 'address' ? 'items-start' : 'items-center'} gap-3`}
                >
                  <div className="w-5 h-5 flex-shrink-0">
                    {getIconComponent(info.icon)}
                  </div>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="font-['Bricolage_Grotesque'] font-light text-base leading-6 text-[#F7F7F7] tracking-[0.02em] hover:underline break-all"
                      target={info.type === 'email' ? '_blank' : undefined}
                      rel={info.type === 'email' ? 'noopener noreferrer' : undefined}
                    >
                      {info.text}
                    </a>
                  ) : (
                    <span className="font-['Bricolage_Grotesque'] font-light text-base leading-6 text-[#F7F7F7] tracking-[0.02em]">
                      {info.text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="pt-8 border-t border-[#323232] w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
            <p className="font-['Bricolage_Grotesque'] font-extralight text-sm leading-6 text-[#9CA3AF] text-center sm:text-left">
              {copyright}
            </p>
            <div className="flex gap-x-4 sm:gap-x-6">
              {legalLinks.map((link, index) => (
                <a key={index} href={link.href} className="font-['Bricolage_Grotesque'] font-extralight text-sm leading-6 text-[#9CA3AF] hover:underline" target="_blank">
                  {link.label} 
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


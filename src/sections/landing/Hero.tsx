import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBed, FaSearch, FaChevronDown } from 'react-icons/fa';

const RupeesIcon = () => (
  <span className="text-white w-4 h-4 font-bold" style={{ fontSize: '1rem', lineHeight: '1' }}>
    ₹
  </span>
);
import { heroData as staticHeroData } from '@/data/hero';
import type { HeroData } from '@/data/types';
import ProjectCard from '@/components/property/ProjectCard';
import Footer from '@/components/common/Footer';
import { Property } from '@/app/admin/types';
import { useRouter } from 'next/navigation';

/**
 * Maps icon names to their corresponding React components.
 * 
 * @param {string} icon - The name of the icon to retrieve
 * @returns {JSX.Element | null} The corresponding icon component or null if not found
 */
const getInfoIcon = (icon: string) => {
  const iconMap = {
    location: <FaMapMarkerAlt className="text-white w-4 h-4" />,
    price: <RupeesIcon />,
    bedroom: <FaBed className="text-white w-4 h-4" />,
    search: <FaSearch className="text-[#9CA3AF] w-4 h-4" />,
    dropdown: <FaChevronDown className="text-[#9CA3AF] w-3 h-3" />,
  };
  return iconMap[icon as keyof typeof iconMap] || null;
};

function formatPriceRange(price: any): string {
  if (!price) return '';
  if (typeof price === 'string') return price;
  if (typeof price === 'object' && price.from && price.to) {
    const from = price.from.value ? `${price.from.value} ${price.from.unit}` : '';
    const to = price.to.value ? `${price.to.value} ${price.to.unit}` : '';
    if (from && to) return `${from} to ${to}`;
    return from || to || '';
  }
  return '';
}

interface HeroProps {
  onSearch?: (results: Property[]) => void;
  searchActive?: boolean;
  matched?: Property[];
}

const pageSize = 6;

const propertyTypeOptionsStatic = [
  { value: '', label: 'Select property type' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Land', label: 'Land' },
  { value: 'Luxury', label: 'Luxury' },
];

const statusButtonOptions = [
  { value: 'Ready', label: 'Ready' },
  { value: 'Under Construction', label: 'Under Construction' },
  { value: 'Upcoming', label: 'Upcoming' },
];

/**
 * Hero component that displays the main banner section of the landing page.
 * 
 * @component
 * @returns {JSX.Element} The rendered Hero component
 * 
 * @example
 * ```tsx
 * <Hero />
 * ```
 * 
 * @description
 * This component displays a full-width hero section with:
 * - Background image with gradient overlay
 * - Main heading with customizable text
 * - Information chips with icons
 * - Call-to-action buttons
 * - Search filters for property search
 */
type HeroContent = HeroData & { tagline?: string };
const Hero: React.FC<HeroProps> = ({ onSearch, searchActive, matched: matchedProp }) => {
  const [homeProperty, setHomeProperty] = useState<Property | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent>(staticHeroData);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyTypeOptions, setPropertyTypeOptions] = useState(propertyTypeOptionsStatic);
  const [priceRange, setPriceRange] = useState('');
  const [status, setStatus] = useState('');
  const [matched, setMatched] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();

  // Only destructure if heroContent exists
  let badge, title, infoChips, ctaButtons, searchFilters, filterChips, backgroundImage;
  if (heroContent) {
    ({ badge, title, infoChips, ctaButtons, searchFilters, filterChips, backgroundImage } = heroContent);
  }

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Prioritize 'home' properties at the top, keep others in original order
          const homeProps = data.properties.filter((p: Property) => p.home && p.trendingScore !== undefined && p.trendingScore !== null);
          const nonHomeProps = data.properties.filter((p: Property) => !p.home);
          setAllProperties([...homeProps, ...nonHomeProps]);
          if (homeProps.length > 0) {
            setHomeProperty(homeProps[0]);
            setHeroContent({
              ...staticHeroData,
              backgroundImage: (homeProps[0].gallery && homeProps[0].gallery[0] && (homeProps[0].gallery[0].data || homeProps[0].gallery[0].url)) || staticHeroData.backgroundImage,
              title: homeProps[0].name,
              tagline: homeProps[0].tagline,
              infoChips: [
                { icon: 'location', text: homeProps[0].location },
                { icon: 'price', text: formatPriceRange(homeProps[0].priceRange) },
                { icon: 'bedroom', text: homeProps[0].keyHighlights?.unitConfiguration
                  ? homeProps[0].keyHighlights.unitConfiguration
                      .split(',')
                      .map(b => b.trim())
                      .filter(Boolean)
                      .join(', ')
                  : '' },
              ],
              ctaButtons: [
                { text: 'View Project', variant: 'primary', href: `/projects/${homeProps[0]._id}` },
                { text: 'Request Info', variant: 'secondary', href: '/contact' },
              ],
            });
          } else {
            setHomeProperty(null);
            setHeroContent(staticHeroData);
          }
        }
      });

    // Fetch property categories for property type options
    fetch('/api/property-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.categories)) {
          const options = data.categories.map((cat: { name: string }) => ({
            value: cat.name,
            label: cat.name,
          }));
          setPropertyTypeOptions([{ value: '', label: 'Select property type' }, ...options]);
        }
      });
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Build query string from filters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (propertyType) params.append('propertyType', propertyType);
    if (priceRange) params.append('priceRange', priceRange);
    if (status) params.append('status', status);
    router.push(`/search?${params.toString()}`);
  };

  // Use matched from props if provided (for controlled mode)
  const results = matchedProp !== undefined ? matchedProp : matched;
  const paginated = results.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(results.length / pageSize);

  if (!heroContent) return null;
  return (
    <>
      <section className="relative w-full h-auto min-h-[667px] md:min-h-0 md:h-[720px]">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)), 
                           linear-gradient(360deg, #1A1A1A -1.25%, rgba(26, 26, 26, 0.02) 41.94%), 
                           url(${backgroundImage})`,
            borderRadius: '0px',
          }}
        />
        
        <div className="relative z-10 flex flex-col justify-center md:justify-between h-full px-4 sm:px-6 lg:px-8 pt-50 md:pt-32 pb-12 md:pb-16">
          {/* Overlay for better text readability on mobile */}
          <div className="absolute inset-0 bg-black/40 md:bg-transparent z-[-1] rounded-none" />
          {/* Main Content */}
          <div className="flex flex-col gap-4 text-left md:text-left w-full max-w-md md:max-w-4xl mx-0">
            {(heroContent.tagline || badge) && (
              <div className="flex items-center justify-start w-fit bg-[#E50914] rounded-full px-4 py-1 mx-0">
                <span className="text-white text-xs font-semibold leading-5">
                  {heroContent.tagline || badge}
                </span>
              </div>
            )}

            {/* Main Heading */}
            <h1 className="text-white text-4xl sm:text-5xl lg:text-[60px] font-semibold leading-tight sm:leading-[1.1] font-['General_Sans'] w-full mx-0 md:mx-0 md:w-3/4">
              {title.split('\n').map((line: string, i: number) => (
                <React.Fragment key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>

            {/* Info Chips - each on its own line, left-aligned on mobile */}
            <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-0.5 md:gap-6 mt-2">
              {infoChips && infoChips.map((chip: { icon: string; text: string }, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-1 md:mb-0">
                  {getInfoIcon(chip.icon)}
                  <span className="text-[#F7F7F7] text-xs md:text-lg leading-5 md:leading-6 tracking-[0.03em] font-['Bricolage_Grotesque']">
                    {chip.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons - side by side, left-aligned, not full width on mobile */}
            <div className="flex flex-row gap-2 md:gap-4 mt-4 w-full pb-20 md:pb-0">
              {ctaButtons && ctaButtons.map((button, index) => (
                <button
                  key={index}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium font-['Bricolage_Grotesque'] text-xs md:text-base leading-6 ${
                    button.variant === 'primary'
                      ? 'bg-[#E50914] text-white'
                      : 'bg-white/20 backdrop-blur-md text-white'
                  }`}
                  onClick={() => {
                    if (button.text === 'Request Info') {
                      router.push('/contact');
                    }
                  }}
                  style={{ minWidth: 120 }}
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>

          {/* Search Filters */}
          <form onSubmit={handleSearch} className="w-full max-w-xs md:max-w-screen-lg mx-auto mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3 mb-3 md:mb-0 pt-0 md:pt-20">
              {/* Location */}
              <div className="relative w-full md:flex-1 md:min-w-[180px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {getInfoIcon('location')}
                </div>
                <input
                  type="text"
                  className="w-full h-9 md:h-12 pl-10 pr-4 bg-[#333333] text-white rounded-xl md:rounded-lg font-['Bricolage_Grotesque'] text-xs md:text-sm placeholder-[#9CA3AF] focus:outline-none"
                  placeholder="Search by location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
              {/* Property Type */}
              <div className="relative w-full md:flex-1 md:min-w-[180px] ">
                <select
                  className="w-full h-9 md:h-12 pl-4 pr-10 bg-[#333333] text-white rounded-xl md:rounded-lg appearance-none font-['Bricolage_Grotesque'] text-xs md:text-sm focus:outline-none"
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                >
                  {propertyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {getInfoIcon('dropdown')}
                </div>
              </div>
              {/* Price Range */}
              <div className="relative w-full md:flex-1 md:min-w-[180px]">
                <select
                  className="w-full h-9 md:h-12 pl-4 pr-10 bg-[#333333] text-white rounded-xl md:rounded-lg appearance-none font-['Bricolage_Grotesque'] text-xs md:text-sm focus:outline-none"
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value)}
                >
                  <option value="">Select price range</option>
                  {[...new Set(allProperties.map(p => formatPriceRange(p.priceRange)).filter(Boolean))].map((pr, i) => (
                    <option key={i} value={pr}>{pr}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {getInfoIcon('dropdown')}
                </div>
              </div>
              {/* Search Button */}
              <button type="submit" className="w-full md:w-auto flex items-center justify-center gap-2 h-9 md:h-12 px-4 md:px-6 py-2 md:py-3 text-white rounded-xl md:rounded-lg bg-[#E50914] font-['Bricolage_Grotesque'] text-xs md:text-sm font-medium leading-5 whitespace-nowrap">
                <FaSearch className="w-4 h-4" />
                Search
              </button>
            </div>
          </form>
          {/* Status Buttons Row */}
          <div className="flex flex-wrap justify-center gap-2 mt-0 pt-0 pb-0">
            {statusButtonOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  status === option.value ? 'bg-white text-[#0A0A0A]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                style={{ minWidth: 120 }}
                onClick={() => setStatus(option.value === status ? '' : option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Matched Properties Section */}
      {results.length > 0 && (
        <section className="w-full bg-[#1A1A1A] py-12 sm:py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-medium text-white font-['Bricolage_Grotesque'] tracking-wide">
                Matched Properties
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 pb-6 px-4 sm:px-6 lg:px-8">
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : paginated.length === 0 ? (
                <div className="text-gray-400">No properties found.</div>
              ) : (
                paginated.map((property) => (
                  <ProjectCard 
                    key={property._id}
                    project={{
                      id: property._id || '',
                      title: property.name,
                      location: property.location,
                      price: formatPriceRange(property.priceRange),
                      type: property.propertyType,
                      status: property.status as any,
                      image: (property.gallery && property.gallery[0] && (property.gallery[0].data || property.gallery[0].url)) || '',
                      bhk: property.keyHighlights?.unitConfiguration || '',
                      gallery: property.gallery
                    }}
                    className="w-[300px] sm:w-[390px] lg:w-[370px]"
                  />
                ))
              )}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <button
                  className={`mx-1 px-3 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                  onClick={() => page > 1 && setPage(page - 1)}
                  disabled={page === 1}
                >
                  {'<'}
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`mx-1 px-3 py-1 rounded border border-gray-700 ${page === i + 1 ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className={`mx-1 px-3 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                  onClick={() => page < totalPages && setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  {'>'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
      {/* Footer removed from Hero, should be rendered in main layout only */}
    </>
  );
};

export default Hero;
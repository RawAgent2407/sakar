'use client';

import React, { useEffect, useState } from 'react';
import ProjectCard from '@/components/property/ProjectCard';
import { Property } from '@/app/admin/types';
import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';

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

/**
 * A component that displays a horizontal scrolling list of residential properties.
 * 
 * @component
 * @returns {JSX.Element} The rendered ResidentialSpaces section
 * 
 * @example
 * ```tsx
 * <ResidentialSpaces />
 * ```
 * 
 * @description
 * This component displays a horizontally scrollable list of residential properties with:
 * - Property images
 * - Status badges
 * - Location information
 * - Pricing
 * - Property type and BHK configuration
 * - A 'See All' button that can be hooked up to navigate to a full listing page
 */
const ResidentialSpaces = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProperties(data.properties.filter((p: Property) => p.propertyType === 'Residential'));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusConfig: { [key: string]: { label: string; className: string } } = {
    'Ready': {
      label: 'Ready',
      className: 'bg-white text-black',
    },
    'Under Construction': {
      label: 'Under Construction',
      className: 'bg-white text-black',
    },
    'Upcoming': {
      label: 'Upcoming',
      className: 'bg-white text-black',
    },
  };

  return (
    <section className="w-full bg-[#1A1A1A] py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-medium text-white font-['Bricolage_Grotesque'] tracking-wide">
              Residential Spaces
            </h2>
            <Link 
              href="/residential"
              className="flex items-center text-white text-sm font-['Bricolage_Grotesque'] hover:opacity-80 transition-opacity underline"
            >
              See All
            </Link>
          </div>
        </div>
        <div className="relative w-full">
          <div className="w-full overflow-x-auto pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex space-x-4 sm:space-x-6 w-max pl-0 sm:pl-0 lg:pl-0 pr-4 sm:pr-6 lg:pr-8">
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : properties.length === 0 ? (
                <div className="text-gray-400">No residential properties found.</div>
              ) : (
                properties.map((property) => {
                  const status = statusConfig[property.status] || { label: property.status, className: 'bg-white text-black' };
                  return (
                    <Link key={property._id} href={`/projects/${property._id}`} className="block">
                      <div className="flex-none w-[300px] sm:w-[360px] bg-[#0A0A0A] rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                        {/* Image Container */}
                        <div className="relative w-full h-[150px] sm:h-[160px] bg-gray-800">
                          {property.gallery && property.gallery[0] && (property.gallery[0].data || property.gallery[0].url) && (
                            <Image
                              src={property.gallery[0].data || property.gallery[0].url}
                              alt={property.gallery[0].name || property.name}
                              fill
                              className="w-full h-full object-cover"
                            />
                          )}
                          {/* Status Badge */}
                          <div className="absolute left-4 bottom-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${status.className}`}>
                              {status.label}
                            </span>
                          </div>
                        </div>
                        {/* Details Container */}
                        <div className="p-3 sm:p-4 flex-1 flex flex-col">
                          <h3 className="text-white text-base sm:text-lg font-medium leading-snug sm:leading-7">
                            {property.name}
                          </h3>
                          <div className="flex items-center mt-1 text-[#E0E0E0] text-xs sm:text-sm">
                            <FaMapMarkerAlt className="w-4 h-4 text-[#9CA3AF] mr-1" />
                            <span>{property.location}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs sm:text-sm">
                            <span className="bg-white/10 text-white px-2 py-1 rounded-md">
                              {formatPriceRange(property.priceRange)}
                            </span>
                            <span className="text-[#E0E0E0]">
                              {property.keyHighlights.unitConfiguration
                                ? property.keyHighlights.unitConfiguration
                                    .split(',')
                                    .map(b => b.trim())
                                    .filter(Boolean)
                                    .join(', ')
                                : ''}
                            </span>
                          </div>
                          <div className="mt-2 text-xs sm:text-sm text-[#E0E0E0]">
                            {property.tagline}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, #1A1A1A, rgba(26, 26, 26, 0))',
            }}
          />
        </div>
      </div>
      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar { display: none; }
        .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ResidentialSpaces;

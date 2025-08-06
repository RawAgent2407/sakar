'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Property } from '@/app/admin/types';

/**
 * Configuration for different project status types in the featured projects section.
 * Maps status keys to their display labels and corresponding CSS classes.
 */
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
 * A card component that displays information about a featured project.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {typeof featuredProjects[0]} props.project - The project data to display
 * @returns {JSX.Element} The rendered ProjectCard component
 * 
 * @example
 * ```tsx
 * <ProjectCard project={featuredProjects[0]} />
 * ```
 */
const ProjectCard = ({ property, cardClassName }: { property: Property; cardClassName?: string }) => {
  const status = statusConfig[property.status] || { label: property.status, className: 'bg-white text-black' };
  return (
    <Link 
      href={`/projects/${property._id}`}
      className={`flex-none ${cardClassName || 'w-[300px] sm:w-[360px] lg:w-[420px]'} bg-[#0A0A0A] rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300`}
    >
      {/* Image Container */}
      <div className="relative w-full h-[160px] sm:h-[180px] bg-gray-800">
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
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="text-white text-base sm:text-lg font-medium leading-snug sm:leading-7 tracking-wide">
          {property.name}
        </h3>
        <div className="flex items-center mt-1 text-[#E0E0E0] text-sm">
          <FaMapMarkerAlt className="w-4 h-4 text-[#9CA3AF] mr-1" />
          <span>{property.location}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm bg-white/10 text-white px-2 py-1 rounded-md">
            {formatPriceRange(property.priceRange)}
          </span>
        </div>
        {/* <div className="mt-2 text-sm text-[#E0E0E0]">
          {property.tagline}
        </div> */}
      </div>
    </Link>
  );
};

/**
 * A component that displays a horizontal scrolling list of featured real estate projects.
 * 
 * @component
 * @returns {JSX.Element} The rendered FeaturedProjects section
 * 
 * @example
 * ```tsx
 * <FeaturedProjects />
 * ```
 * 
 * @description
 * This component displays a horizontally scrollable list of featured projects with:
 * - Project images
 * - Status badges
 * - Location information
 * - Pricing
 * - Property type and BHK configuration
 */
const FeaturedProjects = ({ onShowAll }: { onShowAll?: (show: boolean) => void }) => {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [all, setAll] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    setLoading(true);
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeatured(data.properties.filter((p: any) => p.featured));
          setAll(data.properties);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (onShowAll) onShowAll(showAll);
  }, [showAll, onShowAll]);

  const paginated = showAll
    ? all.slice((page - 1) * pageSize, page * pageSize)
    : featured;
  const totalPages = showAll ? Math.ceil(all.length / pageSize) : 1;

  return (
    <section className="w-full bg-[#1A1A1A] py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-medium text-white font-['Bricolage_Grotesque'] tracking-wide">
              Featured Projects
            </h2>
            <button 
              className="flex items-center text-white text-sm font-['Bricolage_Grotesque'] hover:opacity-80 transition-opacity underline"
              onClick={() => { setShowAll(!showAll); setPage(1); }}
            >
              {showAll ? 'Show Featured' : 'See All'}
            </button>
          </div>
        </div>
        <div className="relative w-full">
          {showAll ? (
            <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : paginated.length === 0 ? (
                <div className="text-gray-400">No properties found.</div>
              ) : (
                paginated.map((property) => (
                  <ProjectCard key={property._id} property={property} cardClassName="w-full" />
                ))
              )}
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex space-x-4 sm:space-x-6 w-max pl-0 sm:pl-0 lg:pl-0 pr-4 sm:pr-6 lg:pr-8">
                {loading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : paginated.length === 0 ? (
                  <div className="text-gray-400">No properties found.</div>
                ) : (
                  paginated.map((property) => (
                    <ProjectCard key={property._id} property={property} />
                  ))
                )}
              </div>
            </div>
          )}
          {showAll && totalPages > 1 && (
            <div className="max-w-screen-xl mx-auto flex justify-center mt-8">
              <button
                className={`mx-1 px-3 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 ${page === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
              >
                {'<'}
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`mx-1 px-3 py-1 rounded border ${page === i + 1 ? 'bg-red-600 text-white border-red-600' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
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
          {!showAll && (
            <div 
              className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 pointer-events-none"
              style={{
                background: 'linear-gradient(to left, #1A1A1A, rgba(26, 26, 26, 0))',
              }}
            />
          )}
        </div>
      </div>
      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar { display: none; }
        .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default FeaturedProjects;

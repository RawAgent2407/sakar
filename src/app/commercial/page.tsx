"use client";
import React, { useEffect, useState } from "react";
import ProjectCard from "@/components/property/ProjectCard";
import { Property } from "@/app/admin/types";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
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

const CommercialPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProperties(data.properties.filter((p: Property) => p.propertyType === "Commercial"));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) =>
    p.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'asc') {
      const aPrice = parseFloat((formatPriceRange(a.priceRange).match(/([\d.]+)/g) || [])[0] || '0');
      const bPrice = parseFloat((formatPriceRange(b.priceRange).match(/([\d.]+)/g) || [])[0] || '0');
      return aPrice - bPrice;
    } else if (sortOrder === 'desc') {
      const aPrice = parseFloat((formatPriceRange(a.priceRange).match(/([\d.]+)/g) || [])[0] || '0');
      const bPrice = parseFloat((formatPriceRange(b.priceRange).match(/([\d.]+)/g) || [])[0] || '0');
      return bPrice - aPrice;
    }
    return 0;
  });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#181818] text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-10 mt-8 leading-tight font-['Bricolage_Grotesque']">
            All Commercial Properties
          </h1>
          <div className="bg-[#181818] rounded-xl shadow border border-[#232323] px-4 py-5 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full">
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
              className="h-12 px-4 rounded-lg bg-[#222] text-white text-base focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-72 shadow-sm"
              />
            <div className="flex flex-col gap-4 w-full sm:w-auto">
              <span className="font-semibold text-base text-gray-100 text-center sm:text-left">Sort by price:</span>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                  className={`h-12 w-full sm:w-auto px-5 rounded-lg bg-[#222] text-white text-base font-medium flex items-center justify-center gap-2 shadow-sm transition hover:bg-[#232323] focus:ring-2 focus:ring-red-500 ${sortOrder === 'asc' ? 'ring-2 ring-red-500' : ''}`}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'default' : 'asc')}
              >
                <FaSortAmountDown /> Low to High
              </button>
              <button
                  className={`h-12 w-full sm:w-auto px-5 rounded-lg bg-[#222] text-white text-base font-medium flex items-center justify-center gap-2 shadow-sm transition hover:bg-[#232323] focus:ring-2 focus:ring-red-500 ${sortOrder === 'desc' ? 'ring-2 ring-red-500' : ''}`}
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'default' : 'desc')}
              >
                <FaSortAmountUp /> High to Low
              </button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : sorted.length === 0 ? (
            <div className="text-gray-400">No commercial properties found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sorted.map((property) => {
                const status = statusConfig[property.status] || { label: property.status, className: 'bg-white text-black' };
                return (
                <Link key={property._id} href={`/projects/${property._id}`} className="block">
                    <div className="flex-none w-full sm:w-[360px] bg-[#0A0A0A] rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
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
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CommercialPage; 
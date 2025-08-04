"use client";
import React, { useEffect, useState } from "react";
import ProjectCard from "@/components/property/ProjectCard";
import { Property } from "@/app/admin/types";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { formatPriceRange } from '@/components/property/ProjectCard';

const LuxuryPage = () => {
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
          setProperties(data.properties.filter((p: Property) => p.propertyType === "Luxury"));
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
      const aPrice = parseFloat((a.priceRange.match(/([\d.]+)/g) || [])[0] || '0');
      const bPrice = parseFloat((b.priceRange.match(/([\d.]+)/g) || [])[0] || '0');
      return aPrice - bPrice;
    } else if (sortOrder === 'desc') {
      const aPrice = parseFloat((a.priceRange.match(/([\d.]+)/g) || [])[0] || '0');
      const bPrice = parseFloat((b.priceRange.match(/([\d.]+)/g) || [])[0] || '0');
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
            All Luxury Properties
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
            <div className="text-gray-400">No luxury properties found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sorted.map((property) => (
                <Link key={property._id} href={`/projects/${property._id}`} className="block">
                  <div className="flex-none w-full sm:w-[360px] bg-[#0A0A0A] rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                  <ProjectCard project={{
                    id: property._id || '',
                    title: property.name,
                    location: property.location,
                    price: formatPriceRange(property.priceRange),
                    type: property.propertyType,
                    status: ([
                      'new-launch',
                      'rera-approved',
                      'ready-to-move',
                      'prime-location',
                      'retail-space',
                      'co-working',
                      'industrial',
                    ].includes(property.status)
                      ? property.status
                      : 'new-launch') as any,
                    image:
                      (property.gallery && property.gallery[0] && (property.gallery[0].data || property.gallery[0].url)) || '',
                    bhk: property.keyHighlights.unitConfiguration
                      ? property.keyHighlights.unitConfiguration
                          .split(',')
                          .map(b => b.trim())
                          .filter(Boolean)
                          .join(', ')
                      : '',
                  }} tagPosition="bottom" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LuxuryPage; 
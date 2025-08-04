"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProjectCard from "@/components/property/ProjectCard";
import Footer from "@/components/common/Footer";
import Navigation from "@/components/common/Navigation";
import { Property } from "@/app/admin/types";
import { formatPriceRange } from '@/components/property/ProjectCard';
import Link from "next/link";

const pageSize = 6;

// Property type options will be fetched from API
const statusButtonOptions = [
  { value: 'Ready', label: 'Ready' },
  { value: 'Under Construction', label: 'Under Construction' },
  { value: 'Upcoming', label: 'Upcoming' },
];
const selectionFilters = [
  { key: 'readyToMove', label: 'Ready to Move', value: 'Ready' },
  { key: 'reraApproved', label: 'RERA Approved', value: 'RERA Approved' },
  { key: 'newLaunch', label: 'New Launch', value: 'New Launch' },
];

export default function SearchPage() {
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All Types' }]);
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "");
  const [priceRange, setPriceRange] = useState(searchParams.get("priceRange") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(searchParams.getAll("filter"));

  useEffect(() => {
    setLoading(true);
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProperties(data.properties);
        setLoading(false);
      });
    // Fetch property categories for property type options
    fetch("/api/property-categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories)) {
          setPropertyTypeOptions([{ value: '', label: 'All Types' }, ...data.categories.map((cat: { name: string }) => ({ value: cat.name, label: cat.name }))]);
        }
      });
  }, []);

  let filtered = properties;
  if (location) filtered = filtered.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()));
  if (propertyType) filtered = filtered.filter((p) => p.propertyType === propertyType);
  if (priceRange) filtered = filtered.filter((p) => {
    const pr = typeof p.priceRange === 'string' ? p.priceRange : JSON.stringify(p.priceRange);
    return pr === priceRange;
  });
  if (status) filtered = filtered.filter((p) => p.status === status);
  selectedFilters.forEach((f) => {
    if (["Ready", "New Launch", "RERA Approved", "Under Construction", "Upcoming"].includes(f)) {
      filtered = filtered.filter((p) => p.status === f);
    }
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleFilter = () => {
    setPage(1);
  };
  const handleSelectionFilter = (filterValue: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterValue)
        ? prev.filter((v) => v !== filterValue)
        : [...prev, filterValue]
    );
    setPage(1);
  };

  return (
    <>
      <Navigation />
      <section className="w-full bg-[#1A1A1A] py-12 sm:py-16 min-h-[60vh]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-white font-['Bricolage_Grotesque'] tracking-wide mb-8 pt-8">
            Search Results
          </h2>
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3 mb-3 px-4">
            <input
              type="text"
              className="w-full md:flex-1 h-12 pl-4 pr-4 bg-[#333333] text-white rounded-lg font-['Bricolage_Grotesque'] text-sm placeholder-[#9CA3AF] focus:outline-none"
              placeholder="Search by location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div className="relative w-full md:flex-1 md:min-w-[180px]">
            <select
                className="w-full h-12 pl-4 pr-10 bg-[#333333] text-white rounded-lg appearance-none font-['Bricolage_Grotesque'] text-sm focus:outline-none"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              {propertyTypeOptions.map((option: { value: string; label: string }) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="relative w-full md:flex-1 md:min-w-[180px]">
            <select
                className="w-full h-12 pl-4 pr-10 bg-[#333333] text-white rounded-lg appearance-none font-['Bricolage_Grotesque'] text-sm focus:outline-none"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Select price range</option>
                {[...new Set(properties.map((p) => typeof p.priceRange === 'string' ? p.priceRange : JSON.stringify(p.priceRange)).filter(Boolean))].map((pr, i) => (
                <option key={i} value={pr}>
                    {formatPriceRange(typeof pr === 'string' && pr.startsWith('{') ? JSON.parse(pr) : pr)}
                </option>
              ))}
            </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              className="w-full md:w-auto flex items-center justify-center gap-2 h-12 px-6 py-3 text-white rounded-lg bg-[#E50914] font-['Bricolage_Grotesque'] text-sm font-medium leading-5 whitespace-nowrap"
              onClick={handleFilter}
              type="button"
            >
              Filter
            </button>
          </div>
          {/* Status Buttons Row */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 mt-1">
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
          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 pb-6 px-4 sm:px-6 lg:px-8 w-full">
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : paginated.length === 0 ? (
              <div className="text-gray-400">No properties found.</div>
            ) : (
              paginated.map((property) => (
                <Link href={`/projects/${property._id}`} key={property._id} className="block">
                <ProjectCard
                  project={{
                    id: property._id || '',
                    title: property.name,
                    location: property.location,
                      price: formatPriceRange(property.priceRange),
                    type: property.propertyType,
                    status: property.status as any,
                    image:
                      (property.gallery && property.gallery[0] && (property.gallery[0].data || property.gallery[0].url)) || '',
                    bhk: property.keyHighlights?.unitConfiguration
                      ? property.keyHighlights.unitConfiguration
                          .split(',')
                          .map(b => b.trim())
                          .filter(Boolean)
                          .join(', ')
                      : '',
                    gallery: property.gallery,
                  }}
                    className="w-[300px] sm:w-[390px] lg:w-[370px] cursor-pointer hover:shadow-2xl transition-shadow duration-200"
                />
                </Link>
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
      <Footer />
    </>
  );
} 
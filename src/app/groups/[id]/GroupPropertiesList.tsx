"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PAGE_SIZE = 9;

export default function GroupPropertiesList({ properties }: { properties: any[] }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const filteredProperties = properties.filter((property: any) =>
    property.name.toLowerCase().includes(search.toLowerCase()) ||
    (property.location && property.location.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredProperties.length / PAGE_SIZE);
  const paginated = filteredProperties.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when search changes
  React.useEffect(() => { setPage(1); }, [search]);

  return (
    <>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search properties by name or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-[#222] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginated.length === 0 ? (
          <div className="text-gray-400 col-span-full">No properties found.</div>
        ) : (
          paginated.map((property: any) => (
            <Link key={property._id} href={`/projects/${property._id}`} className="bg-[#181818] rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-40 bg-gray-800">
                {property.gallery && property.gallery[0] && (property.gallery[0].data || property.gallery[0].url) && (
                  <Image
                    src={property.gallery[0].data || property.gallery[0].url}
                    alt={property.gallery[0].name || property.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-white text-lg font-medium mb-1">{property.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{property.location}</p>
                <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-md w-fit">
                  {property.priceRange && typeof property.priceRange === 'object'
                    ? `${property.priceRange.from.value} ${property.priceRange.from.unit} to ${property.priceRange.to.value} ${property.priceRange.to.unit}`
                    : property.priceRange}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            className="px-4 py-2 rounded bg-[#222] text-white disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-white">{page} / {totalPages}</span>
          <button
            className="px-4 py-2 rounded bg-[#222] text-white disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
} 
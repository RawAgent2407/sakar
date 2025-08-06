'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * A component that displays a collection of locations with their respective property counts.
 * 
 * @component
 * @returns {JSX.Element} The rendered LocationCollections section
 * 
 * @example
 * ```tsx
 * <LocationCollections />
 * ```
 * 
 * @description
 * This component displays a horizontally scrollable list of locations with:
 * - Location images with gradient overlays
 * - Location titles
 * - Property counts for each location
 * - Interactive hover effects
 * - A 'See All' button that can be hooked up to navigate to a full locations page
 */
const LocationCollections = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch('/api/groups')
      .then(res => res.json())
      .then(data => {
        if (data.success) setGroups(data.groups);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-[#1A1A1A] py-8 sm:py-12 lg:py-14">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-medium text-white font-['Bricolage_Grotesque'] tracking-wide">
              Groups
            </h2>
            <button
              className="flex items-center text-white text-sm font-['Bricolage_Grotesque'] hover:opacity-80 transition-opacity underline"
              onClick={() => router.push('/groups')}
            >
              See All
            </button>
          </div>
        </div>
        <div className="relative w-full">
          <div className="w-full overflow-x-auto pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex space-x-4 sm:space-x-6 w-max pl-0 sm:pl-0 lg:pl-0 pr-4 sm:pr-6 lg:pr-8">
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : groups.length === 0 ? (
                <div className="text-gray-400">No groups found.</div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group._id}
                    className="flex-none w-[260px] h-[200px] sm:w-[310px] sm:h-[240px] bg-[#1A1A1A] rounded-lg shadow-lg overflow-hidden relative group cursor-pointer"
                    onClick={() => router.push(`/groups/${group._id}`)}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                      {group.photo ? (
                        <Image
                          src={group.photo}
                          alt={group.name}
                          layout="fill"
                          objectFit="cover"
                          className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{ background: 'linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%)' }}
                    />
                    {/* Group Info */}
                    <div className="absolute left-4 bottom-4 z-10">
                      <h3 className="text-white text-base sm:text-lg font-medium font-['General_Sans'] tracking-wide">
                        {group.name}
                      </h3>
                      <p className="text-[#E0E0E0] text-xs sm:text-sm font-['Bricolage_Grotesque'] mt-1">
                        {group.properties.length} Properties
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div
            className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #1A1A1A, rgba(26, 26, 26, 0))' }}
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

export default LocationCollections;

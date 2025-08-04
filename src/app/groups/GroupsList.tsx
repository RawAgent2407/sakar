"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PAGE_SIZE = 6;

export default function GroupsList({ groups }: { groups: any[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(groups.length / PAGE_SIZE);
  const paginated = groups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginated.length === 0 ? (
          <div className="text-gray-400 col-span-full">No groups found.</div>
        ) : (
          paginated.map((group) => (
            <Link
              key={group._id}
              href={`/groups/${group._id}`}
              className="flex-none w-full bg-[#1A1A1A] rounded-lg shadow-lg overflow-hidden relative group cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-[200px] bg-gray-800">
                {group.photo && (
                  <Image
                    src={group.photo}
                    alt={group.name}
                    fill
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-white text-lg font-medium mb-1">{group.name}</h3>
                <p className="text-[#E0E0E0] text-sm">{group.properties.length} Properties</p>
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
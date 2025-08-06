import React from 'react';
import ProjectCard from '@/components/property/ProjectCard';
import Navigation from '@/components/common/Navigation';
import Footer from '@/components/common/Footer';
import { headers } from 'next/headers';
import Link from 'next/link';

interface Props {
  params: { name: string };
}

async function fetchPropertiesByCategory(category: string) {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/properties`, { cache: 'no-store' });
  const data = await res.json();
  if (!data.success) return [];
  const normalizedCategory = category.trim().toLowerCase();
  return data.properties.filter((p: any) =>
    typeof p.propertyType === 'string' &&
    p.propertyType.trim().toLowerCase() === normalizedCategory
  );
}

export default async function CategoryPage({ params }: Props) {
  const { name } = await params;
  const properties = await fetchPropertiesByCategory(decodeURIComponent(name));

  return (
    <>
      <Navigation />
      <section className="w-full bg-[#1A1A1A] py-12 sm:py-16 min-h-[60vh]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-white font-['Bricolage_Grotesque'] tracking-wide mb-8 pt-8">
            {name} Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 pb-6 pl-0 pr-4 sm:pr-6 lg:pr-8">
            {properties.length === 0 ? (
              <div className="text-gray-400 col-span-full">No properties found in this category.</div>
            ) : (
              properties.map((property: any) => (
                <Link key={property._id} href={`/projects/${property._id}`} className="block">
                <ProjectCard
                  project={{
                    id: property._id || '',
                    title: property.name,
                    location: property.location,
                    price: property.priceRange,
                    type: property.propertyType,
                    status: property.status as any,
                    image:
                      (property.gallery && property.gallery[0] && (property.gallery[0].data || property.gallery[0].url)) || '',
                    bhk: property.keyHighlights?.unitConfiguration || '',
                    gallery: property.gallery,
                  }}
                    className="w-[300px] sm:w-[390px] lg:w-[370px] cursor-pointer hover:shadow-2xl transition-shadow duration-200"
                />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
} 
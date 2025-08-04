import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import Navigation from '@/components/common/Navigation';
import Footer from '@/components/common/Footer';
import GroupPropertiesList from './GroupPropertiesList';

async function getGroup(id: string) {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const url = `${protocol}://${host}/api/groups/${id}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.group;
}

const GroupDetailPage = async ({ params }: { params: { id: string } }) => {
  const awaitedParams = await params;
  const group = await getGroup(awaitedParams.id);

  if (!group) {
    return <div className="p-8 text-white">Group not found.</div>;
  }

  return (
    <>
      <Navigation />
      <main className="w-full bg-[#1A1A1A] min-h-screen py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8 pt-10">{group.name}</h1>
          <GroupPropertiesList properties={group.properties} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GroupDetailPage; 
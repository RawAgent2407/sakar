import Navigation from '@/components/common/Navigation';
import Footer from '@/components/common/Footer';
import GroupsList from './GroupsList';
import { headers } from 'next/headers';

async function getGroups() {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const url = `${protocol}://${host}/api/groups`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  return data.groups || [];
}

export default async function GroupsPage() {
  const groups = await getGroups();

  return (
    <>
      <Navigation />
      <main className="w-full bg-[#1A1A1A] min-h-screen py-12 sm:py-16 lg:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8 pt-16">All Groups</h1>
          <GroupsList groups={groups} />
        </div>
      </main>
      <Footer />
    </>
  );
} 
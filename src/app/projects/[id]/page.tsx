import { notFound } from 'next/navigation';
import Navigation from '@/components/common/Navigation';
import Footer from '@/components/common/Footer';
import { Property } from '@/app/admin/types';
import { headers } from 'next/headers';
import ProjectHero from '@/sections/projects/ProjectHero';
import KeyHighlights from '@/sections/projects/KeyHighlights';
import ProjectGallery from '@/sections/projects/ProjectGallery';
import LocationAdvantages from '@/sections/projects/LocationAdvantages';
import FeaturedDevelopment from '@/sections/projects/FeaturedDevelopment';
import InquirySection from '@/sections/projects/InquirySection';
import RelatedProjects from '@/sections/projects/RelatedProjects';

interface Props {
  params: { id: string };
}

function getBaseUrl() {
  return (async () => {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    return `${protocol}://${host}`;
  })();
}

async function fetchProperty(id: string): Promise<Property | null> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/properties`, { cache: 'no-store' });
  const data = await res.json();
  if (!data.success) return null;
  return data.properties.find((p: Property) => p._id === id) || null;
}

export default async function ProjectDetail({ params }: Props) {
  const { id } = await params;
  const property = await fetchProperty(id);
  if (!property) notFound();

  // Map property fields to the original component props as best as possible
  return (
    <>
      <Navigation />
      {/* Hero Section */}
      <ProjectHero
        title={property.name}
        tagline={property.tagline}
        location={property.location}
        priceRange={property.priceRange}
        bhk={property.keyHighlights.unitConfiguration}
        image={property.gallery[0]?.data || property.gallery[0]?.url || ''}
        builderWebsite={property.builder.websiteUrl}
      />
      {/* Key Highlights Section */}
      <KeyHighlights
        highlights={property.keyHighlights}
      />
      {/* Project Gallery */}
      <ProjectGallery
        gallery={property.gallery}
        videos={property.videos}
      />
      {/* Location & Advantages */}
      <LocationAdvantages
        address={property.locationAdvantage.address}
        addressUrl={property.locationAdvantage.addressUrl}
        advantages={property.locationAdvantage.advantages}
      />
      {/* Featured Development */}
      <FeaturedDevelopment
        text={property.featuredDevelopment.text}
        images={property.featuredDevelopment.images}
      />
      {/* Inquiry Section */}
      <InquirySection
        developerName={property.builder.developerName}
        websiteUrl={property.builder.websiteUrl}
        defaultPropertyType={property.propertyType}
        defaultPropertyId={property._id}
      />
      {/* Related Projects */}
      <RelatedProjects
        otherProjects={property.otherProjects}
      />
      <Footer />
    </>
  );
}

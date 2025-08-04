'use client';

import Image from 'next/image';
import { FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import { projectPageContent, projectHeroStyles, backgroundStyles } from '@/data/project-page';

interface ProjectHeroProps {
  title: string;
  tagline?: string;
  location: string;
  priceRange?: string;
  bhk?: string;
  image: string | { src: string };
  builderWebsite?: string;
}

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

export default function ProjectHero({ title, tagline, location, priceRange, bhk, image, builderWebsite }: ProjectHeroProps) {
  const imageSrc = typeof image === 'string' ? image : image.src;
  const formattedPrice = formatPriceRange(priceRange);
  const priceDisplay = `₹ ${formattedPrice && formattedPrice.trim() !== '' ? formattedPrice : '-'}`;
        const formattedBHK = bhk
          ? bhk.split(',').map(b => b.trim()).filter(Boolean).join(', ')
          : '';

  // Scroll to gallery section
  const handleViewGallery = () => {
    if (typeof window !== 'undefined') {
      const gallerySection = document.getElementById('project-gallery');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={projectHeroStyles.container}>
      {/* Background Image with Gradient Overlay */}
      <div 
        className={projectHeroStyles.background}
        style={{
          backgroundImage: `url(${imageSrc})`,
          ...backgroundStyles
        }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover opacity-0"
          priority
          sizes="100vw"
        />
      </div>

      <div className={projectHeroStyles.contentContainer}>
        <div className={projectHeroStyles.contentWrapper}>
          <div className={projectHeroStyles.glassCard}>
            {/* Status Badge */}
            {tagline && (
              <div className={projectHeroStyles.statusBadge}>
                {tagline}
              </div>
            )}

            {/* Project Title */}
            <h1 className={projectHeroStyles.title}>{title}</h1>

            {/* Project Meta */}
            <div className={projectHeroStyles.metaContainer}>
              <div className={projectHeroStyles.metaItem}>
                <FaMapMarkerAlt className="mr-2" />
                <span>{location}</span>
              </div>
              <div className={projectHeroStyles.metaItem}>
                <span className="font-medium">{priceDisplay}</span>
              </div>
              {formattedBHK && (
                <div className={projectHeroStyles.metaItem}>
                  <FaHome className="mr-2" />
                  <span>{formattedBHK}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={projectHeroStyles.buttonContainer}>
              {builderWebsite ? (
                <a href={builderWebsite} target="_blank" rel="noopener noreferrer" className={projectHeroStyles.primaryButton}>
                  {projectPageContent.ctaButtons.contactDeveloper}
                </a>
              ) : (
                <button className={projectHeroStyles.primaryButton} disabled>
                  {projectPageContent.ctaButtons.contactDeveloper}
                </button>
              )}
              <button className={projectHeroStyles.secondaryButton} onClick={handleViewGallery} type="button">
                {projectPageContent.ctaButtons.viewGallery}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

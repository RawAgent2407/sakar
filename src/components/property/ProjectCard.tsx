import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';

/**
 * Configuration for different project status types.
 * Maps status keys to their display labels and corresponding CSS classes.
 */
const statusConfig = {
  'new-launch': {
    label: 'New Launch',
    className: 'bg-white text-black',
  },
  'rera-approved': {
    label: 'RERA Approved',
    className: 'bg-white text-black',
  },
  'ready-to-move': {
    label: 'Ready to Move',
    className: 'bg-white text-black',
  },
  'prime-location': {
    label: 'Prime Location',
    className: 'bg-white text-black',
  },
  'retail-space': {
    label: 'Retail Space',
    className: 'bg-white text-black',
  },
  'co-working': {
    label: 'Co-Working',
    className: 'bg-white text-black',
  },
  'industrial': {
    label: 'Industrial',
    className: 'bg-white text-black',
  },
  'upcoming': {
    label: 'Upcoming',
    className: 'bg-yellow-400 text-black',
  },
  'under-construction': {
    label: 'Under Construction',
    className: 'bg-orange-400 text-black',
  },
  // Add more statuses as needed
};

/**
 * Properties for the ProjectCard component.
 * 
 * @interface ProjectCardProps
 * @property {Object} project - The project data to display
 * @property {string} project.id - Unique identifier for the project
 * @property {string} project.title - Name/title of the project
 * @property {string} project.location - Location of the project
 * @property {string} project.price - Formatted price string (e.g., '₹4.3-8.5 Cr')
 * @property {string} project.type - Type of property (e.g., 'Prime 3 BHK flats')
 * @property {keyof typeof statusConfig} project.status - Project status from predefined config
 * @property {string} project.image - URL or path to the project image
 * @property {string} project.bhk - Number of bedrooms (e.g., '2 BHK', '3 BHK')
 * @property {string} [className] - Additional CSS classes for custom styling
 * @property {'top' | 'bottom'} [tagPosition='top'] - Position of the status tag
 */
interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    location: string;
    price: string;
    type: string;
    status: keyof typeof statusConfig;
    image: string;
    bhk: string;
    gallery?: any[]; // Add gallery as optional, type can be improved if needed
  };
  className?: string;
  tagPosition?: 'top' | 'bottom';
}

export function formatPriceRange(price: any): string {
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

/**
 * A card component that displays information about a real estate project.
 * 
 * @component
 * @param {ProjectCardProps} props - The component props
 * @param {Object} props.project - The project data to display
 * @param {string} [props.className=''] - Additional CSS classes for custom styling
 * @param {'top'|'bottom'} [props.tagPosition='top'] - Position of the status tag
 * @returns {JSX.Element} The rendered ProjectCard component
 * 
 * @example
 * ```tsx
 * <ProjectCard 
 *   project={{
 *     id: '1',
 *     title: 'Luxury Apartments',
 *     location: 'Downtown',
 *     price: '$1.2M - $2.5M',
 *     type: 'Luxury Condos',
 *     status: 'new-launch',
 *     image: '/projects/luxury-apt.jpg',
 *     bhk: '3 BHK'
 *   }}
 *   className="custom-class"
 *   tagPosition="bottom"
 * />
 * ```
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  className = '',
  tagPosition = 'top'
}) => {
  const status = statusConfig[project.status] || statusConfig['new-launch'];
  
  return (
    <div className={`flex-none w-[300px] sm:w-[360px] bg-[#0A0A0A] rounded-lg shadow-lg overflow-hidden flex flex-col ${className}`}>
      {/* Image Container */}
      <div className="relative w-full h-[150px] sm:h-[160px] bg-gray-800">
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        )}
        {/* If using gallery directly, prefer data (base64) over url */}
        {project.gallery && project.gallery[0] && (project.gallery[0].data || project.gallery[0].url) && (
          <Image
            src={project.gallery[0].data || project.gallery[0].url}
            alt={project.gallery[0].name || project.title}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        )}
        {/* Status Badge */}
        <div className={`absolute left-4 ${tagPosition === 'top' ? 'top-4' : 'bottom-4'}`}>
          <span className={`px-2 py-1 text-xs font-medium rounded ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>
      {/* Details Container */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="text-white text-base sm:text-lg font-medium leading-snug sm:leading-7">
          {project.title}
        </h3>
        <div className="flex items-center mt-1 text-[#E0E0E0] text-xs sm:text-sm">
          <FaMapMarkerAlt className="w-4 h-4 text-[#9CA3AF] mr-1" />
          <span>{project.location}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs sm:text-sm">
          <span className="bg-white/10 text-white px-2 py-1 rounded-md">
            {formatPriceRange(project.price)}
          </span>
          <span className="text-[#E0E0E0]">
            {project.bhk
              ? project.bhk
                  .split(',')
                  .map(b => b.trim())
                  .filter(Boolean)
                  .join(', ')
              : ''}
          </span>
        </div>
        <div className="mt-2 text-xs sm:text-sm text-[#E0E0E0]">
          {project.type}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

import { StaticImageData } from 'next/image';

/**
 * Represents a featured real estate project with comprehensive details
 * @interface Project
 * @property {string} id - Unique identifier for the project
 * @property {string} title - Name of the project
 * @property {string} location - Geographic location of the project
 * @property {string} price - Formatted price range (e.g., '₹1.5 Cr - ₹2.5 Cr')
 * @property {string} type - Type of project (e.g., 'Residential', 'Commercial', 'Mixed-Use')
 * @property {'new-launch'|'rera-approved'|'ready-to-move'} status - Current status of the project
 * @property {StaticImageData|string} image - Project's featured image (can be static import or path string)
 * @property {string} [developer] - Name of the developer/construction company (optional)
 * @property {string} [possession] - Expected possession date (optional)
 * @property {string[]} [amenities] - List of amenities available (optional)
 * @property {string} [description] - Brief description of the project (optional)
 * @property {string} [reraId] - RERA registration ID (optional)
 * @example
 * {
 *   id: 'fp1',
 *   title: 'The Sovereign',
 *   location: 'Gachibowli, Hyderabad',
 *   price: '₹1.5 Cr - ₹2.5 Cr',
 *   type: 'Residential',
 *   status: 'new-launch',
 *   image: '/projects/sovereign.jpg',
 *   developer: 'ABC Developers',
 *   possession: 'Dec 2025',
 *   amenities: ['Swimming Pool', 'Gym', 'Club House'],
 *   reraId: 'P123456789'
 * }
 */
export interface Project {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: 'new-launch' | 'rera-approved' | 'ready-to-move';
  image: StaticImageData | string;
  bhk: string;
  developer?: string;
  possession?: string;
  amenities?: string[];
  description?: string;
  reraId?: string;
}

/**
 * Array of featured real estate projects
 * @type {Project[]}
 * @description Contains a collection of premium real estate projects that are
 *              currently being featured on the platform. These projects are
 *              typically highlighted due to their unique features, prime locations,
 *              or special offerings.
 * @example
 * // Get all ready-to-move projects
 * const readyProjects = featuredProjects.filter(project => project.status === 'ready-to-move');
 *
 * // Get project by ID
 * function getProjectById(id: string) {
 *   return featuredProjects.find(project => project.id === id);
 * }
 */
export const featuredProjects: Project[] = [
  {
    id: '1',
    title: 'The Sovereign',
    location: 'Thaltej',
    price: '₹ 4.3–8.5 Cr',
    type: 'Prime 3 BHK flats',
    status: 'new-launch',
    image: '/featured/i1.png',
    bhk: '3 BHK',
  },
  {
    id: '2',
    title: 'Adani Augusta Tragad',
    location: 'Tragad',
    price: '₹ 1.12–1.42 Cr',
    type: 'Under-construction 3 BHK',
    status: 'ready-to-move',
    image: '/featured/i2.png',
    bhk: '3 BHK',
  },
  {
    id: '3',
    title: 'Adani Embrace Shantigram',
    location: 'Shantigram',
    price: '₹ 1.29–2.67 Cr',
    type: 'Spacious 3 BHK',
    status: 'rera-approved',
    image: '/featured/i3.png',
    bhk: '3 BHK',
  },
  {
    id: '4',
    title: 'Canary Wharf Residences',
    location: 'Canary Wharf, London',
    price: '₹1.3M - ₹4.1M',
    type: 'Luxury Apartments',
    status: 'new-launch',
    image: '/featured/i4.png',
    bhk: '2-4 BHK',
  },
];

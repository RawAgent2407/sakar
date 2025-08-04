/**
 * Represents a commercial real estate property
 * @interface CommercialSpace
 * @property {string} id - Unique identifier for the commercial property
 * @property {string} title - Name or title of the commercial property
 * @property {string} location - Geographic location of the property
 * @property {string} price - Formatted price string (e.g., '₹2.5 Cr')
 * @property {string} type - Type of commercial space (e.g., 'Office', 'Retail', 'Warehouse')
 * @property {'new-launch'|'rera-approved'|'ready-to-move'|'prime-location'|'industrial'|'retail-space'|'co-working'} status - Current status of the property
 * @property {string} image - Path to the property's featured image
 * @property {string} size - Formatted size/area of the property (e.g., '2000 sq.ft.')
 * @example
 * {
 *   id: 'cs1',
 *   title: 'Tech Park Office Space',
 *   location: 'Hitech City',
 *   price: '₹2.5 Cr',
 *   type: 'Office Space',
 *   status: 'ready-to-move',
 *   image: '/commercial/tech-park.jpg',
 *   size: '2000 sq.ft.'
 * }
 */
export interface CommercialSpace {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: 'new-launch' | 'rera-approved' | 'ready-to-move' | 'prime-location' | 'industrial' | 'retail-space' | 'co-working';
  image: string;
  size: string;
}

export const commercialSpaces: CommercialSpace[] = [
  {
    id: 'c1',
    title: 'Business Bay',
    location: 'Dubai, UAE',
    price: '₹120/sq ft',
    type: 'Office Space',
    status: 'prime-location',
    image: '/commercial/i1.png',
    size: '5,000 - 50,000 sq ft'
  },
  {
    id: 'c2',
    title: 'Oxford Street',
    location: 'London, UK',
    price: '₹250/sq ft',
    type: 'Retail Space',
    status: 'retail-space',
    image: '/commercial/i2.png',
    size: '1,000 - 10,000 sq ft'
  },
  {
    id: 'c3',
    title: 'Silicon Oasis',
    location: 'Dubai, UAE',
    price: '₹80/sq ft',
    type: 'Co-Working',
    status: 'co-working',
    image: '/commercial/i3.png',
    size: 'Flexible Desks & Offices'
  },
  {
    id: 'c4',
    title: 'JAFZA',
    location: 'Dubai, UAE',
    price: '₹45/sq ft',
    type: 'Industrial',
    status: 'industrial',
    image: '/commercial/i4.png',
    size: '10,000 - 100,000 sq ft'
  },
  {
    id: 'c5',
    title: 'Canary Wharf',
    location: 'London, UK',
    price: '₹180/sq ft',
    type: 'Office Space',
    status: 'prime-location',
    image: '/commercial/i5.png',
    size: '2,000 - 20,000 sq ft'
  }
];

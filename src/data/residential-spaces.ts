/**
 * Represents a residential real estate property
 * @interface ResidentialSpace
 * @property {string} id - Unique identifier for the residential property
 * @property {string} title - Name or title of the residential property
 * @property {string} location - Geographic location of the property
 * @property {string} price - Formatted price string (e.g., '₹1.2 Cr')
 * @property {string} type - Type of residential space (e.g., 'Apartment', 'Villa', 'Plot')
 * @property {'new-launch'|'rera-approved'|'ready-to-move'|'prime-location'|'luxury'|'premium'} status - Current status of the property
 * @property {string} image - Path to the property's featured image
 * @property {string} bhk - Number of Bedrooms, Hall, and Kitchen (e.g., '2 BHK', '3 BHK', '4 BHK')
 * @example
 * {
 *   id: 'rs1',
 *   title: 'Luxury Apartment',
 *   location: 'Banjara Hills',
 *   price: '₹1.2 Cr',
 *   type: 'Apartment',
 *   status: 'ready-to-move',
 *   image: '/residential/luxury-apt.jpg',
 *   bhk: '3 BHK'
 * }
 */
export interface ResidentialSpace {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: 'new-launch' | 'rera-approved' | 'ready-to-move' | 'prime-location';
  image: string;
  bhk: string;
}

export const residentialSpaces: ResidentialSpace[] = [
  {
    id: '1',
    title: 'Adani The North Park',
    location: 'Adani\'s Shantigram township',
    price: '₹25/sq ft',
    type: 'Residential',
    status: 'new-launch',
    image: '/residential/i1.png',
    bhk: '4/5/6-BHK villas'
  },
  {
    id: '2',
    title: 'Shalin Boulevard',
    location: 'SG Highway',
    price: '₹120/sq ft',
    type: 'Residential',
    status: 'ready-to-move',
    image: '/residential/i2.png',
    bhk: '~4,050 sq ft'
  },
  {
    id: '3',
    title: 'True The North',
    location: 'Navrangpura',
    price: '₹45/sq ft',
    type: 'Residential',
    status: 'rera-approved',
    image: '/residential/i3.png',
    bhk: '4 BHK units'
  },
  {
    id: '4',
    title: 'Galaxy KP Villas',
    location: 'SG Highway',
    price: '₹75/sq ft',
    type: 'Residential',
    status: 'prime-location',
    image: '/residential/i4.png',
    bhk: '5 BHK villas'
  },
  {
    id: '5',
    title: 'Kensington Hotel',
    location: 'Kensington, London',
    price: '₹15.5M',
    type: 'Luxury Hotel',
    status: 'prime-location',
    image: '/residential/i5.png',
    bhk: '45 Rooms'
  }
];

/**
 * Represents a collection of properties in a specific location
 * @interface LocationCollection
 * @property {string} id - Unique identifier for the location collection
 * @property {string} title - Name of the location/neighborhood
 * @property {number} propertyCount - Number of available properties in this location
 * @property {string} image - Path to the location's featured image
 */
export interface LocationCollection {
  id: string;
  title: string;
  propertyCount: number;
  image: string;
}

/**
 * Array of location-based property collections
 * @type {LocationCollection[]}
 * @description Contains a collection of real estate locations with their property counts
 *              and featured images, typically used for location-based browsing
 * @example
 * // Filter locations with more than 50 properties
 * const popularLocations = locationCollections.filter(loc => loc.propertyCount > 50);
 */
export const locationCollections: LocationCollection[] = [
  {
    id: 'l1',
    title: 'SG Highway',
    propertyCount: 245,
    image: '/locations/i1.png',
  },
  {
    id: 'l2',
    title: 'Gift City',
    propertyCount: 128,
    image: '/locations/i2.png',
  },
  {
    id: 'l3',
    title: 'Shantigram, Jagatpur',
    propertyCount: 96,
    image: '/locations/i3.png',
  },
  {
    id: 'l4',
    title: 'Satellite',
    propertyCount: 82,
    image: '/locations/i4.png',
  },
];

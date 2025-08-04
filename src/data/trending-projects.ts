/**
 * Represents a trending real estate project with its key details
 * @interface TrendingProject
 * @property {number} id - Unique identifier for the project
 * @property {string} title - Name of the project
 * @property {string} location - Geographic location of the project
 * @property {string} image - Path to the project's featured image
 * @property {number} rank - Current ranking in the trending list (1-10)
 */
export interface TrendingProject {
  id: number;
  title: string;
  location: string;
  image: string;
  rank: number;
}

/**
 * Array of trending real estate projects
 * @type {TrendingProject[]}
 * @description Contains a collection of real estate projects that are currently trending,
 *              sorted by their popularity and market interest
 * @example
 * // Get the top 3 trending projects
 * const topThree = trendingProjects.slice(0, 3);
 */
export const trendingProjects: TrendingProject[] = [
  {
    id: 1,
    title: "The Shard Residences",
    location: "London Bridge",
    image: "/trending/i1.png",
    rank: 1
  },
  {
    id: 2,
    title: "Battersea Power Station",
    location: "Battersea, London",
    image: "/trending/i2.png",
    rank: 2
  },
  {
    id: 3,
    title: "One Blackfriars",
    location: "South Bank",
    image: "/trending/i3.png",
    rank: 3
  },
  {
    id: 4,
    title: "The Corniche",
    location: "Nine Elms",
    image: "/trending/i4.png",
    rank: 4
  },
  {
    id: 5,
    title: "The Madison",
    location: "Tower Bridge",
    image: "/trending/i5.png",
    rank: 5
  },
  {
    id: 6,
    title: "Embassy Gardens",
    location: "Nine Elms",
    image: "/trending/i6.png",
    rank: 6
  },
  {
    id: 7,
    title: "The Atlas Building",
    location: "Shoreditch",
    image: "/trending/i7.png",
    rank: 7
  },
  {
    id: 8,
    title: "The Stratford",
    location: "Stratford",
    image: "/trending/i8.png",
    rank: 8
  },
  {
    id: 9,
    title: "Wardian London",
    location: "Canary Wharf",
    image: "/trending/i9.png",
    rank: 9
  },
  {
    id: 10,
    title: "The Broadway",
    location: "Westminster",
    image: "/trending/i10.png",
    rank: 10
  }
];

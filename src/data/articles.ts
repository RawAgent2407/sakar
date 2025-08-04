/**
 * Represents a real estate article with its metadata
 * @interface Article
 * @property {number} id - Unique identifier for the article
 * @property {string} title - Title of the article
 * @property {string} date - Publication date in 'DD MMM YYYY' format
 * @property {string} image - Path to the article's featured image
 * @property {string} category - Category of the article (e.g., 'Commercial', 'Investment')
 */
export interface Article {
  id: number;
  title: string;
  date: string;
  image: string;
  category: string;
}

/**
 * Array of trending real estate articles
 * @type {Article[]}
 * @description Contains a collection of articles that are currently trending in the real estate market
 */
export const trendingArticles: Article[] = [
  {
    id: 1,
    title: "A Guide to Choosing the Right Commercial Property in Vaishnodevi, Ahmedabad",
    date: "12 Sep 2024",
    image: "/articles/i1.png",
    category: "Commercial"
  },
  {
    id: 2,
    title: "Why Offices in Vaishnodevi Are the Ideal Choice for High-End Businesses",
    date: "12 Sep 2024",
    image: "/articles/i2.png",
    category: "Commercial"
  },
  {
    id: 3,
    title: "The Future of Real Estate Investment: Trends and Predictions",
    date: "12 Sep 2024",
    image: "/articles/i3.png",
    category: "Investment"
  }
];

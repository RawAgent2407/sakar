import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  _id?: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  content: string[];
  images: { url: string; name: string; data: string }[];
  featured?: boolean;
  coverImage?: { url: string; name: string; data: string };
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <Link 
      href={`/articles/${article._id}`} 
      className="flex flex-col h-full group"
    >
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-800">
        {article.coverImage?.data || article.coverImage?.url ? (
          <Image
            src={article.coverImage.data || article.coverImage.url}
            alt={article.coverImage.name || article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : article.images && article.images[0] && (article.images[0].data || article.images[0].url) ? (
          <Image
            src={article.images[0].data || article.images[0].url}
            alt={article.images[0].name || article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-white text-lg font-medium leading-snug line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-400 text-sm mt-2">
          {article.date} • {article.readTime}
        </p>
      </div>
    </Link>
  );
};

const ArticlesSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Sort by date in descending order (newest first) and take first 3 featured articles
          const featured = data.articles
            .filter((a: Article) => a.featured)
            .sort((a: Article, b: Article) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
          setArticles(featured);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-[#1A1A1A] py-12 sm:py-16 lg:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0 font-['Bricolage_Grotesque']">
              Featured Articles
            </h2>
            <Link 
              href="/articles"
              className="text-white text-sm hover:opacity-80 transition-opacity underline font-['Bricolage_Grotesque']"
            >
              View All Articles
            </Link>
          </div>
          
          {loading ? (
            <div className="text-gray-400">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="text-gray-400">No featured articles found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {articles.map((article) => (
                <div key={article._id} className="h-full">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;

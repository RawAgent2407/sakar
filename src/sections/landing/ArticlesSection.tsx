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
    <Link href={`/articles/${article._id}`} className="flex flex-col w-[300px] sm:w-[360px] lg:w-[418.67px] flex-shrink-0">
      <div className="relative w-full h-[200px] sm:h-[240px] lg:h-[280px] rounded-lg overflow-hidden">
        {article.coverImage?.data || article.coverImage?.url ? (
          <Image
            src={article.coverImage.data || article.coverImage.url}
            alt={article.coverImage.name || article.title}
            fill
            className="object-cover"
          />
        ) : article.images && article.images[0] && (article.images[0].data || article.images[0].url) ? (
          <Image
            src={article.images[0].data || article.images[0].url}
            alt={article.images[0].name || article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-white text-base sm:text-lg font-medium leading-snug sm:leading-7">
          {article.title}
        </h3>
        <p className="text-white text-xs sm:text-sm mt-2 underline">
          {article.date}
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
          setArticles(data.articles.filter((a: Article) => a.featured));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-[#1A1A1A] py-12 sm:py-16 lg:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-4 sm:mb-0">
            Featured Articles
          </h2>
          <Link 
            href="/articles"
            className="flex items-center text-white text-sm font-['Bricolage_Grotesque'] hover:opacity-80 transition-opacity underline"
          >
            See All
          </Link>
        </div>
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex gap-4 sm:gap-7 overflow-x-auto pb-6 px-4 sm:px-6 lg:px-8 scrollbar-hide">
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : articles.length === 0 ? (
              <div className="text-gray-400">No featured articles found.</div>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;

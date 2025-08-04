'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/data/articles';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/common/Navigation';
import Footer from '@/components/common/Footer';

const PAGE_SIZE = 8;

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success) setArticles(data.articles);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const paginated = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#181818] text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 mt-8 leading-tight">
            The thinking, ideas<br />and technology<br />behind World.
          </h1>
          <h2 className="text-lg font-medium mb-6">Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : paginated.length === 0 ? (
              <div className="text-gray-400">No articles found.</div>
            ) : (
              paginated.map((article: any, idx: number) => (
                <Link key={article._id || idx} href={`/articles/${article._id}`} className="group block">
                  <div className="w-full h-[250px] aspect-[16/10] bg-[#F3F3F3] rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    {article.coverImage?.data || article.coverImage?.url ? (
                      <Image
                        src={article.coverImage.data || article.coverImage.url}
                        alt={article.coverImage.name || article.title}
                        width={400}
                        height={250}
                        className="object-cover w-full h-full"
                      />
                    ) : article.images && article.images[0] && (article.images[0].data || article.images[0].url) ? (
                      <Image
                        src={article.images[0].data || article.images[0].url}
                        alt={article.images[0].name || article.title}
                        width={400}
                        height={250}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="text-base font-medium text-white group-hover:underline mb-1 truncate">
                    {article.title}
                  </div>
                  <div className="text-xs text-gray-400">{article.date}</div>
                </Link>
              ))
            )}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button
              className="px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              {'<'}
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded border border-gray-700 ${page === i + 1 ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              {'>'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 
'use client';

import React from 'react';
import Image from 'next/image';
import { GalleryItem, VideoItem } from '@/app/admin/types';

interface ProjectGalleryProps {
  gallery: GalleryItem[];
  videos: VideoItem[];
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  // Match standard and share YouTube URLs
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ gallery, videos }) => {
  const [activeTab, setActiveTab] = React.useState<'photos' | 'videos'>('photos');

  return (
    <section id="project-gallery" className="w-full bg-black">
      <div className="mx-auto px-4 sm:px-8 md:px-16 py-10 md:py-20">
        <div className="flex flex-col gap-8 w-full">
          {/* Header */}
          <div className="flex justify-between items-center w-full relative z-10">
            <h2 className="text-2xl font-medium text-white font-['Bricolage_Grotesque']">
              Gallery
            </h2>
            <div className="flex gap-4">
              <button 
                className={`px-4 py-2 ${activeTab === 'photos' ? 'text-white border-b-2 border-white' : 'text-white/50'}`}
                onClick={() => setActiveTab('photos')}
              >
                <span className="text-lg font-normal">Photos</span>
              </button>
              <button 
                className={`px-4 py-2 ${activeTab === 'videos' ? 'text-white border-b-2 border-white' : 'text-white/50'}`}
                onClick={() => setActiveTab('videos')}
              >
                <span className="text-lg font-normal">Videos</span>
              </button>
            </div>
          </div>
          {/* Gallery Grid */}
          <div className="relative">
            {activeTab === 'photos' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {gallery.length === 0 ? (
                  <div className="text-gray-400 col-span-4">No photos available.</div>
                ) : (
                  gallery.map((image, idx) => (
                    <div key={idx} className="relative h-40 md:h-48 rounded overflow-hidden">
                      <Image
                        src={image.data || image.url}
                        alt={image.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-end p-4 hover:bg-black/50 transition-colors">
                        <span className="text-white font-medium">{image.name}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {videos.length === 0 ? (
                  <div className="text-gray-400 col-span-4">No videos available.</div>
                ) : (
                  videos.map((video, idx) => {
                    const embedUrl = getYouTubeEmbedUrl(video.url);
                    return (
                      <div key={idx} className="relative h-40 md:h-48 rounded overflow-hidden flex flex-col items-center justify-center bg-[#181818]">
                        {embedUrl ? (
                          <iframe
                            width="100%"
                            height="100%"
                            src={embedUrl}
                            title={video.name || 'YouTube video'}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full rounded"
                          />
                        ) : (
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-white underline text-center">
                            {video.name || video.url}
                          </a>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
            {/* Gradient overlay for scroll effect */}
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black to-transparent pointer-events-none -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;

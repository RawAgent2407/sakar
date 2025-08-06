
//   return (
//     <section className="w-full bg-black px-4 sm:px-8 md:px-16 py-10 md:py-20">
//       <div className="mx-auto flex flex-col gap-6">
//         {/* Header */}
//         <div className="flex flex-col gap-2 w-full">
//           <h2 className="text-2xl font-medium text-white font-['Bricolage_Grotesque']">
//             Featured Development
//           </h2>
//           <p className="text-[#F3F3F3] text-lg font-light leading-relaxed max-w-[1312px]">
//             {text || 'No description provided.'}
//           </p>
//         </div>
//         {/* Image Grid */}
//         <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
//           {images && images.length > 0 ? (
//             images.map((img, idx) => (
//               <div key={idx} className="relative h-32 w-full md:h-48 md:w-100 rounded-lg overflow-hidden mb-3 md:mb-0">
//                 <Image
//                   src={img.data || img.url || ''}
//                   alt={img.name || `Development showcase ${idx + 1}`}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-400">No images provided.</div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedDevelopment;


import React from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/app/admin/types';

interface FeaturedDevelopmentProps {
  text: string;
  images: GalleryItem[];
}

const FeaturedDevelopment: React.FC<FeaturedDevelopmentProps> = ({ text, images }) => {
  return (
    <section className="w-full bg-black px-4 sm:px-8 md:px-16 py-10 md:py-20">
      <div className="mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-2xl font-medium text-white font-['Bricolage_Grotesque']">
            Featured Development
          </h2>
          <p className="text-[#F3F3F3] text-lg font-light leading-relaxed max-w-[1312px]">
            {text || 'No description provided.'}
          </p>
        </div>

        {/* Image Grid */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
          {images && images.length > 0 ? (
            images.map((img, idx) => {
              const imageUrl = img?.data || img?.url || null;

              if (!imageUrl) return null; // Skip rendering if no valid URL

              return (
                <div
                  key={idx}
                  className="relative h-32 w-full md:h-48 md:w-100 rounded-lg overflow-hidden mb-3 md:mb-0"
                >
                  <Image
                    src={imageUrl}
                    alt={img.name || `Development showcase ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })
          ) : (
            <div className="text-gray-400">No images provided.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDevelopment;

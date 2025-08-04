// 'use client';

// import Hero from "@/sections/landing/Hero";
// import FeaturedProjects from "@/sections/landing/FeaturedProjects";
// import ResidentialSpaces from "@/sections/landing/ResidentialSpaces";
// import CommercialSpaces from "@/sections/landing/CommercialSpaces";
// import LocationCollections from "@/sections/landing/LocationCollections";
// import TrendingProjects from "@/sections/landing/TrendingProjects";
// import ArticlesSection from "@/sections/landing/ArticlesSection";
// import Navigation from "@/components/common/Navigation";
// import Footer from "@/components/common/Footer";
// import React, { useState } from 'react';
// import HomeContactModal from '@/components/common/HomeContactModal';
// import { Property } from '@/app/admin/types';

// export default function Home() {
//   const [searchActive, setSearchActive] = useState(false);
//   const [matched, setMatched] = useState<Property[]>([]);

//   return (
//     <>
//       <HomeContactModal />
//       <Navigation />
//       <Hero 
//         onSearch={(results: Property[]) => {
//           setMatched(results);
//           setSearchActive(results.length > 0);
//         }}
//         searchActive={searchActive}
//         matched={matched}
//       />
//       {!searchActive && <FeaturedProjects />}
//       {!searchActive && <ResidentialSpaces />}
//       {!searchActive && <CommercialSpaces />}
//       {!searchActive && <LocationCollections />}
//       {!searchActive && <TrendingProjects />}
//       {!searchActive && <ArticlesSection />}
//       <Footer />
//     </>
//   );
// }
'use client';

import Hero from "@/sections/landing/Hero";
import FeaturedProjects from "@/sections/landing/FeaturedProjects";
import ResidentialSpaces from "@/sections/landing/ResidentialSpaces";
import CommercialSpaces from "@/sections/landing/CommercialSpaces";
import LocationCollections from "@/sections/landing/LocationCollections";
import TrendingProjects from "@/sections/landing/TrendingProjects";
import ArticlesSection from "@/sections/landing/ArticlesSection";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import React, { useState } from 'react';
import HomeContactModal from '@/components/common/HomeContactModal';
import { Property } from '@/app/admin/types';

export default function Home() {
  const [searchActive, setSearchActive] = useState(false);
  const [matched, setMatched] = useState<Property[]>([]);

  return (
    <div className="bg-[#0A0A0A] min-h-screen overflow-x-hidden">
      <HomeContactModal />
      <Navigation />
      <Hero 
        onSearch={(results: Property[]) => {
          setMatched(results);
          setSearchActive(results.length > 0);
        }}
        searchActive={searchActive}
        matched={matched}
      />
      {!searchActive && <FeaturedProjects />}
      {!searchActive && <ResidentialSpaces />}
      {!searchActive && <CommercialSpaces />}
      {!searchActive && <LocationCollections />}
      {!searchActive && <TrendingProjects />}
      {!searchActive && <ArticlesSection />}
      <Footer />
    </div>
  );
}

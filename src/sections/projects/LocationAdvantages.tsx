'use client';

import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface LocationAdvantagesProps {
  address: string;
  addressUrl: string;
  advantages: string[];
}

const LocationAdvantages: React.FC<LocationAdvantagesProps> = ({ address, addressUrl, advantages }) => {
  return (
    <section className="w-full bg-black px-4 sm:px-8 md:px-16 py-10 md:py-20">
      <div className=" mx-auto">
        <div className="flex flex-col gap-6 max-w-[1280px] mx-auto">
          <h2 className="text-2xl font-medium text-white font-['Bricolage_Grotesque']">
            Location & Proximity Highlights
          </h2>
          {address && (
            <div className="flex items-center gap-2 text-lg text-white bg-[#181818] rounded px-4 py-2 w-fit">
              <FaMapMarkerAlt className="text-[#E50914] w-5 h-5" />
              <span>{address}</span>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Map Section */}
            <div className="relative w-full md:w-[66%] h-[220px] md:h-[372px] rounded-lg overflow-hidden bg-gray-200">
              {addressUrl ? (
                <iframe
                  src={addressUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, width: '100%', height: '100%' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No map available</div>
              )}
            </div>
            {/* Advantages List */}
            <div className="w-full md:w-[32%] bg-[#0A0A0A] rounded-lg p-6 md:p-8 shadow-[0px_4px_4px_rgba(0,0,0,0.25),inset_0px_2px_4px_rgba(255,255,255,0.12)] mt-6 md:mt-0">
              <h3 className="text-white text-xl font-semibold mb-6">Proximity Highlights</h3>
              <div className="space-y-4">
                {advantages && advantages.length > 0 ? (
                  advantages.map((adv, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="mt-0.5">
                        {/* You can add an icon here if you want */}
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                      </div>
                      <div>
                        <p className="text-[#A5A5A5] text-sm">{adv}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No advantages listed.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationAdvantages;

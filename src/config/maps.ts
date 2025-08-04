// Google Maps configuration
export const GOOGLE_MAPS_API_KEY = 'AIzaSyB-roFuoAYOFg7N4qU8gz5o68AkToQZD9k';

export const MAP_CONFIG = {
  defaultCenter: {
    lat: 23.0225,  // Ahmedabad coordinates
    lng: 72.5714
  },
  defaultZoom: 14,
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID // Optional: Add your styled map ID here if you have one
};

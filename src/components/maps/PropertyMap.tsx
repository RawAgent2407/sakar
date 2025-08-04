'use client';

import React, { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, MAP_CONFIG } from '@/config/maps';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden'
};

const mapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'on' }]
  },
  {
    featureType: 'landscape',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#444444' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#f2f2f2' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9e8fe' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }]
  }
];

const PropertyMap = () => {
  const [selected, setSelected] = React.useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Create marker configuration with enhanced red highlight
  const markerIcon = React.useMemo(() => {
    if (typeof window === 'undefined' || !window.google) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
        '<svg width="40" height="54" viewBox="0 0 40 54" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<!-- Outer glow -->' +
        '<circle cx="20" cy="20" r="18" fill="rgba(255,0,0,0.2)" filter="url(#glow)"/>' +
        '<!-- Marker shadow -->' +
        '<ellipse cx="20" cy="48" rx="8" ry="2" fill="rgba(0,0,0,0.2)" filter="url(#shadow)"/>' +
        '<!-- Main marker body -->' +
        '<path d="M20 0C9 0 0 9 0 20C0 35 20 54 20 54C20 54 40 35 40 20C40 9 31 0 20 0Z" fill="%23FF0000"/>' +
        '<!-- Inner highlight -->' +
        '<path d="M20 4C11.2 4 4 11.2 4 20C4 28.8 20 46 20 46C20 46 36 28.8 36 20C36 11.2 28.8 4 20 4Z" fill="%23FF3333"/>' +
        '<!-- Center dot with highlight -->' +
        '<circle cx="20" cy="20" r="6" fill="white" filter="url(#highlight)"/>' +
        '<!-- SVG Filters -->' +
        '<defs>' +
        '  <filter id="glow" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse">' +
        '    <feGaussianBlur stdDeviation="2" result="blur"/>' +
        '    <feComposite in="SourceGraphic" in2="blur" operator="over"/>' +
        '  </filter>' +
        '  <filter id="shadow" x="10" y="46" width="20" height="6" filterUnits="userSpaceOnUse">' +
        '    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>' +
        '    <feOffset dy="1" result="offsetblur"/>' +
        '    <feComponentTransfer>' +
        '      <feFuncA type="linear" slope="0.2"/>' +
        '    </feComponentTransfer>' +
        '    <feMerge>' +
        '      <feMergeNode/>' +
        '      <feMergeNode in="SourceGraphic"/>' +
        '    </feMerge>' +
        '  </filter>' +
        '  <filter id="highlight" x="10" y="10" width="20" height="20" filterUnits="userSpaceOnUse">' +
        '    <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>' +
        '    <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.5" specularExponent="10" lighting-color="white" result="specOut">' +
        '      <fePointLight x="5" y="5" z="10"/>' +
        '    </feSpecularLighting>' +
        '    <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"/>' +
        '    <feComposite in="SourceGraphic" in2="litPaint" operator="over"/>' +
        '  </filter>' +
        '</defs>' +
        '</svg>'
      ),
      scaledSize: new window.google.maps.Size(40, 54),
      anchor: new window.google.maps.Point(20, 54),
      labelOrigin: new window.google.maps.Point(20, 12)
    };
  }, []);

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    try {
      // Store the map instance
      setMap(map);
      
      // Create bounds and extend to include our marker
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(MAP_CONFIG.defaultCenter);
      
      // Add some padding around the marker
      const padding = 0.01; // degrees
      bounds.extend({
        lat: MAP_CONFIG.defaultCenter.lat + padding,
        lng: MAP_CONFIG.defaultCenter.lng + padding
      });
      bounds.extend({
        lat: MAP_CONFIG.defaultCenter.lat - padding,
        lng: MAP_CONFIG.defaultCenter.lng - padding
      });
      
      // Fit bounds with padding
      map.fitBounds(bounds);
      
      // Set a maximum zoom level
      const listener = window.google.maps.event.addListenerOnce(map, 'idle', function() {
        // Set a minimum zoom level to ensure marker is visible
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 15) {
          map.setZoom(15);
        } else if (currentZoom && currentZoom < 12) {
          map.setZoom(12);
        }
      });
      
      setIsLoaded(true);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to load map. Please try again later.');
    }
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
    setIsLoaded(false);
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .pulsing-marker {
          animation: pulse 2s infinite;
          transform-origin: center bottom;
        }
      `}</style>
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        libraries={['places']}
        loadingElement={
          <div className="absolute inset-0 bg-[#E8E8E8] rounded-lg flex items-center justify-center">
            <div className="text-black">Loading map...</div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={MAP_CONFIG.defaultCenter}
          zoom={MAP_CONFIG.defaultZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
              position: window.google?.maps?.ControlPosition?.RIGHT_TOP || 5,
            },
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            mapTypeId: 'roadmap',
            clickableIcons: false,
            gestureHandling: 'greedy',
            minZoom: 10,
            maxZoom: 18,
          }}
        >
          {markerIcon && (
            <div className="pulsing-marker">
              <Marker
                position={MAP_CONFIG.defaultCenter}
                onClick={() => setSelected(MAP_CONFIG.defaultCenter)}
                icon={markerIcon}
                label=""
              />
            </div>
          )}

          {selected && (
            <InfoWindow
              position={selected}
              onCloseClick={() => setSelected(null)}
            >
              <div className="p-2">
                <p className="text-sm font-medium">The Skyline Residences</p>
                <p className="text-xs">Ahmedabad, Gujarat</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default PropertyMap;

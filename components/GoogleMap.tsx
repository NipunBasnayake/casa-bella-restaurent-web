/// <reference path="../types/google-maps.d.ts" />
'use client';
import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: string;
}

export default function GoogleMap({
  address = '123 Bella Ave, Cityville, CA 90000',
  lat = 34.0522,  // Default: Los Angeles coordinates
  lng = -118.2437,
  zoom = 15,
  height = '400px',
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      setError('Google Maps API key not configured');
      setIsLoading(false);
      return;
    }

    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Define callback in global scope
      (window as any).initMap = initMap;
      
      script.onerror = () => {
        setError('Failed to load Google Maps');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current) return;

      try {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        // Add marker
        new google.maps.Marker({
          position: { lat, lng },
          map,
          title: 'Casa Bella Ristorante',
          animation: google.maps.Animation.DROP,
        });

        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, [lat, lng, zoom]);

  if (error) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ color: '#8B0000', marginBottom: '1rem' }}>Casa Bella Ristorante</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Get Directions
          </a>
          <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            zIndex: 1,
          }}
        >
          <p style={{ color: '#666' }}>Loading map...</p>
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

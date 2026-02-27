'use client';

import { useEffect, useRef } from 'react';

export default function RiderMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;
    let L: any;

    const initMap = async () => {
      if (!mapRef.current || map) return;

      L = await import('leaflet');
      
      map = L.map(mapRef.current).setView([20.0080, 73.7860], 14);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const riderIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#3b82f6;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;">🛵</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([20.0080, 73.7860], { icon: riderIcon })
        .addTo(map)
        .bindPopup('Your Location');

      const restaurantIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#ef4444;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;">🍔</div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([20.0062, 73.7879], { icon: restaurantIcon })
        .addTo(map)
        .bindPopup('Pickup Location');

      const homeIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#22c55e;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;">🏠</div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([20.0100, 73.7850], { icon: homeIcon })
        .addTo(map)
        .bindPopup('Delivery Location');

      const routeLine = L.polyline([
        [20.0080, 73.7860],
        [20.0100, 73.7850],
      ], { color: '#3b82f6', weight: 4, opacity: 0.7 }).addTo(map);
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full bg-gray-800 rounded-xl"
      style={{ minHeight: '192px' }}
    />
  );
}

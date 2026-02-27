'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOrderStore } from '@/components/store/orderStore';

const RESTAURANT_COORDS = { lat: 20.0062, lng: 73.7879 };
const USER_COORDS = { lat: 20.0100, lng: 73.7850 };

export function OrderTrackingMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { currentOrder, orders } = useOrderStore();
  
  const order = currentOrder || orders.find(o => o.id === orderId);
  
  const [riderPosition, setRiderPosition] = useState({ lat: 20.0080, lng: 73.7860 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current || (window as any).L) return;
      
      const L = (window as any).L = await import('leaflet');
      
      const map = L.map(mapRef.current).setView([20.0080, 73.7860], 14);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const restaurantIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#ef4444;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;">🍽️</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const userIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#22c55e;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;">🏠</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const riderIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#3b82f6;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;">🚴</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng], { icon: restaurantIcon })
        .addTo(map)
        .bindPopup('Restaurant');

      L.marker([USER_COORDS.lat, USER_COORDS.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('Delivery Address');

      const riderMarker = L.marker([riderPosition.lat, riderPosition.lng], { icon: riderIcon })
        .addTo(map)
        .bindPopup('Rider');

      (window as any).__riderMarker = riderMarker;
      (window as any).__map = map;
      setMapLoaded(true);
    };

    loadMap();

    return () => {
      if ((window as any).__map) {
        (window as any).__map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !order) return;

    if (order.status === 'on_the_way' || order.status === 'picked') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          const newProgress = prev + 2;
          const newLat = RESTAURANT_COORDS.lat + (USER_COORDS.lat - RESTAURANT_COORDS.lat) * (newProgress / 100);
          const newLng = RESTAURANT_COORDS.lng + (USER_COORDS.lng - RESTAURANT_COORDS.lng) * (newProgress / 100);
          
          setRiderPosition({ lat: newLat, lng: newLng });
          
          if ((window as any).__riderMarker) {
            (window as any).__riderMarker.setLatLng([newLat, newLng]);
          }
          
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mapLoaded, order?.status]);

  if (!order) return null;

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="h-full w-full" />
      
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
              🚴
            </div>
            <div>
              <div className="font-medium">Your Rider</div>
              <div className="text-sm text-gray-500">
                {order.status === 'on_the_way' ? 'On the way' : 'Picked up order'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-primary-500">
              {Math.max(0, order.estimatedDeliveryTime - Math.floor(progress / 5))} min
            </div>
            <div className="text-xs text-gray-500">ETA</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Order } from '../types';
import { calculateDistance } from '../utils';

// Custom icons using DivIcon for a professional "App Pin" style (like foodpanda/inDrive)
const createAppPin = (iconSvg: string, color: string) => L.divIcon({
  html: `
    <div class="relative flex flex-col items-center group">
      <!-- Pulsing Ring -->
      <div class="absolute w-12 h-12 rounded-full animate-pulse opacity-20 -translate-y-4" style="background-color: ${color}"></div>
      
      <!-- Teardrop Pin -->
      <div class="relative w-12 h-12 rounded-full rounded-bl-none rotate-45 flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.3)] border-[3px] border-white transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1" style="background-color: ${color}">
        <!-- Icon (Counter-rotated) -->
        <div class="-rotate-45 text-white flex items-center justify-center drop-shadow-md">
          ${iconSvg}
        </div>
      </div>
      <!-- Shadow -->
      <div class="w-4 h-1 bg-black/20 rounded-full blur-[3px] mt-2 transition-all duration-500 group-hover:scale-x-150 group-hover:opacity-30"></div>
    </div>
  `,
  className: 'app-pin-marker',
  iconSize: [48, 64],
  iconAnchor: [24, 60],
  popupAnchor: [0, -54]
});

// Rider Marker (inDrive style)
const createRiderMarker = (color: string = '#10b981') => L.divIcon({
  html: `
    <div class="relative flex items-center justify-center group">
      <!-- Pulsing Rings -->
      <div class="absolute w-16 h-16 rounded-full animate-ping opacity-30" style="background-color: ${color}"></div>
      <div class="absolute w-12 h-12 rounded-full animate-pulse opacity-50" style="background-color: ${color}"></div>
      
      <!-- Outer Circle -->
      <div class="relative w-12 h-12 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.3)] flex items-center justify-center border-[3px] transition-all duration-500 group-hover:scale-110" style="border-color: ${color}">
        <!-- Inner Circle with Icon -->
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-inner" style="background-color: ${color}">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15h.01"/><path d="M14 15h.01"/><path d="M16 10H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Z"/><path d="M15 6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4h10V6Z"/><path d="M10 10v4"/><path d="M14 10v4"/></svg>
        </div>
      </div>
      
      <!-- Direction Arrow -->
      <div class="absolute -top-2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[10px] transition-all duration-500 group-hover:-top-3" style="border-bottom-color: ${color}"></div>
    </div>
  `,
  className: 'rider-marker',
  iconSize: [64, 64],
  iconAnchor: [32, 32],
  popupAnchor: [0, -32]
});

// SVG Icons for pins
const restaurantSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>';
const martSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
const homeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';

const riderIcon = createRiderMarker('#10b981'); // inDrive Green
const restaurantIcon = createAppPin(restaurantSvg, '#FF6B00'); // FoodieExpress Orange
const martIcon = createAppPin(martSvg, '#FF6B00');
const homeIcon = createAppPin(homeSvg, '#3b82f6'); // Delivery Blue

interface MapProps {
  order: Order;
}

// Component to auto-fit bounds
const RecenterMap = ({ pickup, delivery }: { pickup: [number, number], delivery: [number, number] }) => {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (!hasCentered.current && map) {
      const bounds = L.latLngBounds([pickup, delivery]);
      map.fitBounds(bounds, { padding: [50, 50] });
      hasCentered.current = true;
    }
  }, [map, pickup[0], pickup[1], delivery[0], delivery[1]]);
  
  return null;
};

export const Map: React.FC<MapProps> = ({ order }) => {
  const [progress, setProgress] = useState(0);

  const pickupPos = useMemo<[number, number]>(() => 
    [order.restaurantLocation.lat, order.restaurantLocation.lng], 
    [order.restaurantLocation.lat, order.restaurantLocation.lng]
  );
  
  const deliveryPos = useMemo<[number, number]>(() => 
    [order.deliveryLocation.lat, order.deliveryLocation.lng], 
    [order.deliveryLocation.lat, order.deliveryLocation.lng]
  );

  // Calculate rider position based on progress
  const riderPos: [number, number] = useMemo(() => [
    pickupPos[0] + (deliveryPos[0] - pickupPos[0]) * progress,
    pickupPos[1] + (deliveryPos[1] - pickupPos[1]) * progress
  ], [progress, pickupPos, deliveryPos]);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.002; // Slower movement for smoother feel
        if (next >= 1) return 0; // Loop simulation
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const distToPickup = calculateDistance(riderPos[0], riderPos[1], pickupPos[0], pickupPos[1]);
  const distToDelivery = calculateDistance(riderPos[0], riderPos[1], deliveryPos[0], deliveryPos[1]);

  const isMart = order.restaurantName.toLowerCase().includes('mart') || order.restaurantName.toLowerCase().includes('store');

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
      <MapContainer 
        center={pickupPos} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={pickupPos} icon={isMart ? martIcon : restaurantIcon}>
          <Popup>
            <div className="p-1 min-w-[160px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: '#FF6B00' }}>
                  {isMart ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider leading-none mb-0.5">Pickup Location</p>
                  <p className="text-sm font-bold text-stone-900 leading-tight">{order.restaurantName}</p>
                </div>
              </div>
              <p className="text-xs text-stone-500 mb-3 leading-relaxed">{order.restaurantLocation.address}</p>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${pickupPos[0]},${pickupPos[1]}`, '_blank')}
                className="w-full bg-[#FF6B00] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5-5 18-2-8-8-2Z"/></svg>
                Navigate Now
              </button>
            </div>
          </Popup>
        </Marker>

        <Marker position={deliveryPos} icon={homeIcon}>
          <Popup>
            <div className="p-1 min-w-[160px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: '#3b82f6' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider leading-none mb-0.5">Delivery Location</p>
                  <p className="text-sm font-bold text-stone-900 leading-tight">{order.customer.name}</p>
                </div>
              </div>
              <p className="text-xs text-stone-500 mb-3 leading-relaxed">{order.deliveryLocation.address}</p>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${deliveryPos[0]},${deliveryPos[1]}`, '_blank')}
                className="w-full bg-blue-500 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5-5 18-2-8-8-2Z"/></svg>
                Navigate Now
              </button>
            </div>
          </Popup>
        </Marker>

        <Marker position={riderPos} icon={riderIcon}>
          <Popup>
            <div className="text-xs">
              <p className="font-bold">You (Rider)</p>
              <p>On the move...</p>
            </div>
          </Popup>
        </Marker>

        <Polyline 
          positions={[pickupPos, deliveryPos]} 
          color="#FF6B00" 
          weight={4} 
          opacity={0.8}
          lineCap="round"
        />
        <Polyline 
          positions={[pickupPos, deliveryPos]} 
          color="#FF6B00" 
          weight={12} 
          opacity={0.2}
          lineCap="round"
        />
        
        <RecenterMap pickup={pickupPos} delivery={deliveryPos} />
      </MapContainer>

      {/* Distance Overlay */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/40 shadow-lg flex items-center gap-3 transition-all hover:bg-white/95">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#FF6B00' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
          </div>
          <div>
            <p className="text-[9px] text-stone-400 uppercase font-bold tracking-wider leading-none mb-0.5">Pickup</p>
            <p className="text-sm font-bold text-stone-900 leading-none">{distToPickup.toFixed(2)} km</p>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/40 shadow-lg flex items-center gap-3 transition-all hover:bg-white/95">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#3b82f6' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div>
            <p className="text-[9px] text-stone-400 uppercase font-bold tracking-wider leading-none mb-0.5">Delivery</p>
            <p className="text-sm font-bold text-stone-900 leading-none">{distToDelivery.toFixed(2)} km</p>
          </div>
        </div>
      </div>

      {/* Rider Status */}
      <div className="absolute bottom-6 right-6 z-[1000]">
        <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 group transition-all hover:bg-white/95">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
            <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#10b981' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15h.01"/><path d="M14 15h.01"/><path d="M16 10H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Z"/><path d="M15 6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4h10V6Z"/><path d="M10 10v4"/><path d="M14 10v4"/></svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-0.5">Live Tracking</span>
            <span className="text-xs font-bold text-stone-900 leading-none">Rider Moving</span>
          </div>
        </div>
      </div>
    </div>
  );
};

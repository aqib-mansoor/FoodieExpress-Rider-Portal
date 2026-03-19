import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, ChevronRight, Package, Navigation, Map as MapIcon } from 'lucide-react';
import { Order } from '../types';
import { cn, formatCurrency, calculateDistance } from '../utils';
import { Map } from './Map';

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (status: Order['status']) => void;
  onAccept?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, onAccept }) => {
  const [showMap, setShowMap] = useState(false);
  const isPending = order.status === 'PENDING';
  const isAssigned = order.status === 'ASSIGNED';
  const isPickedUp = order.status === 'PICKED_UP';
  const isOnTheWay = order.status === 'ON_THE_WAY';

  // Mock current position for distance calculation in card
  const mockCurrentPos: [number, number] = [order.restaurantLocation.lat + 0.005, order.restaurantLocation.lng + 0.005];
  const distToPickup = calculateDistance(mockCurrentPos[0], mockCurrentPos[1], order.restaurantLocation.lat, order.restaurantLocation.lng);
  const distToDelivery = calculateDistance(mockCurrentPos[0], mockCurrentPos[1], order.deliveryLocation.lat, order.deliveryLocation.lng);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
    >
      <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 300 }}
            exit={{ height: 0 }}
            className="w-full relative overflow-hidden"
          >
            <Map order={order} />
            <button 
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-4 z-[1001] bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-stone-600 hover:text-stone-900"
            >
              <ChevronRight className="rotate-90" size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">{order.orderNumber}</span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-stone-900">{order.restaurantName}</h3>
              <button 
                onClick={() => setShowMap(!showMap)}
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  showMap ? "bg-orange-100 text-[#FF6B00]" : "bg-stone-100 text-stone-400 hover:text-stone-600"
                )}
              >
                <MapIcon size={16} />
              </button>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            order.status === 'DELIVERED' ? "bg-orange-100 text-[#FF6B00]" : "bg-amber-100 text-amber-700"
          )}>
            {order.status.replace('_', ' ')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-stone-50 rounded-2xl border border-stone-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl shadow-sm flex items-center justify-center border border-white/50 text-white"
              style={{ backgroundColor: '#FF6B00' }}
            >
              <Package size={20} className="drop-shadow-sm" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">To Pickup</p>
              <p className="text-sm font-bold text-stone-900">{distToPickup.toFixed(2)} km</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl shadow-sm flex items-center justify-center border border-white/50 text-white"
              style={{ backgroundColor: '#3b82f6' }}
            >
              <MapPin size={20} className="drop-shadow-sm" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">To Delivery</p>
              <p className="text-sm font-bold text-stone-900">{distToDelivery.toFixed(2)} km</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-stone-300" />
              <div className="w-px flex-1 bg-stone-200 my-1" />
              <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Pickup</p>
                <p className="text-sm text-stone-700 line-clamp-1">{order.restaurantLocation.address}</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Delivery</p>
                <p className="text-sm text-stone-700 line-clamp-1">{order.deliveryLocation.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
              <Package size={16} />
            </div>
            <span className="text-sm font-medium text-stone-600">{order.items.length} items</span>
          </div>
          <span className="text-lg font-bold text-stone-900">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="bg-stone-50 p-4 flex gap-2">
        {isPending && onAccept && (
          <button
            onClick={onAccept}
            className="flex-1 bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Accept Delivery
          </button>
        )}

        {isAssigned && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus('PICKED_UP')}
            className="flex-1 bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Confirm Pickup
          </button>
        )}

        {isPickedUp && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus('ON_THE_WAY')}
            className="flex-1 bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Start Delivery
          </button>
        )}

        {isOnTheWay && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus('DELIVERED')}
            className="flex-1 bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Mark as Delivered
          </button>
        )}

        <button className="p-3 bg-white border border-stone-200 rounded-xl text-stone-500 hover:text-stone-900 transition-colors">
          <Navigation size={20} />
        </button>
      </div>
    </motion.div>
  );
};

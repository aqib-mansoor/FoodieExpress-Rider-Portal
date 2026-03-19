import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Package, Star, Clock } from 'lucide-react';
import { useRiderStore } from '../store';
import { OrderCard } from './OrderCard';
import { Map } from './Map';
import { formatCurrency, cn } from '../utils';

export const Dashboard: React.FC = () => {
  const { rider, activeOrder, updateOrderStatus, toggleOnline, simulateNewOrder, earnings } = useRiderStore();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Welcome back, {rider.name.split(' ')[0]}!</h1>
          <p className="text-stone-500">You're currently {rider.isOnline ? 'online and ready for orders' : 'offline'}.</p>
        </div>
        <div className="flex gap-2">
          {rider.isOnline && (
            <button
              onClick={simulateNewOrder}
              className="px-4 py-3 rounded-2xl bg-white border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors"
            >
              Simulate Order
            </button>
          )}
          <button
            onClick={toggleOnline}
            className={cn(
              "px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
              rider.isOnline
                ? "bg-orange-100 text-[#FF6B00] border border-orange-200"
                : "bg-stone-200 text-stone-600 border border-stone-300"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", rider.isOnline ? "bg-[#FF6B00] animate-pulse" : "bg-stone-400")} />
            {rider.isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp className="text-[#FF6B00]" />} label="Today's Earnings" value={formatCurrency(earnings)} />
        <StatCard icon={<Package className="text-blue-500" />} label="Deliveries" value={rider.totalDeliveries.toString()} />
        <StatCard icon={<Star className="text-amber-500" />} label="Rating" value={rider.rating.toString()} />
        <StatCard icon={<Clock className="text-purple-500" />} label="Online Time" value="4h 20m" />
      </section>

      {/* Active Order Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-900">Active Delivery</h2>
          {activeOrder && (
            <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest">Live Tracking</span>
          )}
        </div>

        {activeOrder ? (
          <div className="space-y-4">
            <div className="h-[400px]">
              <Map order={activeOrder} />
            </div>
            <OrderCard
              order={activeOrder}
              onUpdateStatus={(status) => updateOrderStatus(activeOrder.id, status)}
            />
          </div>
        ) : (
          <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-400">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">No active orders</h3>
            <p className="text-stone-500 max-w-xs">Once you accept a delivery request, it will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
    <div className="mb-2">{icon}</div>
    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">{label}</p>
    <p className="text-xl font-bold text-stone-900">{value}</p>
  </div>
);

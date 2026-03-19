import React from 'react';
import { useRiderStore } from '../store';
import { OrderCard } from './OrderCard';

export const Orders: React.FC = () => {
  const { orders, updateOrderStatus, acceptOrder } = useRiderStore();

  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const completedOrders = orders.filter(o => o.status === 'DELIVERED');

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Orders</h1>
        <p className="text-stone-500">Manage your active and past deliveries.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-stone-900">Active Tasks</h2>
        {activeOrders.length > 0 ? (
          <div className="grid gap-6">
            {activeOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={(status) => updateOrderStatus(order.id, status)}
                onAccept={() => acceptOrder(order.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-stone-400 text-center py-10 italic">No active tasks at the moment.</p>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-stone-900">Delivery History</h2>
        <div className="grid gap-4">
          {completedOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-stone-900">{order.restaurantName}</p>
                <p className="text-xs text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#FF6B00]">Delivered</p>
                <p className="text-xs font-mono text-stone-400">{order.orderNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

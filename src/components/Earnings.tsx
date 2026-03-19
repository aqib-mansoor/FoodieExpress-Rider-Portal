import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Wallet, ArrowUpRight, ArrowDownRight, History, TrendingUp, Calendar } from 'lucide-react';
import { MOCK_EARNINGS } from '../mockData';
import { formatCurrency } from '../utils';
import { useRiderStore } from '../store';

export const Earnings: React.FC = () => {
  const { earnings, withdrawFunds } = useRiderStore();
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  
  const totalOrders = MOCK_EARNINGS.reduce((acc, curr) => acc + curr.orders, 0);

  // Mock monthly data
  const monthlyData = [
    { name: 'Jan', amount: 45000 },
    { name: 'Feb', amount: 52000 },
    { name: 'Mar', amount: earnings + 38000 },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Earnings</h1>
        <p className="text-stone-500">Track your daily and monthly performance.</p>
      </section>

      {/* Balance Card */}
      <section className="bg-[#FF6B00] rounded-3xl p-8 text-white shadow-xl shadow-orange-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <p className="text-orange-100 text-sm font-medium uppercase tracking-widest mb-2">Available Balance</p>
          <h2 className="text-5xl font-bold mb-6">{formatCurrency(earnings)}</h2>
          <div className="flex gap-4">
            <button 
              onClick={withdrawFunds}
              className="bg-white text-[#FF6B00] px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors"
            >
              Withdraw Funds
            </button>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-400 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <History size={20} />
            </div>
            <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} /> +12%
            </span>
          </div>
          <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Total Deliveries</p>
          <p className="text-2xl font-bold text-stone-900">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Wallet size={20} />
            </div>
            <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
              <ArrowDownRight size={12} /> -5%
            </span>
          </div>
          <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Avg. per Order</p>
          <p className="text-2xl font-bold text-stone-900">{formatCurrency(totalOrders > 0 ? (earnings + 30000) / totalOrders : 0)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} /> +8%
            </span>
          </div>
          <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Incentives</p>
          <p className="text-2xl font-bold text-stone-900">{formatCurrency(450.00)}</p>
        </div>
      </section>

      {/* Monthly Performance Section */}
      <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="text-[#FF6B00]" size={20} />
            <h3 className="text-lg font-bold text-stone-900">Monthly Performance</h3>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(val) => `Rs.${val/1000}k`}
              />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => [formatCurrency(val), 'Earnings']}
              />
              <Bar dataKey="amount" fill="#FF6B00" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Weekly Chart Section */}
      <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-stone-900">Weekly Working Form</h3>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-1 text-sm font-medium text-stone-600 outline-none"
          >
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
          </select>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_EARNINGS}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(val) => `Rs.${val}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => [formatCurrency(val), 'Earnings']}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#FF6B00"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

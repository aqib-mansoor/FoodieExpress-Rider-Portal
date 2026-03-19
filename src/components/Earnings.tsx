import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Wallet, ArrowUpRight, ArrowDownRight, History, TrendingUp, Calendar, X, CreditCard, Landmark, Smartphone, Package, ChevronRight } from 'lucide-react';
import { MOCK_EARNINGS } from '../mockData';
import { formatCurrency } from '../utils';
import { useRiderStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Withdrawal } from '../types';
import { cn } from '../utils';

export const Earnings: React.FC = () => {
  const { availableBalance, lifetimeEarnings, withdrawFunds, totalDeliveries, incentives, orders, withdrawals } = useRiderStore();
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'earnings' | 'withdrawals'>('earnings');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  
  // Withdrawal state
  const [withdrawStep, setWithdrawStep] = useState<'select' | 'details' | 'confirm'>('select');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [accountDetails, setAccountDetails] = useState('');

  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  const avgPerOrder = totalDeliveries > 0 ? lifetimeEarnings / totalDeliveries : 0;

  const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

  // Mock monthly data
  const monthlyData = [
    { name: 'Jan', amount: 45000 },
    { name: 'Feb', amount: 52000 },
    { name: 'Mar', amount: lifetimeEarnings },
  ];

  const handleWithdrawInit = (method: string) => {
    setSelectedMethod(method);
    setWithdrawStep('details');
  };

  const handleWithdrawConfirm = () => {
    if (selectedMethod && accountDetails) {
      withdrawFunds(selectedMethod, accountDetails);
      setShowWithdrawModal(false);
      // Reset state
      setWithdrawStep('select');
      setSelectedMethod(null);
      setAccountDetails('');
    }
  };

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
          <h2 className="text-5xl font-bold mb-6">{formatCurrency(availableBalance)}</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setWithdrawStep('select');
                setShowWithdrawModal(true);
              }}
              className="bg-white text-[#FF6B00] px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors"
            >
              Withdraw Funds
            </button>
            <button 
              onClick={() => setShowDetailsModal(true)}
              className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-400 transition-colors"
            >
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
          <p className="text-2xl font-bold text-stone-900">{totalDeliveries}</p>
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
          <p className="text-2xl font-bold text-stone-900">{formatCurrency(avgPerOrder)}</p>
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
          <p className="text-2xl font-bold text-stone-900">{formatCurrency(incentives)}</p>
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

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-stone-900">Withdraw Funds</h3>
                <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={20} className="text-stone-400" />
                </button>
              </div>
              
              <div className="p-6">
                {withdrawStep === 'select' && (
                  <div className="space-y-6">
                    <p className="text-stone-500 text-sm">Select your preferred withdrawal method.</p>
                    <div className="space-y-3">
                      <WithdrawOption 
                        icon={<Landmark size={20} />} 
                        label="Bank Transfer" 
                        onSelect={() => handleWithdrawInit("Bank Transfer")}
                      />
                      <WithdrawOption 
                        icon={<Smartphone size={20} />} 
                        label="JazzCash" 
                        onSelect={() => handleWithdrawInit("JazzCash")}
                      />
                      <WithdrawOption 
                        icon={<Smartphone size={20} />} 
                        label="EasyPaisa" 
                        onSelect={() => handleWithdrawInit("EasyPaisa")}
                      />
                    </div>
                  </div>
                )}

                {withdrawStep === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-stone-900 font-bold mb-1">Enter {selectedMethod} Details</p>
                      <p className="text-stone-500 text-sm">Provide your account number or phone number.</p>
                    </div>
                    <input 
                      type="text"
                      placeholder={selectedMethod === 'Bank Transfer' ? "Account Number / IBAN" : "Phone Number"}
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all"
                      autoFocus
                    />
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setWithdrawStep('select')}
                        className="flex-1 py-3 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                      >
                        Back
                      </button>
                      <button 
                        onClick={() => setWithdrawStep('confirm')}
                        disabled={!accountDetails}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B00] hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {withdrawStep === 'confirm' && (
                  <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-orange-100 text-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-stone-900">Confirm Withdrawal</h4>
                      <p className="text-stone-500 text-sm mt-1">
                        You are about to withdraw <span className="font-bold text-stone-900">{formatCurrency(availableBalance)}</span> to your <span className="font-bold text-stone-900">{selectedMethod}</span> account <span className="font-bold text-stone-900">({accountDetails})</span>.
                      </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setWithdrawStep('details')}
                        className="flex-1 py-3 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={handleWithdrawConfirm}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FF6B00] hover:bg-orange-600 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-stone-900">Transaction History</h3>
                  <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                    <X size={20} className="text-stone-400" />
                  </button>
                </div>
                
                <div className="flex p-1 bg-stone-100 rounded-xl">
                  <button
                    onClick={() => setActiveHistoryTab('earnings')}
                    className={cn(
                      "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                      activeHistoryTab === 'earnings' ? "bg-white text-[#FF6B00] shadow-sm" : "text-stone-500"
                    )}
                  >
                    Earnings
                  </button>
                  <button
                    onClick={() => setActiveHistoryTab('withdrawals')}
                    className={cn(
                      "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                      activeHistoryTab === 'withdrawals' ? "bg-white text-[#FF6B00] shadow-sm" : "text-stone-500"
                    )}
                  >
                    Withdrawals
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {activeHistoryTab === 'earnings' ? (
                  deliveredOrders.length > 0 ? (
                    deliveredOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 text-[#FF6B00] rounded-xl flex items-center justify-center">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-stone-900">{order.orderNumber}</p>
                            <p className="text-xs text-stone-400">{new Date(order.deliveredAt || order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="font-bold text-emerald-600">+{formatCurrency(order.deliveryFee)}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-stone-400">No recent deliveries found.</p>
                    </div>
                  )
                ) : (
                  withdrawals.length > 0 ? (
                    withdrawals.map((withdrawal) => (
                      <button 
                        key={withdrawal.id} 
                        onClick={() => setSelectedWithdrawal(withdrawal)}
                        className="w-full text-left p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-[#FF6B00] transition-all group mb-4 last:mb-0"
                      >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition-colors">
                                <ArrowDownRight size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-stone-900">{withdrawal.method}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-stone-400">{new Date(withdrawal.date).toLocaleDateString()}</p>
                                  <span className={cn(
                                    "text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                    withdrawal.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                  )}>
                                    {withdrawal.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-1">
                              <p className="font-bold text-rose-600">-{formatCurrency(withdrawal.amount)}</p>
                              <ChevronRight size={14} className="text-stone-300 group-hover:text-[#FF6B00]" />
                            </div>
                          </div>
                        <div className="bg-white/50 p-3 rounded-xl border border-stone-100 group-hover:bg-white transition-colors">
                          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">Account Details</p>
                          <p className="text-sm font-medium text-stone-700 truncate">{withdrawal.details}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-stone-400">No withdrawal history found.</p>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Withdrawal Receipt Modal */}
      <AnimatePresence>
        {selectedWithdrawal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWithdrawal(null)}
              className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-32 bg-[#FF6B00]" />
              
              <div className="relative pt-12 pb-8 px-8 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl mx-auto mb-6 flex items-center justify-center text-[#FF6B00]">
                  <ArrowDownRight size={40} />
                </div>
                
                <h3 className="text-2xl font-black text-stone-900 mb-1">Withdrawal Receipt</h3>
                <p className="text-stone-400 text-sm mb-8 font-mono uppercase tracking-widest">#{selectedWithdrawal.id.slice(0, 8)}</p>
                
                <div className="space-y-6 text-left">
                  <div className="flex justify-between items-center py-3 border-b border-stone-100">
                    <span className="text-stone-400 text-sm font-bold uppercase tracking-wider">Amount</span>
                    <span className="text-2xl font-black text-[#FF6B00]">{formatCurrency(selectedWithdrawal.amount)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-1">Method</p>
                      <p className="text-sm font-bold text-stone-900">{selectedWithdrawal.method}</p>
                    </div>
                    <div>
                      <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-1">Status</p>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                        selectedWithdrawal.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {selectedWithdrawal.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-1">Account Details</p>
                    <p className="text-sm font-mono text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100 break-all">
                      {selectedWithdrawal.details}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-1">Date & Time</p>
                    <p className="text-sm font-bold text-stone-900">
                      {new Date(selectedWithdrawal.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-xs text-stone-400">
                      {new Date(selectedWithdrawal.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedWithdrawal(null)}
                  className="w-full mt-10 py-4 rounded-2xl font-black text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
                >
                  Close Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WithdrawOption: React.FC<{ icon: React.ReactNode; label: string; onSelect: () => void }> = ({ icon, label, onSelect }) => (
  <button 
    onClick={onSelect}
    className="w-full flex items-center justify-between p-4 rounded-2xl border border-stone-200 hover:border-[#FF6B00] hover:bg-orange-50 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-stone-100 text-stone-600 group-hover:bg-[#FF6B00] group-hover:text-white rounded-lg transition-colors">
        {icon}
      </div>
      <span className="font-bold text-stone-700">{label}</span>
    </div>
    <ChevronRight size={18} className="text-stone-300 group-hover:text-[#FF6B00]" />
  </button>
);

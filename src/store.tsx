import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, RiderProfile, Withdrawal } from './types';
import { MOCK_ORDERS, MOCK_RIDER } from './mockData';
import toast from 'react-hot-toast';

interface RiderContextType {
  isAuthenticated: boolean;
  rider: RiderProfile;
  orders: Order[];
  activeOrder: Order | undefined;
  availableBalance: number;
  lifetimeEarnings: number;
  incentives: number;
  totalDeliveries: number;
  withdrawals: Withdrawal[];
  login: (email: string, password: string) => boolean;
  signup: (data: any) => void;
  logout: () => void;
  toggleOnline: () => void;
  acceptOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  simulateNewOrder: () => void;
  withdrawFunds: (method: string, details: string) => void;
}

const RiderContext = createContext<RiderContextType | undefined>(undefined);

export const RiderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fe_rider_auth') === 'true';
  });
  const [rider, setRider] = useState<RiderProfile>(() => {
    const savedRider = localStorage.getItem('fe_rider_data');
    return savedRider ? JSON.parse(savedRider) : MOCK_RIDER;
  });
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [availableBalance, setAvailableBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem('fe_rider_balance');
    return savedBalance ? parseFloat(savedBalance) : 1200;
  });
  const [lifetimeEarnings, setLifetimeEarnings] = useState<number>(() => {
    const savedLifetime = localStorage.getItem('fe_rider_lifetime_earnings');
    return savedLifetime ? parseFloat(savedLifetime) : 31200;
  });
  const [incentives, setIncentives] = useState<number>(() => {
    const savedIncentives = localStorage.getItem('fe_rider_incentives');
    return savedIncentives ? parseFloat(savedIncentives) : 450;
  });
  const [totalDeliveries, setTotalDeliveries] = useState<number>(() => {
    const savedDeliveries = localStorage.getItem('fe_rider_total_deliveries');
    return savedDeliveries ? parseInt(savedDeliveries) : MOCK_RIDER.totalDeliveries;
  });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const savedWithdrawals = localStorage.getItem('fe_rider_withdrawals');
    return savedWithdrawals ? JSON.parse(savedWithdrawals) : [];
  });

  useEffect(() => {
    localStorage.setItem('fe_rider_balance', availableBalance.toString());
    localStorage.setItem('fe_rider_lifetime_earnings', lifetimeEarnings.toString());
    localStorage.setItem('fe_rider_incentives', incentives.toString());
    localStorage.setItem('fe_rider_total_deliveries', totalDeliveries.toString());
    localStorage.setItem('fe_rider_withdrawals', JSON.stringify(withdrawals));
  }, [availableBalance, lifetimeEarnings, incentives, totalDeliveries, withdrawals]);

  const login = (email: string, password: string) => {
    if (email === 'ali@gmail.com' && password === '123456') {
      const userData = {
        ...MOCK_RIDER,
        name: 'Ali Khan',
        email: 'ali@gmail.com',
      };
      setIsAuthenticated(true);
      setRider(userData);
      localStorage.setItem('fe_rider_auth', 'true');
      localStorage.setItem('fe_rider_data', JSON.stringify(userData));
      toast.success('Welcome back!');
      return true;
    } else {
      toast.error('Invalid email or password');
      return false;
    }
  };

  const signup = (data: any) => {
    const userData = {
      ...MOCK_RIDER,
      id: `rider-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalDeliveries: 0,
      rating: 5.0,
      completionRate: 100,
    };
    setIsAuthenticated(true);
    setRider(userData);
    localStorage.setItem('fe_rider_auth', 'true');
    localStorage.setItem('fe_rider_data', JSON.stringify(userData));
    toast.success('Account created successfully!');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('fe_rider_auth');
    localStorage.removeItem('fe_rider_data');
    toast.success('Logged out successfully');
  };

  const toggleOnline = () => {
    const updatedRider = { ...rider, isOnline: !rider.isOnline };
    setRider(updatedRider);
    localStorage.setItem('fe_rider_data', JSON.stringify(updatedRider));
    toast.success(rider.isOnline ? 'You are now offline' : 'You are now online');
  };

  const acceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ASSIGNED' } : o));
    setActiveOrderId(orderId);
    toast.success('Order accepted!');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (status === 'DELIVERED') {
      const deliveredOrder = orders.find(o => o.id === orderId);
      if (deliveredOrder) {
        // Update rider stats
        setTotalDeliveries(prev => prev + 1);
        
        // Update earnings
        const earnedIncentive = (totalDeliveries + 1) % 5 === 0 ? 50 : 0;
        setAvailableBalance(prev => prev + deliveredOrder.deliveryFee + earnedIncentive);
        setLifetimeEarnings(prev => prev + deliveredOrder.deliveryFee + earnedIncentive);
        
        if (earnedIncentive > 0) {
          setIncentives(prev => prev + earnedIncentive);
          toast.success('Bonus incentive earned! 🌟');
        }

        // Update the order in the list with its earned incentive and delivery time
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { 
            ...o, 
            status, 
            deliveredAt: new Date().toISOString(), 
            incentive: earnedIncentive 
          } : o
        ));
        
        setActiveOrderId(null);
        toast.success('Order delivered! Great job.');

        // Automatically assign next pending order if available
        setTimeout(() => {
          const nextOrder = orders.find(o => o.status === 'PENDING' && o.id !== orderId);
          if (nextOrder) {
            acceptOrder(nextOrder.id);
            toast('Next order automatically assigned!', { icon: '🛵' });
          }
        }, 2000);
      }
    } else {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { 
          ...o, 
          status, 
          pickedUpAt: status === 'PICKED_UP' ? new Date().toISOString() : o.pickedUpAt 
        } : o
      ));
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
    }
  };

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders.find(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');

  const simulateNewOrder = () => {
    const isIslamabad = Math.random() > 0.5;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#FE-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantName: isIslamabad ? 'Kabul Restaurant' : 'Refreshment Center',
      restaurantLocation: isIslamabad 
        ? { lat: 33.7297, lng: 73.0746, address: 'F-6 Markaz, Islamabad' }
        : { lat: 33.6015, lng: 73.0357, address: 'Commercial Market, Rawalpindi' },
      customer: { id: 'cust-new', name: 'Ayesha Ahmed', phone: '+92 300 1112222' },
      deliveryLocation: isIslamabad
        ? { lat: 33.6518, lng: 73.0815, address: 'G-11/3, Islamabad' }
        : { lat: 33.5484, lng: 73.1258, address: 'DHA Phase 2, Rawalpindi' },
      status: 'PENDING',
      items: [{ name: 'Chicken Karahi', quantity: 1 }, { name: 'Naan', quantity: 4 }],
      totalAmount: 2800,
      deliveryFee: 250,
      incentive: 0,
      paymentMethod: 'CASH',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    toast('New delivery request available!', { icon: '🛵', duration: 5000 });
  };

  const withdrawFunds = (method: string, details: string) => {
    if (availableBalance <= 0) {
      toast.error('No funds available for withdrawal');
      return;
    }
    if (!method || !details) {
      toast.error('Please select a payment method and provide details');
      return;
    }
    
    const withdrawalId = `wth-${Date.now()}`;
    const amountToWithdraw = availableBalance;
    
    const newWithdrawal: Withdrawal = {
      id: withdrawalId,
      amount: amountToWithdraw,
      method,
      details,
      date: new Date().toISOString(),
      status: 'PENDING'
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    setAvailableBalance(0);
    
    toast.loading(`Processing withdrawal of Rs.${amountToWithdraw}...`, { id: withdrawalId });

    setTimeout(() => {
      setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status: 'COMPLETED' } : w));
      toast.success(`Withdrawal of Rs.${amountToWithdraw} successful! 💸`, { id: withdrawalId });
    }, 3000);
  };

  return (
    <RiderContext.Provider value={{
      isAuthenticated,
      rider,
      orders,
      activeOrder,
      availableBalance,
      lifetimeEarnings,
      incentives,
      totalDeliveries,
      withdrawals,
      login,
      signup,
      logout,
      toggleOnline,
      acceptOrder,
      updateOrderStatus,
      simulateNewOrder,
      withdrawFunds,
    }}>
      {children}
    </RiderContext.Provider>
  );
};

export const useRiderStore = () => {
  const context = useContext(RiderContext);
  if (context === undefined) {
    throw new Error('useRiderStore must be used within a RiderProvider');
  }
  return context;
};

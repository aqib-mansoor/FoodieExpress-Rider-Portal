import { Order, RiderProfile, EarningSummary } from './types';

export const MOCK_RIDER: RiderProfile = {
  id: 'rider-123',
  name: 'Alex Johnson',
  email: 'alex.j@foodieexpress.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://picsum.photos/seed/rider/200/200',
  isOnline: true,
  rating: 4.8,
  totalDeliveries: 1240,
  completionRate: 98.5,
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: '#FE-9821',
    restaurantName: 'Savour Foods',
    restaurantLocation: {
      lat: 33.7117,
      lng: 73.0589,
      address: 'Blue Area, Islamabad',
    },
    customer: {
      id: 'cust-001',
      name: 'Sarah Miller',
      phone: '+92 333 9876543',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
    },
    deliveryLocation: {
      lat: 33.6844,
      lng: 73.0479,
      address: 'F-7 Markaz, Islamabad',
    },
    status: 'PENDING',
    items: [
      { name: 'Pulao Kabab', quantity: 2 },
      { name: 'Large Raita', quantity: 1 },
      { name: 'Cold Drink', quantity: 1 },
    ],
    totalAmount: 1250,
    deliveryFee: 150,
    incentive: 0,
    paymentMethod: 'CARD',
    specialInstructions: 'Please leave at the door and ring the bell.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ord-002',
    orderNumber: '#FE-9825',
    restaurantName: 'Cheezious',
    restaurantLocation: {
      lat: 33.5651,
      lng: 73.0169,
      address: 'Saddar, Rawalpindi',
    },
    customer: {
      id: 'cust-002',
      name: 'Michael Chen',
      phone: '+92 345 4443333',
      avatar: 'https://picsum.photos/seed/michael/100/100',
    },
    deliveryLocation: {
      lat: 33.5984,
      lng: 73.0441,
      address: 'Bahria Town Phase 7, Rawalpindi',
    },
    status: 'PICKED_UP',
    items: [
      { name: 'Crown Crust Pizza (Large)', quantity: 1 },
      { name: 'Garlic Knots', quantity: 6 },
    ],
    totalAmount: 2400,
    deliveryFee: 200,
    incentive: 0,
    paymentMethod: 'CASH',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const MOCK_EARNINGS: EarningSummary[] = [
  { date: '2026-03-12', amount: 3500, orders: 12 },
  { date: '2026-03-13', amount: 4200, orders: 15 },
  { date: '2026-03-14', amount: 2800, orders: 10 },
  { date: '2026-03-15', amount: 5500, orders: 18 },
  { date: '2026-03-16', amount: 3800, orders: 13 },
  { date: '2026-03-17', amount: 4800, orders: 16 },
  { date: '2026-03-18', amount: 1200, orders: 4 },
];

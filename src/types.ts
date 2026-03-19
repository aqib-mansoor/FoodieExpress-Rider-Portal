/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OrderStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantLocation: Location;
  customer: Customer;
  deliveryLocation: Location;
  status: OrderStatus;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: 'CARD' | 'CASH';
  specialInstructions?: string;
  createdAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export interface EarningSummary {
  date: string;
  amount: number;
  orders: number;
}

export interface RiderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isOnline: boolean;
  rating: number;
  totalDeliveries: number;
  completionRate: number;
}

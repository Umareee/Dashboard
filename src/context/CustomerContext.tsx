"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import customersData from "@/data/customers.json";
import ordersData from "@/data/orders.json";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: "active" | "inactive";
  location: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: string;
}

interface CustomerContextType {
  customers: Customer[];
  orders: Order[];
  getCustomerOrders: (customerId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  updateCustomerStatus: (customerId: string, status: "active" | "inactive") => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(customersData as Customer[]);
  const [orders] = useState<Order[]>(ordersData as Order[]);

  const getCustomerOrders = (customerId: string): Order[] => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const updateCustomerStatus = (customerId: string, status: "active" | "inactive") => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, status } 
          : customer
      )
    );
  };

  return (
    <CustomerContext.Provider value={{
      customers,
      orders,
      getCustomerOrders,
      getOrderById,
      updateCustomerStatus
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}

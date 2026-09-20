"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  dob?: string;
  gender?: string;
  payment?: {
    cardHolder: string;
    cardNumber: string;
    expire: string;
    balance: string;
    type: string;
  };
  role?: 'User' | 'Admin' | 'Super Admin' | 'Inventory Manager' | 'Support Staff';
  notifications?: {
    email: boolean;
    sms: boolean;
    telegram: boolean;
  };
  adminPreferences?: {
    language: 'English' | 'Khmer';
    theme: 'Light' | 'Dark';
    alerts: {
      newOrder: boolean;
      lowStock: boolean;
      returnRequest: boolean;
    }
  };
}

export interface Address {
  id: string;
  isDefault: boolean;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Order Placed' | 'Payment Confirmed' | 'Processing/Packing' | 'Shipped/In Transit' | 'Delivered' | 'Returned' | 'Cancelled' | 'Pending';
  items: any[];
  shippingCompany?: string;
  trackingNumber?: string;
  courierPhone?: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: string;
  shippingFee?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedAddresses = localStorage.getItem('addresses');
      const storedOrders = localStorage.getItem('orders');
      
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedAddresses) setAddresses(JSON.parse(storedAddresses));
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
        localStorage.setItem('addresses', JSON.stringify(addresses));
        
        if (orders.length === 0) {
          localStorage.removeItem('orders');
        } else {
          localStorage.setItem('orders', JSON.stringify(orders));
        }
      } catch (error) {
        console.error('Storage Error in AuthContext:', error);
        if (error.name === 'QuotaExceededError') {
           try {
             const slimOrders = orders.map(order => ({
                 ...order,
                 items: order.items.map(item => ({...item, image: ''}))
             }));
             localStorage.setItem('orders', JSON.stringify(slimOrders));
           } catch(e) {}
        }
      }
    }
  }, [user, addresses, orders, isLoaded]);

  const login = (userData: User) => {
    // If no role is set, make them a Super Admin for testing this feature, or User
    // Let's default to Super Admin if email contains 'admin'
    const role = userData.email.includes('admin') ? 'Super Admin' : (userData.role || 'User');
    setUser({
      ...userData,
      role,
      notifications: userData.notifications || { email: true, sms: false, telegram: true },
      adminPreferences: userData.adminPreferences || {
        language: 'English',
        theme: 'Light',
        alerts: { newOrder: true, lowStock: true, returnRequest: true }
      }
    });
  };
  const logout = () => {
    setUser(null);
    setAddresses([]);
    setOrders([]);
  };
  const updateProfile = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress = { ...address, id: Date.now().toString() };
    if (addresses.length === 0) newAddress.isDefault = true;
    setAddresses(prev => [...prev, newAddress]);
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoaded,
      login,
      logout,
      updateProfile,
      addresses,
      addAddress,
      deleteAddress,
      setDefaultAddress,
      orders,
      addOrder
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

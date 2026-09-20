"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useGlobalLoading } from '@/components/providers/GlobalLoadingProvider';

// Common Types
export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  desktop_image: string;
  mobile_image?: string;
  target_url?: string;
  cta_text?: string;
  position: 'Hero' | 'Middle' | 'Category';
  sort_order: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  clicks: number;
}

export interface StoreSettings {
  id: number;
  brand_story: string;
  mission_statement: string;
  why_choose_us: any[];
  stats: any[];
  team_photos: string[];
  team_members: any[];
  contact_info: {
    phone: string;
    email: string;
    address?: string;
    telegram: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    map_embed: string;
  };
  seo_metadata: {
    meta_title: string;
    meta_description: string;
    og_image: string;
    hero_subtitle?: string;
    hero_desktop?: string;
    hero_mobile?: string;
    story_image?: string;
    gallery?: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface ProductVariants {
  colors: string[];
  sizes: string[];
  materials: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  image: string;
  images?: string[];
  description?: string;
  isNew?: boolean;
  rating?: number;
  stock: number;
  lowStockThreshold?: number;
  variants?: ProductVariants;
  status: 'Active' | 'Out of Stock' | 'Draft';
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  date: string;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Verified' | 'Failed' | 'Refunded';
  paymentSlipUrl?: string;
  refundStatus: 'None' | 'Requested' | 'Approved' | 'Rejected';
  refundReason?: string;
  items: any[];
  courier?: 'VET' | 'J&T' | 'Speed' | 'Manual' | '';
  trackingNumber?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  ordersCount: number;
  joinDate: string;
}

interface AdminContextType {
  settings: StoreSettings | null;
  banners: Banner[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addProducts: (products: Omit<Product, 'id'>[]) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBanner: (banner: Omit<Banner, 'id' | 'clicks'>) => Promise<void>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<StoreSettings>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updateOrderDelivery: (id: string, courier: Order['courier'], trackingNumber: string) => Promise<void>;
  updateOrderPayment: (id: string, status: Order['paymentStatus']) => Promise<void>;
  updateOrderRefund: (id: string, status: Order['refundStatus']) => Promise<void>;
  refreshOrders: () => Promise<void>;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setGlobalLoading } = useGlobalLoading();

  // Fetch initial data from Supabase
  useEffect(() => {
    fetchSettings();
    fetchBanners();
    fetchCategories();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).maybeSingle();
    if (error) { 
      console.error("Error fetching settings:", error);
    }
    if (data) setSettings(data);
  };

  const fetchBanners = async () => {
    const { data, error } = await supabase.from('banners').select('*').order('sort_order', { ascending: true });
    if (error) {
      console.error("Error fetching banners:", error);
      return;
    }
    setBanners(data || []);
  };

    const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }
    setCategories(data);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Error fetching products:", error);
      return;
    }
    
    // Map snake_case to camelCase
    const formatted = data.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      category: p.category,
      image: p.image,
      isNew: p.is_new,
      rating: p.rating ? Number(p.rating) : undefined,
      stock: p.stock,
      status: p.status
    }));
    setProducts(formatted);
    setIsLoading(false);
  };

  const fetchOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      return;
    }
    
    const { data: itemsData, error: itemsError } = await supabase.from('order_items').select('*');
    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return;
    }

    const formattedOrders = ordersData.map(o => {
      const oItems = itemsData.filter(i => i.order_id === o.id).map(i => ({
        id: i.id,
        productId: i.product_id,
        name: i.name,
        price: Number(i.price),
        quantity: i.quantity,
        color: i.color,
        size: i.size
      }));

      return {
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        date: new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        total: Number(o.total),
        status: o.status,
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status || 'Pending',
        paymentSlipUrl: o.payment_slip_url,
        refundStatus: o.refund_status || 'None',
        refundReason: o.refund_reason,
        courier: o.courier || '',
        trackingNumber: o.tracking_number || '',
        items: oItems
      };
    });

    setOrders(formattedOrders);
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  
  const addCategory = async (category: Omit<Category, 'id'>) => {
    const { error } = await supabase.from('categories').insert([category]);
    if (error) {
      alert("Failed to add category: " + error.message);
      return;
    }
    await fetchCategories();
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { error } = await supabase.from('categories').update(updates).eq('id', id);
    if (error) {
      alert("Failed to update category: " + error.message);
      return;
    }
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      alert("Failed to delete category: " + error.message);
      return;
    }
    await fetchCategories();
  };

  const addBanner = async (banner: Omit<Banner, 'id' | 'clicks'>) => {
    const { error } = await supabase.from('banners').insert([banner]);
    if (error) {
      alert("Failed to add banner: " + error.message);
      return;
    }
    await fetchBanners();
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    const { error } = await supabase.from('banners').update(updates).eq('id', id);
    if (error) {
      alert("Failed to update banner: " + error.message);
      return;
    }
    await fetchBanners();
  };

  const deleteBanner = async (id: string) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) {
      alert("Failed to delete banner: " + error.message);
      return;
    }
    await fetchBanners();
  };

  const updateSettings = async (updates: Partial<StoreSettings>) => {
    const { error } = await supabase.from('store_settings').upsert({ id: 1, ...updates });
    if (error) {
      throw error;
    }
    await fetchSettings();
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { error } = await supabase.from('products').insert([{
      name: product.name,
      price: product.price,
      original_price: product.originalPrice,
      category: product.category,
      sub_category: product.subCategory,
      image: product.image,
      images: product.images,
      description: product.description,
      stock: product.stock,
      low_stock_threshold: product.lowStockThreshold,
      variants: product.variants,
      status: product.status
    }]);

    if (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product: " + error.message);
      return;
    }
    await fetchProducts();
  };

  const addProducts = async (productsArray: Omit<Product, 'id'>[]) => {
    const payload = productsArray.map(product => ({
      name: product.name,
      price: product.price,
      original_price: product.originalPrice,
      category: product.category,
      sub_category: product.subCategory,
      image: product.image,
      images: product.images,
      description: product.description,
      stock: product.stock,
      low_stock_threshold: product.lowStockThreshold,
      variants: product.variants,
      status: product.status
    }));

    const { error } = await supabase.from('products').insert(payload);

    if (error) {
      console.error("Error adding products in bulk:", error);
      alert("Failed to add products: " + error.message);
      throw error;
    }
    await fetchProducts();
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.subCategory !== undefined) dbUpdates.sub_category = updates.subCategory;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.lowStockThreshold !== undefined) dbUpdates.low_stock_threshold = updates.lowStockThreshold;
    if (updates.variants !== undefined) dbUpdates.variants = updates.variants;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
    if (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product: " + error.message);
      return;
    }
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product: " + error.message);
      return;
    }
    await fetchProducts();
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setGlobalLoading(true);
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) {
        console.error("Error updating order status:", error);
        alert(`Supabase Error: ${error.message} \nDetails: ${error.details || ''} \nHint: ${error.hint || ''}`);
        return;
      }
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } finally {
      setGlobalLoading(false);
    }
  };

  const updateOrderDelivery = async (id: string, courier: Order['courier'], trackingNumber: string) => {
    setGlobalLoading(true);
    try {
      const { error } = await supabase.from('orders').update({ 
        courier, 
        tracking_number: trackingNumber 
      }).eq('id', id);
      
      if (error) {
        console.error("Error updating delivery:", error);
        alert("Failed to update delivery info.");
        return;
      }
      setOrders(prev => prev.map(o => o.id === id ? { ...o, courier, trackingNumber } : o));
    } finally {
      setGlobalLoading(false);
    }
  };

  const updateOrderPayment = async (id: string, paymentStatus: Order['paymentStatus']) => {
    const { error } = await supabase.from('orders').update({ payment_status: paymentStatus }).eq('id', id);
    if (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment.");
      return;
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus } : o));
  };

  const updateOrderRefund = async (id: string, refundStatus: Order['refundStatus']) => {
    const { error } = await supabase.from('orders').update({ refund_status: refundStatus }).eq('id', id);
    if (error) {
      console.error("Error updating refund:", error);
      alert("Failed to update refund status.");
      return;
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, refundStatus } : o));
  };


  return (
    <AdminContext.Provider value={{ 
      settings, banners, categories, products, orders, customers, 
      addBanner, updateBanner, deleteBanner,
      updateSettings,
      addCategory, updateCategory, deleteCategory,
      addProduct, addProducts, updateProduct, deleteProduct, 
      updateOrderStatus, updateOrderDelivery, updateOrderPayment, updateOrderRefund, refreshOrders, isLoading 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

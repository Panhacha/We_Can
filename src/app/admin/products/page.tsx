"use client";
import { useState, useRef } from 'react';
import { useAdmin, Product, ProductVariants } from '@/context/AdminContext';
import { Plus, Pencil, Trash2, Search, Filter, ArrowUpDown, X, Upload, AlertTriangle } from 'lucide-react';
import { z } from 'zod';
import ConfirmModal from '@/components/ui/ConfirmModal';

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name is too long"),
  price: z.number().positive("Price must be greater than 0"),
  originalPrice: z.number().min(0).optional().or(z.literal(0)),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  lowStockThreshold: z.number().int().nonnegative("Threshold must be 0 or positive"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  description: z.string().optional(),
});

const defaultFormData = {
  name: '', price: '', originalPrice: '', category: '', subCategory: '', description: '',
  stock: '', lowStockThreshold: '5', image: '', status: 'Active' as const
};
const defaultVariants = { colors: [], sizes: [], materials: [] };

export default function AdminProducts() {
  const { categories, products, addProduct, addProducts, updateProduct, deleteProduct } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [formDataList, setFormDataList] = useState([defaultFormData]);
  const [variantsList, setVariantsList] = useState<ProductVariants[]>([defaultVariants]);
  const [activeFormIndex, setActiveFormIndex] = useState(0);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Temporary inputs for variants
  const [tempColor, setTempColor] = useState('');
  const [tempSize, setTempSize] = useState('');
  const [tempMaterial, setTempMaterial] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormDataList([{
        name: product.name,
        price: product.price.toString(),
        originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
        category: product.category,
        subCategory: product.subCategory || '',
        description: product.description || '',
        stock: product.stock.toString(),
        lowStockThreshold: (product.lowStockThreshold || 5).toString(),
        image: product.image,
        status: product.status as 'Active' | 'Draft' | 'Out of Stock'
      }]);
      setVariantsList([product.variants || defaultVariants]);
    } else {
      setEditingId(null);
      setFormDataList([{...defaultFormData}]);
      setVariantsList([{...defaultVariants}]);
    }
    setActiveFormIndex(0);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const updateActiveForm = (updates: Partial<typeof defaultFormData>) => {
    const newList = [...formDataList];
    newList[activeFormIndex] = { ...newList[activeFormIndex], ...updates };
    setFormDataList(newList);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateActiveForm({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariantItem = (type: keyof ProductVariants, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!value.trim()) return;
    const newVariantsList = [...variantsList];
    const currentVariants = newVariantsList[activeFormIndex];
    currentVariants[type] = [...(currentVariants[type] || []), value.trim()];
    setVariantsList(newVariantsList);
    setter('');
  };

  const removeVariantItem = (type: keyof ProductVariants, idx: number) => {
    const newVariantsList = [...variantsList];
    const currentVariants = newVariantsList[activeFormIndex];
    currentVariants[type] = currentVariants[type].filter((_, i) => i !== idx);
    setVariantsList(newVariantsList);
  };

  const addNewProductTab = () => {
    if (formDataList.length >= 10) {
      alert("You can only add up to 10 products at a time.");
      return;
    }
    setFormDataList([...formDataList, {...defaultFormData}]);
    setVariantsList([...variantsList, {...defaultVariants}]);
    setActiveFormIndex(formDataList.length); // Switch to new tab
  };

  const removeProductTab = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    if (formDataList.length === 1) return; // Must have at least one
    const newFormDataList = formDataList.filter((_, idx) => idx !== indexToRemove);
    const newVariantsList = variantsList.filter((_, idx) => idx !== indexToRemove);
    setFormDataList(newFormDataList);
    setVariantsList(newVariantsList);
    if (activeFormIndex >= newFormDataList.length) {
      setActiveFormIndex(newFormDataList.length - 1);
    } else if (activeFormIndex > indexToRemove) {
      setActiveFormIndex(activeFormIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    
    let hasErrors = false;
    const allErrors: Record<string, string> = {};
    const validProducts = [];

    for (let i = 0; i < formDataList.length; i++) {
      const fd = formDataList[i];
      try {
        productSchema.parse({
          name: fd.name,
          price: parseFloat(fd.price),
          originalPrice: fd.originalPrice ? parseFloat(fd.originalPrice) : 0,
          stock: parseInt(fd.stock),
          lowStockThreshold: parseInt(fd.lowStockThreshold),
          category: fd.category,
          subCategory: fd.subCategory,
          description: fd.description,
        });

        validProducts.push({
          name: fd.name,
          price: parseFloat(fd.price) || 0,
          originalPrice: fd.originalPrice ? parseFloat(fd.originalPrice) : undefined,
          category: fd.category,
          subCategory: fd.subCategory,
          description: fd.description,
          stock: parseInt(fd.stock) || 0,
          lowStockThreshold: parseInt(fd.lowStockThreshold) || 5,
          image: fd.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
          status: fd.status,
          variants: variantsList[i]
        });

      } catch (err) {
        hasErrors = true;
        if (err instanceof z.ZodError) {
          err.errors.forEach(e => {
            if (e.path[0]) allErrors[`${i}-${e.path[0]}`] = e.message;
          });
        }
      }
    }

    if (hasErrors) {
      setFormErrors(allErrors);
      // Switch to the first tab that has an error
      const firstErrorTab = parseInt(Object.keys(allErrors)[0].split('-')[0]);
      setActiveFormIndex(firstErrorTab);
      return;
    }

    if (editingId) {
      await updateProduct(editingId, validProducts[0]);
    } else {
      if (validProducts.length === 1) {
        await addProduct(validProducts[0] as any);
      } else {
        await addProducts(validProducts as any);
      }
    }
    setIsModalOpen(false);
  };

  const formData = formDataList[activeFormIndex];
  const variants = variantsList[activeFormIndex];
  const getFieldError = (field: string) => formErrors[`${activeFormIndex}-${field}`];

  return (
    <div className="space-y-6 pb-20" suppressHydrationWarning>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">PAGES / PRODUCTS</h2>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Products Inventory</h1>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2rem] p-6">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-200 placeholder-white/50 focus:outline-none focus:bg-white/10 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 bg-white/5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Product</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Stock</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const isLowStock = product.stock <= (product.lowStockThreshold || 5);
                  return (
                    <tr key={product.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isLowStock ? 'bg-red-500/5' : ''}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-lighten" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-200 text-sm block">{product.name}</span>
                            {product.variants?.sizes?.length ? (
                              <span className="text-[11px] text-gray-500">{product.variants.sizes.length} Sizes | {product.variants?.colors?.length || 0} Colors</span>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-400 text-sm">
                        {product.category}
                        {product.subCategory && <span className="block text-[11px] text-gray-500">{product.subCategory}</span>}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="font-medium text-gray-200">${product.price.toFixed(2)}</span>
                        {product.originalPrice ? <span className="block text-[11px] line-through text-gray-500">${product.originalPrice.toFixed(2)}</span> : null}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-sm ${isLowStock ? 'text-red-500' : 'text-gray-300'}`}>{product.stock}</span>
                          {isLowStock && <AlertTriangle className="w-3 h-3 text-red-500" title="Low Stock Warning" />}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                          product.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          product.status === 'Out of Stock' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white/5 rounded transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(product.id)} className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No products found. Add a new product to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center p-4 sm:p-10 overflow-y-auto">
          <div className="bg-[#16161a] border border-[#2a2a30] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col my-auto sm:my-0 mb-10 relative">
            <div className="px-8 py-5 border-b border-[#2a2a30] flex justify-between items-center bg-[#16161a] shrink-0 sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Product' : (
                  <div className="flex items-center gap-3">
                    <span>Add New Products</span>
                    <span className="text-xs font-normal bg-white/10 text-white/70 px-2 py-1 rounded-full border border-white/10">
                      {formDataList.length} / 10
                    </span>
                  </div>
                )}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-0">
              
              {/* Product Tabs (Only if Adding Multiple) */}
              {!editingId && (
                <div className="flex items-center gap-2 px-6 pt-6 overflow-x-auto border-b border-white/5 pb-0">
                  {formDataList.map((fd, idx) => {
                    const hasErr = Object.keys(formErrors).some(k => k.startsWith(`${idx}-`));
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setActiveFormIndex(idx)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl cursor-pointer border border-b-0 transition-colors whitespace-nowrap min-w-[120px] ${
                          activeFormIndex === idx 
                            ? 'bg-[#1c1c21] border-[#2a2a30] text-blue-400 shadow-[0_4px_0_0_#1c1c21]' 
                            : 'bg-[#0e0e11] border-transparent text-gray-500 hover:bg-[#16161a]'
                        }`}
                      >
                        <span className="text-sm font-medium">Product {idx + 1}</span>
                        {hasErr && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                        {formDataList.length > 1 && (
                          <button 
                            type="button" 
                            onClick={(e) => removeProductTab(e, idx)} 
                            className="ml-2 text-gray-500 hover:text-red-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {formDataList.length < 10 && (
                    <button 
                      type="button" 
                      onClick={addNewProductTab}
                      className="flex items-center gap-1.5 px-4 py-2.5 mb-1 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10 ml-2"
                    >
                      <Plus className="w-4 h-4" /> Add Another
                    </button>
                  )}
                </div>
              )}

              <div className={`p-6 sm:p-8 space-y-5 ${!editingId ? 'bg-[#1c1c21] rounded-b-3xl' : ''}`}>
                {/* Top Section: Media & Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5">
                  {/* Media Section */}
                  <div className="bg-[#1c1c21] p-5 rounded-2xl border border-[#2a2a30] shadow-sm">
                    <h4 className="text-sm font-medium text-white mb-4">Product Image</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {formData.image ? (
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#2a2a30] group shadow-sm shrink-0">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover mix-blend-lighten" />
                          <button type="button" onClick={() => updateActiveForm({ image: '' })} className="absolute top-2 right-2 bg-black/80 text-red-500 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-xl border border-dashed border-[#2a2a30] flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer bg-[#0e0e11] shrink-0">
                          <Upload className="w-6 h-6 mb-1.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-center">Upload<br/>Image</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    </div>
                  </div>

                  {/* Name & Description */}
                  <div className="bg-[#1c1c21] p-5 rounded-2xl border border-[#2a2a30] shadow-sm space-y-4">
                    <h4 className="text-sm font-medium text-white mb-1.5">Basic Information</h4>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Product Name</label>
                      <input required type="text" value={formData.name} onChange={e => updateActiveForm({ name: e.target.value })} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all" placeholder="E.g. Vintage T-Shirt" />
                      {getFieldError('name') && <p className="text-red-500 text-xs mt-1">{getFieldError('name')}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea rows={2} value={formData.description} onChange={e => updateActiveForm({ description: e.target.value })} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all resize-none" placeholder="Describe the product..." />
                    </div>
                  </div>
                </div>

                {/* 3-Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  
                  {/* 1. Left: Pricing & Inventory */}
                  <div className="bg-[#1c1c21] p-5 rounded-2xl border border-[#2a2a30] shadow-sm space-y-4 flex flex-col">
                    <h4 className="text-sm font-medium text-white mb-1.5">Pricing & Inventory</h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Selling Price ($)</label>
                        <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => updateActiveForm({ price: e.target.value })} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all font-bold" placeholder="0.00" />
                        {getFieldError('price') && <p className="text-red-500 text-xs mt-1">{getFieldError('price')}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Original Price ($)</label>
                        <input type="number" step="0.01" min="0" value={formData.originalPrice} onChange={e => updateActiveForm({ originalPrice: e.target.value })} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all" placeholder="Optional (for discounts)" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                        <input required type="number" min="0" value={formData.stock} onChange={e => updateActiveForm({ stock: e.target.value })} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all" placeholder="0" />
                        {getFieldError('stock') && <p className="text-red-500 text-xs mt-1">{getFieldError('stock')}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Low Stock Alert</label>
                        <input required type="number" min="0" value={formData.lowStockThreshold} onChange={e => updateActiveForm({ lowStockThreshold: e.target.value })} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all" placeholder="5" />
                      </div>
                    </div>
                  </div>

                  {/* 2. Center: Category / Organization */}
                  <div className="bg-[#1c1c21] p-5 rounded-2xl border border-[#2a2a30] shadow-sm space-y-4 flex flex-col">
                    <h4 className="text-sm font-medium text-white mb-1.5">Organization</h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                        <select required value={formData.category} onChange={e => updateActiveForm({ category: e.target.value })} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all">
                          <option value="" disabled>Select a category</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        {getFieldError('category') && <p className="text-red-500 text-xs mt-1">{getFieldError('category')}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sub Category</label>
                        <input type="text" value={formData.subCategory} onChange={e => updateActiveForm({ subCategory: e.target.value })} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all" placeholder="Optional" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select value={formData.status} onChange={e => updateActiveForm({ status: e.target.value as any })} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all">
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 3. Right: Variants */}
                  <div className="bg-[#1c1c21] p-5 rounded-2xl border border-[#2a2a30] shadow-sm space-y-4 flex flex-col">
                    <h4 className="text-sm font-medium text-white mb-1.5">Product Variants</h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Sizes */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sizes (S, M, L)</label>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value={tempSize} onChange={e => setTempSize(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVariantItem('sizes', tempSize, setTempSize))} className="flex-1 bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500" placeholder="Type & Add" />
                          <button type="button" onClick={() => addVariantItem('sizes', tempSize, setTempSize)} className="bg-white/5 hover:bg-white/10 border border-[#2a2a30] text-gray-300 hover:text-white px-3 py-2.5 rounded-xl text-sm font-medium transition-colors">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {variants.sizes?.map((s, idx) => (
                            <span key={idx} className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                              {s} <X className="w-3 h-3 cursor-pointer hover:text-red-500 ml-1" onClick={() => removeVariantItem('sizes', idx)} />
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Colors</label>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value={tempColor} onChange={e => setTempColor(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVariantItem('colors', tempColor, setTempColor))} className="flex-1 bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500" placeholder="Type & Add" />
                          <button type="button" onClick={() => addVariantItem('colors', tempColor, setTempColor)} className="bg-white/5 hover:bg-white/10 border border-[#2a2a30] text-gray-300 hover:text-white px-3 py-2.5 rounded-xl text-sm font-medium transition-colors">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {variants.colors?.map((c, idx) => (
                            <span key={idx} className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                              {c} <X className="w-3 h-3 cursor-pointer hover:text-red-500 ml-1" onClick={() => removeVariantItem('colors', idx)} />
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Materials */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Materials</label>
                        <div className="flex gap-2 mb-3">
                          <input type="text" value={tempMaterial} onChange={e => setTempMaterial(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVariantItem('materials', tempMaterial, setTempMaterial))} className="flex-1 bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500" placeholder="Type & Add" />
                          <button type="button" onClick={() => addVariantItem('materials', tempMaterial, setTempMaterial)} className="bg-white/5 hover:bg-white/10 border border-[#2a2a30] text-gray-300 hover:text-white px-3 py-2.5 rounded-xl text-sm font-medium transition-colors">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {variants.materials?.map((m, idx) => (
                            <span key={idx} className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                              {m} <X className="w-3 h-3 cursor-pointer hover:text-red-500 ml-1" onClick={() => removeVariantItem('materials', idx)} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 border border-blue-500/50">
                    {editingId ? 'Save Changes' : (formDataList.length > 1 ? `Publish ${formDataList.length} Products` : 'Publish Product')}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteConfirmId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() => {
          if (deleteConfirmId) {
             deleteProduct(deleteConfirmId);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
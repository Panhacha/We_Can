"use client";
import { useState, useRef } from 'react';
import { useAdmin, Category } from '@/context/AdminContext';
import Image from 'next/image';
import { Upload, Plus, Pencil, Trash2, Package } from 'lucide-react';
import { z } from 'zod';
import ConfirmModal from '@/components/ui/ConfirmModal';
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50)
});

export default function AdminCategories() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: '', image: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData({ name: category.name, image: category.image });
      setImagePreview(category.image);
    } else {
      setEditingId(null);
      setFormData({ name: '', image: '' });
      setImagePreview('');
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      categorySchema.parse(formData);
      setFormErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) errors[e.path[0].toString()] = e.message;
        });
        setFormErrors(errors);
        return;
      }
    }

    const finalData = { ...formData, image: imagePreview || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&q=80' };
    
    if (editingId) {
      updateCategory(editingId, finalData);
    } else {
      addCategory(finalData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">PAGES / CATEGORIES</h2>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Categories</h1>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2rem] p-6">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-200 placeholder-white/50 focus:outline-none focus:bg-white/10 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider w-1/3">Category</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Product Count</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const productCount = products?.filter(p => p.category === cat.name).length || 0;
                  
                  return (
                    <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                            <Image src={cat.image} alt={cat.name} fill className="object-cover mix-blend-lighten" />
                          </div>
                          <span className="font-medium text-gray-200 text-sm">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-300 text-sm">{productCount}</span>
                            <span className="text-gray-500 text-[11px] ml-1">items</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleOpenModal(cat)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white/5 rounded transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(cat.id)} className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-400">
                    No categories found. Add a new category to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#16161a] border border-[#2a2a30] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#2a2a30] flex justify-between items-center bg-[#16161a]">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#2a2a30] group shrink-0">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover mix-blend-lighten" />
                        <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => fileInputRef.current?.click()} className="w-16 h-16 rounded-xl border-2 border-dashed border-[#2a2a30] flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer bg-white/5">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Upload</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    <div className="text-sm text-gray-400">
                      <p className="font-medium text-gray-200">Upload an image</p>
                      <p className="text-xs text-gray-500 mt-0.5">Recommended size: 500x500px.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0e0e11] border border-[#2a2a30] rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:bg-white/5 focus:outline-none focus:border-blue-500 transition-all" placeholder="E.g. Electronics" />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#2a2a30]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/30">
                  {editingId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteConfirmId}
        title="Delete Category"
        message="Are you sure you want to delete this category? This will affect products associated with it."
        onConfirm={() => {
          if (deleteConfirmId) {
             deleteCategory(deleteConfirmId);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}

"use client";
import { useState, useRef } from 'react';
import { useAdmin, Banner } from '@/context/AdminContext';
import { Plus, Pencil, Trash2, Search, X, Upload, Calendar, Link as LinkIcon } from 'lucide-react';
import { z } from 'zod';
import ConfirmModal from '@/components/ui/ConfirmModal';
const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  desktop_image: z.string().min(1, "Desktop image is required"),
  mobile_image: z.string().optional(),
  target_url: z.string().optional(),
  cta_text: z.string().optional(),
  position: z.enum(['Hero', 'Middle', 'Category']),
  sort_order: z.number().int(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_active: z.boolean()
});

export default function AdminBanners() {
  const { banners, addBanner, updateBanner, deleteBanner } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', subtitle: '', desktop_image: '', mobile_image: '',
    target_url: '', cta_text: '', position: 'Hero' as 'Hero' | 'Middle' | 'Category',
    sort_order: '0', start_date: '', end_date: '', is_active: true
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const filteredBanners = (banners || []).filter(b => 
    (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        desktop_image: banner.desktop_image,
        mobile_image: banner.mobile_image || '',
        target_url: banner.target_url || '',
        cta_text: banner.cta_text || '',
        position: banner.position,
        sort_order: banner.sort_order.toString(),
        start_date: banner.start_date ? new Date(banner.start_date).toISOString().slice(0,16) : '',
        end_date: banner.end_date ? new Date(banner.end_date).toISOString().slice(0,16) : '',
        is_active: banner.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '', subtitle: '', desktop_image: '', mobile_image: '',
        target_url: '', cta_text: '', position: 'Hero',
        sort_order: '0', start_date: '', end_date: '', is_active: true
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if too large
          const MAX_WIDTH = type === 'desktop' ? 1920 : 800;
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             // Compress to JPEG with 70% quality to reduce base64 size
             const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
             if (type === 'desktop') setFormData(prev => ({ ...prev, desktop_image: dataUrl }));
             if (type === 'mobile') setFormData(prev => ({ ...prev, mobile_image: dataUrl }));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      bannerSchema.parse({
        ...formData,
        sort_order: parseInt(formData.sort_order) || 0
      });
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

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      desktop_image: formData.desktop_image,
      mobile_image: formData.mobile_image,
      target_url: formData.target_url,
      cta_text: formData.cta_text,
      position: formData.position,
      sort_order: parseInt(formData.sort_order) || 0,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : undefined,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
      is_active: formData.is_active
    };

    if (editingId) {
      updateBanner(editingId, payload);
    } else {
      addBanner(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20" suppressHydrationWarning>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">PAGES / BANNERS</h2>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Banner Management</h1>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2rem] p-6">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search banners..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-200 placeholder-white/50 focus:outline-none focus:bg-white/10 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Banner</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Position & Order</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Schedule</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Clicks (CTR)</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBanners.length > 0 ? (
                filteredBanners.map((banner) => {
                  return (
                    <tr key={banner.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10 relative">
                            <img src={banner.desktop_image} alt={banner.title || 'Banner'} className="w-full h-full object-cover mix-blend-lighten" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-200 text-sm block">{banner.title || 'Untitled Banner'}</span>
                            <a href={banner.target_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5">
                              <LinkIcon className="w-3 h-3" /> {banner.target_url ? banner.target_url.slice(0, 30) + '...' : 'No Link'}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-300 block text-sm">{banner.position}</span>
                        <span className="text-[11px] text-white/40">Order: {banner.sort_order}</span>
                      </td>
                      <td className="py-4 px-6">
                        {banner.start_date || banner.end_date ? (
                          <div className="text-[11px] text-white/50">
                            <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-white/40" /> Start: {banner.start_date ? new Date(banner.start_date).toLocaleDateString() : 'Now'}</div>
                            <div className="flex items-center gap-1 mt-1"><Calendar className="w-3 h-3 text-white/40" /> End: {banner.end_date ? new Date(banner.end_date).toLocaleDateString() : 'Never'}</div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-white/40">Always Show</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                          banner.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-200 text-sm">{banner.clicks || 0}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleOpenModal(banner)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(banner.id)} className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/40">
                    No banners found. Add a new banner to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-10 overflow-y-auto">
          <div className="bg-[#16161a] border border-white/10 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col my-auto sm:my-0 mb-10 relative">
            <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-[#16161a] shrink-0 sticky top-0 z-10">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Banner' : 'Add New Banner'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              
              {/* Images Section */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm">
                <h4 className="text-sm font-bold text-white mb-4">Banner Images</h4>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Desktop Image */}
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Desktop Version (Required)</label>
                    {formData.desktop_image ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 group shadow-sm bg-white/5">
                        <img src={formData.desktop_image} alt="Desktop Preview" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => setFormData({...formData, desktop_image: ''})} className="absolute top-2 right-2 bg-black/80 text-red-400 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => desktopInputRef.current?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/40 hover:border-primary hover:text-primary transition-colors cursor-pointer bg-white/5">
                        <Upload className="w-6 h-6 mb-1.5" />
                        <span className="text-xs font-bold uppercase tracking-wider text-center">Upload Desktop<br/>(1920x600)</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" ref={desktopInputRef} onChange={(e) => handleImageUpload(e, 'desktop')} className="hidden" />
                    {formErrors.desktop_image && <p className="text-red-400 text-xs mt-1">{formErrors.desktop_image}</p>}
                  </div>

                  {/* Mobile Image */}
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Mobile Version (Optional)</label>
                    {formData.mobile_image ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 group shadow-sm bg-white/5">
                        <img src={formData.mobile_image} alt="Mobile Preview" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => setFormData({...formData, mobile_image: ''})} className="absolute top-2 right-2 bg-black/80 text-red-400 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => mobileInputRef.current?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/40 hover:border-primary hover:text-primary transition-colors cursor-pointer bg-white/5">
                        <Upload className="w-6 h-6 mb-1.5" />
                        <span className="text-xs font-bold uppercase tracking-wider text-center">Upload Mobile<br/>(800x800)</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" ref={mobileInputRef} onChange={(e) => handleImageUpload(e, 'mobile')} className="hidden" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left Col: Text & Links */}
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-white mb-1.5">Content & Links</h4>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="Optional Title" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Subtitle</label>
                    <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="Optional Subtitle" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Button Text</label>
                      <input type="text" value={formData.cta_text} onChange={e => setFormData({...formData, cta_text: e.target.value})} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="e.g. Shop Now" />
                    </div>
                    <div className="flex-[2]">
                      <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Target URL</label>
                      <input type="text" value={formData.target_url} onChange={e => setFormData({...formData, target_url: e.target.value})} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="/shop or https://..." />
                    </div>
                  </div>
                </div>

                {/* Right Col: Settings & Schedule */}
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-white mb-1.5">Settings & Schedule</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Position</label>
                      <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value as any})} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all">
                        <option value="Hero">Hero (Top Main Slider)</option>
                        <option value="Middle">Middle (Promo Section)</option>
                        <option value="Category">Category (Page Header)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Sort Order</label>
                      <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: e.target.value})} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="0" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Start Date</label>
                      <input type="datetime-local" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">End Date</label>
                      <input type="datetime-local" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>

                  <div className="pt-2">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 rounded border-white/10 bg-[#16161a] text-blue-500 focus:ring-blue-500 focus:ring-offset-0" />
                        <span className="font-bold text-white/90">Banner is Active</span>
                     </label>
                  </div>
                </div>
              </div>

              <div className="pt-2 sticky bottom-0 z-10 bg-[#16161a] -mx-8 -mb-8 px-8 py-5 border-t border-[#2a2a30] flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 border border-blue-500/50">
                  {editingId ? 'Save Changes' : 'Publish Banner'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteConfirmId}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        onConfirm={() => {
          if (deleteConfirmId) {
             deleteBanner(deleteConfirmId);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}

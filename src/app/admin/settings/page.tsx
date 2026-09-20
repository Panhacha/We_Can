"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAdmin, StoreSettings } from '@/context/AdminContext';
import { Save, Plus, Trash2, MapPin, Phone, Mail, CheckCircle2, AlertCircle, X, Settings2, Image as ImageIcon, Edit3, Type, Heading, Star, Layout, List, PhoneCall } from 'lucide-react';
import Image from 'next/image';

const iconList = ['Heart', 'Star', 'Shield', 'Truck', 'Package', 'Tag', 'Clock', 'ThumbsUp', 'CheckCircle2'];

const defaultSettings: StoreSettings = {
  id: 1,
  brand_story: '<p>Our story begins here...</p>',
  mission_statement: 'Modern Style & Trusted Quality',
  why_choose_us: [],
  stats: [],
  team_photos: [],
  team_members: [],
  contact_info: { phone: '', email: '', address: '', telegram: '', facebook: '', instagram: '', tiktok: '', map_embed: '' },
  seo_metadata: { meta_title: '', meta_description: '', og_image: '', hero_subtitle: '', hero_desktop: '', hero_mobile: '', story_image: '', gallery: [] }
};

export default function AdminSettingsVisual() {
  const { settings, updateSettings } = useAdmin();
  const [formData, setFormData] = useState<StoreSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'hero' | 'story' | 'values' | 'stats' | 'gallery' | 'contact' | 'seo'>('hero');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (settings) {
      setFormData({
        ...defaultSettings,
        ...settings,
        contact_info: { ...defaultSettings.contact_info, ...settings.contact_info },
        seo_metadata: { ...defaultSettings.seo_metadata, ...settings.seo_metadata }
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(formData);
      showToast("CMS Settings saved successfully!", 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Failed to save settings.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof StoreSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const updateContact = (field: keyof StoreSettings['contact_info'], value: string) => {
    setFormData(prev => ({ ...prev, contact_info: { ...prev.contact_info, [field]: value } }));
  };

  const updateSeo = (field: keyof StoreSettings['seo_metadata'], value: any) => {
    setFormData(prev => ({ ...prev, seo_metadata: { ...prev.seo_metadata, [field]: value } }));
  };

  const processImage = (file: File, maxWidth: number, callback: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) { height = Math.round(height * (maxWidth / width)); width = maxWidth; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
           ctx.drawImage(img, 0, 0, width, height);
           callback(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, maxWidth: number, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) processImage(file, maxWidth, callback);
  };

  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const currentGallery = formData.seo_metadata.gallery || [];
    Array.from(files).forEach(file => {
      processImage(file, 800, (url) => {
        setFormData(prev => ({ ...prev, seo_metadata: { ...prev.seo_metadata, gallery: [...(prev.seo_metadata.gallery || []), url] } }));
      });
    });
  };

  const inputClass = "w-full bg-[#16161a] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3 outline-none text-white text-sm transition-all";
  const labelClass = "block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2";

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Layout },
    { id: 'story', label: 'Brand Story', icon: Edit3 },
    { id: 'values', label: 'Core Values', icon: Star },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'contact', label: 'Contact Info', icon: PhoneCall },
    { id: 'seo', label: 'SEO Metadata', icon: Settings2 }
  ] as const;

  return (
    <div className="bg-transparent min-h-screen relative font-sans -mx-6 -mt-6">
      
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-bold text-sm">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-2 text-white/50 hover:text-white"><X className="w-4 h-4"/></button>
        </div>
      )}

      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-2xl bg-[#0f1016]/80 border-b border-white/10 px-8 py-5 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">About Page CMS</h1>
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Live Editor</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 border border-blue-500/50 disabled:opacity-50">
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 sticky top-32">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 border border-blue-500/50' : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'}`}
              >
                <tab.icon className="w-5 h-5 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 lg:p-10 shadow-2xl min-h-[600px]">
          
          {/* 1. Hero Section Management */}
          {activeTab === 'hero' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Hero Section Management</h2>
              
              <div className="grid gap-6">
                <div>
                  <label className={labelClass}>Hero Tagline</label>
                  <input type="text" value={formData.mission_statement} onChange={e => updateField('mission_statement', e.target.value)} className={inputClass} placeholder="e.g. Modern Style & Trusted Quality" />
                </div>
                <div>
                  <label className={labelClass}>Hero Subtitle</label>
                  <textarea rows={2} value={formData.seo_metadata.hero_subtitle} onChange={e => updateSeo('hero_subtitle', e.target.value)} className={inputClass} placeholder="Short description below tagline" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div>
                  <label className={labelClass}>Desktop Banner Image (16:9)</label>
                  <div className="mt-2 relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 bg-black/20 group flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors" onClick={() => document.getElementById('heroDesk')?.click()}>
                    {formData.seo_metadata.hero_desktop ? (
                      <>
                        <Image src={formData.seo_metadata.hero_desktop} alt="Hero Desktop" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ImageIcon className="w-8 h-8 text-white"/></div>
                      </>
                    ) : (
                      <div className="text-center text-white/50"><ImageIcon className="w-8 h-8 mx-auto mb-2"/><span>Upload Desktop Image</span></div>
                    )}
                    <input type="file" id="heroDesk" accept="image/*" className="hidden" onChange={e => handleSingleImageUpload(e, 1920, (url) => updateSeo('hero_desktop', url))} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mobile Banner Image (9:16 or 4:5)</label>
                  <div className="mt-2 relative w-full md:w-3/4 h-48 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 bg-black/20 group flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors mx-auto md:mx-0" onClick={() => document.getElementById('heroMob')?.click()}>
                    {formData.seo_metadata.hero_mobile ? (
                      <>
                        <Image src={formData.seo_metadata.hero_mobile} alt="Hero Mobile" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ImageIcon className="w-8 h-8 text-white"/></div>
                      </>
                    ) : (
                      <div className="text-center text-white/50"><ImageIcon className="w-8 h-8 mx-auto mb-2"/><span>Upload Mobile Image</span></div>
                    )}
                    <input type="file" id="heroMob" accept="image/*" className="hidden" onChange={e => handleSingleImageUpload(e, 800, (url) => updateSeo('hero_mobile', url))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Story & Mission Editor */}
          {activeTab === 'story' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Brand Story & Mission</h2>
              
              <div>
                <label className={labelClass}>Story Content (HTML Supported)</label>
                <div className="bg-[#16161a] border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition-all">
                  <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex gap-2">
                    <span className="text-white/50 text-xs font-bold">Use tags like &lt;p&gt;, &lt;strong&gt;, &lt;br&gt; for formatting</span>
                  </div>
                  <textarea rows={10} value={formData.brand_story} onChange={e => updateField('brand_story', e.target.value)} className="w-full bg-transparent p-4 outline-none text-white text-sm" placeholder="<p>Write your story here...</p>" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Story Side Image</label>
                <div className="mt-2 relative w-full md:w-1/2 h-64 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 bg-black/20 group flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors" onClick={() => document.getElementById('storyImg')?.click()}>
                  {formData.seo_metadata.story_image ? (
                    <>
                      <Image src={formData.seo_metadata.story_image} alt="Story Image" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ImageIcon className="w-8 h-8 text-white"/></div>
                    </>
                  ) : (
                    <div className="text-center text-white/50"><ImageIcon className="w-8 h-8 mx-auto mb-2"/><span>Upload Story Image</span></div>
                  )}
                  <input type="file" id="storyImg" accept="image/*" className="hidden" onChange={e => handleSingleImageUpload(e, 800, (url) => updateSeo('story_image', url))} />
                </div>
              </div>
            </div>
          )}

          {/* 3. Values Cards Manager */}
          {activeTab === 'values' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-white">Core Values (Why Choose Us)</h2>
                <button onClick={() => updateField('why_choose_us', [...formData.why_choose_us, { title: 'New Value', description: '', icon: 'Star' }])} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border border-white/10 transition-all">
                  <Plus className="w-4 h-4"/> Add Value
                </button>
              </div>

              {formData.why_choose_us.length === 0 && <p className="text-white/40 italic text-center py-8">No core values added yet.</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.why_choose_us.map((val: any, idx: number) => (
                  <div key={idx} className="bg-black/20 border border-white/10 p-5 rounded-2xl relative group">
                    <button onClick={() => updateField('why_choose_us', formData.why_choose_us.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors">
                      <Trash2 className="w-5 h-5"/>
                    </button>
                    <div className="space-y-4 pr-8">
                      <div>
                        <label className={labelClass}>Icon</label>
                        <select value={val.icon} onChange={e => { const newArr = [...formData.why_choose_us]; newArr[idx].icon = e.target.value; updateField('why_choose_us', newArr); }} className={inputClass}>
                          {iconList.map(icon => <option key={icon} value={icon} className="bg-gray-900">{icon}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Title</label>
                        <input type="text" value={val.title} onChange={e => { const newArr = [...formData.why_choose_us]; newArr[idx].title = e.target.value; updateField('why_choose_us', newArr); }} className={inputClass} placeholder="e.g. High Quality" />
                      </div>
                      <div>
                        <label className={labelClass}>Description</label>
                        <textarea rows={2} value={val.description} onChange={e => { const newArr = [...formData.why_choose_us]; newArr[idx].description = e.target.value; updateField('why_choose_us', newArr); }} className={inputClass} placeholder="Brief description..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* 5. Gallery Photo Uploader */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-white">Store Gallery</h2>
                <div>
                  <input type="file" id="galleryUpload" multiple accept="image/*" className="hidden" onChange={handleMultiImageUpload} />
                  <button onClick={() => document.getElementById('galleryUpload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border border-blue-500/50 shadow-lg shadow-blue-600/20 transition-all">
                    <Plus className="w-4 h-4"/> Upload Photos
                  </button>
                </div>
              </div>

              {(!formData.seo_metadata.gallery || formData.seo_metadata.gallery.length === 0) && (
                <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center text-white/50">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No photos in gallery. Click "Upload Photos" to add some.</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(formData.seo_metadata.gallery || []).map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group bg-black/50">
                    <Image src={imgUrl} alt={`Gallery ${idx}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button onClick={() => {
                        const newGallery = formData.seo_metadata.gallery?.filter((_, i) => i !== idx);
                        updateSeo('gallery', newGallery);
                      }} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                        <Trash2 className="w-5 h-5"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Contact & Social Media */}
          {activeTab === 'contact' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Contact & Location</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="font-bold text-white/80">Primary Details</h3>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="text" value={formData.contact_info.phone} onChange={e => updateContact('phone', e.target.value)} className={inputClass} placeholder="+855 12 345 678" />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input type="email" value={formData.contact_info.email} onChange={e => updateContact('email', e.target.value)} className={inputClass} placeholder="contact@wecan.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Physical Address</label>
                    <textarea rows={3} value={formData.contact_info.address} onChange={e => updateContact('address', e.target.value)} className={inputClass} placeholder="123 Street Name, City" />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-bold text-white/80">Social Links</h3>
                  <div>
                    <label className={labelClass}>Facebook URL</label>
                    <input type="text" value={formData.contact_info.facebook} onChange={e => updateContact('facebook', e.target.value)} className={inputClass} placeholder="facebook.com/page" />
                  </div>
                  <div>
                    <label className={labelClass}>Instagram URL</label>
                    <input type="text" value={formData.contact_info.instagram} onChange={e => updateContact('instagram', e.target.value)} className={inputClass} placeholder="instagram.com/page" />
                  </div>
                  <div>
                    <label className={labelClass}>TikTok URL</label>
                    <input type="text" value={formData.contact_info.tiktok} onChange={e => updateContact('tiktok', e.target.value)} className={inputClass} placeholder="tiktok.com/@page" />
                  </div>
                  <div>
                    <label className={labelClass}>Telegram URL</label>
                    <input type="text" value={formData.contact_info.telegram} onChange={e => updateContact('telegram', e.target.value)} className={inputClass} placeholder="t.me/username" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <label className={labelClass}>Google Maps Embed Iframe Code</label>
                <textarea rows={3} value={formData.contact_info.map_embed} onChange={e => updateContact('map_embed', e.target.value)} className={inputClass} placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>' />
                {formData.contact_info.map_embed && (
                  <div className="mt-4 w-full h-48 rounded-xl overflow-hidden border border-white/10" dangerouslySetInnerHTML={{ __html: formData.contact_info.map_embed.replace(/width=".*?"/, 'width="100%"').replace(/height=".*?"/, 'height="100%"') }} />
                )}
              </div>
            </div>
          )}

          {/* 7. SEO Metadata */}
          {activeTab === 'seo' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Search Engine Optimization</h2>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className={labelClass}>Meta Title</label>
                  <input type="text" value={formData.seo_metadata.meta_title} onChange={e => updateSeo('meta_title', e.target.value)} className={inputClass} placeholder="About Us - WE can Premium Store" />
                </div>
                <div>
                  <label className={labelClass}>Meta Description (max 160 chars)</label>
                  <textarea rows={4} value={formData.seo_metadata.meta_description} onChange={e => updateSeo('meta_description', e.target.value)} className={inputClass} placeholder="Discover the story behind WE can..." />
                </div>
                <div>
                  <label className={labelClass}>Open Graph (OG) Image URL for Social Sharing</label>
                  <input type="text" value={formData.seo_metadata.og_image} onChange={e => updateSeo('og_image', e.target.value)} className={inputClass} placeholder="https://..." />
                  {formData.seo_metadata.og_image && (
                    <div className="mt-4 relative w-full md:w-1/2 h-40 rounded-xl overflow-hidden border border-white/10">
                      <img src={formData.seo_metadata.og_image} className="w-full h-full object-cover" alt="OG Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

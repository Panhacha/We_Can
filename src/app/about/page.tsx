import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Heart, Star, Shield, Truck, Package, Tag, Clock, ThumbsUp, MapPin, Phone, Mail, Send, Share2, Play, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

const Facebook = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Instagram = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const Tiktok = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3v11a7 7 0 1 1-7-7z"></path>
  </svg>
);

const Telegram = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" x2="11" y1="2" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const iconMap: Record<string, any> = { Heart, Star, Shield, Truck, Package, Tag, Clock, ThumbsUp, CheckCircle2 };

// Generate dynamic metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('store_settings').select('seo_metadata').eq('id', 1).maybeSingle();
  const seo = data?.seo_metadata || {};
  return {
    title: seo.meta_title || "About Us - WE can",
    description: seo.meta_description || "Learn more about WE can store.",
    openGraph: {
      images: seo.og_image ? [seo.og_image] : [],
    }
  };
}

export const revalidate = 60;

export default async function AboutPage() {
  const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 1).maybeSingle();

  // 1. Hero Section Data
  const heroTagline = settings?.mission_statement || 'Modern Style & Trusted Quality';
  const heroSubtitle = settings?.seo_metadata?.hero_subtitle || 'Discover the passion and dedication behind our carefully curated collections.';
  const heroDesktop = settings?.seo_metadata?.hero_desktop || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80';
  const heroMobile = settings?.seo_metadata?.hero_mobile || heroDesktop;

  // 2. Brand Story Data
  const brandStoryHtml = settings?.brand_story || '<p>We merge technology and visual design to create innovative, impactful solutions. Our mission is to deliver designs that are both striking and highly functional, redefining what is possible in the digital space.</p>';
  const storyImage = settings?.seo_metadata?.story_image || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80';

  // 3. Core Values / Why Choose Us Data
  const defaultValues = [
    { title: 'High Quality', description: 'Carefully selected fabrics and materials.', icon: 'Star' },
    { title: 'Affordable Prices', description: 'Premium quality that fits your budget.', icon: 'Tag' },
    { title: 'Fast Delivery', description: 'Quick and secure shipping to your door.', icon: 'Truck' },
    { title: 'Easy Returns', description: 'Hassle-free exchange policy.', icon: 'Heart' }
  ];
  const coreValues = (settings?.why_choose_us && settings.why_choose_us.length > 0) ? settings.why_choose_us : defaultValues;

  // 4. Statistics Data
  const defaultStats = [
    { value: '5,000+', label: 'Happy Customers' },
    { value: '10,000+', label: 'Products Sold' },
    { value: '100%', label: 'Authentic Stock' }
  ];
  const stats = (settings?.stats && settings.stats.length > 0) ? settings.stats : defaultStats;

  // 5. Gallery Data
  const gallery = settings?.seo_metadata?.gallery && settings.seo_metadata.gallery.length > 0
    ? settings.seo_metadata.gallery
    : [
        'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
        'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=600&q=80',
        'https://images.unsplash.com/photo-1558769132-cb1fac0840c2?w=600&q=80'
      ];

  // 6. Contact & Map Data
  const contact = settings?.contact_info || { phone: '', email: '', address: '', telegram: '', facebook: '', instagram: '', tiktok: '', map_embed: '' };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Desktop Image */}
        <div className="hidden md:block absolute inset-0">
          <Image src={heroDesktop} alt="Hero Banner" fill className="object-cover" priority />
        </div>
        {/* Mobile Image */}
        <div className="block md:hidden absolute inset-0">
          <Image src={heroMobile} alt="Hero Banner" fill className="object-cover" priority />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-md leading-tight">
            {heroTagline}
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. Brand Story */}
        <section className="py-24 border-b border-gray-100">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-800 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-black"></span>
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Our Mission & Commitment
              </h2>
              <div 
                className="prose prose-lg text-gray-600 prose-headings:text-gray-900 prose-a:text-black"
                dangerouslySetInnerHTML={{ __html: brandStoryHtml }}
              />
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image src={storyImage} alt="Brand Story" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* 3. Core Values / Why Choose Us */}
        <section className="py-24 border-b border-gray-100">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="text-gray-500 font-medium">What makes us stand out from the rest</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {coreValues.map((value: any, idx: number) => {
              const IconComp = iconMap[value.icon] || CheckCircle2;
              return (
                <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all group flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-black group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-snug">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>



        {/* 5. Store & Team Gallery */}
        <section className="py-24 border-b border-gray-100">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Store Gallery</h2>
            <p className="text-gray-500 font-medium">A glimpse into our store and operations</p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 max-w-6xl mx-auto">
            {gallery.map((imgUrl: string, idx: number) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden group shadow-sm aspect-square">
                <Image src={imgUrl} alt={`Gallery Image ${idx + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Contact & Map */}
        <section className="py-24">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                <p className="text-gray-500 font-medium text-lg">We'd love to hear from you. Here's how you can reach us.</p>
              </div>
              
              <div className="space-y-6">
                {contact.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                      <MapPin className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">{contact.address}</p>
                    </div>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                      <Phone className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                      <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-black">{contact.phone}</a>
                    </div>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                      <Mail className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                      <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-black">{contact.email}</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  {contact.facebook && (
                    <a href={contact.facebook.startsWith('http') ? contact.facebook : `https://${contact.facebook}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white hover:border-transparent transition-all">
                      <Facebook className="w-5 h-5"/>
                    </a>
                  )}
                  {contact.instagram && (
                    <a href={contact.instagram.startsWith('http') ? contact.instagram : `https://${contact.instagram}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#E4405F] hover:text-white hover:border-transparent transition-all">
                      <Instagram className="w-5 h-5"/>
                    </a>
                  )}
                  {contact.tiktok && (
                    <a href={contact.tiktok.startsWith('http') ? contact.tiktok : `https://${contact.tiktok}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-transparent transition-all">
                      <Tiktok className="w-5 h-5"/>
                    </a>
                  )}
                  {contact.telegram && (
                    <a href={contact.telegram.startsWith('http') ? contact.telegram : `https://${contact.telegram}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#229ED9] hover:text-white hover:border-transparent transition-all">
                      <Telegram className="w-5 h-5"/>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="h-[400px] lg:h-auto min-h-[400px] rounded-3xl overflow-hidden bg-gray-100 shadow-inner relative border border-gray-200">
              {contact.map_embed ? (
                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: contact.map_embed.replace(/width=".*?"/, 'width="100%"').replace(/height=".*?"/, 'height="100%"') }} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">Map Not Available</div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

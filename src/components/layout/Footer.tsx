"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer suppressHydrationWarning className="bg-white border-t border-gray-100 pt-16 pb-8" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12" suppressHydrationWarning>
          <div>
            <Link href="/" className="flex flex-col items-start leading-none group">
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase group-hover:opacity-80 transition-opacity">
                WE can
              </span>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-0.5 ml-1">
                Ma La Ra
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your premium destination for fashion. Experience the blend of style and comfort.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop?category=Men's%20Fashion" className="text-gray-500 hover:text-primary text-sm transition-colors">Men's Fashion</Link></li>
              <li><Link href="/shop?category=Women's%20Fashion" className="text-gray-500 hover:text-secondary text-sm transition-colors">Women's Fashion</Link></li>
              <li><Link href="/shop?category=Kids%20Fashion" className="text-gray-500 hover:text-primary text-sm transition-colors">Kids</Link></li>
              <li><Link href="/shop?category=Accessories" className="text-gray-500 hover:text-secondary text-sm transition-colors">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-gray-500 hover:text-primary text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="/support" className="text-gray-500 hover:text-secondary text-sm transition-colors">FAQs</Link></li>
              <li><Link href="/support" className="text-gray-500 hover:text-primary text-sm transition-colors">Shipping Information</Link></li>
              <li><Link href="/support" className="text-gray-500 hover:text-secondary text-sm transition-colors">Returns & Exchanges</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="text-gray-500 text-sm">Email: support@wecan-malara.com</li>
              <li className="text-gray-500 text-sm">Phone: +855 12 345 678</li>
              <li className="text-gray-500 text-sm">Phnom Penh, Cambodia</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2026 WE can - Ma La Ra. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-secondary transition-colors text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import Image from 'next/image';

export default function NewArrivals() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-12 lg:p-20 flex flex-col justify-center">
              <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-4 block">New Arrivals</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                The Spring Collection <br/> is Here.
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Refresh your wardrobe with our latest pieces featuring vibrant colors and breathable fabrics.
              </p>
              <Link href="/new" className="inline-flex w-max items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-secondary hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-secondary/50">
                Explore Now
              </Link>
            </div>
            <div className="h-64 md:h-auto relative min-h-[300px]">
              <Image 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" 
                alt="Spring Collection" 
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


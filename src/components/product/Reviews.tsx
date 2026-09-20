
export default function Reviews({ rating, reviewCount }: { rating: number, reviewCount: number }) {
  return (
    <div className="border-t border-gray-100 py-12 mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h3>
      <div className="flex items-center gap-6 mb-10">
        <div className="text-5xl font-black text-gray-900">{rating}</div>
        <div>
          <div className="flex text-yellow-400 mb-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`w-5 h-5 ${i <= Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ))}
          </div>
          <p className="text-sm text-gray-500 font-medium">Based on {reviewCount} reviews</p>
        </div>
      </div>
      
      {/* Mock Review List */}
      <div className="space-y-8">
        {[
          { name: "Sarah M.", title: "Absolutely love it!", body: "The material is so soft and the fit is perfect. Exactly what I was looking for.", date: "2 weeks ago" },
          { name: "David K.", title: "Great quality", body: "You can really feel the quality in the stitching. Fast shipping too.", date: "1 month ago" }
        ].map((review, i) => (
          <div key={i} className="pb-8 border-b border-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">{review.name.charAt(0)}</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(star => (
                   <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
            </div>
            <h5 className="font-bold text-gray-800 text-sm mb-1 mt-3">{review.title}</h5>
            <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

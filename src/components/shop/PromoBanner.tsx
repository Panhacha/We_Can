export default function PromoBanner() {
  return (
    <div className="w-full bg-[#f4f3ec] rounded-3xl overflow-hidden flex flex-col md:flex-row mb-16 shadow-sm border border-[#e8e6dc]">
      <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
        <span className="inline-block px-3 py-1 bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest rounded-md mb-4 w-max">Limited Time Offer</span>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Spring Sale Is Live!</h2>
        <p className="text-gray-600 mb-8 font-medium">Get up to 30% off on selected items.</p>
        <button className="bg-[#3e5f35] text-white px-6 py-3 rounded-md font-bold w-max hover:bg-[#2c4725] transition-colors flex items-center gap-2">
          Shop the Sale <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
      
      {/* Timer Circle */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#ebe9df] md:bg-transparent">
        <div className="w-48 h-48 bg-white rounded-full shadow-lg flex flex-col items-center justify-center p-6 text-center border-4 border-white">
          <p className="text-sm font-bold text-gray-900 mb-2">Hurry Up!<br/>Offer ends in</p>
          <div className="text-xl font-black text-gray-900 tracking-wider">02 : 14 : 36 : 45</div>
          <div className="flex gap-4 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span>Days</span>
            <span>Hrs</span>
            <span>Mins</span>
            <span>Secs</span>
          </div>
        </div>
      </div>
      
      {/* Decorative Image */}
      <div className="flex-1 hidden lg:block bg-[url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80')] bg-cover bg-center">
      </div>
    </div>
  );
}


export default function SortDropdown() {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500 font-medium">Sort by:</span>
      <select className="bg-transparent text-sm font-semibold text-gray-900 focus:outline-none cursor-pointer hover:text-primary transition-colors">
        <option>Featured</option>
        <option>Newest Arrivals</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
    </div>
  );
}

import { categories } from '../data/products';

interface CategoryFilterProps {
  active: string;
  onChange: (id: string) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            active === cat.id
              ? 'bg-[#2F5D50] text-white shadow-md shadow-[#2F5D50]/20'
              : 'bg-white text-[#2F5D50]/70 hover:text-[#2F5D50] hover:bg-[#A8C686]/20 border border-[#A8C686]/30'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

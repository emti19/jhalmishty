import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cart } from '../types';
import logo from '../../assets/jhalmistylogo.png';

interface HeaderProps {
  cart: Cart;
  onCartOpen: () => void;
}

export function Header({ cart, onCartOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#A8C686]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <a href="/"><img src={logo} alt="Farm Logo" className="h-24 w-auto" /></a>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/products"
              className="text-sm font-medium text-[#2F5D50]/70 hover:text-[#2F5D50] transition-colors duration-200"
            >
              Shop
            </Link>
            {['Our Farm', 'Recipes', 'About'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-[#2F5D50]/70 hover:text-[#2F5D50] transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-[#A8C686]/20 transition-colors duration-200">
              <Search className="w-4 h-4 text-[#2F5D50]" />
            </button>
            <button
              onClick={onCartOpen}
              className="relative flex items-center gap-2 bg-[#2F5D50] hover:bg-[#264d43] text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cart.count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#F4A261] rounded-full text-xs font-bold flex items-center justify-center text-white">
                  {cart.count}
                </span>
              )}
            </button>
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#A8C686]/20 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#2F5D50]" />
              ) : (
                <Menu className="w-5 h-5 text-[#2F5D50]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-t border-[#A8C686]/20 px-4 py-4 flex flex-col gap-3">
          <Link
            to="/products"
            className="text-sm font-medium text-[#2F5D50]/70 hover:text-[#2F5D50] py-2 transition-colors"
          >
            Shop
          </Link>
          {['Our Farm', 'Recipes', 'About'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-[#2F5D50]/70 hover:text-[#2F5D50] py-2 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

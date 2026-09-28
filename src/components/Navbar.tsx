import React from 'react';
import { BookOpen, Camera, ShoppingBag, MessageSquare, MapPin } from 'lucide-react';

interface NavbarProps {
  activeTab: 'scanner' | 'catalog' | 'books' | 'about';
  setActiveTab: (tab: 'scanner' | 'catalog' | 'books' | 'about') => void;
  orderItemsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, orderItemsCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-2.5 text-right group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-800 text-amber-50 flex items-center justify-center font-bold text-lg shadow-sm">
              <BookOpen className="w-5 h-5 text-amber-200" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
              مكتبة السالمي — أدرار
            </span>
          </button>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`transition-colors flex items-center gap-1.5 py-1 ${
                activeTab === 'scanner'
                  ? 'text-amber-800 border-b-2 border-amber-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>معالجة القوائم والصور</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`transition-colors flex items-center gap-1.5 py-1 ${
                activeTab === 'catalog'
                  ? 'text-amber-800 border-b-2 border-amber-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>دليل الأسعار والأدوات</span>
            </button>

            <button
              onClick={() => setActiveTab('books')}
              className={`transition-colors flex items-center gap-1.5 py-1 ${
                activeTab === 'books'
                  ? 'text-amber-800 border-b-2 border-amber-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>استعلام الكتب والمراجع</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`transition-colors flex items-center gap-1.5 py-1 ${
                activeTab === 'about'
                  ? 'text-amber-800 border-b-2 border-amber-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>مقر المكتبة بأدرار</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('scanner')}
              className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-800 rounded-lg hover:bg-amber-900 transition-colors shadow-sm whitespace-nowrap"
            >
              <Camera className="w-4 h-4" />
              <span>مسح قائمة الآن</span>
              {orderItemsCount > 0 && (
                <span className="bg-amber-600 text-white text-xs px-1.5 py-0.5 rounded-full font-mono">
                  {orderItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-stone-100 text-xs font-medium">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'scanner' ? 'text-amber-800 font-bold' : 'text-stone-600'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>ماسح القوائم</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'catalog' ? 'text-amber-800 font-bold' : 'text-stone-600'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الأسعار</span>
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'books' ? 'text-amber-800 font-bold' : 'text-stone-600'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>الكتب</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'about' ? 'text-amber-800 font-bold' : 'text-stone-600'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>أدرار</span>
          </button>
        </div>
      </div>
    </header>
  );
};

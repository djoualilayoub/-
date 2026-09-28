import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ListScanner } from './components/ListScanner';
import { PriceCatalogView } from './components/PriceCatalogView';
import { BookAdvisor } from './components/BookAdvisor';
import { StoreAboutView } from './components/StoreAboutView';
import { BookItem, OrderItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'catalog' | 'books' | 'about'>('scanner');
  const [orderItemsCount, setOrderItemsCount] = useState<number>(0);

  const handleAddBookToOrder = (book: BookItem) => {
    setOrderItemsCount((prev) => prev + 1);
    setActiveTab('scanner');
  };

  const handleAddItemToOrder = (item: OrderItem) => {
    setOrderItemsCount((prev) => prev + item.quantity);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-200">
      {/* Top Bar adhering to 3-zone contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orderItemsCount={orderItemsCount}
      />

      {/* Hero presentation shown on scanner tab */}
      {activeTab === 'scanner' && (
        <HeroSection
          onStartScan={() => {
            const scannerElem = document.getElementById('scanner-section');
            scannerElem?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreCatalog={() => setActiveTab('catalog')}
          onExploreBooks={() => setActiveTab('books')}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'scanner' && (
          <div id="scanner-section">
            <ListScanner />
          </div>
        )}

        {activeTab === 'catalog' && (
          <PriceCatalogView onAddItemToOrder={handleAddItemToOrder} />
        )}

        {activeTab === 'books' && (
          <BookAdvisor onAddBookToOrder={handleAddBookToOrder} />
        )}

        {activeTab === 'about' && (
          <StoreAboutView />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="no-print bg-white border-t border-stone-200 py-8 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div>
            <div className="font-bold text-stone-900">مكتبة ووراقة السالمي — أدرار (الجزائر)</div>
            <div className="text-stone-500 mt-0.5">
              خدمة معالجة قوائم الأدوات المدرسية بالذكاء الاصطناعي ومطابقة الأسعار الرسمية بالدينار الجزائري (د.ج).
            </div>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>وسط مدينة أدرار</span>
            <span aria-hidden="true">·</span>
            <span>واتساب: 0661.23.45.67</span>
            <span aria-hidden="true">·</span>
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

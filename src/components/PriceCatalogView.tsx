import React, { useState } from 'react';
import { ShoppingBag, Search, Plus, Check } from 'lucide-react';
import { DEFAULT_CATALOG } from '../data/defaultCatalog';
import { CatalogItem, OrderItem } from '../types';

interface PriceCatalogViewProps {
  onAddItemToOrder: (item: OrderItem) => void;
}

export const PriceCatalogView: React.FC<PriceCatalogViewProps> = ({ onAddItemToOrder }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'جميع اللوازم' },
    { id: 'notebooks', label: 'الكراريس' },
    { id: 'paper', label: 'الأوراق المزدوجة والفردية' },
    { id: 'pens', label: 'أقلام وسيالات' },
    { id: 'geometry', label: 'أدوات الهندسة' },
    { id: 'uniforms', label: 'المآزر المدرسية' },
    { id: 'bac_series', label: 'سلاسل البكالوريا' },
    { id: 'accessories', label: 'الملحقات والأغلفة' },
  ];

  const filteredItems = DEFAULT_CATALOG.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameFr && item.nameFr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleAdd = (item: CatalogItem) => {
    const orderItem: OrderItem = {
      id: `cat-item-${Date.now()}-${item.id}`,
      name: item.name,
      specifications: item.unit,
      quantity: 1,
      unitPrice: item.price,
      totalPrice: item.price,
      isEstimated: Boolean(item.isEstimated),
      category: item.category,
      confidence: 'high',
    };

    onAddItemToOrder(orderItem);
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <div className="space-y-6 text-right">
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-800" />
              <span>دليل أسعار مكتبة السالمي المعتمد — أدرار</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              الأسعار الرسمية للكراريس، الأقلام، المآزر وسلاسل البكالوريا بالدينار الجزائري (د.ج).
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="ابحث في الأسعار والأدوات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pr-9 pl-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-800 focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-stone-200 mt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeCategory === cat.id
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isAdded = addedMap[item.id];

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between hover:border-amber-700/50 transition-all text-right"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-mono text-[11px] text-stone-400">{item.nameFr}</span>
                  <span className="text-emerald-700 font-medium">متوفر</span>
                </div>

                <h3 className="font-bold text-sm text-stone-900 leading-snug">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-stone-900 font-mono tabular-nums">
                    {item.price}
                  </span>
                  <span className="text-xs text-stone-600 mr-1 font-sans">د.ج</span>
                  <span className="text-[11px] text-stone-400 block font-sans">
                    لكل {item.unit}
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(item)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-amber-800 hover:bg-amber-900 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>أضيفت للطلبية</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة للطلبية</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

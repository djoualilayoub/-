import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, RefreshCw } from 'lucide-react';
import { OrderItem } from '../types';

interface QuotationTableProps {
  items: OrderItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (item: Omit<OrderItem, 'id' | 'totalPrice'>) => void;
  onUpdateItem: (id: string, updatedFields: Partial<OrderItem>) => void;
  onReset: () => void;
  detectedGrade?: string;
}

export const QuotationTable: React.FC<QuotationTableProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onAddItem,
  onUpdateItem,
  onReset,
  detectedGrade,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemSpec, setNewItemSpec] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(120);
  const [newItemQty, setNewItemQty] = useState(1);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      specifications: newItemSpec.trim() || undefined,
      quantity: newItemQty,
      unitPrice: newItemPrice,
      isEstimated: false,
      confidence: 'high',
    });

    setNewItemName('');
    setNewItemSpec('');
    setNewItemPrice(120);
    setNewItemQty(1);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900">
              الفاتورة التقديرية للأدوات المدرسية
            </h2>
            {detectedGrade && (
              <span className="text-xs font-medium text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
                {detectedGrade}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            جميع الأسعار مطابقة لتسعيرة مكتبة السالمي (أدرار) بالدينار الجزائري (د.ج) ويمكن تعديلها.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-800" />
            <span>إضافة أداة / كراس يدوي</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-stone-500 hover:text-rose-600 text-xs rounded-lg transition-colors"
            title="إعادة ضبط القائمة"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تفريغ</span>
          </button>
        </div>
      </div>

      {/* Manual Add Form Drawer/Box */}
      {showAddForm && (
        <form
          onSubmit={handleAddNew}
          className="p-4 bg-stone-50 border-b border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-3 text-right"
        >
          <div className="sm:col-span-5">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              اسم الأداة أو الكراس:
            </label>
            <input
              type="text"
              placeholder="مثلاً: كراس رسم كانسون، مقص، لوحة..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-800 focus:outline-none"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              مواصفات إضافية:
            </label>
            <input
              type="text"
              placeholder="مثلاً: حجم كبير، لون أزرق..."
              value={newItemSpec}
              onChange={(e) => setNewItemSpec(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-800 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-700 mb-1">الكمية:</label>
            <input
              type="number"
              min="1"
              value={newItemQty}
              onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-800 focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-700 mb-1">السعر (د.ج):</label>
            <input
              type="number"
              min="5"
              step="5"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-800 focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-12 flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              إضافة إلى الفاتورة
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 bg-stone-200 text-stone-700 text-xs font-medium rounded-lg"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Table Content */}
      {items.length === 0 ? (
        <div className="p-8 text-center text-stone-500">
          <p className="text-sm">لا توجد مواد في الفاتورة حالياً.</p>
          <p className="text-xs text-stone-400 mt-1">
            قم بتصوير أو رفع صورة قائمتك المدرسية، أو اختر أحد النماذج الجاهزة أعلاه.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">اسم المادة / الكراس</th>
                <th className="py-3 px-4 text-center">الكمية</th>
                <th className="py-3 px-4 text-left">سعر الوحدة</th>
                <th className="py-3 px-4 text-left">الإجمالي</th>
                <th className="py-3 px-3 text-center w-20">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {items.map((item, index) => {
                const isEditingThisPrice = editingItemId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-stone-400 font-mono text-xs">
                      {index + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{item.name}</div>
                      {item.specifications && (
                        <div className="text-xs text-stone-500 mt-0.5">{item.specifications}</div>
                      )}
                      {item.note && (
                        <div className="text-[11px] text-amber-700 mt-0.5">{item.note}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded-md">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded font-bold"
                          title="إنقاص"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs px-1 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded font-bold"
                          title="زيادة"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-left font-mono tabular-nums">
                      {isEditingThisPrice ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 px-1 py-0.5 text-xs border border-stone-300 rounded font-mono"
                          />
                          <button
                            onClick={() => {
                              onUpdateItem(item.id, {
                                unitPrice: editingPrice,
                                totalPrice: editingPrice * item.quantity,
                                isEstimated: false,
                              });
                              setEditingItemId(null);
                            }}
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <span>{item.unitPrice} د.ج</span>
                          {item.isEstimated && (
                            <span className="text-[10px] text-amber-800 font-sans">
                              (سعر تقريبي)
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setEditingItemId(item.id);
                              setEditingPrice(item.unitPrice);
                            }}
                            className="text-stone-400 hover:text-stone-700 p-0.5"
                            title="تعديل السعر"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-left font-mono font-bold text-stone-900 tabular-nums">
                      {item.totalPrice} د.ج
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                        title="حذف هذا البند"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bill Footer Summary */}
      {items.length > 0 && (
        <div className="bg-stone-50 border-t border-stone-200 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-right text-xs text-stone-500 space-y-0.5">
              <div>إجمالي المواد المختارة: <span className="font-bold text-stone-800">{items.length} صنف</span> ({totalItemsCount} قطعة)</div>
              <div>مكان الاستلام: <span className="font-medium text-stone-700">مقر مكتبة السالمي - وسط أدرار</span></div>
            </div>

            <div className="flex items-baseline gap-3 text-right">
              <span className="text-sm font-semibold text-stone-600">الإجمالي التقديري:</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-mono tabular-nums">
                {totalAmount} <span className="text-lg font-sans text-stone-700">د.ج</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

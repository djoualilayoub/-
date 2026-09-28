import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { AmbiguousItem, OrderItem } from '../types';

interface AmbiguityResolverProps {
  ambiguities: AmbiguousItem[];
  onResolve: (ambiguityId: string, resolvedItem: OrderItem) => void;
  onDismiss: (ambiguityId: string) => void;
}

export const AmbiguityResolver: React.FC<AmbiguityResolverProps> = ({
  ambiguities,
  onResolve,
  onDismiss,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState(150);
  const [customQty, setCustomQty] = useState(1);

  if (ambiguities.length === 0) return null;

  const unresolved = ambiguities.filter((a) => !a.resolved);
  if (unresolved.length === 0) return null;

  return (
    <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-200 text-amber-900 rounded-lg shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="text-right">
          <h3 className="text-base font-bold text-amber-950">
            تنبيه حول قراءة خط اليد ({unresolved.length} بند بحاجة لتأكيد)
          </h3>
          <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
            لضمان دقة الفاتورة المجهزة من مكتبة السالمي، يرجى مراجعة وتأكيد البنود ذات الخط غير الواضح:
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {unresolved.map((amb) => {
          const isEditing = editingId === amb.id;

          return (
            <div
              key={amb.id}
              className="bg-white border border-amber-200 rounded-lg p-3.5 sm:p-4 text-right transition-all shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                    <span>موقع البند:</span>
                    <span className="text-amber-900 font-medium bg-amber-100/70 px-2 py-0.5 rounded">
                      {amb.location}
                    </span>
                  </div>

                  {/* Standard Question Format requested by user */}
                  <p className="text-sm font-semibold text-stone-900 leading-snug">
                    {amb.question}
                  </p>

                  <div className="text-xs text-stone-600 flex items-center gap-2">
                    <span>النص المشوش الأصلي:</span>
                    <span className="font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                      {amb.recognizedFragment || 'غير مقروء'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>السعر المقترح:</span>
                    <span className="font-mono font-bold text-stone-900">{amb.suggestedPrice} د.ج</span>
                  </div>
                </div>

                {/* Action buttons */}
                {!isEditing && (
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => {
                        const resolvedItem: OrderItem = {
                          id: `resolved-${amb.id}`,
                          name: amb.suggestedItem,
                          specifications: 'تم التأكيد بناءً على اقتراح المساعد',
                          quantity: 1,
                          unitPrice: amb.suggestedPrice,
                          totalPrice: amb.suggestedPrice,
                          isEstimated: false,
                          confidence: 'high',
                        };
                        onResolve(amb.id, resolvedItem);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>نعم، هو المطلوب</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(amb.id);
                        setCustomName(amb.suggestedItem);
                        setCustomPrice(amb.suggestedPrice);
                        setCustomQty(1);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-md transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                      <span>تعديل يدوي</span>
                    </button>

                    <button
                      onClick={() => onDismiss(amb.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md transition-colors"
                      title="تجاهل وحذف هذا البند"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Inline Edit Form if user taps 'تعديل يدوي' */}
              {isEditing && (
                <div className="mt-3 pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-2 text-right">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      اسم المادة الصحيح (كما طلبه الأستاذ):
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">الكمية:</label>
                    <input
                      type="number"
                      min="1"
                      value={customQty}
                      onChange={(e) => setCustomQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">السعر (د.ج):</label>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-md focus:ring-1 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-end gap-1.5">
                    <button
                      onClick={() => {
                        const resolvedItem: OrderItem = {
                          id: `resolved-${amb.id}`,
                          name: customName || amb.suggestedItem,
                          specifications: 'تم التعديل يدوياً من طرف الزبون',
                          quantity: customQty,
                          unitPrice: customPrice,
                          totalPrice: customPrice * customQty,
                          isEstimated: false,
                          confidence: 'high',
                        };
                        onResolve(amb.id, resolvedItem);
                        setEditingId(null);
                      }}
                      className="w-full py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-md transition-colors"
                    >
                      حفظ وتحديث
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="py-1.5 px-2 bg-stone-200 text-stone-700 text-xs rounded-md"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

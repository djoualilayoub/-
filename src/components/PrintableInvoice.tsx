import React from 'react';
import { OrderItem } from '../types';
import { Printer, X } from 'lucide-react';

interface PrintableInvoiceProps {
  items: OrderItem[];
  detectedGrade?: string;
  notes?: string;
  onClose: () => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({
  items,
  detectedGrade,
  notes,
  onClose,
}) => {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const invoiceNumber = `SALMI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateFormatted = new Date().toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden text-right border border-stone-300">
        {/* Modal Controls (No print) */}
        <div className="no-print bg-stone-100 px-6 py-3 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>تأكيد وطباعة الفاتورة</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Paper Area */}
        <div className="p-8 sm:p-10 space-y-6 text-stone-900 bg-white" id="printable-area">
          {/* Header */}
          <div className="border-b-2 border-stone-900 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-stone-900">
                  مكتبة ووراقة السالمي
                </h1>
                <p className="text-xs text-stone-600 mt-0.5">
                  بيع الكتب المدرسية، الأدوات المكتبية، سلاسل البكالوريا واللوازم الجامعية
                </p>
                <p className="text-xs text-stone-500 mt-0.5 font-mono">
                  ولاية أدرار (01) — وسط المدينة — هاتف: 0661.XX.XX.XX
                </p>
              </div>

              <div className="text-left font-mono text-xs text-stone-600 space-y-1">
                <div>رقم الوصل: <span className="font-bold text-stone-900">{invoiceNumber}</span></div>
                <div>التاريخ: {dateFormatted}</div>
                {detectedGrade && (
                  <div>المستوى: <span className="font-semibold text-stone-800">{detectedGrade}</span></div>
                )}
              </div>
            </div>
          </div>

          {/* Title banner */}
          <div className="text-center py-1 bg-stone-100 rounded text-stone-800 font-bold text-sm tracking-wide">
            وصل تقديري لطلبية الأدوات المدرسية
          </div>

          {/* Table */}
          <table className="w-full text-right text-xs border border-stone-300 divide-y divide-stone-200">
            <thead className="bg-stone-100 font-bold text-stone-700">
              <tr>
                <th className="py-2.5 px-3 border-l border-stone-300 w-10 text-center">#</th>
                <th className="py-2.5 px-3 border-l border-stone-300">بيان المادة والمواصفات</th>
                <th className="py-2.5 px-3 border-l border-stone-300 text-center w-16">الكمية</th>
                <th className="py-2.5 px-3 border-l border-stone-300 text-left w-24">سعر الوحدة</th>
                <th className="py-2.5 px-3 text-left w-24">المجموع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-stone-800">
              {items.map((item, index) => (
                <tr key={item.id} className="even:bg-stone-50/50">
                  <td className="py-2 px-3 border-l border-stone-300 text-center font-mono">
                    {index + 1}
                  </td>
                  <td className="py-2 px-3 border-l border-stone-300 font-medium">
                    {item.name}
                    {item.specifications && (
                      <span className="text-[11px] text-stone-500 block">
                        {item.specifications}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 border-l border-stone-300 text-center font-mono tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="py-2 px-3 border-l border-stone-300 text-left font-mono tabular-nums">
                    {item.unitPrice} د.ج
                    {item.isEstimated && <span className="text-[10px] block text-stone-400">تقريبي</span>}
                  </td>
                  <td className="py-2 px-3 text-left font-mono font-bold tabular-nums">
                    {item.totalPrice} د.ج
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-stone-100 font-bold text-stone-900 border-t-2 border-stone-400">
                <td colSpan={4} className="py-2.5 px-3 text-right">
                  الإجمالي التقديري المطلوب تسديده:
                </td>
                <td className="py-2.5 px-3 text-left font-mono text-sm tabular-nums text-amber-900">
                  {totalAmount} د.ج
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Notes and Store Signature */}
          <div className="grid grid-cols-2 gap-6 pt-4 text-xs">
            <div className="border border-stone-200 p-3 rounded space-y-1">
              <div className="font-bold text-stone-700">ملاحظات وتعليمات الاستلام:</div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {notes || 'يتم تجهيز الطلبية فور إرسال رسالة التأكيد عبر الواتساب. يرجى إحضار هذا الوصل أو رقم الطلبية عند التوجه لمقر المكتبة.'}
              </p>
            </div>

            <div className="border border-stone-200 p-3 rounded flex flex-col justify-between items-center text-center">
              <div className="font-bold text-stone-700">خاتم وتأشيرة مكتبة السالمي - أدرار</div>
              <div className="w-24 h-16 border border-dashed border-stone-300 rounded flex items-center justify-center text-[10px] text-stone-400 font-serif">
                ختم المحل
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Printer, Sparkles, Send } from 'lucide-react';
import { OrderItem } from '../types';

interface WhatsAppPreviewProps {
  items: OrderItem[];
  notes?: string;
  onPrint: () => void;
  bookstoreWhatsAppNumber?: string;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  items,
  notes,
  onPrint,
  bookstoreWhatsAppNumber = '213661234567', // Adrar Librairie Essalmi contact
}) => {
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const totalAmount = items.reduce((sum, it) => sum + it.totalPrice, 0);

  // Exact prompt structure:
  const itemsLines = items
    .map(
      (item) =>
        `- ${item.name}${item.specifications ? ` (${item.specifications})` : ''} [كمية: ${item.quantity}]: ${item.totalPrice} د.ج${
          item.isEstimated ? ' (سعر تقريبي)' : ''
        }`
    )
    .join('\n');

  const notesText =
    notes && notes.trim().length > 0
      ? notes
      : 'جميع المواد المذكورة متوفرة بالمخزن وجاهزة للتجهيز الفوري.';

  const customerPrefix =
    customerName.trim() || customerPhone.trim()
      ? `👤 اسم الزبون: ${customerName || 'غير محدد'} | 📞 الهاتف: ${customerPhone || 'غير محدد'}\n\n`
      : '';

  const fullWhatsAppMessage = `${customerPrefix}مرحباً بك في مكتبة السالمي 📚!
تمت معالجة القائمة الخاصة بك بنجاح، إليك التفاصيل:

📋 **قائمة الأدوات المطلوبة:**
${itemsLines}

💰 **الإجمالي التقديري:** ${totalAmount} د.ج

📌 **ملاحظات:** ${notesText}

هل ترغب في حجز هذه الطلبية لتجهيزها واستلامها من المقر؟`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullWhatsAppMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(fullWhatsAppMessage);
    const url = `https://wa.me/${bookstoreWhatsAppNumber}?text=${encoded}`;
    window.open(url, '_blank');
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Top Banner */}
      <div className="bg-emerald-800 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
            <MessageCircle className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-right">
            <h3 className="font-bold text-base text-white">
              رسالة الطلب والحجز عبر الواتساب (WhatsApp Standard)
            </h3>
            <p className="text-xs text-emerald-100">
              صيغة مهيكلة وجاهزة للإرسال مباشرة إلى مكتبة السالمي بأدرار لحجز طلبيتك.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-200" />
            <span>طباعة الفاتورة</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Optional Customer Details for the order */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-right">
          <div className="text-xs font-semibold text-stone-700 mb-2">
            معلومات إضافية للطلبية (اختياري لتجهيز الكيس باسمك في المحل):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="اسم ولي الأمر أو الطالب..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="text-xs px-3 py-1.5 bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-emerald-700 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="رقم الهاتف للتواصل (مثلاً: 0661xxxxxx)..."
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="text-xs px-3 py-1.5 bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        {/* WhatsApp Chat Simulation Card */}
        <div className="bg-[#EFEAE2] p-4 sm:p-6 rounded-xl border border-stone-300 shadow-inner text-right">
          <div className="max-w-xl mx-auto bg-white rounded-lg p-4 shadow-sm text-stone-900 text-sm whitespace-pre-wrap leading-relaxed font-sans border-r-4 border-r-emerald-600">
            {fullWhatsAppMessage}
            <div className="flex justify-end items-center gap-1 text-[10px] text-stone-400 mt-2 font-mono">
              <span>الآن</span>
              <span className="text-emerald-600 font-bold">✓✓</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span>تم نسخ الرسالة بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-600" />
                <span>نسخ نص الواتساب</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>إرسال مباشر إلى واتساب مكتبة السالمي (+213)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

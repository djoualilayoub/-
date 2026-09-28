import React from 'react';
import { Camera, BookOpen, Clock, ShieldCheck, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onStartScan: () => void;
  onExploreCatalog: () => void;
  onExploreBooks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartScan,
  onExploreCatalog,
  onExploreBooks,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 to-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text and Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-100/80 px-3 py-1 rounded-md border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>مكتبة ووراقة السالمي — ولاية أدرار (01)</span>
              <span aria-hidden="true">·</span>
              <span>خدمة معالجة قوائم الأدوات المدرسية والجامعية</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 leading-tight text-balance">
              مساعد مكتبة السالمي الذكي
              <span className="block text-amber-800 text-2xl sm:text-3xl lg:text-4xl mt-1.5 font-bold">
                صوّر قائمتك المدرسية.. وجهّز سلّتك بالدينار الجزائري في ثوانٍ
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              سواء كانت قائمتك مكتوبة بخط اليد السريع أو مطبوعة رسمياً من المؤسسة، يقوم مساعدنا الذكي بقراءتها بدقة، استخراج الكراريس والأقلام، مطابقتها مع أسعار المكتبة بأدرار، وصياغة طلبية جاهزة للحجز عبر الواتساب فوراً.
            </p>

            {/* Quick Proof Metrics (Clean typography without pills) */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-stone-200 text-stone-700">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono tabular-nums">100%</div>
                <div className="text-xs text-stone-500 mt-0.5">مطابقة للأسعار المعتمدة (د.ج)</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono tabular-nums">ثوانٍ</div>
                <div className="text-xs text-stone-500 mt-0.5">لقراءة خط اليد وتوليد الفاتورة</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono tabular-nums">أدرار</div>
                <div className="text-xs text-stone-500 mt-0.5">استلام فوري من المقر وتوصيل</div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartScan}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg shadow-sm transition-all transform active:scale-95"
              >
                <Camera className="w-5 h-5 text-amber-200" />
                <span>تحميل أو تصوير القائمة المدرسية</span>
              </button>

              <button
                onClick={onExploreBooks}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-medium rounded-lg border border-stone-300 transition-colors shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-stone-600" />
                <span>كتب وسلاسل البكالوريا وجامعة أدرار</span>
              </button>

              <button
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-1.5 px-4 py-3.5 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
              >
                <span>استعراض جدول الأسعار</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-stone-900">
              <img
                src="/src/assets/images/bookstore_hero_adrar_1790554737135.jpg"
                alt="مكتبة السالمي في أدرار"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-mono text-amber-300">مكتبة السالمي — ولاية أدرار</span>
                <p className="text-sm font-medium text-stone-200 mt-1">
                  أهلاً بكم في مقرنا بقلب مدينة أدرار. نوفر جميع الكراريس، كتب ONPS، سلاسل التحدي والموفق، ومراجع طلبة جامعة أحمد دراية.
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-stone-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    السبت - الخميس: 8:00 - 21:00
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    أسعار رسمية بالدينار الجزائري
                  </span>
                </div>
              </div>
            </div>

            {/* Small floating preview card */}
            <div className="hidden sm:flex absolute -bottom-5 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200 shadow-md items-center gap-3 max-w-xs">
              <img
                src="/src/assets/images/school_supplies_flatlay_1790554748740.jpg"
                alt="أدوات مدرسية جزائرية"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover border border-stone-100 shrink-0"
              />
              <div className="text-right">
                <div className="text-xs font-bold text-stone-900">معالجة فورية وتلقائية للخط</div>
                <div className="text-[11px] text-stone-500">استخراج الكراريس والأوراق ومطابقة الأسعار</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

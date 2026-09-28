import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, Truck, ShieldCheck, BookOpen } from 'lucide-react';

export const StoreAboutView: React.FC = () => {
  return (
    <div className="space-y-8 text-right max-w-5xl mx-auto">
      {/* Hero card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="relative h-64 sm:h-80 overflow-hidden bg-stone-900">
          <img
            src="/src/assets/images/bookstore_hero_adrar_1790554737135.jpg"
            alt="مكتبة ووراقة السالمي أدرار"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <span className="text-xs font-mono text-amber-300">مكتبة ووراقة السالمي — أدرار</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              شريككم الدراسي الأول في ولاية أدرار
            </h2>
            <p className="text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
              تأسست مكتبة السالمي لتكون الوجهة التعليمية الموثوقة لأولياء الأمور والتلاميذ والأساتذة وطلبة جامعة أحمد دراية بأدرار. نوفر جميع الأدوات والكتب المعتمدة بأسعار تنافسية وثابتة بالدينار الجزائري.
            </p>
          </div>
        </div>

        {/* Contact and Location details */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-stone-200 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">الموقع الجغرافي</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              ولاية أدرار (01) — وسط المدينة، بالقرب من ثانوية بلكين الثاني وعلى مقربة من القطب الجامعي (جامعة أحمد دراية).
            </p>
          </div>

          <div className="border border-stone-200 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">مواعيد العمل</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              من السبت إلى الخميس:<br />
              الفترة الصباحية: 08:00 صباحاً – 12:30 زوالاً<br />
              الفترة المسائية: 04:00 مساءً – 09:00 ليلاً<br />
              (الجمعة مغلق)
            </p>
          </div>

          <div className="border border-stone-200 rounded-xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">التواصل والواتساب</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              رقم الواتساب للطلبيات المسبقة: <strong>0661.23.45.67</strong><br />
              البريد: contact@salmi-adrar.dz<br />
              يمكنكم إرسال صورة القائمة وسنرد بالفاتورة فوراً.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2 shadow-xs">
          <ShieldCheck className="w-6 h-6 text-amber-800" />
          <h4 className="font-bold text-sm text-stone-900">أسعار رسمية وشفافة (د.ج)</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            التزام صارم بالأسعار المقننة للكراريس والكتب المدرسية بدون أي زيادة، مع فواتير واضحة بنداً ببند.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2 shadow-xs">
          <Truck className="w-6 h-6 text-amber-800" />
          <h4 className="font-bold text-sm text-stone-900">تجهيز سريع بدون طوابير</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            أرسل قائمتك عبر الواتساب ليتم تجهيزها وتغليفها باسمك في كيس خاص، لتأتي وتستلمها مباشرة دون انتظار.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-2 shadow-xs">
          <BookOpen className="w-6 h-6 text-amber-800" />
          <h4 className="font-bold text-sm text-stone-900">تغطية شاملة لكل الأطوار</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            من التحضيري والابتدائي إلى البكالوريا والتخصصات الجامعية والماستر بجامعة أحمد دراية بأدرار.
          </p>
        </div>
      </div>
    </div>
  );
};

export interface SampleSchoolList {
  id: string;
  title: string;
  gradeLevel: string;
  schoolType: 'ابتدائي' | 'متوسط' | 'ثانوي / بكالوريا' | 'خط يد حقيقي';
  description: string;
  imageUrl?: string;
  simulatedOcrText: string;
  sampleItems: Array<{
    name: string;
    specifications?: string;
    quantity: number;
    unitPrice: number;
    isEstimated: boolean;
  }>;
  ambiguities?: Array<{
    location: string;
    recognizedFragment: string;
    suggestedItem: string;
    suggestedPrice: number;
    question: string;
  }>;
  notes?: string;
}

export const SAMPLE_SCHOOL_LISTS: SampleSchoolList[] = [
  {
    id: 'bac-sciences-sample',
    title: 'قائمة أدوات البكالوريا (شعبة علوم تجريبية) — ثانوية بلكين الثاني بأدرار',
    gradeLevel: 'السنة الثالثة ثانوي',
    schoolType: 'ثانوي / بكالوريا',
    description: 'قائمة رسمية مطبوعة تشمل كراريس الأحجام الكبيرة، الأوراق المزدوجة، أدوات الهندسة، وسلسلة المراجعة.',
    simulatedOcrText: `الجمهورية الجزائرية الديمقراطية الشعبية
وزارة التربية الوطنية - مديرية التربية لولاية أدرار
ثانوية بلكين الثاني - قائمة الأدوات المدرسية للسنة الثالثة ثانوي (علوم تجريبية)
- كراس 288 صفحة (للرياضيات) عدد 1
- كراس 192 صفحة (للعلوم الطبيعية) عدد 2
- كراس 192 صفحة (للعلوم الفيزيائية) عدد 2
- كراس أعمال تطبيقية TP (علوم + فيزياء) عدد 2
- كراس 96 صفحة (للغات والعلوم الإسلامية والتاريخ) عدد 5
- حزمة أوراق مزدوجة 100 ورقة عدد 2
- طقم أدوات هندسية (منقلة + كوس + مسطرة) عدد 1
- سيالات بيك (2 أزرق + 1 أسود + 1 أحمر + 1 أخضر)
- غلاف بلاستيكي للكراريس عدد 12
- مئزر مدرسي أبيض خاص بالمخبر
- سلسلة التحدي في العلوم أو الموفق في الرياضيات`,
    sampleItems: [
      { name: 'كراس 288 صفحة (سجل للرياضيات)', specifications: '288 صفحة مقسم', quantity: 1, unitPrice: 350, isEstimated: false },
      { name: 'كراس 192 صفحة (علوم وفيزياء)', specifications: '192 صفحة مسطر', quantity: 4, unitPrice: 220, isEstimated: false },
      { name: 'كراس أعمال تطبيقية TP', specifications: 'مخطط + أبيض', quantity: 2, unitPrice: 180, isEstimated: false },
      { name: 'كراس 96 صفحة (مواد ثانوية)', specifications: '96 صفحة', quantity: 5, unitPrice: 120, isEstimated: false },
      { name: 'أوراق مزدوجة حزمة 100', specifications: 'Double Feuilles 100', quantity: 2, unitPrice: 250, isEstimated: false },
      { name: 'مجموعة أدوات هندسية', specifications: 'منقلة + كوس + مسطرة', quantity: 1, unitPrice: 200, isEstimated: false },
      { name: 'أقلام سيالة بيك (أزرق/أسود/أحمر/أخضر)', specifications: 'مجموعة 5 أقلام', quantity: 5, unitPrice: 25, isEstimated: false },
      { name: 'غلاف بلاستيكي للكراريس', specifications: 'ألوان متعددة', quantity: 12, unitPrice: 30, isEstimated: false },
      { name: 'مئزر مدرسي أبيض طور ثانوي', specifications: 'مقاس ثانوي / مخبر قطن', quantity: 1, unitPrice: 1500, isEstimated: false },
      { name: 'سلسلة مراجعة البكالوريا (التحدي / الموفق)', specifications: 'الجزء الأول', quantity: 1, unitPrice: 650, isEstimated: false },
    ],
    notes: 'تم توفير كافة متطلبات شعبة العلوم التجريبية، المئزر متوفر بعدة مقاسات في المتجر.'
  },
  {
    id: 'handwritten-unclear-sample',
    title: 'قائمة خط يد (ولي تلميذ) — مع بنود غير واضحة لاختبار معالجة الغموض',
    gradeLevel: 'السنة الرابعة متوسط (BEM)',
    schoolType: 'خط يد حقيقي',
    description: 'صورة قائمة بخط يد سريع من ولي تلميذ، تتضمن كلمة مشوشة في البند الرابع، مما يفعل آلية الاستفسار والتأكيد.',
    simulatedOcrText: `بسم الله الرحمن الرحيم
قائمة أدوات ولدي محمد (4 متوسط BEM):
1. 3 كراريس 96 صفحة
2. 2 كراريس 192 صفحة
3. باكي أوراق دوبل فوي (100)
4. [خط يد غير واضح تماماً: كراس ... 192ص أو 288ص لمادة الرياضيات؟]
5. 4 ستيلوات (2 زرق + 1 كحل + 1 حمر)
6. طقم منقلة ومسطرة وكوس
7. 6 أغلفة كراس بلاستيك`,
    sampleItems: [
      { name: 'كراس 96 صفحة', specifications: 'خط عادي', quantity: 3, unitPrice: 120, isEstimated: false },
      { name: 'كراس 192 صفحة', specifications: '192 صفحة للمواد العلمية', quantity: 2, unitPrice: 220, isEstimated: false },
      { name: 'أوراق مزدوجة (Double Feuilles) حزمة 100', specifications: '100 ورقة للفروض', quantity: 1, unitPrice: 250, isEstimated: false },
      { name: 'كراس 192 صفحة (بند تحت التأكيد)', specifications: 'مقترح تلقائي بدل الخط المشوش', quantity: 1, unitPrice: 220, isEstimated: true },
      { name: 'قلم سيالة بيك (أزرق/أسود/أحمر)', specifications: '4 أقلام', quantity: 4, unitPrice: 25, isEstimated: false },
      { name: 'مجموعة أدوات هندسية', specifications: 'منقلة + كوس + مسطرة', quantity: 1, unitPrice: 200, isEstimated: false },
      { name: 'غلاف بلاستيكي للكراريس', specifications: 'ألوان متنوعة', quantity: 6, unitPrice: 30, isEstimated: false },
    ],
    ambiguities: [
      {
        location: 'البند الرابع في وسط القائمة',
        recognizedFragment: 'كراس ... [غير واضح: 192 أو 288؟]',
        suggestedItem: 'كراس 192 صفحة لمادة الرياضيات',
        suggestedPrice: 220,
        question: 'لم أستطع قراءة هذا البند بدقة [البند الرابع في القائمة]، هل تقصد كراس 192 صفحة لمادة الرياضيات؟'
      }
    ],
    notes: 'يرجى تأكيد البند الرابع (نوع الكراس المطلوب لمادة الرياضيات) لتحديث السعر النهائي.'
  },
  {
    id: 'primary-sample',
    title: 'قائمة السنة الأولى ابتدائي — مدرسة الشهيد بأدرار',
    gradeLevel: 'السنة الأولى ابتدائي',
    schoolType: 'ابتدائي',
    description: 'قائمة الصغار تشمل اللوحة، الألوان، المئزر الوردي/الأزرق، الكراريس المخططة، والمقلمة.',
    simulatedOcrText: `المدرسة الابتدائية - السنة الأولى ابتدائي
الأدوات المطلوبة للالتحاق بالقسم:
- 4 كراريس 96 صفحة مسطر خط كبير (سيديس Seyès)
- لوحة بيضاء ذات وجهين + قلم لباد وممحاة
- علبة أقلام تلوين خشبية (12 لون)
- علبة أقلام لباد Feutres
- ممحاة ومبراة بحاوية
- مقص أطفال غير حاد + أنبوب غراء
- 4 أغلفة كراريس (أحمر، أزرق، أصفر، أخضر)
- ورقة بطاقات تسمية للكتب والكراريس
- مئزر مدرسي وردي للبنات أو أزرق للذكور`,
    sampleItems: [
      { name: 'كراس 96 صفحة (خط كبير Seyès)', specifications: 'مخطط للأطفال', quantity: 4, unitPrice: 120, isEstimated: false },
      { name: 'لوحة مدرسية بيضاء مع قلم لباد وممحاة (Ardoise)', specifications: 'قابلة للمسح', quantity: 1, unitPrice: 160, isEstimated: false },
      { name: 'علبة أقلام تلوين خشبية 12 لون', specifications: 'خشبية زاهية', quantity: 1, unitPrice: 180, isEstimated: false },
      { name: 'علبة أقلام لباد Feutres 12 لون', specifications: 'ألوان مائية للأطفال', quantity: 1, unitPrice: 220, isEstimated: false },
      { name: 'طقم ممحاة ستيدلر ومبراة', specifications: 'ممحاة ناعمة ومبراة آمنة', quantity: 1, unitPrice: 90, isEstimated: false },
      { name: 'أغلفة كراريس بلاستيكية', specifications: 'أحمر، أزرق، أصفر، أخضر', quantity: 4, unitPrice: 30, isEstimated: false },
      { name: 'ورقة بطاقات تعريفية (Étiquettes)', specifications: 'لتسمية الكراريس', quantity: 1, unitPrice: 50, isEstimated: false },
      { name: 'مئزر مدرسي طور ابتدائي (أزرق/وردي)', specifications: 'قطن مريح عالي الجودة', quantity: 1, unitPrice: 1200, isEstimated: false },
    ],
    notes: 'يتوفر لدينا المئزر باللونين الأزرق والوردي، وبكافة المقاسات الخاصة بالأطفال (5 إلى 7 سنوات).'
  }
];

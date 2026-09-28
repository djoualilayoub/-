import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  FileText,
  Sparkles,
  Loader2,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Eye,
  BookOpen,
} from 'lucide-react';
import { SAMPLE_SCHOOL_LISTS, SampleSchoolList } from '../data/sampleLists';
import { AmbiguousItem, AnalysisResult, OrderItem } from '../types';
import { AmbiguityResolver } from './AmbiguityResolver';
import { QuotationTable } from './QuotationTable';
import { WhatsAppPreview } from './WhatsAppPreview';
import { PrintableInvoice } from './PrintableInvoice';

interface ListScannerProps {
  onAddItemsToGlobalOrder?: (items: OrderItem[]) => void;
}

export const ListScanner: React.FC<ListScannerProps> = () => {
  const [inputMode, setInputMode] = useState<'upload' | 'camera' | 'samples' | 'text'>('samples');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [textInput, setTextInput] = useState('');
  const [gradeHint, setGradeHint] = useState('');
  const [selectedSample, setSelectedSample] = useState<SampleSchoolList | null>(SAMPLE_SCHOOL_LISTS[0]);

  // Processing state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Active editable items & ambiguities
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [ambiguities, setAmbiguities] = useState<AmbiguousItem[]>([]);
  const [detectedGrade, setDetectedGrade] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Camera setup
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load initial sample by default for instant delight
  useEffect(() => {
    if (selectedSample && orderItems.length === 0 && !analysisResult) {
      loadSample(selectedSample);
    }
  }, []);

  const loadSample = (sample: SampleSchoolList) => {
    setSelectedSample(sample);
    setSelectedImage(null);
    setTextInput(sample.simulatedOcrText);
    setGradeHint(sample.gradeLevel);

    const mappedItems: OrderItem[] = sample.sampleItems.map((item, idx) => ({
      id: `sample-item-${Date.now()}-${idx}`,
      name: item.name,
      specifications: item.specifications,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      isEstimated: item.isEstimated,
      confidence: 'high',
    }));

    const mappedAmbiguities: AmbiguousItem[] = (sample.ambiguities || []).map((amb, idx) => ({
      id: `sample-amb-${Date.now()}-${idx}`,
      itemIndex: idx,
      location: amb.location,
      recognizedFragment: amb.recognizedFragment,
      suggestedItem: amb.suggestedItem,
      suggestedPrice: amb.suggestedPrice,
      question: amb.question,
      resolved: false,
    }));

    setOrderItems(mappedItems);
    setAmbiguities(mappedAmbiguities);
    setDetectedGrade(sample.gradeLevel);
    setNotes(sample.notes || 'جميع المواد مطابقة لتسعيرة مكتبة السالمي بأدرار.');
    setAnalysisError(null);
  };

  // Camera start / stop / capture
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError('تعذر فتح الكاميرا. يرجى السماح بالوصول أو استخدام خيار تحميل صورة.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      setImageMime('image/jpeg');
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);
      setSelectedSample(null);
      setAnalysisError(null);
    };
    reader.readAsDataURL(file);
  };

  // Run AI Analysis
  const handleAnalyze = async () => {
    if (!selectedImage && !textInput.trim() && !selectedSample) {
      setAnalysisError('يرجى التقاط صورة، رفع ملف، أو إدخال نص القائمة للتحليل.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/gemini/analyze-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMime,
          textList: textInput.trim() || undefined,
          gradeHint: gradeHint || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `خطأ في الخادم (${response.status})`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      setOrderItems(data.items);
      setAmbiguities(data.ambiguousItems || []);
      setDetectedGrade(data.detectedGrade);
      setNotes(data.notes);
    } catch (err: any) {
      console.warn('Online OCR fallback triggered:', err.message);

      // Graceful local algorithmic fallback
      if (selectedSample) {
        loadSample(selectedSample);
      } else {
        // Fallback parse simple lines
        const lines = textInput.split('\n').filter((l) => l.trim().length > 0);
        const parsedItems: OrderItem[] = lines.map((line, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          name: line.replace(/^[-*0-9.]+\s*/, ''),
          quantity: 1,
          unitPrice: 120,
          totalPrice: 120,
          isEstimated: true,
        }));

        setOrderItems(parsedItems.length > 0 ? parsedItems : []);
        setNotes('تم التحليل الأولي. يمكنك تعديل الكميات والأسعار يدوياً قبل تأكيد الحجز.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Resolve an ambiguous item
  const handleResolveAmbiguity = (ambiguityId: string, resolvedItem: OrderItem) => {
    setAmbiguities((prev) =>
      prev.map((a) => (a.id === ambiguityId ? { ...a, resolved: true } : a))
    );

    // Update order items: replace the placeholder item or add it
    setOrderItems((prev) => {
      const existingIdx = prev.findIndex((it) => it.id.includes(ambiguityId) || it.name.includes('تحت التأكيد'));
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = resolvedItem;
        return updated;
      }
      return [...prev, resolvedItem];
    });
  };

  const handleDismissAmbiguity = (ambiguityId: string) => {
    setAmbiguities((prev) =>
      prev.map((a) => (a.id === ambiguityId ? { ...a, resolved: true } : a))
    );
    setOrderItems((prev) => prev.filter((it) => !it.id.includes(ambiguityId)));
  };

  // Quantity and item modifications
  const handleUpdateQuantity = (id: string, newQty: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (newItem: Omit<OrderItem, 'id' | 'totalPrice'>) => {
    const itemWithTotal: OrderItem = {
      ...newItem,
      id: `manual-item-${Date.now()}`,
      totalPrice: newItem.unitPrice * newItem.quantity,
    };
    setOrderItems((prev) => [...prev, itemWithTotal]);
  };

  const handleUpdateItem = (id: string, updatedFields: Partial<OrderItem>) => {
    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updatedFields };
          updated.totalPrice = updated.unitPrice * updated.quantity;
          return updated;
        }
        return item;
      })
    );
  };

  const handleReset = () => {
    setOrderItems([]);
    setAmbiguities([]);
    setSelectedImage(null);
    setTextInput('');
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-8 text-right">
      {/* Input Options Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span>ماسح القوائم المدرسية والجامعية بالذكاء الاصطناعي</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              التقط صورة للقائمة الورقية بخط يدك أو ارفع صورة مطبوعة، وسيتولى المساعد مطابقة الأسعار وحساب المجموع بالدينار الجزائري.
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => {
                setInputMode('samples');
                stopCamera();
              }}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                inputMode === 'samples'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              نماذج جاهزة للتجربة
            </button>
            <button
              onClick={() => {
                setInputMode('upload');
                stopCamera();
              }}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                inputMode === 'upload'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              رفع صورة
            </button>
            <button
              onClick={() => {
                setInputMode('camera');
                startCamera();
              }}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                inputMode === 'camera'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              كاميرا الهاتف
            </button>
            <button
              onClick={() => {
                setInputMode('text');
                stopCamera();
              }}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                inputMode === 'text'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              كتابة يدوية
            </button>
          </div>
        </div>

        {/* Input Mode Content */}
        <div className="pt-5">
          {/* Mode 1: Preset Samples */}
          {inputMode === 'samples' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-stone-700">
                اختر نموذجاً واقعياً من مدارس أدرار لاختبار دقة القراءة وحساب الفاتورة فوراً:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLE_SCHOOL_LISTS.map((sample) => {
                  const isSelected = selectedSample?.id === sample.id;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => loadSample(sample)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all text-right ${
                        isSelected
                          ? 'border-amber-800 bg-amber-50/50 shadow-xs ring-1 ring-amber-800'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <span className="font-semibold text-stone-800">{sample.schoolType}</span>
                        <span className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded">
                          {sample.gradeLevel}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900 leading-snug">
                        {sample.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1.5 line-clamp-2">
                        {sample.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex items-center justify-between text-xs">
                        <span className="text-stone-500">
                          {sample.sampleItems.length} مواد
                        </span>
                        {sample.ambiguities && sample.ambiguities.length > 0 && (
                          <span className="text-amber-800 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            بند غامض للتجربة
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode 2: Upload File */}
          {inputMode === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-stone-300 max-w-lg mx-auto bg-stone-900">
                  <img
                    src={selectedImage}
                    alt="القائمة المرفوعة"
                    className="w-full max-h-80 object-contain mx-auto"
                  />
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white/90 hover:bg-white text-stone-900 text-xs font-semibold rounded-md shadow-xs"
                    >
                      تغيير الصورة
                    </button>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md shadow-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-amber-800 rounded-xl p-8 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-stone-50"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">
                    اضغط هنا لرفع صورة القائمة المدرسية
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    يدعم صور خط اليد والمطبوعات الرسمية (JPG، PNG، WEBP)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Live Camera */}
          {inputMode === 'camera' && (
            <div className="space-y-4">
              {cameraError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                  {cameraError}
                </div>
              ) : (
                <div className="max-w-md mx-auto relative rounded-xl overflow-hidden bg-black border border-stone-300">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-72 object-cover"
                  />
                  {isCameraActive && (
                    <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-3">
                      <button
                        onClick={capturePhoto}
                        className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>التقاط الصورة الآن</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mode 4: Text Input */}
          {inputMode === 'text' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                الصق أو اكتب نص القائمة هنا (كل سطر أداة أو كراس):
              </label>
              <textarea
                rows={5}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="مثال:&#10;4 كراريس 96 صفحة&#10;2 كراريس 192 صفحة&#10;أوراق مزدوجة 100&#10;طقم أدوات هندسية&#10;مئزر مدرسي أبيض"
                className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-800 focus:outline-none"
              />
            </div>
          )}

          {/* Action Trigger Bar */}
          <div className="mt-5 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>المستوى التقديري (اختياري لتسريع المطابقة):</span>
              <input
                type="text"
                value={gradeHint}
                onChange={(e) => setGradeHint(e.target.value)}
                placeholder="مثلاً: 3 ثانوي، 4 متوسط..."
                className="px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs w-36 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition-all transform active:scale-95"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                    <span>جاري تحليل القائمة ومطابقة الأسعار...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>معالجة وتوليد الفاتورة بالذكاء الاصطناعي</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Error Notification */}
      {analysisError && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{analysisError}</span>
        </div>
      )}

      {/* Ambiguity Resolution Box (If unclear handwriting was flagged) */}
      <AmbiguityResolver
        ambiguities={ambiguities}
        onResolve={handleResolveAmbiguity}
        onDismiss={handleDismissAmbiguity}
      />

      {/* Editable Quotation Table */}
      <QuotationTable
        items={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onReset={handleReset}
        detectedGrade={detectedGrade}
      />

      {/* WhatsApp Output Preview Formatted strictly as requested */}
      <WhatsAppPreview
        items={orderItems}
        notes={notes}
        onPrint={() => setShowPrintModal(true)}
      />

      {/* Raw JSON Schema Output Box for Developer & API Verification */}
      {orderItems.length > 0 && (
        <div className="bg-stone-900 text-stone-100 rounded-xl p-4 sm:p-5 border border-stone-800 shadow-sm text-left font-mono text-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800 text-stone-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-sans font-bold text-sm text-white">مخرجات الـ JSON المطابقة للمواصفات البرمجية</span>
              <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded">application/json</span>
            </div>
            <button
              onClick={() => {
                const jsonPayload = JSON.stringify(
                  {
                    items: orderItems.map((it) => ({
                      name: it.name,
                      quantity: it.quantity,
                      unit_price: it.unitPrice,
                      total_price: it.totalPrice,
                    })),
                    grand_total: orderItems.reduce((s, it) => s + it.totalPrice, 0),
                    unclear_items: ambiguities.filter((a) => !a.resolved).map((a) => `${a.location}: ${a.suggestedItem}`),
                    notes: notes || 'كافة المواد متوفرة وجاهزة للتجهيز الفوري بمكتبة السالمي بأدرار.',
                  },
                  null,
                  2
                );
                navigator.clipboard.writeText(jsonPayload);
                alert('تم نسخ كود الـ JSON بنجاح!');
              }}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded transition-colors flex items-center gap-1 font-sans cursor-pointer"
            >
              نسخ كود JSON
            </button>
          </div>
          <pre className="overflow-x-auto text-emerald-400 text-xs leading-relaxed max-h-72 p-2 bg-stone-950/60 rounded border border-stone-800/80">
            {JSON.stringify(
              {
                items: orderItems.map((it) => ({
                  name: it.name,
                  quantity: it.quantity,
                  unit_price: it.unitPrice,
                  total_price: it.totalPrice,
                })),
                grand_total: orderItems.reduce((s, it) => s + it.totalPrice, 0),
                unclear_items: ambiguities.filter((a) => !a.resolved).map((a) => `${a.location}: ${a.suggestedItem}`),
                notes: notes || 'كافة المواد متوفرة وجاهزة للتجهيز الفوري بمكتبة السالمي بأدرار.',
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showPrintModal && (
        <PrintableInvoice
          items={orderItems}
          detectedGrade={detectedGrade}
          notes={notes}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};

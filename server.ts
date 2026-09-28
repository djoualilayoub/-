import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));

// Shared Gemini client initialization
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper: Format WhatsApp Template exactly as requested
function generateWhatsAppTemplate(
  items: Array<{ name: string; quantity: number; unitPrice: number; totalPrice: number; isEstimated?: boolean }>,
  total: number,
  notes?: string
): string {
  const itemsText = items
    .map(
      (item) =>
        `- ${item.name} (الكمية: ${item.quantity}): ${item.totalPrice} د.ج${
          item.isEstimated ? ' (سعر تقريبي)' : ''
        }`
    )
    .join('\n');

  const notesText = notes && notes.trim().length > 0 ? notes : 'كافة المواد المذكورة متوفرة وجاهزة للتجهيز الفوري.';

  return `مرحباً بك في مكتبة السالمي 📚!
تمت معالجة القائمة الخاصة بك بنجاح، إليك التفاصيل:

📋 **قائمة الأدوات المطلوبة:**
${itemsText}

💰 **الإجمالي التقديري:** ${total} د.ج

📌 **ملاحظات:** ${notesText}

هل ترغب في حجز هذه الطلبية لتجهيزها واستلامها من المقر؟`;
}

// POST /api/gemini/analyze-list
app.post('/api/gemini/analyze-list', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', textList, gradeHint } = req.body;

    if (!imageBase64 && !textList) {
      res.status(400).json({ error: 'يرجى تقديم صورة للقائمة أو نصها للتحليل' });
      return;
    }

    if (!ai) {
      // Smart offline fallback if API key is temporarily unavailable
      res.status(503).json({
        error: 'مفتاح Gemini API غير مهيأ حالياً. يرجى التحقق من إعدادات المفتاح.',
      });
      return;
    }

    const systemPrompt = `أنت المحرك البرمجي الخلفي لموقع ومساعد "مكتبة السالمي - أدرار" في الجزائر.
مهمتك الاستثنائية هي استخراج النصوص من صور أدوات المدارس والمراجع المكتوبة بخط اليد أو المطبوعة، وحساب قيمتها الإجمالية ومطابقتها مع جدول الأسعار المعتمد.

جدول أسعار مكتبة السالمي المعتمد:
- كراس 96 صفحة: 120 د.ج
- كراس 192 صفحة: 220 د.ج
- كراس 288 صفحة: 350 د.ج
- حزمة أوراق مزدوجة 100 ورقة (Double Feuilles): 250 د.ج
- قلم سيالة (أزرق/أحمر/أسود/أخضر): 25 د.ج
- غلاف بلاستيكي: 30 د.ج
- طقم أدوات هندسية (Rapporteur + Équerre + Règle): 200 د.ج
- مئزر مدرسي: 1500 د.ج (أو حسب المقاس: 1200 - 1800 د.ج)
- قلم تصحيح (Effaceur): 80 د.ج
- شريط لاصق: 50 د.ج
- محاية / براية: 40 د.ج
- قلم رصاص: 30 د.ج
- سلاسل مراجعة البكالوريا (سلسلة التحدي/الموفق): 650 د.ج
- كراس أعمال تطبيقية TP: 180 د.ج
- كراس رسم كانسون: 280 د.ج
- لوحة مدرسية بيضاء مع قلم لباد وممحاة: 160 د.ج
- علبة أقلام تلوين 12 لون: 180 د.ج
- علبة أقلام لباد Feutres: 220 د.ج
*(إذا لم تكن المادة موجودة في القائمة، ضع لها سعراً تقريبياً متداولاً في السوق الجزائرية وضع isEstimated: true)*

معالجة الغموض والخط غير الواضح:
إذا كانت هناك أداة غير واضحة تماماً في الخط اليدوي، أضفها إلى قائمة unclear_items واقترح أقرب خيار لها.
وكذلك في ambiguousItems مع صياغة السؤال:
"لم أستطع قراءة هذا البند بدقة [الموقع]، هل تقصد [الاقتراح التلقائي]؟"`;

    const contentsPayload: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      contentsPayload.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const userInstructions = `قم بتحليل هذه القائمة المدرسية المستلمة من الزبون.${
      gradeHint ? ` المستوى التقديري: ${gradeHint}.` : ''
    }${textList ? ` النص المرفق أو المنقول:\n${textList}` : ''}
استخرج جميع البنود، الكميات، الأسعار الفردية، المجموع، وحدد أي بنود غير واضحة مع اقتراح بديل.`;

    contentsPayload.push({
      text: userInstructions,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedGrade: {
              type: Type.STRING,
              description: 'المستوى الدراسي المكتشف من القائمة إن وجد، مثلا: 3 ثانوي، 4 متوسط، 1 ابتدائي',
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'اسم المادة أو الأداة' },
                  specifications: { type: Type.STRING, description: 'المواصفات، عدد الصفحات، اللون، الحجم' },
                  quantity: { type: Type.INTEGER, description: 'الكمية المطلوبة' },
                  unit_price: { type: Type.NUMBER, description: 'سعر الوحدة بالدينار الجزائري د.ج' },
                  total_price: { type: Type.NUMBER, description: 'إجمالي سعر البند بالدينار الجزائري' },
                  isEstimated: { type: Type.BOOLEAN, description: 'هل السعر تقديري تقريبي؟' },
                  category: { type: Type.STRING, description: 'الفئة: كراريس، أقلام، أوراق، هندسة، مآزر، كتب، ملحقات' },
                  originalText: { type: Type.STRING, description: 'النص الأصلي المقروء من الصورة' },
                  note: { type: Type.STRING, description: 'ملاحظة خاصة بالبند إن وجدت' },
                },
                required: ['name', 'quantity', 'unit_price', 'total_price', 'isEstimated'],
              },
            },
            unclear_items: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'أسماء العناصر غير الواضحة بالكامل في الخط اليدوي مع الاقتراح',
            },
            ambiguousItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  location: { type: Type.STRING, description: 'موقع البند في القائمة (مثلاً: البند الثالث، أعلى يسار الورقة)' },
                  recognizedFragment: { type: Type.STRING, description: 'الجزء المقروء أو المشوش' },
                  suggestedItem: { type: Type.STRING, description: 'البند المقترح بناءً على السياق' },
                  suggestedPrice: { type: Type.NUMBER, description: 'السعر المقترح للبند المقترح' },
                  question: {
                    type: Type.STRING,
                    description: 'نص السؤال الموجه للزبون بالصيغة المحددة: لم أستطع قراءة هذا البند بدقة [الموقع]، هل تقصد [الاقتراح]؟',
                  },
                },
                required: ['location', 'recognizedFragment', 'suggestedItem', 'suggestedPrice', 'question'],
              },
            },
            grand_total: {
              type: Type.NUMBER,
              description: 'المجموع الإجمالي لكافة البنود بالدينار الجزائري د.ج',
            },
            notes: {
              type: Type.STRING,
              description: 'أي ملاحظة إضافية للزبون',
            },
          },
          required: ['items', 'grand_total', 'notes'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');

    // Add unique IDs to items and support both camelCase and snake_case
    const items = (parsedData.items || []).map((it: any, index: number) => {
      const uPrice = it.unit_price ?? it.unitPrice ?? 0;
      const q = it.quantity || 1;
      const tPrice = it.total_price ?? it.totalPrice ?? (uPrice * q);
      return {
        ...it,
        id: `item-${Date.now()}-${index}`,
        unitPrice: uPrice,
        unit_price: uPrice,
        totalPrice: tPrice,
        total_price: tPrice,
        quantity: q,
      };
    });

    const ambiguousItems = (parsedData.ambiguousItems || []).map((amb: any, index: number) => ({
      ...amb,
      id: `amb-${Date.now()}-${index}`,
      itemIndex: index,
      resolved: false,
    }));

    const unclear_items = parsedData.unclear_items || ambiguousItems.map((a: any) => `${a.location}: ${a.suggestedItem}`);

    const grand_total = parsedData.grand_total ?? parsedData.estimatedTotal ?? items.reduce((sum: number, it: any) => sum + it.totalPrice, 0);

    const formattedWhatsApp = generateWhatsAppTemplate(items, grand_total, parsedData.notes);

    res.json({
      items,
      grand_total,
      estimatedTotal: grand_total,
      unclear_items,
      ambiguousItems,
      notes: parsedData.notes || 'تمت معالجة القائمة ومطابقتها مع مخزون مكتبة السالمي.',
      detectedGrade: parsedData.detectedGrade || 'غير محدد',
      formattedWhatsApp,
    });
  } catch (error: any) {
    console.error('Error analyzing list with Gemini:', error);
    res.status(500).json({
      error: 'حدث خطأ أثناء معالجة القائمة عبر الذكاء الاصطناعي.',
      details: error.message,
    });
  }
});

// POST /api/gemini/chat-advisor (Book inquiries and customer assistance)
app.post('/api/gemini/chat-advisor', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      res.status(400).json({ error: 'الرسالة مطلوبة' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'مفتاح Gemini API غير مهيأ حالياً' });
      return;
    }

    const systemPrompt = `أنت "مساعد مكتبة السالمي الذكي" في أدرار (الجزائر).
وظيفتك الإجابة على استفسارات الزبائن (أولياء أمور، طلاب، وأساتذة) ومعالجة طلبياتهم بسرعة ودقة عبر الواتساب/الموقع.
أسلوبك:
- محترم، مهني، دافئ، ومزيج سلس بين العربية الفصحى والدارجة الجزائرية المفهومة الراقية.
- العملة دائماً هي الدينار الجزائري (د.ج أو دج).
- تعرف كتب المناهج الجزائرية بدقة:
  * سلاسل البكالوريا: سلسلة التحدي (650 د.ج)، سلسلة الموفق (650 د.ج)، سلسلة المغني في الفيزياء (750 د.ج)، الصفوة في الفلسفة (550 د.ج)، كليك، المعاصر.
  * كتب شهادة التعليم المتوسط BEM والتحضيري والابتدائي.
  * مراجع ومقررات جامعة أحمد دراية بأدرار (الحقوق، العلوم الاقتصادية والتسيير، العلوم الإسلامية وتراث توات، الهندسة وتسيير المياه والفقارات الصحراوية).
  * الروايات الجزائرية والعالمية (كاتب ياسين، ياسمينة خضرا، مالك بن نبي، مولود فرعون).
- ركز على السرعة، والوضوح، ودعوة الزبون للحجز المباشر (Call to Action) لاستلام الطلبية من مقر المكتبة بأدرار أو تجهيزها عبر الواتساب.
- لا تبتدع أسعاراً خيالية، اعتمد الأسعار المتاحة ووضح حالة التوفر دائماً ("متوفر في المتجر"، "كمية محدودة"، أو "يمكن توفيره خلال 48 ساعة").`;

    // Construct history for multi-turn chat
    const formattedContents = history.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({
      reply: response.text,
    });
  } catch (error: any) {
    console.error('Error in chat advisor:', error);
    res.status(500).json({
      error: 'عذراً، حدث خطأ أثناء التواصل مع المساعد الذكي.',
      details: error.message,
    });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'مكتبة السالمي - أدرار', apiConfigured: Boolean(apiKey) });
});

// Vite middleware or production static build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

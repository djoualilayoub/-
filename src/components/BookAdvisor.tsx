import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Send, CheckCircle2, Clock, AlertCircle, ShoppingCart } from 'lucide-react';
import { DEFAULT_BOOKS } from '../data/defaultCatalog';
import { BookItem, ChatMessage, OrderItem } from '../types';

interface BookAdvisorProps {
  onAddBookToOrder: (bookItem: BookItem) => void;
}

export const BookAdvisor: React.FC<BookAdvisorProps> = ({ onAddBookToOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('الكل');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `مرحباً بك في مكتبة السالمي بأدرار 📚!
أنا مساعدك الذكي للإجابة عن توفر الكتب المدرسية، سلاسل البكالوريا (التحدي، الموفق، المغني)، والمراجع الجامعية لطلبة جامعة أحمد دراية، والروايات.
عن أي كتاب أو مرجع ترغب في الاستفسار اليوم؟`,
      timestamp: 'الآن',
      quickReplies: [
        'هل تتوفر سلسلة التحدي في العلوم الطبيعية للبكالوريا؟',
        'ما هي مراجع كلية الحقوق بجامعة أدرار؟',
        'كم سعر سلسلة الموفق في الرياضيات؟',
        'هل متوفرة كتب ومواضيع BEM التعليم المتوسط؟',
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [addedBooksMap, setAddedBooksMap] = useState<Record<string, boolean>>({});

  const levels = [
    'الكل',
    'بكالوريا',
    'التعليم المتوسط',
    'التعليم الابتدائي',
    'جامعي - جامعة أدرار',
    'ثقافة وروايات',
  ];

  const filteredBooks = DEFAULT_BOOKS.filter((book) => {
    const matchesLevel = selectedLevel === 'الكل' || book.level === selectedLevel;
    const matchesQuery =
      searchQuery.trim() === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.authorOrPublisher && book.authorOrPublisher.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.streamOrMajor && book.streamOrMajor.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesQuery;
  });

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'الآن',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await fetch('/api/gemini/chat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: chatMessages.slice(-6),
        }),
      });

      if (!response.ok) {
        throw new Error('تعذر التواصل مع المساعد الذكي');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: 'الآن',
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Offline fallback response based on catalog keywords
      const matched = DEFAULT_BOOKS.find((b) =>
        query.includes('تحدي') ? b.title.includes('التحدي') :
        query.includes('موفق') ? b.title.includes('الموفق') :
        query.includes('مغني') ? b.title.includes('المغني') :
        query.includes('حقوق') ? b.title.includes('القانون') :
        query.includes('فقارة') || query.includes('مياه') ? b.title.includes('الفقارات') :
        query.includes('نجمة') ? b.title.includes('نجمة') :
        query.includes('خضرا') ? b.title.includes('النهار') :
        b.title.includes(query)
      );

      let fallbackText = '';
      if (matched) {
        fallbackText = `نعم، كتاب "${matched.title}" (${matched.level}) متوفر لدينا في مقر مكتبة السالمي بأدرار بسعر ${matched.price} د.ج (${matched.status}). هل ترغب في حجزه لتجهيزه لك؟`;
      } else {
        fallbackText = `مرحباً بك! الكتاب متوفر أو يمكننا توفيره لك خلال 48 ساعة من الجزائر العاصمة إلى أدرار بسعر مناسب بالدينار الجزائري. تفضل بزيارتنا في مقر المكتبة بوسط أدرار أو احجزه مباشرة عبر الواتساب.`;
      }

      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: 'الآن',
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleAdd = (book: BookItem) => {
    onAddBookToOrder(book);
    setAddedBooksMap((prev) => ({ ...prev, [book.id]: true }));
    setTimeout(() => {
      setAddedBooksMap((prev) => ({ ...prev, [book.id]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-8 text-right">
      {/* Header section */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-800" />
              <span>استعلام الكتب والمراجع الدراسية والجامعية</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              تحقق من توفر كتب البكالوريا، مقررات التعليم المتوسط والابتدائي، ومراجع جامعة أحمد دراية بأدرار مع الأسعار الفورية (د.ج).
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="ابحث عن كتاب، مؤلف، أو مادة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pr-9 pl-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-800 focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Level Filters (Interactive tabs/segmented controls) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-stone-200 mt-4">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                selectedLevel === lvl
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => {
          const isAdded = addedBooksMap[book.id];

          return (
            <div
              key={book.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-700/50 transition-all text-right group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-amber-900">{book.level}</span>
                  <span className="text-[11px] text-stone-400">{book.authorOrPublisher}</span>
                </div>

                <h3 className="font-bold text-sm text-stone-900 leading-snug group-hover:text-amber-800 transition-colors">
                  {book.title}
                </h3>

                {book.streamOrMajor && (
                  <div className="text-xs text-stone-600 font-medium bg-stone-50 px-2 py-1 rounded inline-block">
                    {book.streamOrMajor}
                  </div>
                )}

                <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                  {book.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="text-right">
                  <div className="text-xs text-stone-400">السعر:</div>
                  <div className="text-base font-extrabold text-stone-900 font-mono tabular-nums">
                    {book.price} <span className="text-xs font-sans text-stone-600">د.ج</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {book.status}
                  </span>

                  <button
                    onClick={() => handleAdd(book)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تمت الإضافة</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5 text-stone-600" />
                        <span>إضافة للفاتورة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive AI Chat with Store Assistant */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                محادثة مباشرة مع مساعد مكتبة السالمي الذكي
              </h3>
              <p className="text-[11px] text-stone-300">
                إجابات فورية عن توفر الكتب، المقررات الوزارية، ومراجع جامعة أدرار بالدينار الجزائري
              </p>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="p-4 sm:p-5 max-h-96 overflow-y-auto space-y-4 bg-stone-50/50">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-xl rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-amber-800 text-white rounded-bl-none'
                    : 'bg-white text-stone-900 border border-stone-200 rounded-br-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>

              {msg.quickReplies && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.quickReplies.map((qr, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(qr)}
                      className="text-[11px] px-2.5 py-1 bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 rounded-full transition-colors"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-stone-500 text-xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-800" />
              <span>مساعد مكتبة السالمي يتحقق من المخزون والأسعار...</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="اسأل عن أي كتاب، سلسلة بكالوريا، أو مرجع جامعي..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-800 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <span>إرسال</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

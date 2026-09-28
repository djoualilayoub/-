export interface CatalogItem {
  id: string;
  name: string;
  nameFr?: string;
  category: 'notebooks' | 'pens' | 'paper' | 'geometry' | 'uniforms' | 'bac_series' | 'books' | 'accessories';
  price: number; // in د.ج
  unit: string;
  description?: string;
  isEstimated?: boolean;
  inStock: boolean;
  level?: string;
  code?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  specifications?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isEstimated: boolean;
  category?: string;
  confidence?: 'high' | 'medium' | 'low';
  originalText?: string;
  note?: string;
}

export interface AmbiguousItem {
  id: string;
  itemIndex: number;
  location: string;
  recognizedFragment: string;
  suggestedItem: string;
  suggestedPrice: number;
  question: string;
  resolved: boolean;
  userCorrection?: string;
}

export interface AnalysisResult {
  detectedGrade?: string;
  schoolName?: string;
  items: OrderItem[];
  ambiguousItems: AmbiguousItem[];
  estimatedTotal: number;
  notes: string;
  formattedWhatsApp: string;
  rawOcrSummary?: string;
}

export interface BookItem {
  id: string;
  title: string;
  authorOrPublisher?: string;
  level: string; // e.g., 'بكالوريا', 'التعليم المتوسط', 'التعليم الابتدائي', 'جامعي - جامعة أدرار', 'ثقافة وروايات'
  streamOrMajor?: string; // شعبة علوم تجريبية، تقني رياضي، تسيير، حقوق...
  price: number;
  status: 'متوفر في المتجر' | 'كمية محدودة' | 'تحت الطلب (خلال 48 ساعة)';
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  recommendedBooks?: BookItem[];
  relatedList?: OrderItem[];
}

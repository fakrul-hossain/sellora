export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  inStock: boolean;
  imageUrl?: string;
}

export interface OptionVariant {
  id: string;
  name: string;
  priceDelta: number;
  inStock: boolean;
}

export interface KeyFeatureCardItem {
  title: string;
  subtitle: string;
  iconName: 'bluetooth' | 'battery' | 'shield' | 'zap' | 'sound' | 'water' | 'cpu' | 'display' | 'star';
}

export interface SpecGroup {
  category: string;
  items: { label: string; value: string }[];
}

export interface BoxItem {
  title: string;
  quantity: string;
  iconName?: string;
}

export interface EMIOption {
  bankName: string;
  logo: string;
  months: number;
  monthlyAmount: number;
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  photos?: string[];
  likes: number;
}

export interface QuestionItem {
  id: string;
  question: string;
  author: string;
  date: string;
  answer?: string;
  answeredBy?: string;
  answerDate?: string;
}

export interface BundleAccessory {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  defaultSelected: boolean;
}

export interface ProductDetailItem {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  soldCount?: number;
  qnaCount?: number;
  isVerifiedOfficialStore?: boolean;
  imageUrl: string;
  galleryImages: string[];
  threeSixtyFrames?: string[];
  videoUrl?: string;
  inStock: boolean;
  stockCount: number;
  sku: string;
  warranty: string;
  description: string;
  features: string[];
  keyFeatureCards?: KeyFeatureCardItem[];
  colorVariants?: ColorVariant[];
  storageVariants?: OptionVariant[];
  versionVariants?: OptionVariant[];
  specifications?: SpecGroup[];
  boxContents?: BoxItem[];
  emiPlans?: EMIOption[];
  reviewsList?: ReviewItem[];
  questionsList?: QuestionItem[];
  frequentlyBoughtTogether?: BundleAccessory[];
}

export const mockProducts: ProductDetailItem[] = [
  {
    id: 'remax-200h',
    title: 'Remax 200h High-Fidelity Wireless Bluetooth Neckband Earphones with ANC & 18H Playtime',
    brand: 'REMAX',
    category: 'Electronics',
    price: 3490,
    originalPrice: 4790,
    discountPercentage: 27,
    rating: 4.8,
    reviewCount: 369,
    soldCount: 1420,
    qnaCount: 24,
    isVerifiedOfficialStore: true,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    ],
    threeSixtyFrames: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    inStock: true,
    stockCount: 45,
    sku: 'RMX-200H-PRO-BLK',
    warranty: '12 Months Replacement Warranty',
    description: `Experience studio-grade audio streaming with the Remax 200h Wireless Neckband Earphones. Featuring custom-tuned 10mm titanium dynamic drivers and Active Noise Cancellation (ANC), the Remax 200h delivers crystal-clear highs, warm mids, and deep punchy bass.

    Built for active modern lifestyles, the lightweight skin-friendly silicone neckband ensures all-day ergonomic comfort while sweat-proof IPX4 sealing protects against intense workouts and rain. Equipped with Bluetooth 5.3 technology, enjoy ultra-low latency audio sync perfect for mobile gaming and video streaming.`,
    features: [
      'Bluetooth 5.3 instant auto-pairing with dual-device seamless switching',
      'Active Noise Cancellation (ANC) up to 25dB for immersive calls & music',
      '18-hour continuous battery playback on a single fast Type-C charge',
      'Ergonomic skin-friendly silicone neckband with magnetic tangle-free earbuds',
      'IPX4 splash & sweat resistance for active workouts',
    ],
    keyFeatureCards: [
      { title: 'Bluetooth 5.3', subtitle: 'Ultra-low 45ms latency', iconName: 'bluetooth' },
      { title: '18 Hours Battery', subtitle: 'Type-C Fast Charge 10-min = 3 hrs', iconName: 'battery' },
      { title: 'ANC Noise Cancellation', subtitle: 'Up to 25dB active filtering', iconName: 'zap' },
      { title: 'IPX4 Water Resistant', subtitle: 'Sweat and rain protected', iconName: 'water' },
      { title: 'HD Call Mic', subtitle: 'Dual MEMS clear voice mic', iconName: 'sound' },
      { title: '1 Year Warranty', subtitle: 'Instant official unit swap', iconName: 'shield' },
    ],
    colorVariants: [
      { id: 'c-black', name: 'Midnight Black', hex: '#1E293B', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
      { id: 'c-silver', name: 'Titanium Silver', hex: '#94A3B8', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80' },
      { id: 'c-red', name: 'Crimson Red', hex: '#DE1162', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80' },
    ],
    versionVariants: [
      { id: 'v-std', name: 'Standard Edition', priceDelta: 0, inStock: true },
      { id: 'v-pro', name: 'Pro Edition (ANC + Carry Case)', priceDelta: 400, inStock: true },
    ],
    specifications: [
      {
        category: 'Audio & Acoustics',
        items: [
          { label: 'Driver Size', value: '10mm Dynamic Titanium Coated' },
          { label: 'Frequency Response', value: '20Hz - 20,000Hz' },
          { label: 'Noise Cancellation', value: 'Active Noise Cancellation (ANC) up to 25dB' },
          { label: 'Impedance', value: '32 Ω ± 15%' },
        ],
      },
      {
        category: 'Connectivity & Wireless',
        items: [
          { label: 'Bluetooth Version', value: 'v5.3 + EDR' },
          { label: 'Wireless Range', value: '10 Meters (33 Feet) Line of sight' },
          { label: 'Supported Codecs', value: 'AAC, SBC' },
          { label: 'Multipoint Pairing', value: 'Yes (Connect 2 devices simultaneously)' },
        ],
      },
      {
        category: 'Battery & Charging',
        items: [
          { label: 'Battery Capacity', value: '180 mAh Lithium Polymer' },
          { label: 'Playtime', value: 'Up to 18 Hours (50% Volume)' },
          { label: 'Charging Port', value: 'USB Type-C Fast Charging' },
          { label: 'Full Charge Time', value: '1.2 Hours' },
        ],
      },
      {
        category: 'Build & Dimensions',
        items: [
          { label: 'Weight', value: '28.5g Ultra Lightweight' },
          { label: 'Waterproof Rating', value: 'IPX4 Water & Sweat Proof' },
          { label: 'Neckband Material', value: 'Medical-grade Flexible Memory Silicone' },
          { label: 'Magnetic Earbuds', value: 'Yes (Auto Sleep when clipped)' },
        ],
      },
      {
        category: 'Warranty & Support',
        items: [
          { label: 'Warranty Duration', value: '12 Months Official Brand Replacement Warranty' },
          { label: 'Warranty Type', value: 'SELLORA Express Direct Replacement' },
          { label: 'Origin Country', value: 'Designed in Hong Kong, Assembled in China' },
        ],
      },
    ],
    boxContents: [
      { title: 'Remax 200h Wireless Neckband', quantity: '1 Unit' },
      { title: 'USB Type-C Fast Charging Cable', quantity: '1 Cable' },
      { title: 'Silicone Eartips (S / M / L)', quantity: '3 Pairs' },
      { title: 'User Instruction Manual', quantity: '1 Booklet' },
      { title: 'SELLORA Official Warranty Card', quantity: '1 Card' },
    ],
    emiPlans: [
      { bankName: 'City Bank Amex', logo: 'city', months: 3, monthlyAmount: 1163 },
      { bankName: 'City Bank Amex', logo: 'city', months: 6, monthlyAmount: 581 },
      { bankName: 'EBL Credit Card', logo: 'ebl', months: 12, monthlyAmount: 291 },
      { bankName: 'BRAC Bank', logo: 'brac', months: 6, monthlyAmount: 581 },
      { bankName: 'Standard Chartered', logo: 'scb', months: 12, monthlyAmount: 291 },
    ],
    reviewsList: [
      {
        id: 'r1',
        author: 'Tanvir Hossain',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '2 Days ago',
        verified: true,
        comment: 'Mindblowing sound clarity for this budget! The ANC works surprisingly well in crowded bus rides in Dhaka. Delivery was super fast within 24 hours.',
        photos: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80',
        ],
        likes: 34,
      },
      {
        id: 'r2',
        author: 'Nusrat Jahan',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: '1 week ago',
        verified: true,
        comment: 'Battery backup is genuine 17-18 hours! Charge lasts 3-4 days of office calls. Official warranty card was stamped properly inside package.',
        likes: 19,
      },
      {
        id: 'r3',
        author: 'Kazi Mahbub',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        rating: 4,
        date: '2 weeks ago',
        verified: true,
        comment: 'Bass response is punchy. Mic audio during phone calls in wind is clear. 100% authentic product from SELLORA official store.',
        likes: 12,
      },
    ],
    questionsList: [
      {
        id: 'q1',
        question: 'Is this compatible with iPhone 15 Pro Max and Android phones?',
        author: 'Rakib Hasan',
        date: '3 days ago',
        answer: 'Yes, absolutely! The Remax 200h uses universal Bluetooth 5.3 and connects seamlessly to iOS, Android, laptops, and smart TVs.',
        answeredBy: 'REMAX Official Support',
        answerDate: '3 days ago',
      },
      {
        id: 'q2',
        question: 'How long does the warranty last and how do I claim it?',
        author: 'Shamim Ahmed',
        date: '1 week ago',
        answer: 'It includes 1 Year Direct Official Replacement Warranty. You can bring or courier the unit to any SELLORA Hub across Bangladesh for instant replacement.',
        answeredBy: 'SELLORA Customer Care',
        answerDate: '1 week ago',
      },
    ],
    frequentlyBoughtTogether: [
      {
        id: 'b-case',
        title: 'Hard EVA Earphone Protective Travel Case',
        price: 290,
        originalPrice: 450,
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80',
        defaultSelected: true,
      },
      {
        id: 'b-charger',
        title: 'Baseus 20W PD Type-C Fast Wall Charger',
        price: 890,
        originalPrice: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1609592424074-b52e6bc80d85?auto=format&fit=crop&w=300&q=80',
        defaultSelected: true,
      },
    ],
  },
  {
    id: 'tata-tea-450g',
    title: 'TATA Tea Premium Leaf Tea 450g Pack',
    brand: 'TATA',
    category: 'Groceries',
    price: 170,
    originalPrice: 225,
    discountPercentage: 25,
    rating: 4.9,
    reviewCount: 189,
    soldCount: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    ],
    inStock: true,
    stockCount: 120,
    sku: 'TATA-TEA-450',
    warranty: '100% Original & Fresh Guarantee',
    description: 'Rich blend of fine tea leaves giving strong flavor, rich color, and refreshing aroma for your daily tea time.',
    features: ['Selected premium CTC tea leaves', 'Rich color and strong refreshing taste', 'Sealed air-tight foil packaging'],
  },
  {
    id: 'columbus-knife',
    title: 'Columbus Stainless Steel Super Chef Knife Set',
    brand: 'COLUMBUS',
    category: 'Home & Living',
    price: 389,
    originalPrice: 509,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 189,
    soldCount: 940,
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    ],
    inStock: true,
    stockCount: 30,
    sku: 'COL-KNIFE-STEEL',
    warranty: '1 Year Warranty',
    description: 'Ultra-sharp high carbon stainless steel chef knife engineered for effortless slicing, dicing, and chopping.',
    features: ['High carbon German stainless steel', 'Non-slip ergonomic grip handle', 'Precision honed razor edge'],
  },
  {
    id: 'waterproof-backpack',
    title: "Men's Water Proof Travel & Laptop Backpack",
    brand: 'SELLORA',
    category: 'Fashion',
    price: 1199,
    originalPrice: 1750,
    discountPercentage: 31,
    rating: 4.7,
    reviewCount: 303,
    soldCount: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    ],
    inStock: true,
    stockCount: 60,
    sku: 'SLR-BP-WPF',
    warranty: '1 Year Stitching Warranty',
    description: 'Durable 15.6-inch waterproof travel laptop backpack with anti-theft hidden pocket and built-in USB charging port.',
    features: ['Waterproof Oxford fabric material', 'Padded laptop compartment up to 15.6"', 'External USB charging port'],
  },
  {
    id: 't900-ultra-smartwatch',
    title: 'T900 Ultra 2.3 Big Display Smart Watch',
    brand: 'T900',
    category: 'Electronics',
    price: 4770,
    originalPrice: 5990,
    discountPercentage: 20,
    rating: 4.8,
    reviewCount: 477,
    soldCount: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    ],
    inStock: true,
    stockCount: 80,
    sku: 'T900-ULTRA-BLK',
    warranty: '6 Months Warranty',
    description: 'Feature-rich smartwatch with 2.3-inch borderless HD display, Bluetooth calling, heart rate & SpO2 tracking.',
    features: ['Bluetooth Calling with loudspeaker', 'Heart Rate & Sleep Monitoring', 'Multi-sport fitness tracking modes'],
  },
  {
    id: 'baseus-powerbank-10000',
    title: 'Baseus Bipow Fast Charge Power Bank 10000mAh',
    brand: 'BASEUS',
    category: 'Electronics',
    price: 1250,
    originalPrice: 1699,
    discountPercentage: 26,
    rating: 4.9,
    reviewCount: 560,
    soldCount: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1609592424074-b52e6bc80d85?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1609592424074-b52e6bc80d85?auto=format&fit=crop&w=600&q=80',
    ],
    inStock: true,
    stockCount: 50,
    sku: 'BAS-PB-10K',
    warranty: '6 Months Official Warranty',
    description: '15W 2-Way Fast Charge dual USB output power bank with LED digital percentage indicator.',
    features: ['Dual USB & Type-C fast output', 'Digital percentage battery LED display', 'Polymer battery safety protection'],
  },
  {
    id: 'noise-colorfit-pulse-3',
    title: 'Noise ColorFit Pulse 3 Smart Watch',
    brand: 'NOISE',
    category: 'Electronics',
    price: 2799,
    originalPrice: 3499,
    discountPercentage: 20,
    rating: 4.7,
    reviewCount: 1200,
    soldCount: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    ],
    inStock: true,
    stockCount: 40,
    sku: 'NOISE-PULSE-3',
    warranty: '1 Year Official Warranty',
    description: '1.96" TFT display smartwatch with Tru Sync Bluetooth calling and 100+ sports modes.',
    features: ['1.96" TFT HD Touch Display', 'Tru Sync Bluetooth calling', '7-day battery endurance'],
  },
  {
    id: 'nivea-men-facewash',
    title: 'Nivea Men Deep Impact Face Wash 100ml',
    brand: 'NIVEA',
    category: 'Beauty & Health',
    price: 249,
    originalPrice: 320,
    discountPercentage: 22,
    rating: 4.9,
    reviewCount: 890,
    soldCount: 6200,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    ],
    inStock: true,
    stockCount: 150,
    sku: 'NIV-MEN-FW100',
    warranty: '100% Original Guarantee',
    description: 'Black carbon formula face wash that deeply cleanses pores and removes excess oil without drying skin.',
    features: ['Intense black carbon cleansing formula', 'Clears pores & oil control', 'Dermatologically approved'],
  },
  {
    id: 'redmi-buds-4-lite',
    title: 'Redmi Buds 4 Lite TWS Wireless Earbuds',
    brand: 'XIAOMI',
    category: 'Electronics',
    price: 1499,
    originalPrice: 1899,
    discountPercentage: 21,
    rating: 4.8,
    reviewCount: 780,
    soldCount: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    ],
    inStock: true,
    stockCount: 75,
    sku: 'REDMI-BUDS-4L',
    warranty: '6 Months Official Warranty',
    description: '12mm dynamic driver earbuds with AI noise cancellation for calls and 20-hour total battery life.',
    features: ['12mm dynamic audio driver', 'Google Fast Pair support', 'IP54 dust & water resistance'],
  },
  {
    id: 'philips-mixer-grinder',
    title: 'Philips HL7756/00 750W Mixer Grinder 3 Jars',
    brand: 'PHILIPS',
    category: 'Home & Living',
    price: 4250,
    originalPrice: 5199,
    discountPercentage: 18,
    rating: 4.7,
    reviewCount: 640,
    soldCount: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=600&q=80',
    ],
    inStock: true,
    stockCount: 25,
    sku: 'PHI-HL7756-750W',
    warranty: '2 Years Official Warranty',
    description: '750-watt Turbo Motor mixer grinder with 3 stainless steel leakproof jars for wet & dry grinding.',
    features: ['750W Air ventilated motor', '3 leakproof stainless steel jars', 'Specialized tough blades for Indian/BD spices'],
  },
];

export function getProductById(id: string): ProductDetailItem {
  const found = mockProducts.find((p) => p.id === id);
  if (found) return found;

  // Fallback enriched default product if id is unknown
  const base = mockProducts[0];
  return {
    ...base,
    id: id,
    title: id.replace(/-/g, ' ').toUpperCase() + ' - Premium Tech Edition',
  };
}


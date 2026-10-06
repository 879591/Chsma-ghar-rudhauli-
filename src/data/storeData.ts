export interface DoctorInfo {
  id: string;
  nameHi: string;
  nameEn: string;
  qualification: string;
}

export interface ServiceItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'checkup' | 'optical' | 'guidance';
  descriptionHi: string;
  consultationNoteHi: string;
}

export type FrameCategory =
  | "Men's Frames"
  | "Women's Frames"
  | "Kids Frames"
  | "Sunglasses"
  | "Computer Glasses"
  | "Premium Frames";

export interface EyewearProduct {
  id: string;
  nameHi: string;
  nameEn: string;
  category: FrameCategory;
  categoryHi: string;
  frameStyle: string;
  image: string;
  price?: string; // Optional, not invented
  isSamplePlaceholder: boolean;
}

export interface GalleryItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: string;
  image: string;
  captionHi: string;
}

export interface AppointmentRequest {
  id: string;
  createdAt: string;
  name: string;
  mobile: string;
  preferredDate: string;
  preferredTime: string;
  service: 'Eye Checkup' | 'Frame Selection' | 'Glasses' | 'Other';
  message: string;
}

export interface PrescriptionRecord {
  id: string;
  createdAt: string;
  patientName: string;
  date: string;
  odSph: string;
  odCyl: string;
  odAxis: string;
  odAdd: string;
  osSph: string;
  osCyl: string;
  osAxis: string;
  osAdd: string;
  pd: string;
  remarks: string;
  optometristName: string;
}

export interface CustomerEnquiry {
  id: string;
  createdAt: string;
  customerName: string;
  mobile: string;
  subject: string;
  details: string;
}

export interface StoreConfig {
  businessNameHi: string;
  businessNameEn: string;
  taglineHi: string;
  subheadHi: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  hoursHi: string;
  hoursShortHi: string;
  addressHi: string;
  addressShortHi: string;
  addressEn: string;
  bannerAnnouncementHi: string;
  heroImage: string;
  aboutImage: string;
  doctors: DoctorInfo[];
  services: ServiceItem[];
  products: EyewearProduct[];
  gallery: GalleryItem[];
}

export const INITIAL_STORE_CONFIG: StoreConfig = {
  businessNameHi: 'नेत्री आई केयर सेंटर एवं चश्मा घर',
  businessNameEn: 'Netri Eye Care Center & Chashma Ghar',
  taglineHi: 'स्पष्ट दृष्टि, बेहतर जीवन',
  subheadHi:
    'नेत्री आई केयर सेंटर एवं चश्मा घर में आपकी आँखों और चश्मे से जुड़ी आवश्यक सेवाओं के लिए आपका स्वागत है।',
  primaryPhone: '9118252405',
  secondaryPhone: '6394636296',
  whatsappNumber: '9118252405',
  hoursHi: 'सुबह 9:00 बजे से शाम 6:00 बजे तक',
  hoursShortHi: 'सुबह 9:00 बजे – शाम 6:00 बजे',
  addressHi: 'बस्ती-बांसी रोड, निकट भारत बैट्री, रुधौली-बस्ती, उत्तर प्रदेश',
  addressShortHi: 'रुधौली-बस्ती',
  addressEn: 'Basti-Bansi Road, Near Bharat Battery, Rudhauli-Basti, Uttar Pradesh',
  bannerAnnouncementHi:
    'कंप्यूटरीकृत मशीनों द्वारा आँखों की जाँच एवं आधुनिक चश्मा घर — सुबह 9:00 बजे से शाम 6:00 बजे तक',
  heroImage: '/src/assets/images/hero_optical_showroom_1791271781525.jpg',
  aboutImage: '/src/assets/images/about_eye_checkup_center_1791271799211.jpg',
  doctors: [
    {
      id: 'doc-1',
      nameHi: 'डॉ. N.S. शर्मा',
      nameEn: 'Dr. N.S. Sharma',
      qualification: 'D.Opt',
    },
    {
      id: 'doc-2',
      nameHi: 'डॉ. D.K. आर्या',
      nameEn: 'Dr. D.K. Arya',
      qualification: 'D.Opt',
    },
  ],
  services: [
    {
      id: 'srv-1',
      titleHi: 'कंप्यूटरीकृत मशीनों द्वारा आँखों की जाँच',
      titleEn: 'Computerized Eye Testing',
      category: 'checkup',
      descriptionHi: 'आधुनिक कंप्यूटरीकृत मशीनों की सहायता से दृष्टि एवं चश्मे के नंबर की जाँच।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-2',
      titleHi: 'चश्मा एवं फ्रेम',
      titleEn: 'Spectacles & Optical Frames',
      category: 'optical',
      descriptionHi: 'हर उम्र के लिए आरामदायक और टिकाऊ नजर के चश्मे तथा आकर्षक फ्रेम उपलब्ध।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-3',
      titleHi: 'धूप व छांव के लिए चश्मे',
      titleEn: 'Day & Shade Eyewear / Photochromic & Sunglasses',
      category: 'optical',
      descriptionHi: 'धूप और छांव में आँखों के आराम व सुरक्षा के लिए उपयुक्त चश्मे।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-4',
      titleHi: 'ARC (एंटी-रिफ्लेक्टिव कोटिंग लेंस)',
      titleEn: 'ARC Coated Lenses',
      category: 'optical',
      descriptionHi: 'स्क्रीन और रोशनी की चमक कम करने के लिए ARC लेंस सुविधा।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-5',
      titleHi: 'GLASS CARBON',
      titleEn: 'Glass Carbon Optical Frames & Lenses',
      category: 'optical',
      descriptionHi: 'मजबूत और हल्के ग्लास व कार्बन फ्रेम विकल्प।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-6',
      titleHi: 'SUPRA (सुप्रा हाफ-रिम फ्रेम)',
      titleEn: 'Supra Half-Rim Frames',
      category: 'optical',
      descriptionHi: 'क्लासिक और प्रोफेशनल लुक के लिए सुप्रा फ्रेम की रेंज।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-7',
      titleHi: 'श्री पीस (Rimless / Three-Piece फ्रेम)',
      titleEn: 'Three-Piece Rimless Frames',
      category: 'optical',
      descriptionHi: 'अत्यंत हल्के और सौम्य लुक वाले थ्री-पीस रिमलेस चश्मे।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-8',
      titleHi: 'मेटल / गोल्डन फ्रेम',
      titleEn: 'Metal & Golden Frames',
      category: 'optical',
      descriptionHi: 'पारंपरिक और आधुनिक मेटल व गोल्डन फिनिश फ्रेम।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-9',
      titleHi: 'आँख से पानी आना',
      titleEn: 'Watering Eyes Assessment',
      category: 'guidance',
      descriptionHi: 'आँखों से लगातार पानी आने की समस्या पर प्राथमिक दृष्टि जाँच व परामर्श।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-10',
      titleHi: 'जलन / लाली',
      titleEn: 'Eye Irritation & Redness Guidance',
      category: 'guidance',
      descriptionHi: 'आँखों में जलन या लाली महसूस होने पर उचित जाँच एवं सलाह।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-11',
      titleHi: 'मोतियाबिंद संबंधी सलाह',
      titleEn: 'Cataract Consultation & Guidance',
      category: 'guidance',
      descriptionHi: 'मोतियाबिंद के लक्षणों की पहचान एवं आगे की उचित सलाह।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-12',
      titleHi: 'नासूर / नाखून / पलक की गाँठ',
      titleEn: 'Eyelid & Tear Duct Related Consultation',
      category: 'guidance',
      descriptionHi: 'नासूर, नाखून या पलक की गाँठ से संबंधित जाँच और उचित परामर्श।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-13',
      titleHi: 'सिर के दर्द से संबंधित चश्मे की सुविधा',
      titleEn: 'Eyewear for Eye-Strain Headaches',
      category: 'checkup',
      descriptionHi: 'दृष्टि दोष के कारण होने वाले सिर दर्द के लिए आँखों की जाँच व चश्मे की सुविधा।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
    {
      id: 'srv-14',
      titleHi: 'धुंधला दिखाई देने पर चश्मे की सुविधा',
      titleEn: 'Eyewear for Blurred Vision',
      category: 'checkup',
      descriptionHi: 'पास या दूर का धुंधला दिखाई देने पर नंबर की जाँच एवं उपयुक्त चश्मे की सुविधा।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    },
  ],
  products: [
    {
      id: 'prd-1',
      nameHi: 'मेटल / गोल्डन एवं SUPRA फ्रेम (नमूना)',
      nameEn: 'Classic Metal / Golden & Supra Frame (Sample)',
      category: "Men's Frames",
      categoryHi: 'पुरुषों के फ्रेम (Men’s Frames)',
      frameStyle: 'मेटल / गोल्डन फ्रेम · SUPRA',
      image: '/src/assets/images/mens_classic_metal_frame_1791271817409.jpg',
      price: '',
      isSamplePlaceholder: true,
    },
    {
      id: 'prd-2',
      nameHi: 'हल्के डिज़ाइनर एवं मेटल फ्रेम (नमूना)',
      nameEn: 'Lightweight Elegant Optical Frame (Sample)',
      category: "Women's Frames",
      categoryHi: 'महिलाओं के फ्रेम (Women’s Frames)',
      frameStyle: 'चश्मा एवं फ्रेम · हल्का वजन',
      image: '/src/assets/images/womens_elegant_eyeglasses_1791271828442.jpg',
      price: '',
      isSamplePlaceholder: true,
    },
    {
      id: 'prd-3',
      nameHi: 'बच्चों के लिए लचीले एवं आरामदायक फ्रेम (नमूना)',
      nameEn: 'Flexible Comfort Kids Optical Frame (Sample)',
      category: 'Kids Frames',
      categoryHi: 'बच्चों के फ्रेम (Kids Frames)',
      frameStyle: 'चश्मा एवं फ्रेम · टिकाऊ बनावट',
      image: '/src/assets/images/womens_elegant_eyeglasses_1791271828442.jpg',
      price: '',
      isSamplePlaceholder: true,
    },
    {
      id: 'prd-4',
      nameHi: 'धूप व छांव के लिए चश्मे (नमूना)',
      nameEn: 'Sun & Shade Protective Eyewear (Sample)',
      category: 'Sunglasses',
      categoryHi: 'धूप के चश्मे (Sunglasses)',
      frameStyle: 'धूप व छांव के लिए चश्मे',
      image: '/src/assets/images/sunglasses_arc_collection_1791271842960.jpg',
      price: '',
      isSamplePlaceholder: true,
    },
    {
      id: 'prd-5',
      nameHi: 'ARC कोटेड कंप्यूटर व स्क्रीन चश्मे (नमूना)',
      nameEn: 'ARC Coated Screen Eyewear (Sample)',
      category: 'Computer Glasses',
      categoryHi: 'कंप्यूटर चश्मे (Computer Glasses)',
      frameStyle: 'ARC · GLASS CARBON',
      image: '/src/assets/images/sunglasses_arc_collection_1791271842960.jpg',
      price: '',
      isSamplePlaceholder: true,
    },
    {
      id: 'prd-6',
      nameHi: 'श्री पीस (Three-Piece) एवं प्रीमियम गोल्डन फ्रेम (नमूना)',
      nameEn: 'Three-Piece Rimless & Golden Frame (Sample)',
      category: 'Premium Frames',
      categoryHi: 'प्रीमियम फ्रेम (Premium Frames)',
      frameStyle: 'श्री पीस · मेटल / गोल्डन फ्रेम',
      image: '/src/assets/images/mens_classic_metal_frame_1791271817409.jpg',
      price: '',
      isSamplePlaceholder: true,
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      titleHi: 'नेत्री आई केयर सेंटर एवं चश्मा घर — मुख्य शोरूम झलक',
      titleEn: 'Netri Eye Care Showroom Display',
      category: 'शोरूम एवं डिस्प्ले',
      image: '/src/assets/images/hero_optical_showroom_1791271781525.jpg',
      captionHi: 'चश्मा एवं फ्रेम का सुव्यवस्थित संग्रह (एडमिन पैनल से वास्तविक दुकान फोटो बदलें)',
    },
    {
      id: 'gal-2',
      titleHi: 'कंप्यूटरीकृत मशीनों द्वारा आँखों की जाँच कक्ष',
      titleEn: 'Computerized Eye Testing Setup',
      category: 'जाँच मशीनें',
      image: '/src/assets/images/about_eye_checkup_center_1791271799211.jpg',
      captionHi: 'कंप्यूटरीकृत मशीनों द्वारा आँखों की जाँच सुविधा',
    },
    {
      id: 'gal-3',
      titleHi: 'मेटल / गोल्डन एवं SUPRA फ्रेम संग्रह',
      titleEn: 'Metal, Golden & Supra Frames',
      category: 'मेटल एवं SUPRA',
      image: '/src/assets/images/mens_classic_metal_frame_1791271817409.jpg',
      captionHi: 'SUPRA, श्री पीस एवं मेटल / गोल्डन फ्रेम',
    },
    {
      id: 'gal-4',
      titleHi: 'आधुनिक चश्मा एवं फ्रेम कलेक्शन',
      titleEn: 'Modern Optical Frame Collection',
      category: 'चश्मा एवं फ्रेम',
      image: '/src/assets/images/womens_elegant_eyeglasses_1791271828442.jpg',
      captionHi: 'दैनिक उपयोग एवं पढ़ने के लिए आरामदायक फ्रेम',
    },
    {
      id: 'gal-5',
      titleHi: 'धूप व छांव के चश्मे तथा ARC लेंस',
      titleEn: 'Sun & Shade Eyewear and ARC Lenses',
      category: 'ARC एवं धूप चश्मे',
      image: '/src/assets/images/sunglasses_arc_collection_1791271842960.jpg',
      captionHi: 'धूप व छांव के लिए चश्मे एवं ARC लेंस विकल्प',
    },
  ],
};

export function createWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WHATSAPP_GREETING =
  'नमस्ते, मैं नेत्री आई केयर सेंटर एवं चश्मा घर से आँखों की जाँच/चश्मे के बारे में जानकारी लेना चाहता/चाहती हूँ।';

export const FRAME_WHATSAPP_GREETING =
  'नमस्ते, मुझे इस चश्मे/फ्रेम की उपलब्धता और कीमत के बारे में जानकारी चाहिए।';

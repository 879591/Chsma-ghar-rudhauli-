/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Phone,
  MessageCircle,
  Calendar,
  Eye,
  Glasses,
  MapPin,
  Clock,
  Menu,
  X,
  Search,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Download,
  Smartphone,
  Share2,
  CheckCircle2,
  Stethoscope,
  ShieldCheck,
  Navigation,
  Settings,
  FileText,
  Globe,
  Mail,
  Instagram,
  Facebook,
  Code2,
} from 'lucide-react';
import {
  AppointmentRequest,
  CustomerEnquiry,
  DEFAULT_DEVELOPER_CONFIG,
  DEFAULT_WHATSAPP_GREETING,
  EyewearProduct,
  FRAME_WHATSAPP_GREETING,
  FrameCategory,
  GalleryItem,
  INITIAL_STORE_CONFIG,
  PrescriptionRecord,
  StoreConfig,
  createWhatsAppUrl,
} from './data/storeData';
import { useOnlineStatus, usePWAInstall } from './hooks/usePWAInstall';
import { EyeTestSection } from './components/EyeTestSection';
import { PrescriptionSection } from './components/PrescriptionSection';
import { CustomerDownloadsSection } from './components/CustomerDownloadsSection';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import {
  downloadAppointmentSlip,
  downloadProductInfoSheet,
} from './utils/pdfGenerator';

const STORAGE_KEYS = {
  CONFIG: 'netri_store_config_v1',
  APPOINTMENTS: 'netri_appointments_v1',
  PRESCRIPTIONS: 'netri_prescriptions_v1',
  ENQUIRIES: 'netri_enquiries_v1',
};

const EYEWEAR_CATEGORIES: { id: 'All' | FrameCategory; labelHi: string; labelEn: string }[] = [
  { id: 'All', labelHi: 'सभी श्रेणियाँ', labelEn: 'All Frames' },
  { id: "Men's Frames", labelHi: '👓 पुरुषों के फ्रेम', labelEn: "Men's Frames" },
  { id: "Women's Frames", labelHi: '👓 महिलाओं के फ्रेम', labelEn: "Women's Frames" },
  { id: 'Kids Frames', labelHi: '👓 बच्चों के फ्रेम', labelEn: 'Kids Frames' },
  { id: 'Sunglasses', labelHi: '🕶️ धूप के चश्मे', labelEn: 'Sunglasses' },
  { id: 'Computer Glasses', labelHi: '💻 कंप्यूटर चश्मे', labelEn: 'Computer Glasses' },
  { id: 'Premium Frames', labelHi: '✨ प्रीमियम फ्रेम', labelEn: 'Premium Frames' },
];

export default function App() {
  // Store Config State (Backed by localStorage for Admin CMS)
  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_STORE_CONFIG;
    } catch {
      return INITIAL_STORE_CONFIG;
    }
  });

  const [appointments, setAppointments] = useState<AppointmentRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Navigation & Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [installGuideModal, setInstallGuideModal] = useState(false);

  // Eyewear Catalogue Filter
  const [selectedCategory, setSelectedCategory] = useState<'All' | FrameCategory>('All');

  // Gallery Filter, Search & Lightbox
  const [galleryCategory, setGalleryCategory] = useState<string>('सभी');
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Appointment Form State
  const todayIso = new Date().toISOString().split('T')[0];
  const [aptName, setAptName] = useState('');
  const [aptMobile, setAptMobile] = useState('');
  const [aptDate, setAptDate] = useState(todayIso);
  const [aptTime, setAptTime] = useState('सुबह 10:00 - दोपहर 1:00');
  const [aptService, setAptService] = useState<
    'Eye Checkup' | 'Frame Selection' | 'Glasses' | 'Other'
  >('Eye Checkup');
  const [aptMessage, setAptMessage] = useState('');
  const [aptError, setAptError] = useState('');
  const [submittedApt, setSubmittedApt] = useState<AppointmentRequest | null>(null);

  // PWA & Online Hooks
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch {
      // Ignore storage quota errors
    }
  }, [config]);

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = aptName.trim();
    const cleanMobile = aptMobile.replace(/\D/g, '');

    if (!cleanName) {
      setAptError('कृपया अपना नाम दर्ज करें।');
      return;
    }
    if (cleanMobile.length < 10) {
      setAptError('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।');
      return;
    }

    setAptError('');
    const newApt: AppointmentRequest = {
      id: `APT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      name: cleanName,
      mobile: cleanMobile,
      preferredDate: aptDate || todayIso,
      preferredTime: aptTime,
      service: aptService,
      message: aptMessage.trim(),
    };

    const updated = [newApt, ...appointments];
    setAppointments(updated);
    setSubmittedApt(newApt);
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleSavePrescription = (record: PrescriptionRecord) => {
    const updated = [record, ...prescriptions];
    setPrescriptions(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const logEnquiry = (subject: string, details: string) => {
    const newEnq: CustomerEnquiry = {
      id: `ENQ-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      customerName: 'वेबसाइट विज़िटर',
      mobile: '',
      subject,
      details,
    };
    const updated = [newEnq, ...enquiries];
    setEnquiries(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered Products
  const filteredProducts =
    selectedCategory === 'All'
      ? config.products
      : config.products.filter((p) => p.category === selectedCategory);

  // Filtered Gallery
  const galleryCategories = [
    'सभी',
    ...Array.from(new Set(config.gallery.map((g) => g.category))),
  ];

  const filteredGallery: GalleryItem[] = config.gallery.filter((item) => {
    const matchesCat =
      galleryCategory === 'सभी' || item.category === galleryCategory;
    const q = gallerySearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.titleHi.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.captionHi.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const currentLightboxItem =
    lightboxIndex !== null && filteredGallery[lightboxIndex]
      ? filteredGallery[lightboxIndex]
      : null;

  const handleShareSite = async () => {
    const url = window.location.origin;
    const shareData = {
      title: config.businessNameHi,
      text: `${config.businessNameHi} (${config.addressShortHi}) — आँखों की जाँच एवं चश्मे की जानकारी के लिए वेबसाइट देखें:`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareData.text} ${url}`);
    }
  };

  const getServiceHindiLabel = (srv: AppointmentRequest['service']) => {
    switch (srv) {
      case 'Eye Checkup':
        return 'आँखों की जाँच (Eye Checkup)';
      case 'Frame Selection':
        return 'फ्रेम चयन (Frame Selection)';
      case 'Glasses':
        return 'चश्मा बनवाना (Glasses)';
      default:
        return 'अन्य परामर्श (Other)';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 pb-16 md:pb-0">
      {/* Offline Banner */}
      {!isOnline && (
        <div
          role="status"
          className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
          ऑफ़लाइन मोड सक्रिय — आप बिना इंटरनेट के भी दुकान का पता, नंबर और दृष्टि चार्ट देख सकते हैं।
        </div>
      )}

      {/* Top Bar Contract: Strict 1-row, 3-zone header (Brand Title | 5 Nav Links | 2 Actions) */}
      <header className="sticky top-0 z-40 h-16 glass-panel border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single Text Element Wordmark */}
        <a
          href="#home"
          className="text-lg sm:text-xl font-bold tracking-tight text-[#0B192C] whitespace-nowrap truncate max-w-[230px] sm:max-w-none"
        >
          नेत्री आई केयर सेंटर
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav
          aria-label="मुख्य नेविगेशन"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700"
        >
          <a
            href="#home"
            className="hover:text-[#0B192C] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            होम (Home)
          </a>
          <a
            href="#about"
            className="hover:text-[#0B192C] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            परिचय (About)
          </a>
          <a
            href="#services"
            className="hover:text-[#0B192C] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            सेवाएँ (Services)
          </a>
          <a
            href="#eye-test"
            className="hover:text-[#0B192C] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            दृष्टि जाँच (Eye Test)
          </a>
          <a
            href="#eyewear"
            className="hover:text-[#0B192C] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            चश्मे (Eyewear)
          </a>
          <a
            href="#contact"
            className="hover:text-[#0B192C] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            संपर्क (Contact)
          </a>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2.5">
          {!isInstalled && (
            <button
              type="button"
              onClick={() => {
                if (isInstallable) {
                  install();
                } else {
                  setInstallGuideModal(true);
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-colors min-h-[40px] whitespace-nowrap"
            >
              📲 ऐप इंस्टॉल करें
            </button>
          )}

          <button
            type="button"
            onClick={() => scrollToSection('appointment')}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B192C] text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors shadow-sm min-h-[40px] whitespace-nowrap"
          >
            अपॉइंटमेंट बुक करें
          </button>

          {/* Mobile Hamburger Trigger (44x44px hitbox) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-100"
            aria-label={mobileMenuOpen ? 'मेनू बंद करें' : 'मेनू खोलें'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-30 bg-white border-b border-slate-200 shadow-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2.5 text-sm font-semibold text-slate-800">
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left min-h-[44px]"
            >
              होम (Home)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left min-h-[44px]"
            >
              परिचय (About)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('services')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left min-h-[44px]"
            >
              सेवाएँ (Services)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('eye-test')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left min-h-[44px]"
            >
              दृष्टि जाँच (Eye Test)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('eyewear')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left min-h-[44px]"
            >
              चश्मे (Eyewear)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('gallery')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left min-h-[44px]"
            >
              फ्रेम गैलरी (Gallery)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('prescription')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left min-h-[44px]"
            >
              चश्मे का नंबर (PDF)
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left min-h-[44px]"
            >
              संपर्क (Contact)
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => scrollToSection('appointment')}
              className="flex-1 py-3 px-4 rounded-xl bg-[#0B192C] text-white text-sm font-semibold text-center min-h-[46px]"
            >
              अपॉइंटमेंट बुक करें
            </button>
            {!isInstalled && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isInstallable) {
                    install();
                  } else {
                    setInstallGuideModal(true);
                  }
                }}
                className="py-3 px-4 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold min-h-[46px]"
              >
                📲 ऐप इंस्टॉल करें
              </button>
            )}
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* ==================================================
            3. HERO SECTION
           ================================================== */}
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-8 pb-14 md:py-20"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Hindi-Prominent Brand & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                {/* Unboxed Clean Metadata Line */}
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-sky-800">
                  <span>{config.businessNameHi}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-600 font-medium">{config.businessNameEn}</span>
                </div>

                {/* Main Hero Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#0B192C] leading-[1.18] tracking-tight">
                  {config.taglineHi}
                </h1>

                {/* Hero Subheading */}
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
                  {config.subheadHi}
                </p>

                {/* Primary Hero Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  <button
                    type="button"
                    onClick={() => scrollToSection('appointment')}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0B192C] text-white font-semibold text-base hover:bg-slate-800 transition-colors shadow-sm min-h-[48px] whitespace-nowrap"
                  >
                    <Calendar className="w-5 h-5 text-amber-400" />
                    अपॉइंटमेंट बुक करें
                  </button>

                  <a
                    href={createWhatsAppUrl(config.whatsappNumber, DEFAULT_WHATSAPP_GREETING)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => logEnquiry('Hero WhatsApp Click', 'सामान्य पूछताछ')}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-semibold text-base hover:bg-emerald-800 transition-colors shadow-sm min-h-[48px] whitespace-nowrap"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp करें
                  </a>

                  <a
                    href={`tel:+91${config.primaryPhone}`}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-semibold text-base hover:bg-slate-50 transition-colors min-h-[48px] whitespace-nowrap"
                  >
                    <Phone className="w-5 h-5 text-sky-700" />
                    कॉल करें ({config.primaryPhone})
                  </a>
                </div>

                {/* Verified Store Timings & Location Row */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-slate-900">
                      {config.hoursShortHi}
                    </span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
                    |
                  </span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-700 shrink-0" />
                    <span className="font-semibold text-slate-900">
                      {config.addressShortHi}
                    </span>
                    <span className="text-slate-500 text-xs">
                      (बस्ती-बांसी रोड, निकट भारत बैट्री)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Showroom Visual + Animated Optical Lens SVG */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 shadow-lg bg-[#0B192C] aspect-[16/10] sm:aspect-[4/3]">
                  <img
                    src={config.heroImage}
                    alt="नेत्री आई केयर सेंटर एवं चश्मा घर शोरूम"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 via-[#0B192C]/25 to-transparent" />

                  {/* Subtle Animated Eye / Vision Optical Graphic Overlay */}
                  <div className="absolute top-4 right-4 glass-navy border border-white/15 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 text-white">
                    <svg
                      className="w-8 h-8 text-sky-400"
                      viewBox="0 0 64 64"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 32C14 18 23 12 32 12C41 12 50 18 58 32C50 46 41 52 32 52C23 52 14 46 6 32Z"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="10"
                        className="stroke-amber-400"
                        strokeWidth="3"
                      />
                      <circle cx="32" cy="32" r="4" fill="#38BDF8" />
                    </svg>
                    <div className="text-xs leading-tight">
                      <div className="font-bold text-white">कंप्यूटरीकृत जाँच</div>
                      <div className="text-sky-300 text-[11px]">एवं आधुनिक चश्मा घर</div>
                    </div>
                  </div>

                  {/* Bottom Caption inside Hero Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs text-amber-300 font-semibold">
                      हमारे विशेषज्ञ: डॉ. N.S. शर्मा (D.Opt) · डॉ. D.K. आर्या (D.Opt)
                    </div>
                    <div className="text-sm sm:text-base font-bold mt-0.5">
                      {config.businessNameHi}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            4. QUICK ACTION BAR (4 Large Mobile-Friendly Actions)
           ================================================== */}
        <section
          aria-label="त्वरित सुविधाएँ"
          className="py-6 bg-white border-y border-slate-200"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('eye-test')}
                className="group p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-[#0B192C] border border-slate-200 hover:border-[#0B192C] transition-colors flex items-center gap-3.5 text-left min-h-[68px]"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100 group-hover:bg-white/15 text-sky-800 group-hover:text-sky-300 flex items-center justify-center text-xl shrink-0">
                  👁️
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-white text-base sm:text-lg">
                    आँखों की जाँच
                  </div>
                  <div className="text-xs text-slate-500 group-hover:text-slate-300">
                    ऑनलाइन चार्ट व मशीन जाँच
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('eyewear')}
                className="group p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-[#0B192C] border border-slate-200 hover:border-[#0B192C] transition-colors flex items-center gap-3.5 text-left min-h-[68px]"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 group-hover:bg-white/15 text-amber-800 group-hover:text-amber-300 flex items-center justify-center text-xl shrink-0">
                  👓
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-white text-base sm:text-lg">
                    चश्मा देखें
                  </div>
                  <div className="text-xs text-slate-500 group-hover:text-slate-300">
                    फ्रेम, SUPRA व धूप चश्मे
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('appointment')}
                className="group p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-[#0B192C] border border-slate-200 hover:border-[#0B192C] transition-colors flex items-center gap-3.5 text-left min-h-[68px]"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100 group-hover:bg-white/15 text-sky-800 group-hover:text-sky-300 flex items-center justify-center text-xl shrink-0">
                  📅
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-white text-base sm:text-lg">
                    अपॉइंटमेंट
                  </div>
                  <div className="text-xs text-slate-500 group-hover:text-slate-300">
                    समय बुक करें
                  </div>
                </div>
              </button>

              <a
                href={createWhatsAppUrl(config.whatsappNumber, DEFAULT_WHATSAPP_GREETING)}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 sm:p-5 rounded-2xl bg-emerald-50/80 hover:bg-emerald-700 border border-emerald-200 hover:border-emerald-700 transition-colors flex items-center gap-3.5 text-left min-h-[68px]"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-200/70 group-hover:bg-white/15 text-emerald-900 group-hover:text-white flex items-center justify-center text-xl shrink-0">
                  💬
                </div>
                <div>
                  <div className="font-bold text-emerald-950 group-hover:text-white text-base sm:text-lg">
                    WhatsApp
                  </div>
                  <div className="text-xs text-emerald-800 group-hover:text-emerald-100 font-mono-num">
                    {config.primaryPhone}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ==================================================
            5. ABOUT SECTION & 13. DOCTOR SECTION
           ================================================== */}
        <section id="about" className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Image Slot */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 aspect-[4/3]">
                  <img
                    src={config.aboutImage}
                    alt="नेत्री आई केयर सेंटर में कंप्यूटरीकृत आँखों की जाँच कक्ष"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Verified Introduction Copy */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
                    हमारे बारे में · About Netri Eye Care Center
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                    आपकी दृष्टि, हमारी प्राथमिकता
                  </h2>
                </div>

                <p className="text-slate-700 text-base leading-relaxed">
                  <strong>{config.businessNameHi}</strong> ({config.businessNameEn}) बस्ती-बांसी रोड, निकट भारत बैट्री, रुधौली-बस्ती में स्थित आपका विश्वसनीय नेत्र जाँच एवं चश्मा केंद्र है। यहाँ कंप्यूटरीकृत मशीनों द्वारा आँखों की जाँच, उचित परामर्श तथा विभिन्न प्रकार के आधुनिक व आरामदायक चश्मों और फ्रेम की सुविधा उपलब्ध है।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900 text-sm mb-1">
                      कंप्यूटरीकृत दृष्टि जाँच
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      धुंधला दिखाई देने, सिर दर्द या आँखों की सामान्य समस्याओं के लिए मशीनों द्वारा जाँच व उचित सलाह।
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900 text-sm mb-1">
                      चश्मा एवं फ्रेम संग्रह
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      ARC, GLASS CARBON, SUPRA, श्री पीस, मेटल / गोल्डन फ्रेम तथा धूप व छांव के चश्मे उपलब्ध।
                    </p>
                  </div>
                </div>

                {/* ==================================================
                    13. DOCTOR SECTION ("हमारे विशेषज्ञ")
                   ================================================== */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-sky-700" />
                    हमारे विशेषज्ञ
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl bg-[#0B192C] text-white flex items-center justify-between border border-slate-800"
                      >
                        <div>
                          <div className="text-base sm:text-lg font-bold text-white">
                            {doc.nameHi}
                          </div>
                          <div className="text-xs text-slate-300 mt-0.5">{doc.nameEn}</div>
                        </div>
                        <span className="font-mono-num text-sm font-bold text-amber-400">
                          {doc.qualification}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            6. SERVICES SECTION (Strictly Verified Services)
           ================================================== */}
        <section
          id="services"
          className="py-16 md:py-24 bg-slate-50 border-t border-slate-200"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
                  उपलब्ध सुविधाएँ एवं परामर्श · Verified Store Services
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                  आँखों की जाँच, चश्मा एवं परामर्श सेवाएँ
                </h2>
                <p className="mt-2 text-slate-600 max-w-2xl text-base">
                  नेत्री आई केयर सेंटर एवं चश्मा घर में उपलब्ध प्रमुख सेवाएँ और फ्रेम विकल्प। जाँच एवं उचित सलाह के लिए संपर्क करें।
                </p>
              </div>

              <a
                href={createWhatsAppUrl(config.whatsappNumber, DEFAULT_WHATSAPP_GREETING)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B192C] text-white text-sm font-semibold hover:bg-slate-800 transition-colors self-start min-h-[44px] whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                सेवा के बारे में पूछें
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {config.services.map((srv, index) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-mono-num font-semibold text-sky-700">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{srv.titleEn}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {srv.titleHi}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {srv.descriptionHi}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-600">
                      {srv.consultationNoteHi}
                    </span>
                    <a
                      href={createWhatsAppUrl(
                        config.whatsappNumber,
                        `नमस्ते, मुझे "${srv.titleHi}" के संबंध में जाँच एवं उचित सलाह के लिए जानकारी चाहिए।`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-sky-700 hover:text-sky-900 whitespace-nowrap"
                    >
                      संपर्क करें →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            7. EYE TEST SECTION ("अपनी दृष्टि की जाँच करें")
           ================================================== */}
        <EyeTestSection
          config={config}
          onBookAppointment={() => scrollToSection('appointment')}
        />

        {/* ==================================================
            8. EYEWEAR COLLECTION (Catalogue)
           ================================================== */}
        <section id="eyewear" className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
                  चश्मा एवं फ्रेम कैटलॉग · Eyewear Collection
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                  हर चेहरे और आवश्यकता के लिए उपयुक्त चश्मे
                </h2>
                <p className="mt-2 text-slate-600 max-w-2xl text-base">
                  पसंदीदा श्रेणी चुनें और उपलब्धता या कीमत जानने के लिए सीधे WhatsApp पर संदेश भेजें।
                </p>
              </div>
            </div>

            {/* Interactive Category Filter Buttons */}
            <div
              role="tablist"
              aria-label="चश्मे की श्रेणियाँ"
              className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar"
            >
              {EYEWEAR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[44px] ${
                    selectedCategory === cat.id
                      ? 'bg-[#0B192C] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.labelHi}
                </button>
              ))}
            </div>

            {/* Product Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.nameHi}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    <div className="p-5">
                      {/* Clean Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                        <span>{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.frameStyle}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {product.nameHi}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{product.nameEn}</p>

                      {product.price ? (
                        <div className="mt-3 text-base font-bold text-slate-900 font-mono-num">
                          {product.price}
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-slate-500">
                          {product.isSamplePlaceholder
                            ? 'प्रदर्शनी नमूना (स्टोर मालिक एडमिन पैनल से वास्तविक फोटो व विवरण अपडेट कर सकते हैं)'
                            : 'स्टोर पर विभिन्न डिज़ाइन उपलब्ध'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Card Actions */}
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={createWhatsAppUrl(
                          config.whatsappNumber,
                          `${FRAME_WHATSAPP_GREETING} (फ्रेम: ${product.nameHi} - ${product.category})`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => logEnquiry('Frame Inquiry', product.nameHi)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors min-h-[44px] whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                        WhatsApp पर पूछें
                      </a>

                      <a
                        href={createWhatsAppUrl(
                          config.whatsappNumber,
                          `नमस्ते, क्या "${product.nameHi}" (${product.frameStyle}) अभी स्टोर में उपलब्ध है?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => logEnquiry('Availability Inquiry', product.nameHi)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-white text-xs font-semibold transition-colors min-h-[44px] whitespace-nowrap"
                      >
                        उपलब्धता पूछें
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadProductInfoSheet(product, config)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      फ्रेम विवरण डाउनलोड करें
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            9. FRAME GALLERY (Filter, Search, Lightbox & Mobile Swipe)
           ================================================== */}
        <section
          id="gallery"
          className="py-16 md:py-24 bg-slate-50 border-t border-slate-200"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
                  शोरूम एवं फ्रेम झलक · Frame &amp; Store Gallery
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                  फ्रेम एवं शोरूम गैलरी
                </h2>
                <p className="mt-1.5 text-slate-600 text-sm sm:text-base">
                  किसी भी फोटो को बड़ा करके देखने (Zoom) और WhatsApp पर पूछने के लिए उस पर टैप करें।
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  placeholder="फ्रेम या श्रेणी खोजें (उदा. SUPRA, ARC)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 min-h-[44px]"
                />
              </div>
            </div>

            {/* Category Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGalleryCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap min-h-[40px] ${
                    galleryCategory === cat
                      ? 'bg-[#0B192C] text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            {filteredGallery.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-600">
                आपकी खोज से मेल खाने वाली कोई फोटो नहीं मिली। कृपया अन्य शब्द खोजें।
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredGallery.map((item, idx) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="relative aspect-[4/3] bg-slate-100 overflow-hidden text-left w-full"
                    >
                      <img
                        src={item.image}
                        alt={item.titleHi}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/50 text-white flex items-center justify-center">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-xs text-sky-300 font-medium">{item.category}</div>
                        <div className="text-sm font-bold leading-snug">{item.titleHi}</div>
                      </div>
                    </button>

                    <div className="p-4 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-600 truncate">{item.captionHi}</span>
                      <a
                        href={createWhatsAppUrl(
                          config.whatsappNumber,
                          `${FRAME_WHATSAPP_GREETING} (${item.titleHi})`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold shrink-0 min-h-[40px] whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        इस फ्रेम के बारे में WhatsApp पर पूछें
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Modal with Mobile Swipe Support */}
        {currentLightboxItem && lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="फोटो ज़ूम व्यू"
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;
              const deltaX = e.changedTouches[0].clientX - touchStartX;
              if (deltaX > 50 && lightboxIndex > 0) {
                setLightboxIndex(lightboxIndex - 1);
              } else if (deltaX < -50 && lightboxIndex < filteredGallery.length - 1) {
                setLightboxIndex(lightboxIndex + 1);
              }
              setTouchStartX(null);
            }}
          >
            <div className="flex items-center justify-between text-white max-w-5xl w-full mx-auto">
              <div className="text-sm font-semibold">
                {currentLightboxItem.titleHi}{' '}
                <span className="text-xs text-slate-400 font-mono-num ml-2">
                  ({lightboxIndex + 1} / {filteredGallery.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center my-4 max-w-5xl w-full mx-auto">
              {lightboxIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(lightboxIndex - 1)}
                  className="absolute left-2 z-10 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 min-h-[44px] min-w-[44px]"
                  aria-label="पिछली फोटो"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img
                src={currentLightboxItem.image}
                alt={currentLightboxItem.titleHi}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] max-w-full rounded-2xl object-contain border border-white/15"
              />

              {lightboxIndex < filteredGallery.length - 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(lightboxIndex + 1)}
                  className="absolute right-2 z-10 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 min-h-[44px] min-w-[44px]"
                  aria-label="अगली फोटो"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="max-w-3xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-white">
              <div className="text-xs sm:text-sm">{currentLightboxItem.captionHi}</div>
              <a
                href={createWhatsAppUrl(
                  config.whatsappNumber,
                  `${FRAME_WHATSAPP_GREETING} (${currentLightboxItem.titleHi})`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold min-h-[44px] whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                इस फ्रेम के बारे में WhatsApp पर पूछें
              </a>
            </div>
          </div>
        )}

        {/* ==================================================
            10. APPOINTMENT BOOKING SECTION
           ================================================== */}
        <section id="appointment" className="py-16 md:py-24 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Info Column */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
                    समय बुक करें · Appointment Request
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                    आँखों की जाँच या चश्मे के लिए अपॉइंटमेंट लें
                  </h2>
                  <p className="mt-2 text-slate-600 text-base leading-relaxed">
                    अपना समय बचाने के लिए नीचे फॉर्म भरें और सीधे WhatsApp या कॉल के माध्यम से अपना समय सुनिश्चित करें।
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0B192C] text-white space-y-4">
                  <div className="text-sm font-semibold text-amber-400">
                    नेत्री आई केयर सेंटर एवं चश्मा घर
                  </div>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                      <div>
                        <span className="text-slate-300 block text-xs">खुलने का समय:</span>
                        <strong>{config.hoursHi}</strong>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                      <div>
                        <span className="text-slate-300 block text-xs">पता:</span>
                        <strong>{config.addressHi}</strong>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                      <div>
                        <span className="text-slate-300 block text-xs">संपर्क नंबर:</span>
                        <strong className="font-mono-num">
                          {config.primaryPhone}, {config.secondaryPhone}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Column */}
              <div className="lg:col-span-7 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8">
                {!submittedApt ? (
                  <form onSubmit={handleSaveAppointment} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="apt-name"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          आपका नाम (Name) *
                        </label>
                        <input
                          id="apt-name"
                          type="text"
                          value={aptName}
                          onChange={(e) => setAptName(e.target.value)}
                          placeholder="अपना पूरा नाम लिखें"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="apt-mobile"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          मोबाइल नंबर (Mobile Number) *
                        </label>
                        <input
                          id="apt-mobile"
                          type="tel"
                          value={aptMobile}
                          onChange={(e) => setAptMobile(e.target.value)}
                          placeholder="10 अंकों का मोबाइल नंबर"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-sky-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="apt-date"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          पसंदीदा दिनांक (Preferred Date)
                        </label>
                        <input
                          id="apt-date"
                          type="date"
                          min={todayIso}
                          value={aptDate}
                          onChange={(e) => setAptDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-sky-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="apt-time"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          पसंदीदा समय (Preferred Time)
                        </label>
                        <select
                          id="apt-time"
                          value={aptTime}
                          onChange={(e) => setAptTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                        >
                          <option value="सुबह 9:00 - सुबह 11:00">सुबह 9:00 - सुबह 11:00</option>
                          <option value="सुबह 11:00 - दोपहर 1:00">सुबह 11:00 - दोपहर 1:00</option>
                          <option value="दोपहर 1:00 - शाम 4:00">दोपहर 1:00 - शाम 4:00</option>
                          <option value="शाम 4:00 - शाम 6:00">शाम 4:00 - शाम 6:00</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="apt-service"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        सेवा चुनें (Service)
                      </label>
                      <select
                        id="apt-service"
                        value={aptService}
                        onChange={(e) =>
                          setAptService(
                            e.target.value as
                              | 'Eye Checkup'
                              | 'Frame Selection'
                              | 'Glasses'
                              | 'Other'
                          )
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                      >
                        <option value="Eye Checkup">Eye Checkup (कंप्यूटरीकृत आँखों की जाँच)</option>
                        <option value="Frame Selection">Frame Selection (फ्रेम का चुनाव)</option>
                        <option value="Glasses">Glasses (नजर या धूप का चश्मा बनवाना)</option>
                        <option value="Other">Other (अन्य परामर्श)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="apt-message"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        संदेश या समस्या विवरण (Message - वैकल्पिक)
                      </label>
                      <textarea
                        id="apt-message"
                        rows={3}
                        value={aptMessage}
                        onChange={(e) => setAptMessage(e.target.value)}
                        placeholder="यदि कोई विशेष बात लिखना चाहें (जैसे: पुराना चश्मा नंबर, सिर दर्द, धुंधला दिखना)..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>

                    {aptError && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
                        {aptError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 px-6 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-white font-semibold text-base transition-colors shadow-sm min-h-[48px]"
                    >
                      अपॉइंटमेंट रिक्वेस्ट तैयार करें
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6 py-2">
                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950">
                      <CheckCircle2 className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-base">
                          आपकी request तैयार है। WhatsApp पर भेजकर appointment confirm करें।
                        </h3>
                        <p className="text-xs sm:text-sm text-amber-900 mt-1">
                          नीचे दिए गए हरे बटन पर क्लिक करके अपना विवरण सीधे स्टोर के WhatsApp ({config.primaryPhone}) पर भेजें या कॉल करें।
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">नाम (Name):</span>
                        <strong className="text-slate-900">{submittedApt.name}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">मोबाइल (Mobile):</span>
                        <strong className="text-slate-900 font-mono-num">
                          {submittedApt.mobile}
                        </strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">दिनांक एवं समय:</span>
                        <strong className="text-slate-900">
                          {submittedApt.preferredDate} ({submittedApt.preferredTime})
                        </strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">सेवा (Service):</span>
                        <strong className="text-slate-900">
                          {getServiceHindiLabel(submittedApt.service)}
                        </strong>
                      </div>
                      {submittedApt.message && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">संदेश:</span>
                          <span className="text-slate-800">{submittedApt.message}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={createWhatsAppUrl(
                          config.whatsappNumber,
                          `नमस्ते, मैं नेत्री आई केयर सेंटर एवं चश्मा घर में अपॉइंटमेंट बुक करना चाहता/चाहती हूँ।\n\nनाम: ${submittedApt.name}\nमोबाइल: ${submittedApt.mobile}\nसेवा: ${getServiceHindiLabel(submittedApt.service)}\nपसंदीदा दिनांक: ${submittedApt.preferredDate}\nसमय: ${submittedApt.preferredTime}${
                            submittedApt.message ? `\nसंदेश: ${submittedApt.message}` : ''
                          }`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[220px] inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm sm:text-base transition-colors min-h-[48px] whitespace-nowrap"
                      >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp पर भेजकर Confirm करें
                      </a>

                      <a
                        href={`tel:+91${config.primaryPhone}`}
                        className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-white font-semibold text-sm sm:text-base transition-colors min-h-[48px] whitespace-nowrap"
                      >
                        <Phone className="w-4 h-4 text-amber-400" />
                        कॉल करें ({config.primaryPhone})
                      </a>

                      <button
                        type="button"
                        onClick={() => downloadAppointmentSlip(submittedApt, config)}
                        className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-colors min-h-[48px] whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        पर्ची डाउनलोड करें
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSubmittedApt(null)}
                      className="text-xs font-semibold text-sky-700 hover:underline"
                    >
                      ← नया अपॉइंटमेंट विवरण भरें
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            14. PRESCRIPTION DOWNLOAD UTILITY
           ================================================== */}
        <PrescriptionSection
          config={config}
          onSavePrescription={handleSavePrescription}
        />

        {/* ==================================================
            15 & 16. CUSTOMER DOWNLOADS, QR CODE & PWA INSTALL
           ================================================== */}
        <CustomerDownloadsSection
          config={config}
          lastAppointment={submittedApt || appointments[0] || null}
          onScrollToPrescription={() => scrollToSection('prescription')}
          onScrollToAppointment={() => scrollToSection('appointment')}
          isInstallable={isInstallable}
          isInstalled={isInstalled}
          isIOS={isIOS}
          onInstallPWA={install}
          onOpenIOSGuide={() => setInstallGuideModal(true)}
        />

        {/* ==================================================
            12. CONTACT SECTION (Phones, Address, Hours, Maps Query)
           ================================================== */}
        <section id="contact" className="py-16 md:py-24 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="mb-10">
              <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
                पता एवं संपर्क सूत्र · Visit Our Optical Center
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                हमसे संपर्क करें या स्टोर पर पधारें
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Contact Details Card */}
              <div className="lg:col-span-6 bg-[#0B192C] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {config.businessNameEn}
                    </div>
                    <h3 className="text-2xl font-bold mt-1">{config.businessNameHi}</h3>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-white/15 text-sm sm:text-base">
                    <div className="flex items-start gap-3.5">
                      <Phone className="w-5 h-5 text-sky-400 shrink-0 mt-1" />
                      <div>
                        <span className="text-xs text-slate-300 block">फोन नंबर (Phone):</span>
                        <div className="font-mono-num font-bold text-lg space-x-3">
                          <a href={`tel:+91${config.primaryPhone}`} className="hover:underline">
                            {config.primaryPhone}
                          </a>
                          <span>,</span>
                          <a href={`tel:+91${config.secondaryPhone}`} className="hover:underline">
                            {config.secondaryPhone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                      <div>
                        <span className="text-xs text-slate-300 block">समय (Business Hours):</span>
                        <strong className="text-base">{config.hoursHi}</strong>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-1" />
                      <div>
                        <span className="text-xs text-slate-300 block">पता (Address):</span>
                        <strong className="text-base leading-relaxed block">
                          बस्ती-बांसी रोड,
                          <br />
                          निकट भारत बैट्री,
                          <br />
                          रुधौली-बस्ती, उत्तर प्रदेश
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Contact Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15">
                  <a
                    href={`tel:+91${config.primaryPhone}`}
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white text-[#0B192C] font-bold text-sm hover:bg-slate-100 transition-colors min-h-[48px] whitespace-nowrap"
                  >
                    📞 Call Now
                  </a>

                  <a
                    href={createWhatsAppUrl(config.whatsappNumber, DEFAULT_WHATSAPP_GREETING)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors min-h-[48px] whitespace-nowrap"
                  >
                    💬 WhatsApp
                  </a>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=%E0%A4%AC%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%80-%E0%A4%AC%E0%A4%BE%E0%A4%82%E0%A4%B8%E0%A5%80+%E0%A4%B0%E0%A5%8B%E0%A4%A1+%E0%A4%A8%E0%A4%BF%E0%A4%95%E0%A4%9F+%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4+%E0%A4%AC%E0%A5%88%E0%A4%9F%E0%A5%8D%E0%A4%B0%E0%A5%80+%E0%A4%B0%E0%A5%81%E0%A4%A7%E0%A5%8C%E0%A4%B2%E0%A5%80+%E0%A4%AC%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%80+%E0%A4%89%E0%A4%A4%E0%A5%8D%E0%A4%A4%E0%A4%B0+%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A6%E0%A5%87%E0%A4%B6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sky-600 text-white font-bold text-sm hover:bg-sky-700 transition-colors min-h-[48px] whitespace-nowrap"
                  >
                    📍 Get Directions
                  </a>
                </div>
              </div>

              {/* Address-Based Map Embed / Direction Card (Zero Invented GPS Coordinates) */}
              <div className="lg:col-span-6 rounded-3xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between">
                <div className="w-full h-72 sm:h-80 bg-slate-200 relative">
                  <iframe
                    title="नेत्री आई केयर सेंटर एवं चश्मा घर — रुधौली-बस्ती मानचित्र"
                    src="https://maps.google.com/maps?q=Basti-Bansi+Road,+Rudhauli,+Basti,+Uttar+Pradesh&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm text-slate-700">
                    <strong className="text-slate-900">पहचान चिन्ह (Landmark):</strong> बस्ती-बांसी रोड, निकट भारत बैट्री, रुधौली-बस्ती
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Basti-Bansi+Road+Near+Bharat+Battery+Rudhauli+Basti+Uttar+Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:underline whitespace-nowrap"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Google Maps में खोलें →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================
          24. FOOTER
         ================================================== */}
      <footer className="bg-[#0B192C] text-slate-300 pt-14 pb-24 md:pb-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-white/10">
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xl font-bold text-white">{config.businessNameHi}</div>
              <div className="text-xs text-sky-400 font-medium">{config.businessNameEn}</div>
              <p className="text-base font-semibold text-amber-400 pt-1">
                &ldquo;{config.taglineHi}&rdquo;
              </p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                विशेषज्ञ: डॉ. N.S. शर्मा (D.Opt) एवं डॉ. D.K. आर्या (D.Opt)
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleShareSite}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold min-h-[40px]"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  वेबसाइट शेयर करें
                </button>
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-medium min-h-[40px]"
                >
                  <Settings className="w-3.5 h-3.5" />
                  स्टोर एडमिन (Admin)
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3 space-y-2.5 text-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                त्वरित लिंक (Quick Links)
              </div>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">
                    Home (होम)
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Services (सेवाएँ)
                  </a>
                </li>
                <li>
                  <a href="#eye-test" className="hover:text-white transition-colors">
                    Eye Test (दृष्टि जाँच)
                  </a>
                </li>
                <li>
                  <a href="#eyewear" className="hover:text-white transition-colors">
                    Eyewear (चश्मा संग्रह)
                  </a>
                </li>
                <li>
                  <a href="#appointment" className="hover:text-white transition-colors">
                    Appointment (अपॉइंटमेंट)
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact (संपर्क)
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-4 space-y-2.5 text-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                संपर्क एवं समय
              </div>
              <p className="font-mono-num text-white font-semibold">
                फोन: {config.primaryPhone}, {config.secondaryPhone}
              </p>
              <p>पता: बस्ती-बांसी रोड, निकट भारत बैट्री, रुधौली-बस्ती</p>
              <p>समय: {config.hoursHi}</p>
            </div>
          </div>

          {/* ==================================================
              COMPACT PREMIUM "ABOUT DEVELOPER" SECTION
              (Placed at the bottom of the page, just above copyright)
             ================================================== */}
          {(() => {
            const dev = config.developer || DEFAULT_DEVELOPER_CONFIG;
            const devWhatsappLink = `https://wa.me/${dev.whatsappPhone}?text=${encodeURIComponent(
              dev.whatsappPrefill
            )}`;
            const cleanGmail = (dev.gmailAddress || '').trim();

            return (
              <div className="pt-6 pb-5 border-b border-white/10">
                <div className="rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Compact Developer Identity & Short Description */}
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-sky-400">
                        <Code2 className="w-3.5 h-3.5" />
                        About Developer
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-white text-xs">{dev.name}</span>
                      <span className="text-amber-400 font-semibold text-xs">{dev.handle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-300">{dev.subtitle}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {dev.descriptionHi}
                    </p>

                    {/* Contact Links Row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11px] text-slate-300">
                      <a
                        href={`tel:+91${dev.phone}`}
                        className="inline-flex items-center gap-1 hover:text-white transition-colors font-mono-num"
                      >
                        <Phone className="w-3 h-3 text-sky-400" />
                        <span>{dev.phone}</span>
                      </a>
                      <span className="text-white/20" aria-hidden="true">·</span>
                      <a
                        href={dev.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        Instagram: {dev.instagramHandle}
                      </a>
                      <span className="text-white/20" aria-hidden="true">·</span>
                      <a
                        href={dev.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sky-300 hover:text-white transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        <span>srd-one.vercel.app</span>
                      </a>
                    </div>
                  </div>

                  {/* Right: 4 Small Premium Icon Buttons + Compact CTA */}
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center gap-3 shrink-0">
                    {/* 4 Small Premium Icon Buttons: WhatsApp, Instagram, Facebook, Gmail */}
                    <div className="flex items-center gap-2">
                      <a
                        href={devWhatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp Suraj Maurya"
                        title="WhatsApp"
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-600/90 border border-white/10 hover:border-emerald-500 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      <a
                        href={dev.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram @suraj.5tar"
                        title="Instagram (@suraj.5tar)"
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-600/90 border border-white/10 hover:border-pink-500 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>

                      <a
                        href={dev.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook Profile"
                        title="Facebook"
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-blue-600/90 border border-white/10 hover:border-blue-500 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>

                      {cleanGmail ? (
                        <a
                          href={`mailto:${cleanGmail}`}
                          aria-label={`Email ${cleanGmail}`}
                          title={`Gmail: ${cleanGmail}`}
                          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-amber-600/90 border border-white/10 hover:border-amber-500 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAdminModalOpen(true)}
                          aria-label="Set Developer Gmail in Admin Settings"
                          title="Gmail (एडमिन सेटिंग्स में अपना Gmail पता जोड़ें)"
                          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Small CTA Block */}
                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="text-[11px] text-amber-300/90 font-medium">
                        अपनी दुकान या Business को Digital पहचान दें
                      </span>
                      <a
                        href={devWhatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-200 hover:text-white text-xs font-semibold transition-all duration-150 whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Website बनवाने के लिए Contact करें
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>© 2026 Netri Eye Care Center &amp; Chashma Ghar</div>
            <div className="text-[11px] text-slate-400">
              Designed &amp; Developed by <span className="text-slate-200 font-medium">Suraj Maurya</span> • <span className="text-amber-400 font-medium">5tarSuraj</span>
            </div>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="hover:text-white underline underline-offset-4"
              >
                Privacy Policy (गोपनीयता नीति)
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="hover:text-white underline underline-offset-4"
              >
                Terms (नियम व शर्तें)
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ==================================================
          19. STICKY MOBILE BOTTOM NAVIGATION (Call, WhatsApp, Appointment)
         ================================================== */}
      <nav
        aria-label="मोबाइल त्वरित संपर्क बार"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 grid grid-cols-3 gap-2 items-center"
      >
        <a
          href={`tel:+91${config.primaryPhone}`}
          className="h-11 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Phone className="w-4 h-4 text-sky-700 shrink-0" />
          कॉल करें
        </a>

        <a
          href={createWhatsAppUrl(config.whatsappNumber, DEFAULT_WHATSAPP_GREETING)}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          WhatsApp
        </a>

        <button
          type="button"
          onClick={() => scrollToSection('appointment')}
          className="h-11 rounded-xl bg-[#0B192C] active:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          अपॉइंटमेंट
        </button>
      </nav>

      {/* ==================================================
          17. ADMIN DASHBOARD MODAL
         ================================================== */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        appointments={appointments}
        prescriptions={prescriptions}
        enquiries={enquiries}
        onClearAppointments={() => {
          setAppointments([]);
          localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
        }}
      />

      {/* PWA Install Guide Modal (for iOS / browsers without automatic prompt) */}
      {installGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-6 h-6 text-sky-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  📲 अपने फोन में ऐप इंस्टॉल करें
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInstallGuideModal(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-700 space-y-2.5 leading-relaxed">
              <p>
                <strong>नेत्री आई केयर सेंटर</strong> की वेबसाइट को अपने मोबाइल की होम-स्क्रीन पर ऐप की तरह जोड़ने के लिए:
              </p>
              {isIOS ? (
                <ol className="list-decimal list-inside space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <li>
                    Safari ब्राउज़र में नीचे <strong>Share (शेयर बटन)</strong> पर टैप करें।
                  </li>
                  <li>
                    नीचे स्क्रॉल करके <strong>Add to Home Screen</strong> चुनें।
                  </li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <li>
                    Chrome ब्राउज़र के ऊपरी दाएँ कोने में <strong>तीन बिंदुओं (⋮)</strong> पर टैप करें।
                  </li>
                  <li>
                    <strong>Install App (ऐप इंस्टॉल करें)</strong> या{' '}
                    <strong>Add to Home screen</strong> चुनें।
                  </li>
                </ol>
              )}
            </div>
            <button
              type="button"
              onClick={() => setInstallGuideModal(false)}
              className="w-full py-3 rounded-xl bg-[#0B192C] text-white font-semibold text-sm"
            >
              समझ गया (Close)
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy & Terms Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  {legalModal === 'privacy'
                    ? 'गोपनीयता नीति (Privacy Policy)'
                    : 'नियम एवं शर्तें (Terms of Use)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {legalModal === 'privacy' ? (
              <div className="text-xs sm:text-sm text-slate-700 space-y-2.5 leading-relaxed">
                <p>
                  <strong>नेत्री आई केयर सेंटर एवं चश्मा घर</strong> आपकी गोपनीयता का सम्मान करता है।
                </p>
                <p>
                  1. वेबसाइट पर दर्ज किया गया आपका नाम, मोबाइल नंबर या चश्मे का नंबर (Prescription) किसी भी बाहरी विज्ञापन कंपनी के साथ साझा नहीं किया जाता है।
                </p>
                <p>
                  2. प्रिस्क्रिप्शन PDF आपके अपने डिवाइस पर जनरेट होती है। अपॉइंटमेंट विवरण केवल आपकी सहमति से WhatsApp या कॉल के माध्यम से स्टोर को भेजा जाता है।
                </p>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-slate-700 space-y-2.5 leading-relaxed">
                <p>
                  1. इस वेबसाइट पर उपलब्ध ऑनलाइन दृष्टि जाँच (Eye Test) केवल प्रारंभिक/शैक्षिक स्क्रीनिंग के लिए है। यह डॉक्टर या ऑप्टोमेट्रिस्ट द्वारा की जाने वाली पूर्ण जाँच का विकल्प नहीं है।
                </p>
                <p>
                  2. चश्मा बनवाने से पूर्व स्टोर पर कंप्यूटरीकृत मशीन एवं विशेषज्ञ द्वारा नंबर की पुष्टि अवश्य कराएँ।
                </p>
                <p>
                  3. सभी सेवाएँ सुबह 9:00 बजे से शाम 6:00 बजे तक स्टोर के पते (बस्ती-बांसी रोड, निकट भारत बैट्री, रुधौली-बस्ती) पर उपलब्ध हैं।
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setLegalModal(null)}
              className="w-full py-3 rounded-xl bg-[#0B192C] text-white font-semibold text-sm"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

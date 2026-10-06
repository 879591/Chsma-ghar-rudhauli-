import React, { useState } from 'react';
import {
  X,
  Lock,
  Store,
  Stethoscope,
  Glasses,
  Calendar,
  FileText,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Info,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  AppointmentRequest,
  CustomerEnquiry,
  EyewearProduct,
  FrameCategory,
  INITIAL_STORE_CONFIG,
  PrescriptionRecord,
  ServiceItem,
  StoreConfig,
} from '../data/storeData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
  onUpdateConfig: (newConfig: StoreConfig) => void;
  appointments: AppointmentRequest[];
  prescriptions: PrescriptionRecord[];
  enquiries: CustomerEnquiry[];
  onClearAppointments: () => void;
}

const FRAME_CATEGORIES: { value: FrameCategory; labelHi: string }[] = [
  { value: "Men's Frames", labelHi: 'पुरुषों के फ्रेम (Men’s Frames)' },
  { value: "Women's Frames", labelHi: 'महिलाओं के फ्रेम (Women’s Frames)' },
  { value: 'Kids Frames', labelHi: 'बच्चों के फ्रेम (Kids Frames)' },
  { value: 'Sunglasses', labelHi: 'धूप के चश्मे (Sunglasses)' },
  { value: 'Computer Glasses', labelHi: 'कंप्यूटर चश्मे (Computer Glasses)' },
  { value: 'Premium Frames', labelHi: 'प्रीमियम फ्रेम (Premium Frames)' },
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  appointments,
  prescriptions,
  enquiries,
  onClearAppointments,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'store' | 'doctors_services' | 'catalogue' | 'gallery' | 'records' | 'production'
  >('store');
  const [savedToast, setSavedToast] = useState('');

  // Editable Store State
  const [draftConfig, setDraftConfig] = useState<StoreConfig>(config);

  // New Product State
  const [newProdNameHi, setNewProdNameHi] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<FrameCategory>("Men's Frames");
  const [newProdStyle, setNewProdStyle] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // New Service State
  const [newSrvTitleHi, setNewSrvTitleHi] = useState('');
  const [newSrvTitleEn, setNewSrvTitleEn] = useState('');
  const [newSrvDescHi, setNewSrvDescHi] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo/Local Admin PIN verification (default 2405 — last 4 digits of primary phone 9118252405)
    if (pinInput.trim() === '2405' || pinInput.trim() === 'admin123') {
      setIsAuthenticated(true);
      setDraftConfig(config);
      setPinError('');
    } else {
      setPinError('गलत पिन! स्थानीय डेमो मोड के लिए पिन 2405 दर्ज करें।');
    }
  };

  const triggerSave = (updated: StoreConfig, msg = 'परिवर्तन सुरक्षित कर दिए गए हैं!') => {
    setDraftConfig(updated);
    onUpdateConfig(updated);
    setSavedToast(msg);
    setTimeout(() => setSavedToast(''), 3000);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameHi.trim()) return;
    const catObj = FRAME_CATEGORIES.find((c) => c.value === newProdCategory);
    const newItem: EyewearProduct = {
      id: `prd-${Date.now()}`,
      nameHi: newProdNameHi.trim(),
      nameEn: newProdNameEn.trim() || newProdNameHi.trim(),
      category: newProdCategory,
      categoryHi: catObj ? catObj.labelHi : newProdCategory,
      frameStyle: newProdStyle.trim() || 'चश्मा एवं फ्रेम',
      price: newProdPrice.trim(),
      image:
        newProdImage.trim() ||
        '/src/assets/images/mens_classic_metal_frame_1791271817409.jpg',
      isSamplePlaceholder: false,
    };
    const updated = {
      ...draftConfig,
      products: [newItem, ...draftConfig.products],
    };
    triggerSave(updated, 'नया फ्रेम/चश्मा कैटलॉग में जोड़ा गया!');
    setNewProdNameHi('');
    setNewProdNameEn('');
    setNewProdStyle('');
    setNewProdPrice('');
    setNewProdImage('');
  };

  const handleDeleteProduct = (id: string) => {
    const updated = {
      ...draftConfig,
      products: draftConfig.products.filter((p) => p.id !== id),
    };
    triggerSave(updated, 'प्रोडक्ट हटाया गया।');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvTitleHi.trim()) return;
    const newSrv: ServiceItem = {
      id: `srv-${Date.now()}`,
      titleHi: newSrvTitleHi.trim(),
      titleEn: newSrvTitleEn.trim() || newSrvTitleHi.trim(),
      category: 'optical',
      descriptionHi:
        newSrvDescHi.trim() || 'आँखों की जाँच एवं चश्मे से संबंधित सुविधा।',
      consultationNoteHi: 'जाँच एवं उचित सलाह के लिए संपर्क करें।',
    };
    const updated = {
      ...draftConfig,
      services: [...draftConfig.services, newSrv],
    };
    triggerSave(updated, 'नई सेवा जोड़ी गई!');
    setNewSrvTitleHi('');
    setNewSrvTitleEn('');
    setNewSrvDescHi('');
  };

  const handleResetDefaults = () => {
    triggerSave(INITIAL_STORE_CONFIG, 'डिफ़ॉल्ट स्टोर डेटा रीसेट किया गया।');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="स्टोर एडमिन पैनल"
    >
      <div className="bg-white w-full max-w-5xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0B192C] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold">
                नेत्री आई केयर — एडमिन डैशबोर्ड (Store Admin Panel)
              </h2>
              <p className="text-xs text-slate-300">
                Local / Demo CMS Mode · स्टोर विवरण, फ्रेम कैटलॉग, फोटो एवं अपॉइंटमेंट प्रबंधन
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-5 my-8">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              एडमिन लॉगिन (Admin Access)
            </h3>
            <p className="text-sm text-slate-600">
              दुकान के फोन नंबर, समय, चश्मों के फोटो और अपॉइंटमेंट देखने के लिए सुरक्षा पिन दर्ज करें।
              <span className="block mt-1.5 text-xs text-sky-800 bg-sky-50 p-2 rounded-lg border border-sky-200">
                <strong>Demo / Local Mode PIN:</strong> <code className="font-mono-num font-bold">2405</code> (प्राथमिक फोन के अंतिम 4 अंक)
              </span>
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="पिन दर्ज करें (2405)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center text-lg font-mono-num tracking-widest focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
              {pinError && <p className="text-xs text-red-600 font-medium">{pinError}</p>}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0B192C] text-white font-semibold text-sm hover:bg-slate-800 transition-colors min-h-[48px]"
              >
                डैशबोर्ड खोलें
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Demo / Local Storage Notice */}
            <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-amber-950">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Demo / Local Persistence Mode:</strong> आपके द्वारा किए गए बदलाव तुरंत इस ब्राउज़र (`localStorage`) में सुरक्षित हो जाते हैं। सभी ग्राहकों के फोन पर लाइव डेटाबेस सिंक के लिए <strong>Supabase / Production Setup</strong> टैब देखें।
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-semibold text-xs hover:bg-amber-100 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                डिफ़ॉल्ट डेटा रीसेट करें
              </button>
            </div>

            {savedToast && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-3 flex items-center gap-2 text-emerald-900 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                {savedToast}
              </div>
            )}

            {/* Admin Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('store')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'store'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Store className="w-4 h-4" />
                स्टोर जानकारी व बैनर
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('doctors_services')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'doctors_services'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                डॉक्टर एवं सेवाएँ ({draftConfig.services.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('catalogue')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'catalogue'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Glasses className="w-4 h-4" />
                फ्रेम व धूप चश्मे ({draftConfig.products.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'gallery'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                फोटो व गैलरी ({draftConfig.gallery.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('records')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'records'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                अपॉइंटमेंट व पर्ची ({appointments.length + prescriptions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('production')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'production'
                    ? 'bg-[#0B192C] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Production &amp; Supabase गाइड
              </button>
            </div>

            {/* TAB 1: Store Information & Banners */}
            {activeTab === 'store' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      दुकान का नाम (Hindi)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.businessNameHi}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, businessNameHi: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Name (English)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.businessNameEn}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, businessNameEn: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      प्राथमिक फोन व WhatsApp नंबर
                    </label>
                    <input
                      type="text"
                      value={draftConfig.primaryPhone}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          primaryPhone: e.target.value,
                          whatsappNumber: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      द्वितीयक फोन नंबर
                    </label>
                    <input
                      type="text"
                      value={draftConfig.secondaryPhone}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, secondaryPhone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      खुलने का समय (Business Hours)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.hoursHi}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, hoursHi: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      पूरा पता (Address Hindi)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.addressHi}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, addressHi: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    वेबसाइट टॉप बैनर सूचना (Website Banner Text)
                  </label>
                  <input
                    type="text"
                    value={draftConfig.bannerAnnouncementHi}
                    onChange={(e) =>
                      setDraftConfig({ ...draftConfig, bannerAnnouncementHi: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => triggerSave(draftConfig)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B192C] text-white font-semibold text-sm hover:bg-slate-800"
                >
                  <Save className="w-4 h-4" />
                  स्टोर जानकारी सेव करें
                </button>
              </div>
            )}

            {/* TAB 2: Doctors & Services */}
            {activeTab === 'doctors_services' && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">
                    हमारे विशेषज्ञ (Doctors List)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {draftConfig.doctors.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 space-y-2"
                      >
                        <input
                          type="text"
                          value={doc.nameHi}
                          onChange={(e) => {
                            const updatedDocs = [...draftConfig.doctors];
                            updatedDocs[idx] = { ...doc, nameHi: e.target.value };
                            setDraftConfig({ ...draftConfig, doctors: updatedDocs });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold"
                        />
                        <input
                          type="text"
                          value={doc.qualification}
                          onChange={(e) => {
                            const updatedDocs = [...draftConfig.doctors];
                            updatedDocs[idx] = { ...doc, qualification: e.target.value };
                            setDraftConfig({ ...draftConfig, doctors: updatedDocs });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono-num"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerSave(draftConfig)}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B192C] text-white text-xs font-semibold"
                  >
                    <Save className="w-3.5 h-3.5" />
                    डॉक्टर विवरण अपडेट करें
                  </button>
                </div>

                {/* Add Service */}
                <form
                  onSubmit={handleAddService}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3"
                >
                  <h4 className="font-bold text-slate-900 text-sm">
                    नई सेवा जोड़ें (Add Service)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newSrvTitleHi}
                      onChange={(e) => setNewSrvTitleHi(e.target.value)}
                      placeholder="सेवा का नाम (हिंदी में)"
                      className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                    <input
                      type="text"
                      value={newSrvTitleEn}
                      onChange={(e) => setNewSrvTitleEn(e.target.value)}
                      placeholder="Service Name (English)"
                      className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                    <input
                      type="text"
                      value={newSrvDescHi}
                      onChange={(e) => setNewSrvDescHi(e.target.value)}
                      placeholder="संक्षिप्त विवरण"
                      className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-700 text-white text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    सेवा जोड़ें
                  </button>
                </form>

                {/* Existing Services */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {draftConfig.services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 bg-white"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900">{srv.titleHi}</div>
                        <div className="text-xs text-slate-500">{srv.descriptionHi}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...draftConfig,
                            services: draftConfig.services.filter((s) => s.id !== srv.id),
                          };
                          triggerSave(updated, 'सेवा हटाई गई।');
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="हटाएँ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Frame & Sunglasses Catalogue */}
            {activeTab === 'catalogue' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleAddProduct}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4"
                >
                  <h4 className="font-bold text-slate-900 text-sm">
                    नया चश्मा / फ्रेम / धूप चश्मा जोड़ें
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newProdNameHi}
                      onChange={(e) => setNewProdNameHi(e.target.value)}
                      placeholder="फ्रेम का नाम (हिंदी) *"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                      required
                    />
                    <input
                      type="text"
                      value={newProdNameEn}
                      onChange={(e) => setNewProdNameEn(e.target.value)}
                      placeholder="Frame Name (English)"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as FrameCategory)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    >
                      {FRAME_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.labelHi}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newProdStyle}
                      onChange={(e) => setNewProdStyle(e.target.value)}
                      placeholder="प्रकार (उदा. SUPRA / श्री पीस / ARC)"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                    <input
                      type="text"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="कीमत (वैकल्पिक - खाली छोड़ सकते हैं)"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                    <input
                      type="text"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      placeholder="फोटो URL (या डिफ़ॉल्ट के लिए खाली छोड़ें)"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B192C] text-white text-xs sm:text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    कैटलॉग में जोड़ें
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {draftConfig.products.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.nameHi}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-sm text-slate-900">{prod.nameHi}</div>
                          <div className="text-xs text-slate-500">
                            {prod.category} · {prod.frameStyle}
                            {prod.price ? ` · ${prod.price}` : ''}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="हटाएँ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Images & Gallery Management */}
            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-600">
                  यहाँ से आप मुख्य हीरो फोटो, अबाउट सेक्शन फोटो और फ्रेम गैलरी के फोटो बदल सकते हैं:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hero Image URL (मुख्य बैनर फोटो)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.heroImage}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, heroImage: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      About Shop Image URL (परिचय सेक्शन फोटो)
                    </label>
                    <input
                      type="text"
                      value={draftConfig.aboutImage}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, aboutImage: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono-num"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerSave(draftConfig, 'फोटो URL अपडेट किए गए!')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B192C] text-white text-xs font-semibold"
                >
                  <Save className="w-4 h-4" />
                  फोटो सेव करें
                </button>
              </div>
            )}

            {/* TAB 5: Appointments, Enquiries & Prescription Records */}
            {activeTab === 'records' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-900 text-base">
                      अपॉइंटमेंट अनुरोध (Appointment Requests: {appointments.length})
                    </h4>
                    {appointments.length > 0 && (
                      <button
                        type="button"
                        onClick={onClearAppointments}
                        className="text-xs text-red-600 hover:underline"
                      >
                        सूची साफ़ करें
                      </button>
                    )}
                  </div>
                  {appointments.length === 0 ? (
                    <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      अभी तक कोई स्थानीय अपॉइंटमेंट अनुरोध दर्ज नहीं है।
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {appointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap justify-between gap-2 text-xs sm:text-sm"
                        >
                          <div>
                            <strong className="text-slate-900">{apt.name}</strong> ·{' '}
                            <span className="font-mono-num font-semibold text-sky-700">
                              {apt.mobile}
                            </span>
                            <div className="text-slate-600 mt-0.5">
                              सेवा: {apt.service} | दिनांक: {apt.preferredDate} ({apt.preferredTime})
                            </div>
                            {apt.message && (
                              <div className="text-slate-500 mt-0.5">संदेश: {apt.message}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-3">
                    बनाए गए प्रिस्क्रिप्शन रिकॉर्ड्स (Prescription Records: {prescriptions.length})
                  </h4>
                  {prescriptions.length === 0 ? (
                    <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      अभी तक कोई प्रिस्क्रिप्शन कार्ड जनरेट नहीं किया गया है।
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {prescriptions.map((rx) => (
                        <div
                          key={rx.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white flex flex-wrap justify-between gap-2 text-xs font-mono-num"
                        >
                          <div>
                            <strong className="text-slate-900 font-sans text-sm">
                              {rx.patientName}
                            </strong>{' '}
                            ({rx.date})
                            <div className="text-slate-600 mt-1">
                              OD: {rx.odSph} / {rx.odCyl} x {rx.odAxis} (Add: {rx.odAdd}) | OS:{' '}
                              {rx.osSph} / {rx.osCyl} x {rx.osAxis} (Add: {rx.osAdd})
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-3">
                    ग्राहक पूछताछ (Customer Enquiries: {enquiries.length})
                  </h4>
                  {enquiries.length === 0 ? (
                    <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      सभी WhatsApp पूछताछ सीधे आपके नंबर {config.primaryPhone} पर भेजी जाती हैं।
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {enquiries.map((enq) => (
                        <div key={enq.id} className="p-3 rounded-xl border border-slate-200 text-xs">
                          <strong>{enq.subject}</strong> — {enq.details}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: Production & Supabase Setup Instructions */}
            {activeTab === 'production' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">
                  Production Deployment, Vercel &amp; Supabase Setup Guide
                </h4>
                <p>
                  वर्तमान में यह वेबसाइट <strong>Local/Demo Mode</strong> में कार्य कर रही है जहाँ सभी बदलाव `localStorage` में रहते हैं और अपॉइंटमेंट सीधे आपके WhatsApp ({config.primaryPhone}) पर आते हैं।
                </p>
                <div className="space-y-2">
                  <strong className="text-slate-900 block">
                    1. Environment Variables (`.env` for Production):
                  </strong>
                  <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono-num text-xs overflow-x-auto">
{`VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-public-anon-key"
VITE_CANONICAL_URL="https://netrieyecare.in"`}
                  </pre>
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block">
                    2. Row Level Security (RLS) &amp; Security Policy:
                  </strong>
                  <p>
                    Supabase जोड़ते समय `store_config`, `products`, और `appointments` टेबल पर Row Level Security (RLS) सक्रिय करें। केवल प्रमाणित एडमिन (`authenticated` role) को कैटलॉग बदलने की अनुमति दें और `appointments` में केवल `INSERT` अनुमति सार्वजनिक रखें।
                  </p>
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block">
                    3. वास्तविक दुकान के फोटो कैसे लगाएँ:
                  </strong>
                  <p>
                    अपने शोरूम और साइनबोर्ड के वास्तविक फोटो `/public/shop-photos/` फ़ोल्डर में रखें या ऊपर दिए गए <strong>फोटो व गैलरी</strong> टैब में उनका पथ दर्ज करें।
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

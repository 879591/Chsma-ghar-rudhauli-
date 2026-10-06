import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Download,
  Share2,
  Smartphone,
  QrCode,
  Contact,
  FileText,
  Calendar,
} from 'lucide-react';
import { AppointmentRequest, StoreConfig } from '../data/storeData';
import {
  downloadAppointmentSlip,
  downloadBusinessCardHTML,
  downloadVCard,
} from '../utils/pdfGenerator';

interface CustomerDownloadsModalProps {
  config: StoreConfig;
  lastAppointment: AppointmentRequest | null;
  onScrollToPrescription: () => void;
  onScrollToAppointment: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onInstallPWA: () => void;
  onOpenIOSGuide: () => void;
}

export const CustomerDownloadsSection: React.FC<CustomerDownloadsModalProps> = ({
  config,
  lastAppointment,
  onScrollToPrescription,
  onScrollToAppointment,
  isInstallable,
  isInstalled,
  isIOS,
  onInstallPWA,
  onOpenIOSGuide,
}) => {
  const shareUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://netrieyecare.in';

  const handleShareWebsite = async () => {
    const shareData = {
      title: config.businessNameHi,
      text: `${config.businessNameHi} (${config.addressShortHi}) — आँखों की जाँच एवं चश्मे की जानकारी के लिए वेबसाइट देखें:`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share sheet
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareData.text} ${shareUrl}`);
    }
  };

  const handleDownloadQR = () => {
    const svgEl = document.getElementById('netri-store-qr-svg');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Netri-Eye-Care-QR-Code.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
              ग्राहक सुविधा एवं डाउनलोड · Customer Downloads &amp; App
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              डिजिटल विज़िटिंग कार्ड, QR कोड एवं ऐप इंस्टॉल
            </h2>
            <p className="mt-1.5 text-slate-600 text-sm sm:text-base max-w-2xl">
              दुकान का पता, फोन नंबर, प्रिस्क्रिप्शन PDF और वेबसाइट का QR कोड अपने फोन में सुरक्षित रखें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isInstalled && (
              <button
                type="button"
                onClick={() => {
                  if (isInstallable) {
                    onInstallPWA();
                  } else {
                    onOpenIOSGuide();
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B192C] text-white text-sm font-semibold hover:bg-slate-800 transition-colors min-h-[44px] whitespace-nowrap"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                📲 ऐप इंस्टॉल करें
              </button>
            )}
            <button
              type="button"
              onClick={handleShareWebsite}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-100 transition-colors min-h-[44px] whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 text-sky-700" />
              वेबसाइट शेयर करें
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Contact Card & Visiting Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-4">
                <Contact className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                संपर्क कार्ड / विज़िटिंग कार्ड
              </h3>
              <p className="text-sm text-slate-600 mt-1.5">
                नेत्री आई केयर सेंटर के दोनों फोन नंबर ({config.primaryPhone}, {config.secondaryPhone}) और पता सीधे अपने फोन की कॉन्टैक्ट लिस्ट में सेव करें।
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => downloadVCard(config)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B192C] text-white text-xs font-semibold hover:bg-slate-800 transition-colors min-h-[44px] whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                Save Contact (.vcf)
              </button>
              <button
                type="button"
                onClick={() => downloadBusinessCardHTML(config)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors min-h-[44px] whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5" />
                बिज़नेस कार्ड डाउनलोड
              </button>
            </div>
          </div>

          {/* Card 2: Prescription & Appointment PDF */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                प्रिस्क्रिप्शन एवं अपॉइंटमेंट पर्ची
              </h3>
              <p className="text-sm text-slate-600 mt-1.5">
                चश्मे के नंबर की PDF पर्ची या अपनी बुक की गई अपॉइंटमेंट रिक्वेस्ट की पर्ची डाउनलोड करें।
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={onScrollToPrescription}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-700 text-white text-xs font-semibold hover:bg-sky-800 transition-colors min-h-[44px] whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5" />
                Prescription PDF बनाएँ
              </button>
              {lastAppointment ? (
                <button
                  type="button"
                  onClick={() => downloadAppointmentSlip(lastAppointment, config)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors min-h-[44px] whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  अपॉइंटमेंट पर्ची डाउनलोड
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onScrollToAppointment}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors min-h-[44px] whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  अपॉइंटमेंट फॉर्म भरें
                </button>
              )}
            </div>
          </div>

          {/* Card 3: Website QR Code */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700">
                <QrCode className="w-4 h-4" />
                <span>वेबसाइट QR कोड</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                स्कैन करें या QR डाउनलोड करें
              </h3>
              <p className="text-xs text-slate-600">
                दुकान के काउंटर या मित्रों के साथ साझा करने के लिए QR कोड डाउनलोड करें।
              </p>
              <button
                type="button"
                onClick={handleDownloadQR}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors min-h-[44px] whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                QR कोड डाउनलोड करें
              </button>
            </div>
            <div className="p-3 bg-white border-2 border-[#0B192C] rounded-xl shrink-0">
              <QRCodeSVG
                id="netri-store-qr-svg"
                value={shareUrl}
                size={96}
                bgColor="#FFFFFF"
                fgColor="#0B192C"
                level="M"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

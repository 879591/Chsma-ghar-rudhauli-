import React, { useState } from 'react';
import { FileText, Download, Eye, RotateCcw, ShieldAlert } from 'lucide-react';
import { PrescriptionRecord, StoreConfig } from '../data/storeData';
import { downloadPrescriptionPDF } from '../utils/pdfGenerator';

interface PrescriptionSectionProps {
  config: StoreConfig;
  onSavePrescription: (record: PrescriptionRecord) => void;
}

export const PrescriptionSection: React.FC<PrescriptionSectionProps> = ({
  config,
  onSavePrescription,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState(todayStr);
  const [odSph, setOdSph] = useState('');
  const [odCyl, setOdCyl] = useState('');
  const [odAxis, setOdAxis] = useState('');
  const [odAdd, setOdAdd] = useState('');
  const [osSph, setOsSph] = useState('');
  const [osCyl, setOsCyl] = useState('');
  const [osAxis, setOsAxis] = useState('');
  const [osAdd, setOsAdd] = useState('');
  const [pd, setPd] = useState('');
  const [remarks, setRemarks] = useState('');
  const [optometristName, setOptometristName] = useState(
    'डॉ. N.S. शर्मा (D.Opt) / डॉ. D.K. आर्या (D.Opt)'
  );
  const [showPreview, setShowPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const buildRecord = (): PrescriptionRecord => ({
    id: `RX-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    patientName: patientName.trim() || 'ग्राहक (Patient)',
    date: date || todayStr,
    odSph: odSph.trim() || '0.00',
    odCyl: odCyl.trim() || '0.00',
    odAxis: odAxis.trim() || '—',
    odAdd: odAdd.trim() || '—',
    osSph: osSph.trim() || '0.00',
    osCyl: osCyl.trim() || '0.00',
    osAxis: osAxis.trim() || '—',
    osAdd: osAdd.trim() || '—',
    pd: pd.trim(),
    remarks: remarks.trim(),
    optometristName: optometristName.trim(),
  });

  const handleDownload = () => {
    if (!patientName.trim()) {
      setErrorMsg('कृपया पर्ची डाउनलोड करने से पहले मरीज़ का नाम (Patient Name) दर्ज करें।');
      return;
    }
    setErrorMsg('');
    const record = buildRecord();
    onSavePrescription(record);
    downloadPrescriptionPDF(record, config);
  };

  const handleReset = () => {
    setPatientName('');
    setDate(todayStr);
    setOdSph('');
    setOdCyl('');
    setOdAxis('');
    setOdAdd('');
    setOsSph('');
    setOsCyl('');
    setOsAxis('');
    setOsAdd('');
    setPd('');
    setRemarks('');
    setErrorMsg('');
  };

  const currentRecord = buildRecord();

  return (
    <section id="prescription" className="py-16 md:py-24 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
            चश्मे का नंबर एवं डिजिटल कार्ड · Prescription Record Utility
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            अपना चश्मा नंबर (Prescription) सुरक्षित करें व PDF डाउनलोड करें
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl text-base">
            जाँच के बाद प्राप्त अपने चश्मे के नंबर को यहाँ दर्ज करके भविष्य के लिए साफ-सुथरा प्रिस्क्रिप्शन कार्ड (PDF / Print) डाउनलोड करें।
          </p>
        </div>

        {/* Notice: No automatic diagnosis */}
        <div className="mb-8 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3 text-xs sm:text-sm text-slate-700">
          <ShieldAlert className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
          <div>
            <strong>नोट:</strong> यह सुविधा केवल आपके मौजूदा या जाँच किए गए चश्मे के नंबर को डिजिटल रूप में सहेजने और प्रिंट करने के लिए है। यह स्वतः कोई नंबर या बीमारी तय नहीं करती है।
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Form */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  मरीज़ का नाम (Patient Name) *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="उदा. राजेश कुमार"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  दिनांक (Date)
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            {/* Right Eye / OD */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Right Eye / OD (दाईं आँख का नंबर)</span>
                <span className="text-xs font-normal text-slate-500">चश्मे के कार्ड अनुसार भरें</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">SPH</label>
                  <input
                    type="text"
                    value={odSph}
                    onChange={(e) => setOdSph(e.target.value)}
                    placeholder="-1.25 / +1.00"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">CYL</label>
                  <input
                    type="text"
                    value={odCyl}
                    onChange={(e) => setOdCyl(e.target.value)}
                    placeholder="-0.50"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">AXIS</label>
                  <input
                    type="text"
                    value={odAxis}
                    onChange={(e) => setOdAxis(e.target.value)}
                    placeholder="90°"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">ADD</label>
                  <input
                    type="text"
                    value={odAdd}
                    onChange={(e) => setOdAdd(e.target.value)}
                    placeholder="+1.50"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-num"
                  />
                </div>
              </div>
            </div>

            {/* Left Eye / OS */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Left Eye / OS (बाईं आँख का नंबर)</span>
                <span className="text-xs font-normal text-slate-500">चश्मे के कार्ड अनुसार भरें</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">SPH</label>
                  <input
                    type="text"
                    value={osSph}
                    onChange={(e) => setOsSph(e.target.value)}
                    placeholder="-1.00 / +1.00"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">CYL</label>
                  <input
                    type="text"
                    value={osCyl}
                    onChange={(e) => setOsCyl(e.target.value)}
                    placeholder="-0.50"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">AXIS</label>
                  <input
                    type="text"
                    value={osAxis}
                    onChange={(e) => setOsAxis(e.target.value)}
                    placeholder="180°"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">ADD</label>
                  <input
                    type="text"
                    value={osAdd}
                    onChange={(e) => setOsAdd(e.target.value)}
                    placeholder="+1.50"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-num"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  PD (Pupillary Distance - mm)
                </label>
                <input
                  type="text"
                  value={pd}
                  onChange={(e) => setPd(e.target.value)}
                  placeholder="उदा. 62"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono-num"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  विशेषज्ञ (Doctor / Optometrist)
                </label>
                <select
                  value={optometristName}
                  onChange={(e) => setOptometristName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm"
                >
                  <option value="डॉ. N.S. शर्मा (D.Opt) / डॉ. D.K. आर्या (D.Opt)">
                    डॉ. N.S. शर्मा (D.Opt) / डॉ. D.K. आर्या (D.Opt)
                  </option>
                  {config.doctors.map((d) => (
                    <option key={d.id} value={`${d.nameHi} (${d.qualification})`}>
                      {d.nameHi} ({d.qualification})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                विशेष टिप्पणी / लेंस प्रकार (Remarks - उदा. ARC, Bifocal, Constant Use)
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="उदा. ARC कोटेड लेंस, पढ़ने व दूर के लिए"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPreview((p) => !p)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-100 transition-colors min-h-[46px] whitespace-nowrap"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Preview छुपाएँ' : 'Preview (पर्ची देखें)'}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B192C] text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm min-h-[46px] whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Download Prescription PDF
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 text-sm font-medium min-h-[46px] whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                साफ़ करें
              </button>
            </div>
          </div>

          {/* Live Prescription Sheet Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border-2 border-[#0B192C] p-6 shadow-sm">
              <div className="border-b-2 border-[#0B192C] pb-4 mb-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold tracking-wider uppercase text-sky-700">
                    NETRI EYE CARE CENTER &amp; CHASHMA GHAR
                  </span>
                  <FileText className="w-4 h-4 text-[#0B192C]" />
                </div>
                <h3 className="text-lg font-bold text-[#0B192C] mt-1">
                  {config.businessNameHi}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">{config.addressHi}</p>
                <p className="text-xs font-mono-num text-slate-700 mt-1">
                  फोन: {config.primaryPhone}, {config.secondaryPhone}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
                <div>
                  <span className="text-slate-500 block">मरीज़ का नाम:</span>
                  <strong className="text-slate-900 text-sm">{currentRecord.patientName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">दिनांक:</span>
                  <strong className="text-slate-900 font-mono-num">{currentRecord.date}</strong>
                </div>
              </div>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs border-collapse border border-slate-300 font-mono-num">
                  <thead>
                    <tr className="bg-[#0B192C] text-white">
                      <th className="p-2 text-left border border-slate-700">Eye</th>
                      <th className="p-2 text-center border border-slate-700">SPH</th>
                      <th className="p-2 text-center border border-slate-700">CYL</th>
                      <th className="p-2 text-center border border-slate-700">AXIS</th>
                      <th className="p-2 text-center border border-slate-700">ADD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 font-bold bg-slate-50 border border-slate-300">
                        OD (दाईं)
                      </td>
                      <td className="p-2 text-center border border-slate-300">
                        {currentRecord.odSph}
                      </td>
                      <td className="p-2 text-center border border-slate-300">
                        {currentRecord.odCyl}
                      </td>
                      <td className="p-2 text-center border border-slate-300">
                        {currentRecord.odAxis}
                      </td>
                      <td className="p-2 text-center border border-slate-300">
                        {currentRecord.odAdd}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold bg-slate-50 border border-slate-300">
                        OS (बाईं)
                      </td>
                      <td className="p-2 text-center border border-slate-300">
                        {currentRecord.osSph}
                      </td>
                      <td className="p-2 text-center border border-slate-300">
                        {currentRecord.osCyl}
                      </td>
                      <td className="p-2 text-center border border-slate-300">
                        {currentRecord.osAxis}
                      </td>
                      <td className="p-2 text-center border border-slate-300">
                        {currentRecord.osAdd}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">PD (पुतली की दूरी):</span>
                  <span className="font-mono-num font-semibold">
                    {currentRecord.pd ? `${currentRecord.pd} mm` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">टिप्पणी (Remarks):</span>
                  <span className="font-medium">{currentRecord.remarks || '—'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-dashed border-slate-200">
                  <span className="text-slate-500">Optometrist:</span>
                  <span className="font-semibold text-[#0B192C]">
                    {currentRecord.optometristName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

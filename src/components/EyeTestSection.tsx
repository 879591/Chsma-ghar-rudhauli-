import React, { useState } from 'react';
import {
  RotateCcw,
  Play,
  Eye,
  AlertTriangle,
  Maximize2,
  Minimize2,
  CheckCircle2,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { StoreConfig, createWhatsAppUrl } from '../data/storeData';

interface EyeTestSectionProps {
  config: StoreConfig;
  onBookAppointment: () => void;
}

interface AcuityLevel {
  step: number;
  snellen: string;
  fontSizePx: number;
  lettersHi: string[];
  lettersEn: string[];
  labelHi: string;
}

const ACUITY_LEVELS: AcuityLevel[] = [
  {
    step: 1,
    snellen: '6/60',
    fontSizePx: 68,
    lettersHi: ['क', 'म', 'र'],
    lettersEn: ['E', 'F', 'P'],
    labelHi: 'स्तर 1 (सबसे बड़े अक्षर - 6/60)',
  },
  {
    step: 2,
    snellen: '6/36',
    fontSizePx: 52,
    lettersHi: ['प', 'न', 'त', 'ल'],
    lettersEn: ['T', 'O', 'Z', 'L'],
    labelHi: 'स्तर 2 (बड़े अक्षर - 6/36)',
  },
  {
    step: 3,
    snellen: '6/24',
    fontSizePx: 40,
    lettersHi: ['स', 'ग', 'ब', 'द', 'क'],
    lettersEn: ['P', 'E', 'D', 'F', 'C'],
    labelHi: 'स्तर 3 (मध्यम अक्षर - 6/24)',
  },
  {
    step: 4,
    snellen: '6/18',
    fontSizePx: 30,
    lettersHi: ['च', 'ज', 'व', 'य', 'र'],
    lettersEn: ['E', 'D', 'F', 'C', 'Z'],
    labelHi: 'स्तर 4 (सामान्य से मध्यम - 6/18)',
  },
  {
    step: 5,
    snellen: '6/12',
    fontSizePx: 22,
    lettersHi: ['म', 'त', 'न', 'प', 'ल', 'स'],
    lettersEn: ['F', 'E', 'L', 'O', 'P', 'Z'],
    labelHi: 'स्तर 5 (छोटे अक्षर - 6/12)',
  },
  {
    step: 6,
    snellen: '6/9',
    fontSizePx: 17,
    lettersHi: ['क', 'र', 'ग', 'ब', 'च', 'द'],
    lettersEn: ['D', 'E', 'F', 'P', 'O', 'T'],
    labelHi: 'स्तर 6 (सूक्ष्म अक्षर - 6/9)',
  },
  {
    step: 7,
    snellen: '6/6',
    fontSizePx: 13,
    lettersHi: ['प', 'स', 'व', 'न', 'म', 'त', 'र'],
    lettersEn: ['T', 'Z', 'V', 'E', 'C', 'L', 'O'],
    labelHi: 'स्तर 7 (स्पष्ट सूक्ष्म अक्षर - 6/6)',
  },
];

export const EyeTestSection: React.FC<EyeTestSectionProps> = ({ config, onBookAppointment }) => {
  const [scriptMode, setScriptMode] = useState<'hi' | 'en'>('hi');
  const [activeEye, setActiveEye] = useState<'left' | 'right'>('right');
  const [testState, setTestState] = useState<'instructions' | 'testing' | 'result'>('instructions');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rightEyeMaxStep, setRightEyeMaxStep] = useState<number | null>(null);
  const [leftEyeMaxStep, setLeftEyeMaxStep] = useState<number | null>(null);

  const currentLevel = ACUITY_LEVELS[currentLevelIdx];

  const startTest = () => {
    setCurrentLevelIdx(0);
    setActiveEye('right');
    setRightEyeMaxStep(null);
    setLeftEyeMaxStep(null);
    setTestState('testing');
  };

  const restartTest = () => {
    setCurrentLevelIdx(0);
    setActiveEye('right');
    setRightEyeMaxStep(null);
    setLeftEyeMaxStep(null);
    setTestState('instructions');
  };

  const handleResponse = (canReadClearly: boolean) => {
    if (canReadClearly) {
      if (currentLevelIdx < ACUITY_LEVELS.length - 1) {
        setCurrentLevelIdx((prev) => prev + 1);
      } else {
        // Completed all 7 levels for current eye
        finishCurrentEye(ACUITY_LEVELS.length);
      }
    } else {
      // Could not read current level clearly
      finishCurrentEye(currentLevelIdx);
    }
  };

  const finishCurrentEye = (achievedStepCount: number) => {
    if (activeEye === 'right') {
      setRightEyeMaxStep(achievedStepCount);
      setActiveEye('left');
      setCurrentLevelIdx(0);
    } else {
      setLeftEyeMaxStep(achievedStepCount);
      setTestState('result');
    }
  };

  const getStepLabel = (stepCount: number | null) => {
    if (stepCount === null || stepCount === 0) {
      return 'स्तर 1 से कम (अस्पष्ट)';
    }
    const level = ACUITY_LEVELS[Math.min(stepCount - 1, ACUITY_LEVELS.length - 1)];
    return `स्तर ${level.step} (${level.snellen} चार्ट पंक्ति)`;
  };

  return (
    <section id="eye-test" className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase mb-2">
              ऑनलाइन प्रारंभिक दृष्टि स्क्रीनिंग · Online Vision Screening
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              अपनी दृष्टि की जाँच करें
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl text-base">
              हिंदी और अंग्रेज़ी अक्षरों के माध्यम से अपनी दोनों आँखों की प्रारंभिक पठनीयता की जाँच करें।
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 self-start">
            <button
              type="button"
              onClick={() => setScriptMode('hi')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap min-h-[44px] ${
                scriptMode === 'hi'
                  ? 'bg-[#0B192C] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              हिंदी अक्षर (क म र)
            </button>
            <button
              type="button"
              onClick={() => setScriptMode('en')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap min-h-[44px] ${
                scriptMode === 'en'
                  ? 'bg-[#0B192C] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              English Chart (E F P)
            </button>
          </div>
        </div>

        {/* Mandatory Medical Safety Disclaimer Banner */}
        <div
          role="note"
          aria-label="चिकित्सा सुरक्षा सूचना"
          className="mb-8 rounded-2xl bg-amber-50/90 border border-amber-300 p-4 sm:p-5 flex items-start gap-3.5"
        >
          <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-950 leading-relaxed">
            <p className="font-semibold">
              यह ऑनलाइन टेस्ट केवल प्रारंभिक/शैक्षिक स्क्रीनिंग के लिए है। यह डॉक्टर द्वारा की जाने वाली पूर्ण आँखों की जाँच का विकल्प नहीं है।
            </p>
            <p className="mt-1 text-amber-900">
              यदि दृष्टि में समस्या महसूस हो तो विशेषज्ञ से जाँच कराएँ।
            </p>
          </div>
        </div>

        {/* Interactive Eye Test Container */}
        <div
          className={`${
            isFullscreen
              ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-4 sm:p-8 flex flex-col justify-between'
              : 'bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10'
          }`}
        >
          {/* Top Bar inside Test Box */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  नेत्री विज़न एक्युइटी चार्ट (Snellen Reference Chart)
                </h3>
                <p className="text-xs text-slate-500">
                  {scriptMode === 'hi' ? 'देवनागरी वर्णमाला चार्ट' : 'Standard English Optotype Chart'} ·{' '}
                  {testState === 'testing'
                    ? activeEye === 'right'
                      ? 'दाईं आँख (Right Eye - बाईं आँख ढकें)'
                      : 'बाईं आँख (Left Eye - दाईं आँख ढकें)'
                    : 'प्रारंभिक स्क्रीनिंग'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {testState !== 'instructions' && (
                <button
                  type="button"
                  onClick={restartTest}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[44px] whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart (पुनः शुरू करें)
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[44px] whitespace-nowrap"
                aria-label={isFullscreen ? 'छोटा करें' : 'फुल-स्क्रीन मोड'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    सामान्य स्क्रीन
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    Full-Screen (फुल-स्क्रीन)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* State 1: Instructions & Reference Preview */}
          {testState === 'instructions' && (
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                  टेस्ट शुरू करने से पहले आवश्यक निर्देश:
                </h4>
                <ol className="space-y-3.5 text-slate-700 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <span className="font-mono-num font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                      01
                    </span>
                    <span>
                      <strong>उचित दूरी बनाए रखें:</strong> मोबाइल फोन को आँखों से लगभग{' '}
                      <strong>40–50 सेमी (हाथ की लंबाई)</strong> और कंप्यूटर स्क्रीन को लगभग{' '}
                      <strong>1 मीटर (3 फीट)</strong> की दूरी पर रखें।
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono-num font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                      02
                    </span>
                    <span>
                      <strong>एक-एक आँख की जाँच:</strong> पहले अपनी <strong>बाईं आँख</strong> को हथेली से हल्के से ढकें (दबाएँ नहीं) और{' '}
                      <strong>दाईं आँख</strong> से अक्षर पढ़ें। इसके बाद दूसरी आँख की जाँच होगी।
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono-num font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                      03
                    </span>
                    <span>
                      <strong>यदि आप पहले से चश्मा लगाते हैं:</strong> अपना वर्तमान चश्मा पहनकर जाँच करें ताकि पता चल सके कि वर्तमान नंबर से स्पष्ट दिख रहा है या नहीं।
                    </span>
                  </li>
                </ol>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={startTest}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0B192C] text-white font-semibold text-base hover:bg-slate-800 transition-colors shadow-sm min-h-[48px] whitespace-nowrap"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Start Test (जाँच शुरू करें)
                  </button>
                </div>
              </div>

              {/* Visual Reference Eye Chart Preview */}
              <div className="lg:col-span-5">
                <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 text-center select-none shadow-inner">
                  <div className="text-xs font-mono-num text-slate-500 uppercase tracking-widest mb-3 pb-2 border-b border-slate-200">
                    नेत्री आई चार्ट (NETRI EYE CHART)
                  </div>
                  <div className="space-y-2.5 font-bold text-slate-900 tracking-widest">
                    <div className="text-4xl">
                      {scriptMode === 'hi' ? 'क म' : 'E F'}
                    </div>
                    <div className="text-2xl">
                      {scriptMode === 'hi' ? 'प न त' : 'T O Z'}
                    </div>
                    <div className="text-xl">
                      {scriptMode === 'hi' ? 'स ग ब द' : 'L P E D'}
                    </div>
                    <div className="text-base">
                      {scriptMode === 'hi' ? 'च ज व य र' : 'P E C F D'}
                    </div>
                    <div className="text-sm border-b-2 border-emerald-500 pb-1 inline-block px-4">
                      {scriptMode === 'hi' ? 'म त न प ल स' : 'E D F C Z P'}
                    </div>
                    <div className="text-xs text-slate-700">
                      {scriptMode === 'hi' ? 'क र ग ब च द प' : 'F E L O P Z D'}
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    बस्ती-बांसी रोड, रुधौली-बस्ती
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* State 2: Active Step-by-Step Testing */}
          {testState === 'testing' && (
            <div className="py-8 flex flex-col items-center text-center max-w-2xl mx-auto">
              {/* Eye instruction Pill/Banner */}
              <div className="mb-6 px-5 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 font-semibold text-sm sm:text-base">
                {activeEye === 'right' ? (
                  <span>
                    👁️ <strong>दाईं आँख की जाँच (Right Eye):</strong> कृपया अपनी बाईं आँख को हाथ से हल्के से ढकें।
                  </span>
                ) : (
                  <span>
                    👁️ <strong>बाईं आँख की जाँच (Left Eye):</strong> अब अपनी दाईं आँख को हाथ से हल्के से ढकें।
                  </span>
                )}
              </div>

              <div className="text-xs font-mono-num text-slate-500 mb-2">
                {currentLevel.labelHi} · प्रगति: {currentLevel.step} / {ACUITY_LEVELS.length}
              </div>

              {/* Letter Display Card */}
              <div className="w-full min-h-[210px] rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center justify-center p-6 my-4 select-none">
                <div
                  style={{ fontSize: `${currentLevel.fontSizePx}px`, lineHeight: 1.25 }}
                  className="font-bold text-slate-950 tracking-[0.28em] transition-all duration-150"
                >
                  {(scriptMode === 'hi' ? currentLevel.lettersHi : currentLevel.lettersEn).join(' ')}
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                क्या आप ऊपर लिखे सभी अक्षरों को निर्धारित दूरी से स्पष्ट पढ़ पा रहे हैं?
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                <button
                  type="button"
                  onClick={() => handleResponse(true)}
                  className="flex-1 min-w-[180px] py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-base transition-colors min-h-[48px] whitespace-nowrap"
                >
                  हाँ, स्पष्ट दिख रहा है
                </button>
                <button
                  type="button"
                  onClick={() => handleResponse(false)}
                  className="flex-1 min-w-[180px] py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base transition-colors min-h-[48px] whitespace-nowrap"
                >
                  नहीं, धुंधला दिख रहा है
                </button>
              </div>
            </div>
          )}

          {/* State 3: Result Screen */}
          {testState === 'result' && (
            <div className="py-8 max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900">
                  प्रारंभिक दृष्टि स्क्रीनिंग परिणाम (Screening Summary)
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  आपके द्वारा पढ़े गए अक्षरों के स्तर का विवरण नीचे दिया गया है:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold">
                    दाईं आँख (Right Eye / OD)
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1 font-mono-num">
                    {getStepLabel(rightEyeMaxStep)}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {rightEyeMaxStep === ACUITY_LEVELS.length
                      ? 'सभी 7 स्तरों के अक्षर स्पष्ट पढ़े गए।'
                      : 'छोटे अक्षरों को पढ़ने में कठिनाई दर्ज की गई।'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold">
                    बाईं आँख (Left Eye / OS)
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1 font-mono-num">
                    {getStepLabel(leftEyeMaxStep)}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {leftEyeMaxStep === ACUITY_LEVELS.length
                      ? 'सभी 7 स्तरों के अक्षर स्पष्ट पढ़े गए।'
                      : 'छोटे अक्षरों को पढ़ने में कठिनाई दर्ज की गई।'}
                  </p>
                </div>
              </div>

              {/* Mandatory Medical Safety Guidance on Result Screen */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-sm mb-8 space-y-1.5">
                <p className="font-bold">
                  महत्वपूर्ण परामर्श सूचना:
                </p>
                <p>
                  यह ऑनलाइन टेस्ट केवल प्रारंभिक/शैक्षिक स्क्रीनिंग के लिए है। यह डॉक्टर द्वारा की जाने वाली पूर्ण आँखों की जाँच का विकल्प नहीं है।
                </p>
                <p className="font-semibold text-amber-900">
                  यदि दृष्टि में समस्या महसूस हो तो विशेषज्ञ से जाँच कराएँ। नेत्री आई केयर सेंटर एवं चश्मा घर में कंप्यूटरीकृत मशीनों द्वारा आँखों की जाँच की सुविधा उपलब्ध है।
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (isFullscreen) setIsFullscreen(false);
                    onBookAppointment();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B192C] text-white font-semibold text-sm sm:text-base hover:bg-slate-800 transition-colors min-h-[48px] whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  आँखों की जाँच के लिए अपॉइंटमेंट लें
                </button>

                <a
                  href={createWhatsAppUrl(
                    config.whatsappNumber,
                    `नमस्ते, मैंने वेबसाइट पर प्रारंभिक दृष्टि टेस्ट किया है (दाईं आँख: ${getStepLabel(
                      rightEyeMaxStep
                    )}, बाईं आँख: ${getStepLabel(
                      leftEyeMaxStep
                    )})। मैं नेत्री आई केयर सेंटर में आँखों की जाँच के बारे में जानकारी चाहता/चाहती हूँ।`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm sm:text-base hover:bg-emerald-800 transition-colors min-h-[48px] whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp पर सलाह लें
                </a>

                <button
                  type="button"
                  onClick={restartTest}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm sm:text-base hover:bg-slate-100 transition-colors min-h-[48px] whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart Test (फिर से जाँच करें)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

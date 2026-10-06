import { AppointmentRequest, EyewearProduct, PrescriptionRecord, StoreConfig } from '../data/storeData';

/**
 * Generates a clean, formatted printable HTML document and triggers PDF save/print
 * or downloads an HTML/VCF file cleanly without window.alert/window.open issues in sandboxed iframes.
 */
export function downloadPrescriptionPDF(
  record: PrescriptionRecord,
  config: StoreConfig
) {
  const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>Prescription - ${escapeHtml(record.patientName)} - ${escapeHtml(config.businessNameEn)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Noto Sans Devanagari', 'Plus Jakarta Sans', sans-serif;
      color: #0B192C;
      background: #ffffff;
      padding: 32px;
      line-height: 1.5;
    }
    .sheet {
      max-width: 760px;
      margin: 0 auto;
      border: 2px solid #0B192C;
      border-radius: 12px;
      padding: 28px;
    }
    .header {
      border-bottom: 2px solid #0B192C;
      padding-bottom: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    .brand-title-en {
      font-size: 20px;
      font-weight: 700;
      color: #0B192C;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .brand-title-hi {
      font-size: 22px;
      font-weight: 700;
      color: #1E3E62;
      margin-top: 2px;
    }
    .brand-sub {
      font-size: 13px;
      color: #475569;
      margin-top: 4px;
    }
    .contact-box {
      text-align: right;
      font-size: 13px;
      color: #1E293B;
    }
    .doctors-row {
      display: flex;
      justify-content: space-between;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 10px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .patient-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
      font-size: 14px;
      border-bottom: 1px dashed #CBD5E1;
      padding-bottom: 14px;
    }
    .label {
      color: #64748B;
      font-size: 12px;
      display: block;
    }
    .val {
      font-weight: 600;
      font-size: 15px;
      color: #0F172A;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #0B192C;
      padding: 12px 10px;
      text-align: center;
      font-size: 14px;
    }
    th {
      background: #0B192C;
      color: #FFFFFF;
      font-weight: 600;
    }
    td.eye-col {
      background: #F1F5F9;
      font-weight: 700;
      text-align: left;
      padding-left: 14px;
    }
    .meta-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .meta-box {
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 12px;
    }
    .footer-sig {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px solid #E2E8F0;
      font-size: 12px;
      color: #475569;
    }
    .disclaimer {
      margin-top: 16px;
      font-size: 11px;
      color: #64748B;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <div class="brand-title-en">NETRI EYE CARE CENTER &amp; CHASHMA GHAR</div>
        <div class="brand-title-hi">${escapeHtml(config.businessNameHi)}</div>
        <div class="brand-sub">${escapeHtml(config.addressHi)}</div>
      </div>
      <div class="contact-box">
        <div><strong>फोन:</strong> ${escapeHtml(config.primaryPhone)}, ${escapeHtml(config.secondaryPhone)}</div>
        <div><strong>समय:</strong> ${escapeHtml(config.hoursHi)}</div>
      </div>
    </div>

    <div class="doctors-row">
      ${config.doctors
        .map(
          (d) =>
            `<div><strong>${escapeHtml(d.nameHi)}</strong> (${escapeHtml(d.qualification)})</div>`
        )
        .join('')}
    </div>

    <div class="patient-grid">
      <div>
        <span class="label">मरीज़ का नाम (Patient Name)</span>
        <span class="val">${escapeHtml(record.patientName || '—')}</span>
      </div>
      <div>
        <span class="label">दिनांक (Date)</span>
        <span class="val">${escapeHtml(record.date || '—')}</span>
      </div>
      <div>
        <span class="label">रिकॉर्ड आईडी (Record ID)</span>
        <span class="val">${escapeHtml(record.id)}</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align:left; padding-left:14px;">Eye (आँख)</th>
          <th>SPH (स्फेरिकल)</th>
          <th>CYL (सिलिंड्रिकल)</th>
          <th>AXIS (एक्सिस)</th>
          <th>ADD (नियर एडिशन)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="eye-col">Right Eye / OD (दाईं आँख)</td>
          <td>${escapeHtml(record.odSph || '0.00')}</td>
          <td>${escapeHtml(record.odCyl || '0.00')}</td>
          <td>${escapeHtml(record.odAxis || '—')}</td>
          <td>${escapeHtml(record.odAdd || '—')}</td>
        </tr>
        <tr>
          <td class="eye-col">Left Eye / OS (बाईं आँख)</td>
          <td>${escapeHtml(record.osSph || '0.00')}</td>
          <td>${escapeHtml(record.osCyl || '0.00')}</td>
          <td>${escapeHtml(record.osAxis || '—')}</td>
          <td>${escapeHtml(record.osAdd || '—')}</td>
        </tr>
      </tbody>
    </table>

    <div class="meta-row">
      <div class="meta-box">
        <span class="label">PD (Pupillary Distance / पुतली की दूरी)</span>
        <span class="val">${escapeHtml(record.pd ? `${record.pd} mm` : '—')}</span>
      </div>
      <div class="meta-box">
        <span class="label">विशेष टिप्पणी (Remarks)</span>
        <span class="val">${escapeHtml(record.remarks || '—')}</span>
      </div>
    </div>

    <div class="footer-sig">
      <div>
        <div>स्पष्ट दृष्टि, बेहतर जीवन</div>
        <div>बस्ती-बांसी रोड, निकट भारत बैट्री, रुधौली-बस्ती, उत्तर प्रदेश</div>
      </div>
      <div style="text-align:right;">
        <div style="margin-bottom:24px; color:#0B192C; font-weight:600;">
          Doctor / Optometrist: ${escapeHtml(record.optometristName || 'डॉ. N.S. शर्मा (D.Opt) / डॉ. D.K. आर्या (D.Opt)')}
        </div>
        <div>हस्ताक्षर एवं मुहर (Authorized Signatory)</div>
      </div>
    </div>
    <div class="disclaimer">
      नोट: यह ग्राहक द्वारा दर्ज/प्रिंट किया गया दृष्टि विवरण पत्र है। चश्मा बनवाने से पूर्व स्टोर पर नंबर का मिलान अवश्य कराएँ।
    </div>
  </div>
</body>
</html>`;

  triggerPrintOrDownload(
    htmlContent,
    `Netri-Prescription-${(record.patientName || 'Patient').replace(/\s+/g, '-')}.html`
  );
}

export function downloadAppointmentSlip(
  appointment: AppointmentRequest,
  config: StoreConfig
) {
  const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>Appointment Request - ${escapeHtml(appointment.name)}</title>
  <style>
    body { font-family: sans-serif; color: #0B192C; padding: 32px; line-height: 1.6; }
    .card { max-width: 640px; margin: 0 auto; border: 2px solid #0B192C; border-radius: 12px; padding: 24px; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    .sub { color: #475569; font-size: 13px; margin-bottom: 20px; border-bottom: 1px solid #CBD5E1; padding-bottom: 12px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #E2E8F0; }
    .notice { margin-top: 20px; background: #FEF3C7; border: 1px solid #F59E0B; padding: 12px; border-radius: 8px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(config.businessNameHi)}</h1>
    <div class="sub">${escapeHtml(config.businessNameEn)} | फोन: ${escapeHtml(config.primaryPhone)}, ${escapeHtml(config.secondaryPhone)}</div>
    <div class="row"><strong>ग्राहक का नाम (Name):</strong> <span>${escapeHtml(appointment.name)}</span></div>
    <div class="row"><strong>मोबाइल नंबर (Mobile):</strong> <span>${escapeHtml(appointment.mobile)}</span></div>
    <div class="row"><strong>पसंदीदा दिनांक (Date):</strong> <span>${escapeHtml(appointment.preferredDate)}</span></div>
    <div class="row"><strong>पसंदीदा समय (Time):</strong> <span>${escapeHtml(appointment.preferredTime)}</span></div>
    <div class="row"><strong>सेवा (Service):</strong> <span>${escapeHtml(appointment.service)}</span></div>
    <div class="row"><strong>संदेश (Message):</strong> <span>${escapeHtml(appointment.message || '—')}</span></div>
    <div class="row"><strong>पता (Address):</strong> <span>${escapeHtml(config.addressHi)}</span></div>
    <div class="notice">
      <strong>महत्वपूर्ण:</strong> आपकी request तैयार है। कृपया दुकान पर आने से पूर्व WhatsApp (${escapeHtml(config.primaryPhone)}) या कॉल पर अपना समय कन्फर्म कर लें।
    </div>
  </div>
</body>
</html>`;

  triggerPrintOrDownload(
    htmlContent,
    `Netri-Appointment-${appointment.name.replace(/\s+/g, '-')}.html`
  );
}

export function downloadProductInfoSheet(
  product: EyewearProduct,
  config: StoreConfig
) {
  const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>Frame Details - ${escapeHtml(product.nameEn)}</title>
  <style>
    body { font-family: sans-serif; color: #0B192C; padding: 32px; line-height: 1.6; }
    .card { max-width: 600px; margin: 0 auto; border: 2px solid #0B192C; border-radius: 12px; padding: 24px; }
    .row { padding: 8px 0; border-bottom: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="card">
    <h2>${escapeHtml(config.businessNameHi)}</h2>
    <p style="color:#475569;font-size:13px;">${escapeHtml(config.addressHi)} | फोन: ${escapeHtml(config.primaryPhone)}</p>
    <hr style="margin:16px 0;" />
    <h3>चयनित फ्रेम / चश्मा विवरण (Selected Eyewear Info)</h3>
    <div class="row"><strong>नाम (Hindi):</strong> ${escapeHtml(product.nameHi)}</div>
    <div class="row"><strong>Name (English):</strong> ${escapeHtml(product.nameEn)}</div>
    <div class="row"><strong>श्रेणी (Category):</strong> ${escapeHtml(product.categoryHi)}</div>
    <div class="row"><strong>फ्रेम प्रकार (Style):</strong> ${escapeHtml(product.frameStyle)}</div>
    ${product.price ? `<div class="row"><strong>कीमत (Price):</strong> ${escapeHtml(product.price)}</div>` : ''}
    <p style="margin-top:16px;font-size:13px;color:#1E3E62;">
      इस फ्रेम की उपलब्धता और कीमत जानने के लिए WhatsApp करें: <strong>${escapeHtml(config.primaryPhone)}</strong>
    </p>
  </div>
</body>
</html>`;

  triggerPrintOrDownload(htmlContent, `Netri-Frame-${product.id}.html`);
}

export function downloadVCard(config: StoreConfig) {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${config.businessNameHi} (${config.businessNameEn})`,
    `ORG:${config.businessNameEn}`,
    `TEL;TYPE=CELL,VOICE:+91${config.primaryPhone}`,
    `TEL;TYPE=WORK,VOICE:+91${config.secondaryPhone}`,
    `ADR;TYPE=WORK:;;${config.addressHi};Rudhauli, Basti;Uttar Pradesh;;India`,
    `NOTE:${config.taglineHi} - समय: ${config.hoursHi}. विशेषज्ञ: डॉ. N.S. शर्मा (D.Opt), डॉ. D.K. आर्या (D.Opt)`,
    'END:VCARD',
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Netri-Eye-Care-Rudhauli-Basti.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBusinessCardHTML(config: StoreConfig) {
  const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>Business Card - ${escapeHtml(config.businessNameEn)}</title>
  <style>
    body { font-family: sans-serif; background: #F8FAFC; padding: 40px; display: flex; justify-content: center; }
    .bcard {
      width: 460px;
      background: linear-gradient(135deg, #0B192C 0%, #1E3E62 100%);
      color: #FFFFFF;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
      border: 2px solid #F59E0B;
    }
    .gold { color: #FBBF24; font-weight: 700; }
    .cyan { color: #38BDF8; }
    .title { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .sub { font-size: 13px; color: #CBD5E1; margin-bottom: 16px; }
    .docs { display: flex; justify-content: space-between; background: rgba(255,255,255,0.08); padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; }
    .info { font-size: 13px; line-height: 1.7; }
  </style>
</head>
<body>
  <div class="bcard">
    <div class="gold" style="font-size:12px;letter-spacing:1px;">स्पष्ट दृष्टि, बेहतर जीवन</div>
    <div class="title">${escapeHtml(config.businessNameHi)}</div>
    <div class="sub">${escapeHtml(config.businessNameEn)}</div>
    <div class="docs">
      <div><strong>डॉ. N.S. शर्मा</strong> (D.Opt)</div>
      <div><strong>डॉ. D.K. आर्या</strong> (D.Opt)</div>
    </div>
    <div class="info">
      <div><strong class="cyan">फोन:</strong> ${escapeHtml(config.primaryPhone)}, ${escapeHtml(config.secondaryPhone)}</div>
      <div><strong class="cyan">समय:</strong> ${escapeHtml(config.hoursHi)}</div>
      <div><strong class="cyan">पता:</strong> ${escapeHtml(config.addressHi)}</div>
    </div>
  </div>
</body>
</html>`;

  triggerPrintOrDownload(htmlContent, 'Netri-Eye-Care-Business-Card.html');
}

function triggerPrintOrDownload(htmlContent: string, filename: string) {
  // First download the clean standalone HTML file so mobile/iframe users always get the file immediately
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Also trigger hidden iframe print dialog so desktop/Android users can directly "Save as PDF"
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          // Ignore if sandboxed iframe blocks print
        }
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          URL.revokeObjectURL(url);
        }, 2000);
      }, 450);
    }
  } catch {
    URL.revokeObjectURL(url);
  }
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

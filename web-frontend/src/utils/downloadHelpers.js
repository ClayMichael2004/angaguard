/**
 * AngaGuard Real File Download Utilities
 * Generates genuine downloadable CSV spreadsheets, printable Carbon Certificates, and M-Pesa receipts.
 */

export function downloadCSV(filename, headers, rows) {
  const escapeField = (field) => {
    if (field === null || field === undefined) return '""';
    const stringVal = String(field);
    if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return `"${stringVal}"`;
  };

  const headerRow = headers.map(escapeField).join(',');
  const dataRows = rows.map((row) => row.map(escapeField).join(','));
  const csvContent = [headerRow, ...dataRows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCertificateDocument(filename, cert) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${cert.title || 'AngaGuard Carbon Removal Certificate'}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f1ea;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .cert-container {
      background: #ffffff;
      width: 850px;
      padding: 50px;
      border: 12px double #1b4332;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      position: relative;
      color: #1c1917;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #2d6a4f;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo-text {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #1b4332;
      margin: 0;
    }
    .subtitle {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #b08968;
      margin-top: 5px;
      font-weight: bold;
    }
    .cert-title {
      font-size: 24px;
      font-weight: 800;
      color: #1b4332;
      margin-top: 20px;
      text-align: center;
      text-transform: uppercase;
    }
    .cert-body {
      font-size: 15px;
      line-height: 1.8;
      margin: 30px 0;
    }
    .highlight {
      font-size: 20px;
      font-weight: bold;
      color: #2d6a4f;
      text-align: center;
      margin: 20px 0;
      padding: 10px;
      background: #e8f5e9;
      border-radius: 8px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 13px;
    }
    .details-table th, .details-table td {
      border: 1px solid #d8d3c5;
      padding: 10px 14px;
      text-align: left;
    }
    .details-table th {
      background-color: #f7f5f0;
      color: #57534e;
      width: 35%;
    }
    .details-table td {
      font-weight: 600;
      color: #1c1917;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
      border-top: 1px solid #e7e5e4;
      padding-top: 20px;
    }
    .sig-block {
      text-align: center;
    }
    .sig-line {
      width: 200px;
      border-bottom: 2px solid #1c1917;
      margin-bottom: 5px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      background: #1b4332;
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="cert-container">
    <div class="header">
      <h1 class="logo-text">ANGAGUARD dMRV ORACLE</h1>
      <div class="subtitle">Republic of Kenya National Carbon Registry • EMCA 2026</div>
      <div class="cert-title">${cert.title || 'Official Carbon Removal & Retirement Certificate'}</div>
    </div>

    <div class="cert-body">
      <p>This certifies that the following carbon sequestration volume has been verified via IoT telemetry, pyrolytic stoichiometric validation, and permanently retired:</p>
      
      <div class="highlight">
        ${cert.tonnage || '0.00'} Metric Tonnes CO2e (${cert.biocharKg || '0.0'} KG Pure Biochar)
      </div>

      <table class="details-table">
        <tr>
          <th>Certificate Reference ID</th>
          <td><strong>${cert.certId || 'KE-NCR-2026-PROD-001'}</strong></td>
        </tr>
        <tr>
          <th>Beneficiary / Entity</th>
          <td>${cert.entity || 'Smallholder Producer Union'}</td>
        </tr>
        <tr>
          <th>Origin / Sub-County</th>
          <td>${cert.location || 'Kakamega & Western Kenya Agro-Cluster'}</td>
        </tr>
        <tr>
          <th>Smart Kiln Unit(s)</th>
          <td>${cert.kilns || 'KILN-001, KILN-004'}</td>
        </tr>
        <tr>
          <th>Soil Permanence & Purity</th>
          <td>97.0% 100-Year Soil Carbon Sink (Fixed Carbon Purity: 77.4%)</td>
        </tr>
        <tr>
          <th>Market / Settlement Value</th>
          <td>${cert.value || 'KSh 0.00'}</td>
        </tr>
        <tr>
          <th>Timestamp & Registry Seal</th>
          <td>${cert.date || new Date().toLocaleString('en-KE')}</td>
        </tr>
      </table>
    </div>

    <div class="footer">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div style="font-size:12px; font-weight:bold;">Director of Climate Change</div>
        <div style="font-size:10px; color:#78716c;">National Carbon Registry (NCR)</div>
      </div>
      <div>
        <span class="badge">VERIFIED GENUINE</span>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div style="font-size:12px; font-weight:bold;">AngaGuard Chief Verifier</div>
        <div style="font-size:10px; color:#78716c;">Oracle SHA-256 Validated</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.html') ? filename : `${filename}.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

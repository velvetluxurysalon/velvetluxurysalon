import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateProfessionalBillPDF = async (invoiceData, visit) => {
  try {
    // Create temporary HTML element for conversion
    const element = document.createElement('div');
    element.innerHTML = getProfessionalBillHTML(invoiceData, visit);
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.width = '210mm';
    document.body.appendChild(element);

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    document.body.removeChild(element);
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

const getProfessionalBillHTML = (invoiceData, visit) => {
  const itemsHTML = (visit.items || [])
    .map(
      (item, index) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px;">${index + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px; text-align: right;">₹${(
        item.price || 0
      ).toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 13px; text-align: right; font-weight: 600;">₹${(
        (item.price || 0) * (item.quantity || 1)
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const discountAmount = invoiceData.discountAmount || 0;
  const subtotal = (invoiceData.totalAmount || 0) - discountAmount;
  const taxAmount = invoiceData.taxAmount || 0;
  const finalTotal = subtotal + taxAmount;
  const balance = Math.max(0, finalTotal - (invoiceData.paidAmount || 0));

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - Velvet Luxury Salon</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9fafb;
            padding: 20px;
            color: #1f2937;
          }
          
          .invoice-container {
            max-width: 210mm;
            height: 297mm;
            background-color: #ffffff;
            margin: 0 auto;
            padding: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          /* Header Section */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
          }
          
          .salon-info h1 {
            font-size: 28px;
            font-weight: 800;
            color: #1f2937;
            margin-bottom: 5px;
          }
          
          .salon-info p {
            font-size: 12px;
            color: #6b7280;
            margin: 3px 0;
          }
          
          .invoice-number {
            text-align: right;
          }
          
          .invoice-number .label {
            font-size: 11px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
          }
          
          .invoice-number .value {
            font-size: 16px;
            font-weight: 700;
            color: #667eea;
          }
          
          .invoice-date {
            font-size: 12px;
            color: #6b7280;
            margin-top: 8px;
          }
          
          /* Customer & Payment Info */
          .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .info-block h3 {
            font-size: 11px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          
          .info-block p {
            font-size: 13px;
            color: #374151;
            line-height: 1.8;
          }
          
          .info-block strong {
            color: #1f2937;
            font-weight: 600;
          }
          
          /* Items Table */
          .items-section {
            margin-bottom: 30px;
          }
          
          .items-header h3 {
            font-size: 11px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          thead tr {
            background-color: #f3f4f6;
            border-top: 2px solid #e5e7eb;
            border-bottom: 2px solid #e5e7eb;
          }
          
          thead th {
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          thead th:nth-child(3),
          thead th:nth-child(4),
          thead th:nth-child(5) {
            text-align: right;
          }
          
          tbody td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px;
            color: #374151;
          }
          
          tbody td:nth-child(3),
          tbody td:nth-child(4),
          tbody td:nth-child(5) {
            text-align: right;
          }
          
          /* Totals Section */
          .totals-section {
            display: grid;
            grid-template-columns: 1fr 200px;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .totals-box {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            border: 1px solid #e5e7eb;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 13px;
          }
          
          .total-row.heading {
            font-weight: 600;
            color: #374151;
          }
          
          .total-row.amount {
            color: #1f2937;
            font-weight: 600;
          }
          
          .total-row.divider {
            border-top: 1px solid #d1d5db;
            padding-top: 12px;
            margin-top: 12px;
          }
          
          .total-row.balance-due {
            background-color: #ffffff;
            color: #1f2937;
            padding: 10px;
            margin-left: -20px;
            margin-right: -20px;
            padding-left: 20px;
            padding-right: 20px;
            border-radius: 0 0 8px 8px;
            font-weight: 700;
            border-top: 2px solid #e5e7eb;
          }
          
          .total-row.paid {
            color: #1f2937;
            font-weight: 700;
          }
          
          .total-row.final-total {
            background-color: #ffffff;
            color: #1f2937;
            padding: 15px;
            margin: 12px -20px -20px -20px;
            padding-left: 20px;
            padding-right: 20px;
            border-radius: 0 0 8px 8px;
            font-size: 16px;
            font-weight: 700;
            border-top: 2px solid #e5e7eb;
          }
          
          /* Footer */
          .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
          }
          
          .footer p {
            margin: 3px 0;
          }
          
          .thank-you {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="header">
            <div class="salon-info">
              <h1>Velvet Luxury Salon</h1>
              <p>Pamper Yourself. Celebrate Beauty.</p>
              <p>Location: Your Salon Address</p>
              <p>+91-XXXXXXXXXX</p>
              <p>info@velvetluxury.com</p>
            </div>
            <div class="invoice-number">
              <div class="label">Invoice Number</div>
              <div class="value">#INV-${new Date().getTime()}</div>
              <div class="invoice-date">Date: ${new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</div>
            </div>
          </div>

          <!-- Customer & Payment Info -->
          <div class="info-section">
            <div class="info-block">
              <h3>Bill To</h3>
              <p>
                <strong>${visit.customer?.name || 'Guest Customer'}</strong><br>
                ${visit.customer?.contactNo || visit.customer?.phone || 'N/A'}<br>
                ${visit.customer?.email || 'N/A'}
              </p>
            </div>
            <div class="info-block">
              <h3>Payment Details</h3>
              <p>
                <strong>Payment Method:</strong> ${invoiceData.paymentMode || 'Cash'}<br>
                <strong>Status:</strong> ${invoiceData.paidAmount >= finalTotal ? 'PAID' : 'PENDING'}<br>
                <strong>Invoice Date:</strong> ${new Date().toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          <!-- Items Table -->
          <div class="items-section">
            <div class="items-header">
              <h3>Service Details</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">S.No</th>
                  <th style="width: 50%;">Description</th>
                  <th style="width: 15%;">Qty</th>
                  <th style="width: 15%;">Rate</th>
                  <th style="width: 15%;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div class="totals-section">
            <div></div>
            <div class="totals-box">
              <div class="total-row heading">
                <span>Subtotal:</span>
                <span>₹${(invoiceData.totalAmount || 0).toFixed(2)}</span>
              </div>
              ${
                discountAmount > 0
                  ? `
                <div class="total-row">
                  <span>Discount:</span>
                  <span style="color: #10b981;">-₹${discountAmount.toFixed(2)}</span>
                </div>
              `
                  : ''
              }
              <div class="total-row">
                <span>GST (18%):</span>
                <span>₹${taxAmount.toFixed(2)}</span>
              </div>
              <div class="total-row divider final-total">
                <span>Grand Total:</span>
                <span>₹${finalTotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Amount Paid:</span>
                <span class="paid">₹${(invoiceData.paidAmount || 0).toFixed(2)}</span>
              </div>
              ${
                balance > 0
                  ? `
                <div class="total-row balance-due">
                  <span>Balance Due:</span>
                  <span>₹${balance.toFixed(2)}</span>
                </div>
              `
                  : `
                <div class="total-row balance-due">
                  <span>Status:</span>
                  <span>PAID IN FULL</span>
                </div>
              `
              }
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p class="thank-you">Thank you for choosing Velvet Luxury Salon</p>
            <p>We look forward to serving you again!</p>
            <p>For any queries, contact: info@velvetluxury.com | +91-XXXXXXXXXX</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const downloadPDF = (pdf, fileName) => {
  pdf.save(fileName);
};

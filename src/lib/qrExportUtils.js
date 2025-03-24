import { generateQRCodeAsSVG, addLogoToSVG } from './qrSvgUtils';

/**
 * Central module for QR code export functions in different formats
 * Supports multiple export formats including vector and raster options
 */

/**
 * Export QR code as PNG format
 * @param {Object} options - QR code options and data
 * @param {string} filename - Filename for download (without extension)
 * @returns {Promise<boolean>} - Success status
 */
export const exportAsPNG = async (options, filename = 'qrcode') => {
  try {
    const { qrDataUrl } = options;
    
    if (!qrDataUrl) {
      throw new Error('No QR code data available for PNG export');
    }
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = qrDataUrl;
    downloadLink.download = `${filename}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    return true;
  } catch (error) {
    console.error('Error exporting PNG:', error);
    throw error;
  }
};

/**
 * Export QR code as JPEG format with specified quality
 * @param {Object} options - QR code options and data
 * @param {number} quality - JPEG quality (0-1)
 * @param {string} filename - Filename for download (without extension)
 * @returns {Promise<boolean>} - Success status
 */
export const exportAsJPEG = async (options, quality = 0.9, filename = 'qrcode') => {
  try {
    const { qrDataUrl } = options;
    
    if (!qrDataUrl) {
      throw new Error('No QR code data available for JPEG export');
    }
    
    // Create a canvas to convert PNG to JPEG with quality settings
    const img = new Image();
    
    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = qrDataUrl;
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = options.bgColor || '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    
    // Convert to JPEG with quality setting
    const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = jpegDataUrl;
    downloadLink.download = `${filename}.jpg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    return true;
  } catch (error) {
    console.error('Error exporting JPEG:', error);
    throw error;
  }
};

/**
 * Export QR code as SVG format
 * @param {Object} options - QR code options
 * @param {string} filename - Filename for download (without extension)
 * @returns {Promise<boolean>} - Success status
 */
export const exportAsSVG = async (options, filename = 'qrcode') => {
  try {
    const {
      text,
      size,
      fgColor,
      bgColor,
      errorCorrectionLevel,
      showLogo,
      logo,
      logoSize,
      logoShape,
      logoBackground,
      useCustomBackground,
      logoType,
      logoSvgContent
    } = options;
    
    // Generate basic QR SVG
    let svgString = await generateQRCodeAsSVG(text, {
      size,
      fgColor,
      bgColor,
      errorCorrectionLevel
    });
    
    // Add logo if needed
    if (showLogo && logo) {
      svgString = addLogoToSVG(svgString, {
        logo,
        logoSize,
        logoShape,
        logoBackground,
        useCustomBackground,
        logoType,
        logoSvgContent,
        size
      });
    }
    
    // Download the SVG
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${filename}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
    
    return true;
  } catch (error) {
    console.error('Error exporting SVG:', error);
    throw error;
  }
};

/**
 * Export QR code as WebP format
 * @param {Object} options - QR code options and data
 * @param {number} quality - WebP quality (0-1)
 * @param {string} filename - Filename for download (without extension)
 * @returns {Promise<boolean>} - Success status
 */
export const exportAsWebP = async (options, quality = 0.8, filename = 'qrcode') => {
  try {
    const { qrDataUrl } = options;
    
    if (!qrDataUrl) {
      throw new Error('No QR code data available for WebP export');
    }
    
    // Check browser support for WebP
    const canvas = document.createElement('canvas');
    if (!canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
      throw new Error('WebP format is not supported in this browser');
    }
    
    // Create a canvas to convert to WebP
    const img = new Image();
    
    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = qrDataUrl;
    });
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = options.bgColor || '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    
    // Convert to WebP
    const webpDataUrl = canvas.toDataURL('image/webp', quality);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = webpDataUrl;
    downloadLink.download = `${filename}.webp`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    return true;
  } catch (error) {
    console.error('Error exporting WebP:', error);
    throw error;
  }
};

/**
 * Export QR code as PDF format
 * @param {Object} options - QR code options and data
 * @param {string} filename - Filename for download (without extension)
 * @returns {Promise<boolean>} - Success status
 */
export const exportAsPDF = async (options, filename = 'qrcode') => {
  try {
    const { qrDataUrl, size, text, showLogo, logo } = options;
    
    // Check if the qrDataUrl is available
    if (!qrDataUrl) {
      throw new Error('No QR code data available for PDF export');
    }
    
    // For actual implementation, we would need to add jsPDF as a dependency
    // Since we don't have it yet, we'll use a simplified version that relies on browser print
    // The actual implementation will follow in the future
    
    // Create an HTML document with the QR code properly formatted for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${text || 'Export'}</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            font-family: system-ui, -apple-system, sans-serif;
          }
          img {
            max-width: 80%;
            max-height: 70vh;
          }
          p {
            margin-top: 20px;
            text-align: center;
            max-width: 80%;
          }
          .print-button {
            margin-top: 20px;
            padding: 8px 16px;
            background: #1a73e8;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <img src="${qrDataUrl}" alt="QR Code" />
        ${text ? `<p>${text}</p>` : ''}
        <div class="no-print">
          <button class="print-button" onclick="window.print(); setTimeout(() => window.close(), 500);">
            Print as PDF
          </button>
        </div>
        <script>
          // Auto print dialog
          setTimeout(() => {
            document.querySelector('.print-button').focus();
          }, 1000);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    
    return true;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

/**
 * Export QR code as HTML snippet for embedding
 * @param {Object} options - QR code options and data
 * @param {string} filename - Filename for download (without extension)
 * @returns {Promise<boolean>} - Success status
 */
export const exportAsHTMLSnippet = async (options, filename = 'qrcode-embed') => {
  try {
    const { qrDataUrl, size, text } = options;
    
    if (!qrDataUrl) {
      throw new Error('No QR code data available for HTML export');
    }
    
    // Create HTML snippet
    const htmlContent = `<!-- QR Code Generator HTML Embed -->
<div style="text-align: center; margin: 20px 0;">
  <img src="${qrDataUrl}" alt="QR Code" style="max-width: 100%; width: ${size}px; height: ${size}px;" />
  ${text ? `<p style="margin-top: 10px; font-size: 14px;">${text}</p>` : ''}
</div>
<!-- End QR Code Generator HTML Embed -->`;
    
    // Create a blob from the HTML
    const htmlBlob = new Blob([htmlContent], {type: 'text/html;charset=utf-8'});
    const htmlUrl = URL.createObjectURL(htmlBlob);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = htmlUrl;
    downloadLink.download = `${filename}.html`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(htmlUrl);
    
    return true;
  } catch (error) {
    console.error('Error exporting HTML snippet:', error);
    throw error;
  }
};

/**
 * Export QR code data URL
 * @param {Object} options - QR code options and data
 * @param {string} filename - Filename for download (without extension)
 * @returns {Promise<boolean>} - Success status
 */
export const exportAsDataURL = async (options, filename = 'qrcode-dataurl') => {
  try {
    const { qrDataUrl } = options;
    
    if (!qrDataUrl) {
      throw new Error('No QR code data available for DataURL export');
    }
    
    // Create a text file with the data URL
    const textContent = qrDataUrl;
    const textBlob = new Blob([textContent], {type: 'text/plain;charset=utf-8'});
    const textUrl = URL.createObjectURL(textBlob);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = textUrl;
    downloadLink.download = `${filename}.txt`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(textUrl);
    
    return true;
  } catch (error) {
    console.error('Error exporting data URL:', error);
    throw error;
  }
};

/**
 * Copy QR code data URL to clipboard
 * @param {Object} options - QR code options and data
 * @returns {Promise<boolean>} - Success status
 */
export const copyDataURLToClipboard = async (options) => {
  try {
    const { qrDataUrl } = options;
    
    if (!qrDataUrl) {
      throw new Error('No QR code data available for clipboard copy');
    }
    
    await navigator.clipboard.writeText(qrDataUrl);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw error;
  }
};
// Import QRCode library
import QRCode from 'qrcode';

/**
 * Generate QR code as SVG string
 */
export const generateQRCodeAsSVG = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      QRCode.toString(text || 'https://example.com', {
        type: 'svg',
        errorCorrectionLevel: options.errorCorrectionLevel || 'H',
        margin: 1,
        width: options.size || 200,
        color: {
          dark: options.fgColor || '#000000',
          light: options.bgColor || '#FFFFFF'
        }
      }, (err, svgString) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(svgString);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Add logo to SVG QR code
 */
export const addLogoToSVG = (svgString, logoOptions) => {
  const { 
    logo, 
    logoSize, 
    logoShape, 
    logoBackground, 
    useCustomBackground,
    logoType,
    logoSvgContent,
    size 
  } = logoOptions;

  try {
    // Parse the SVG string to a DOM object
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgRoot = svgDoc.documentElement;
    
    // Set dimensions
    svgRoot.setAttribute('width', size);
    svgRoot.setAttribute('height', size);
    
    // Calculate logo dimensions
    const logoWidth = size * (logoSize / 100);
    const logoHeight = logoWidth;
    const logoX = (size - logoWidth) / 2;
    const logoY = (size - logoHeight) / 2;
    const padding = logoWidth * 0.1;
    
    // Create a group for the logo
    const logoGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Add background
    if (useCustomBackground && logoBackground.toLowerCase() !== 'transparent') {
      let backgroundShape;
      
      if (logoShape === 'circle') {
        backgroundShape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        backgroundShape.setAttribute('cx', logoX + logoWidth / 2);
        backgroundShape.setAttribute('cy', logoY + logoHeight / 2);
        backgroundShape.setAttribute('r', logoWidth / 2 + padding);
        backgroundShape.setAttribute('fill', logoBackground);
      } else if (logoShape === 'roundedSquare') {
        backgroundShape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        backgroundShape.setAttribute('x', logoX - padding);
        backgroundShape.setAttribute('y', logoY - padding);
        backgroundShape.setAttribute('width', logoWidth + padding * 2);
        backgroundShape.setAttribute('height', logoHeight + padding * 2);
        backgroundShape.setAttribute('rx', logoWidth * 0.2);
        backgroundShape.setAttribute('ry', logoWidth * 0.2);
        backgroundShape.setAttribute('fill', logoBackground);
      } else {
        backgroundShape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        backgroundShape.setAttribute('x', logoX - padding);
        backgroundShape.setAttribute('y', logoY - padding);
        backgroundShape.setAttribute('width', logoWidth + padding * 2);
        backgroundShape.setAttribute('height', logoHeight + padding * 2);
        backgroundShape.setAttribute('fill', logoBackground);
      }
      
      logoGroup.appendChild(backgroundShape);
    }
    
    // Add logo
    if (logoType === 'svg' && logoSvgContent) {
      try {
        // Handle SVG logo
        const logoDoc = parser.parseFromString(logoSvgContent, 'image/svg+xml');
        const logoRoot = logoDoc.documentElement;
        
        // Get original SVG dimensions
        let svgWidth = parseFloat(logoRoot.getAttribute('width') || 100);
        let svgHeight = parseFloat(logoRoot.getAttribute('height') || 100);
        let viewBox = logoRoot.getAttribute('viewBox');
        
        // Create container for logo
        const logoSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        logoSvgElement.setAttribute('x', logoX);
        logoSvgElement.setAttribute('y', logoY);
        logoSvgElement.setAttribute('width', logoWidth);
        logoSvgElement.setAttribute('height', logoHeight);
        
        if (viewBox) {
          logoSvgElement.setAttribute('viewBox', viewBox);
        } else if (svgWidth && svgHeight) {
          logoSvgElement.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        }
        
        // Copy all child nodes from logo SVG
        Array.from(logoRoot.childNodes).forEach(node => {
          logoSvgElement.appendChild(node.cloneNode(true));
        });
        
        logoGroup.appendChild(logoSvgElement);
      } catch (error) {
        console.error('Error embedding SVG logo:', error);
        // Fallback to image
        addImageToSVG(logoGroup, logo, logoX, logoY, logoWidth, logoHeight);
      }
    } else {
      // For raster logos
      addImageToSVG(logoGroup, logo, logoX, logoY, logoWidth, logoHeight);
    }
    
    // Add the logo group to the SVG
    svgRoot.appendChild(logoGroup);
    
    // Convert back to string
    return new XMLSerializer().serializeToString(svgDoc);
  } catch (error) {
    console.error('Error adding logo to SVG:', error);
    return svgString; // Return original SVG if there's an error
  }
};

// Helper function to add image to SVG
const addImageToSVG = (parent, src, x, y, width, height) => {
  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('x', x);
  image.setAttribute('y', y);
  image.setAttribute('width', width);
  image.setAttribute('height', height);
  image.setAttribute('href', src);
  parent.appendChild(image);
};

/**
 * Main function to generate and download SVG
 */
export const downloadQRCodeAsSVG = async (options) => {
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
    downloadLink.download = 'qrcode.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
    
    return true;
  } catch (error) {
    console.error('Error generating SVG QR code:', error);
    throw error;
  }
};
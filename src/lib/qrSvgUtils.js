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
    
    // Critical: Get the original viewBox before making any changes
    const originalViewBox = svgRoot.getAttribute('viewBox');
    const viewBoxValues = originalViewBox ? originalViewBox.split(' ').map(Number) : [0, 0, size, size];
    
    // Extract viewBox dimensions
    const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = viewBoxValues;
    
    // Preserve the original dimensions of the QR code
    const width = svgRoot.getAttribute('width') || size;
    const height = svgRoot.getAttribute('height') || size;
    
    // Create a new SVG document that will contain everything properly arranged
    const newSvgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', null);
    const newSvgRoot = newSvgDoc.documentElement;
    
    // Set essential attributes on the new root
    newSvgRoot.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    newSvgRoot.setAttribute('width', width);
    newSvgRoot.setAttribute('height', height);
    newSvgRoot.setAttribute('viewBox', originalViewBox || `0 0 ${size} ${size}`);
    
    // Copy all non-content attributes from original SVG root to preserve styling
    Array.from(svgRoot.attributes).forEach(attr => {
      if (!['width', 'height', 'viewBox', 'xmlns'].includes(attr.name)) {
        newSvgRoot.setAttribute(attr.name, attr.value);
      }
    });
    
    // Find background rect if it exists
    const existingBg = svgRoot.querySelector('rect[width="100%"], rect[width="' + viewBoxWidth + '"]');
    const bgColor = existingBg ? existingBg.getAttribute('fill') : '#FFFFFF';
    
    // Create a proper background
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', viewBoxX);
    bgRect.setAttribute('y', viewBoxY);
    bgRect.setAttribute('width', viewBoxWidth);
    bgRect.setAttribute('height', viewBoxHeight);
    bgRect.setAttribute('fill', bgColor);
    newSvgRoot.appendChild(bgRect);
    
    // Calculate logo dimensions relative to viewBox
    const logoWidthInViewBox = viewBoxWidth * (logoSize / 100);
    const logoHeightInViewBox = logoWidthInViewBox;
    const logoXInViewBox = viewBoxX + (viewBoxWidth - logoWidthInViewBox) / 2;
    const logoYInViewBox = viewBoxY + (viewBoxHeight - logoHeightInViewBox) / 2;
    const paddingInViewBox = logoWidthInViewBox * 0.1;
    
    // Create defs section for our masks and clips
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Create a mask for the QR code to create a hole for the logo
    const maskId = `logo-mask-${Math.random().toString(36).substring(2, 9)}`;
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    mask.setAttribute('id', maskId);
    
    // White rectangle for the base mask (shows everything)
    const maskBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    maskBg.setAttribute('x', viewBoxX);
    maskBg.setAttribute('y', viewBoxY);
    maskBg.setAttribute('width', viewBoxWidth);
    maskBg.setAttribute('height', viewBoxHeight);
    maskBg.setAttribute('fill', 'white');
    mask.appendChild(maskBg);
    
    // Black shape for the logo area (creates a hole)
    let maskShape;
    if (logoShape === 'circle') {
      maskShape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      maskShape.setAttribute('cx', logoXInViewBox + logoWidthInViewBox/2);
      maskShape.setAttribute('cy', logoYInViewBox + logoHeightInViewBox/2);
      maskShape.setAttribute('r', logoWidthInViewBox/2 + paddingInViewBox);
      maskShape.setAttribute('fill', 'black');
    } else if (logoShape === 'roundedSquare') {
      maskShape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      maskShape.setAttribute('x', logoXInViewBox - paddingInViewBox);
      maskShape.setAttribute('y', logoYInViewBox - paddingInViewBox);
      maskShape.setAttribute('width', logoWidthInViewBox + paddingInViewBox*2);
      maskShape.setAttribute('height', logoHeightInViewBox + paddingInViewBox*2);
      maskShape.setAttribute('rx', (logoWidthInViewBox + paddingInViewBox*2) * 0.2);
      maskShape.setAttribute('ry', (logoHeightInViewBox + paddingInViewBox*2) * 0.2);
      maskShape.setAttribute('fill', 'black');
    } else {
      maskShape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      maskShape.setAttribute('x', logoXInViewBox - paddingInViewBox);
      maskShape.setAttribute('y', logoYInViewBox - paddingInViewBox);
      maskShape.setAttribute('width', logoWidthInViewBox + paddingInViewBox*2);
      maskShape.setAttribute('height', logoHeightInViewBox + paddingInViewBox*2);
      maskShape.setAttribute('fill', 'black');
    }
    mask.appendChild(maskShape);
    defs.appendChild(mask);
    
    // Create a QR code group with the mask applied
    const qrCodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    qrCodeGroup.setAttribute('mask', `url(#${maskId})`);
    
    // Copy all elements except the background rect from the original SVG
    Array.from(svgRoot.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip the background rect if we found one
        if (node === existingBg) return;
        
        // Special case for groups of path elements (how QRCode.js often outputs)
        if (node.tagName === 'path' || (node.tagName === 'g' && node.querySelector('path'))) {
          qrCodeGroup.appendChild(node.cloneNode(true));
        }
        // Handle rect elements that aren't the background
        else if (node.tagName === 'rect') {
          const width = node.getAttribute('width');
          // Skip rects that look like backgrounds
          if (width === '100%' || width === viewBoxWidth.toString()) return;
          qrCodeGroup.appendChild(node.cloneNode(true));
        }
        // Handle any other relevant elements
        else if (node.tagName !== 'defs') {
          qrCodeGroup.appendChild(node.cloneNode(true));
        }
      }
    });
    
    // Add the QR code group to our new SVG
    newSvgRoot.appendChild(qrCodeGroup);
    
    // Create a logo container group
    const logoGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Add a background for the logo if needed
    if (useCustomBackground && logoBackground.toLowerCase() !== 'transparent') {
      let bgElement;
      if (logoShape === 'circle') {
        bgElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgElement.setAttribute('cx', logoXInViewBox + logoWidthInViewBox/2);
        bgElement.setAttribute('cy', logoYInViewBox + logoHeightInViewBox/2);
        bgElement.setAttribute('r', logoWidthInViewBox/2 + paddingInViewBox/2);
        bgElement.setAttribute('fill', logoBackground);
      } else if (logoShape === 'roundedSquare') {
        bgElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bgElement.setAttribute('x', logoXInViewBox - paddingInViewBox/2);
        bgElement.setAttribute('y', logoYInViewBox - paddingInViewBox/2);
        bgElement.setAttribute('width', logoWidthInViewBox + paddingInViewBox);
        bgElement.setAttribute('height', logoHeightInViewBox + paddingInViewBox);
        bgElement.setAttribute('rx', (logoWidthInViewBox + paddingInViewBox) * 0.2);
        bgElement.setAttribute('ry', (logoHeightInViewBox + paddingInViewBox) * 0.2);
        bgElement.setAttribute('fill', logoBackground);
      } else {
        bgElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bgElement.setAttribute('x', logoXInViewBox - paddingInViewBox/2);
        bgElement.setAttribute('y', logoYInViewBox - paddingInViewBox/2);
        bgElement.setAttribute('width', logoWidthInViewBox + paddingInViewBox);
        bgElement.setAttribute('height', logoHeightInViewBox + paddingInViewBox);
        bgElement.setAttribute('fill', logoBackground);
      }
      logoGroup.appendChild(bgElement);
    }
    
    // Add the logo
    if (logoType === 'svg' && logoSvgContent) {
      try {
        // Parse SVG content
        const logoDoc = parser.parseFromString(logoSvgContent, 'image/svg+xml');
        const logoRoot = logoDoc.documentElement;
        
        // Create a nested SVG element to contain the logo
        const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        logoSvg.setAttribute('x', logoXInViewBox);
        logoSvg.setAttribute('y', logoYInViewBox);
        logoSvg.setAttribute('width', logoWidthInViewBox);
        logoSvg.setAttribute('height', logoHeightInViewBox);
        
        // Preserve logo's viewBox or create one
        const logoViewBox = logoRoot.getAttribute('viewBox');
        if (logoViewBox) {
          logoSvg.setAttribute('viewBox', logoViewBox);
        } else {
          const logoOrigWidth = logoRoot.getAttribute('width') || '100';
          const logoOrigHeight = logoRoot.getAttribute('height') || '100';
          logoSvg.setAttribute('viewBox', `0 0 ${logoOrigWidth} ${logoOrigHeight}`);
        }
        
        // Copy all child nodes from the original logo
        Array.from(logoRoot.childNodes).forEach(node => {
          logoSvg.appendChild(node.cloneNode(true));
        });
        
        logoGroup.appendChild(logoSvg);
      } catch (error) {
        console.error('Error embedding SVG logo:', error);
        // Fallback to image if SVG embedding fails
        addImageToSVG(logoGroup, logo, logoXInViewBox, logoYInViewBox, logoWidthInViewBox, logoHeightInViewBox, logoShape, defs);
      }
    } else {
      // Regular raster image logo
      addImageToSVG(logoGroup, logo, logoXInViewBox, logoYInViewBox, logoWidthInViewBox, logoHeightInViewBox, logoShape, defs);
    }
    
    // Add defs and logo group to the SVG
    newSvgRoot.appendChild(defs);
    newSvgRoot.appendChild(logoGroup);
    
    // Convert the new SVG to a string
    return new XMLSerializer().serializeToString(newSvgDoc);
  } catch (error) {
    console.error('Error generating QR code with logo:', error);
    return svgString; // Return original SVG as fallback
  }
};

// Helper function to add an image element to an SVG
const addImageToSVG = (parent, src, x, y, width, height, shape, defs) => {
  const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  image.setAttribute('x', x);
  image.setAttribute('y', y);
  image.setAttribute('width', width);
  image.setAttribute('height', height);
  image.setAttribute('href', src);
  
  // Apply clipping for shaped logos
  if (shape === 'circle' || shape === 'roundedSquare') {
    const clipId = `logo-clip-${Math.random().toString(36).substring(2, 9)}`;
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.setAttribute('id', clipId);
    
    let clipShape;
    if (shape === 'circle') {
      clipShape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      clipShape.setAttribute('cx', width/2);
      clipShape.setAttribute('cy', height/2);
      clipShape.setAttribute('r', width/2);
    } else {
      clipShape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      clipShape.setAttribute('x', '0');
      clipShape.setAttribute('y', '0');
      clipShape.setAttribute('width', width);
      clipShape.setAttribute('height', height);
      clipShape.setAttribute('rx', width * 0.2);
      clipShape.setAttribute('ry', height * 0.2);
    }
    
    clipPath.appendChild(clipShape);
    defs.appendChild(clipPath);
    image.setAttribute('clip-path', `url(#${clipId})`);
  }
  
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
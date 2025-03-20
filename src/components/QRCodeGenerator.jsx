import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Download, RefreshCw } from 'lucide-react';

// QRCode-Bibliothek vorab importieren, um Ladeprobleme zu vermeiden
import QRCode from 'qrcode';

const QRCodeGenerator = () => {
  // States für alle Einstellungen
  const [text, setText] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(200);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [qrInitialized, setQrInitialized] = useState(false);
  
  // Ref für SVG-Container
  const svgRef = useRef(null);
  const qrDataRef = useRef(null); // Speichert die QR-Code-Daten für Styling
  
  // Initialisiere den QR-Code, wenn die Komponente gemountet wird
  useEffect(() => {
    // Warten, bis das DOM vollständig gerendert ist
    const timer = setTimeout(() => {
      if (svgRef.current) {
        setQrInitialized(true);
        generateQRCode();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // QR-Code generieren und rendern
  const generateQRCode = () => {
    if (!svgRef.current || !qrInitialized) {
      console.log("SVG-Ref ist noch nicht bereit oder QR nicht initialisiert");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // QR-Code-Daten generieren
      QRCode.toDataURL(text || 'https://example.com', {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: size,
        color: {
          dark: fgColor,
          light: bgColor
        }
      }, (err, url) => {
        if (err) {
          console.error("Fehler bei der QR-Code Generierung:", err);
          setError("QR-Code konnte nicht generiert werden: " + err.message);
          setLoading(false);
          return;
        }
        
        // Jetzt rendern wir den QR-Code mit unserem eigenen Ansatz
        // um die Ecken abzurunden
        if (svgRef.current) {
          // QR-Code-Elemente mit abgerundeten Ecken erstellen
          renderQRCodeWithRoundedCorners(url);
        } else {
          console.error("svgRef.current ist null nach QR-Code-Generierung");
          setError("Fehler beim Rendern des QR-Codes");
        }
        
        setLoading(false);
      });
    } catch (error) {
      console.error("Fehler beim Generieren des QR-Codes:", error);
      setError("QR-Code konnte nicht generiert werden: " + error.message);
      setLoading(false);
    }
  };

  // QR-Code mit abgerundeten Ecken rendern
  const renderQRCodeWithRoundedCorners = (dataUrl) => {
    if (!svgRef.current) return;
    
    // Container leeren
    svgRef.current.innerHTML = '';
    
    if (cornerRadius === 0) {
      // Wenn kein Radius, dann einfach das Bild anzeigen
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      svgRef.current.appendChild(img);
      return;
    }
    
    // QR-Code in Canvas umwandeln für Pixelzugriff
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // QR-Code Daten extrahieren
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelData = imageData.data;
      
      // QR-Code-Zellen erkennen
      const cellSize = canvas.width / Math.sqrt(pixelData.length / 4);
      const moduleCount = Math.floor(canvas.width / cellSize);
      
      // SVG erstellen
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      svg.setAttribute("viewBox", `0 0 ${moduleCount} ${moduleCount}`);
      
      // Hintergrund
      const background = document.createElementNS(svgNS, "rect");
      background.setAttribute("width", moduleCount);
      background.setAttribute("height", moduleCount);
      background.setAttribute("fill", bgColor);
      svg.appendChild(background);
      
      // QR-Code-Zellen
      for (let y = 0; y < moduleCount; y++) {
        for (let x = 0; x < moduleCount; x++) {
          const pixelIndex = (y * cellSize * canvas.width + x * cellSize) * 4;
          // Prüfen, ob es ein dunkles Pixel ist (QR-Code-Punkt)
          if (pixelData[pixelIndex] < 128) {
            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", 1);
            rect.setAttribute("height", 1);
            rect.setAttribute("fill", fgColor);
            rect.setAttribute("rx", cornerRadius / 20); // Skalierter Radius
            rect.setAttribute("ry", cornerRadius / 20); // Skalierter Radius
            svg.appendChild(rect);
          }
        }
      }
      
      // SVG in den Container einfügen
      svgRef.current.appendChild(svg);
      
      // QR-Code-Daten speichern für Downloads
      qrDataRef.current = {
        svgElement: svg,
        dataUrl: dataUrl
      };
      
      setSuccessMessage('QR-Code erfolgreich generiert!');
      setTimeout(() => setSuccessMessage(''), 2000);
    };
    
    img.onerror = () => {
      setError("Fehler beim Laden des QR-Code-Bildes");
    };
    
    img.src = dataUrl;
  };

  // QR-Code bei Änderungen neu generieren
  useEffect(() => {
    if (!qrInitialized) return;
    
    const timer = setTimeout(() => {
      generateQRCode();
    }, 300); // Debounce-Verzögerung

    return () => clearTimeout(timer);
  }, [text, fgColor, bgColor, size, cornerRadius, qrInitialized]);
  
  // Als SVG herunterladen
  const downloadSVG = () => {
    if (!qrDataRef.current || !qrDataRef.current.svgElement) {
      setError("Kein QR-Code zum Herunterladen vorhanden.");
      return;
    }
    
    try {
      const svgData = new XMLSerializer().serializeToString(qrDataRef.current.svgElement);
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'qrcode.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
      
      setSuccessMessage('SVG erfolgreich heruntergeladen!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error("Fehler beim SVG-Download:", err);
      setError("SVG konnte nicht heruntergeladen werden: " + err.message);
    }
  };
  
  // Als PNG herunterladen
  const downloadPNG = () => {
    if (!qrDataRef.current || !qrDataRef.current.dataUrl) {
      setError("Kein QR-Code zum Herunterladen vorhanden.");
      return;
    }
    
    try {
      // Wenn kein Eckenradius, können wir direkt die DataURL verwenden
      if (cornerRadius === 0) {
        const downloadLink = document.createElement('a');
        downloadLink.href = qrDataRef.current.dataUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        // Ansonsten müssen wir das SVG in eine Canvas rendern und dann als PNG speichern
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Hintergrund zeichnen
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // SVG in Canvas zeichnen
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(qrDataRef.current.svgElement);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Als PNG herunterladen
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'qrcode.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          URL.revokeObjectURL(url);
          
          setSuccessMessage('PNG erfolgreich heruntergeladen!');
          setTimeout(() => setSuccessMessage(''), 2000);
        };
        
        img.onerror = (err) => {
          console.error("Fehler beim Laden des SVG als Bild:", err);
          setError("SVG konnte nicht als Bild geladen werden.");
          URL.revokeObjectURL(url);
        };
        
        img.src = url;
      }
    } catch (err) {
      console.error("Fehler beim PNG-Download:", err);
      setError("PNG konnte nicht heruntergeladen werden: " + err.message);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Steuerungselemente */}
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>QR-Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text">Text oder URL</Label>
            <Input 
              id="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fgColor">Vordergrundfarbe</Label>
            <div className="flex gap-2">
              <Input 
                id="fgColor" 
                type="color" 
                value={fgColor} 
                onChange={(e) => setFgColor(e.target.value)} 
                className="w-12 h-10 p-1"
              />
              <Input 
                value={fgColor} 
                onChange={(e) => setFgColor(e.target.value)} 
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bgColor">Hintergrundfarbe</Label>
            <div className="flex gap-2">
              <Input 
                id="bgColor" 
                type="color" 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)} 
                className="w-12 h-10 p-1"
              />
              <Input 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)} 
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Größe: {size}px</Label>
            <Slider
              id="size"
              min={100}
              max={400}
              step={10}
              value={[size]}
              onValueChange={(value) => setSize(value[0])}
              className="py-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cornerRadius">Eckenradius: {cornerRadius}</Label>
            <Slider
              id="cornerRadius"
              min={0}
              max={8}
              step={1}
              value={[cornerRadius]}
              onValueChange={(value) => setCornerRadius(value[0])}
              className="py-4"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={generateQRCode} className="w-full" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={downloadSVG} className="w-full" disabled={loading || !qrInitialized}>
              <Download className="w-4 h-4 mr-2" />
              SVG
            </Button>
            <Button onClick={downloadPNG} className="w-full" disabled={loading || !qrInitialized}>
              <Download className="w-4 h-4 mr-2" />
              PNG
            </Button>
          </div>
          
          {error && (
            <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 rounded bg-green-50 text-green-600 text-sm">
              {successMessage}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Vorschau */}
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>Vorschau</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-64">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div 
              ref={svgRef} 
              className="flex items-center justify-center p-4 rounded border border-gray-200 w-full min-h-52"
              style={{ backgroundColor: bgColor }}
            >
              {!qrInitialized && <p className="text-gray-400">QR-Code wird geladen...</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
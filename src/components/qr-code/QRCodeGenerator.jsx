import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Download, RefreshCw, Settings, Palette, Move, Image, FileCode, Shield } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ColorSchemeSelector from './ColorSchemeSelector';
import QRCodeTemplates from './QRCodeTemplates';
import TemplateFormFields from './TemplateFormFields';
import { useTheme } from '@/context/ThemeContext';

// QRCode-Bibliothek vorab importieren, um Ladeprobleme zu vermeiden
import QRCode from 'qrcode';

/**
 * QR-Code Generator Komponente
 * 
 * Erlaubt es Benutzern, QR-Codes zu erstellen mit verschiedenen Vorlagen,
 * anpassbaren Farben, Größen und weiteren Optionen.
 * Mit Unterstützung für Dark Mode.
 */
const QRCodeGenerator = () => {
  // Theme context
  const { theme } = useTheme();
  
  // States für alle Einstellungen
  const [text, setText] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(200);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('H'); // Default to High
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [qrInitialized, setQrInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState('templates'); // Standardtab auf Templates
  const [activeTemplateId, setActiveTemplateId] = useState(''); // ID des aktuell ausgewählten Templates
  
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
      // If in dark mode and using default colors, consider adjusting for visibility
      let effectiveBgColor = bgColor;
      let effectiveFgColor = fgColor;
      
      // Optional: Adjust QR code for better visibility in dark mode
      // Only adjust if the user hasn't explicitly set custom colors
      if (theme === 'dark' && bgColor === '#ffffff' && fgColor === '#000000') {
        // Swap colors or adjust for better visibility in dark mode
        effectiveBgColor = '#2e2e2e';
        effectiveFgColor = '#ffffff';
      }
      
      // QR-Code-Daten generieren
      QRCode.toDataURL(text || 'https://example.com', {
        errorCorrectionLevel: errorCorrectionLevel, // Use the selected level
        margin: 1,
        width: size,
        color: {
          dark: effectiveFgColor,
          light: effectiveBgColor
        }
      }, (err, url) => {
        if (err) {
          console.error("Fehler bei der QR-Code Generierung:", err);
          setError("QR-Code konnte nicht generiert werden: " + err.message);
          setLoading(false);
          return;
        }
        
        // Jetzt rendern wir den QR-Code mit unserem eigenen Ansatz
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

  // QR-Code rendern
  const renderQRCodeWithRoundedCorners = (dataUrl) => {
    if (!svgRef.current) return;
    
    // Container leeren
    svgRef.current.innerHTML = '';
    
    // Container für das Bild erstellen, um Proportionen zu wahren
    const container = document.createElement('div');
    container.style.width = `${size}px`;
    container.style.height = `${size}px`;
    container.style.maxWidth = '100%';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    // Bild mit korrekten Proportionen
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.objectFit = 'contain'; // Ensures aspect ratio is maintained
    
    container.appendChild(img);
    svgRef.current.appendChild(container);
    
    // QR-Code-Daten speichern für Downloads
    qrDataRef.current = {
      svgElement: null,
      dataUrl: dataUrl
    };
  };

  // QR-Code bei Änderungen neu generieren
  useEffect(() => {
    if (!qrInitialized) return;
    
    const timer = setTimeout(() => {
      generateQRCode();
    }, 300); // Debounce-Verzögerung

    return () => clearTimeout(timer);
  }, [text, fgColor, bgColor, size, qrInitialized, errorCorrectionLevel, theme]);
  
  // Farbschema auswählen
  const handleSelectColorScheme = (newFgColor, newBgColor) => {
    setFgColor(newFgColor);
    setBgColor(newBgColor);
    // QR-Code wird automatisch aktualisiert durch den useEffect
  };
  
  // Template auswählen
  const handleSelectTemplate = (template) => {
    setText(template.content);
    setFgColor(template.fgColor);
    setBgColor(template.bgColor);
    setActiveTemplateId(template.id); // Template-ID speichern
    
    // Nach Template-Auswahl zum Content-Tab wechseln, um die Details anzupassen
    setActiveTab('content');
    
    // Feedback für den Benutzer
    setSuccessMessage(`Vorlage "${template.name}" wurde angewendet!`);
    setTimeout(() => setSuccessMessage(''), 2000);
  };
  
  // Aktualisieren des QR-Code-Inhalts aus den Formularfeldern
  const handleContentChangeFromFields = (newContent) => {
    setText(newContent);
  };
  
  // Als SVG herunterladen
  const downloadSVG = () => {
    if (!qrDataRef.current) {
      setError("Kein QR-Code zum Herunterladen vorhanden.");
      console.error("qrDataRef.current ist nicht initialisiert");
      return;
    }
    
    try {
      // Da wir kein SVG-Element mehr erzeugen, erstellen wir ein einfaches SVG
      if (!qrDataRef.current.svgElement) {
        if (!qrDataRef.current.dataUrl) {
          setError("Keine QR-Code Daten vorhanden.");
          return;
        }
        
        // Erstelle ein einfaches SVG mit dem QR-Code als eingebettetes Bild
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("width", "100%");
        rect.setAttribute("height", "100%");
        rect.setAttribute("fill", bgColor);
        svg.appendChild(rect);
        
        const image = document.createElementNS(svgNS, "image");
        image.setAttribute("href", qrDataRef.current.dataUrl);
        image.setAttribute("width", "100%");
        image.setAttribute("height", "100%");
        svg.appendChild(image);
        
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'qrcode.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      } else {
        // Originaler Code für den Fall, dass SVG-Element vorhanden ist
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
      }
      
      setSuccessMessage('SVG erfolgreich heruntergeladen!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error("Fehler beim SVG-Download:", err);
      setError("SVG konnte nicht heruntergeladen werden: " + err.message);
    }
  };
  
  // Als PNG herunterladen
  const downloadPNG = () => {
    if (!qrDataRef.current) {
      setError("Kein QR-Code zum Herunterladen vorhanden.");
      console.error("qrDataRef.current ist nicht initialisiert");
      return;
    }
    
    if (!qrDataRef.current.dataUrl) {
      setError("Keine QR-Code Daten vorhanden.");
      console.error("qrDataRef.current.dataUrl ist nicht verfügbar");
      return;
    }
    
    try {
      // Direkter Download der PNG, unabhängig vom cornerRadius
      const downloadLink = document.createElement('a');
      downloadLink.href = qrDataRef.current.dataUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setSuccessMessage('PNG erfolgreich heruntergeladen!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error("Fehler beim PNG-Download:", err);
      setError("PNG konnte nicht heruntergeladen werden: " + err.message);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Steuerungselemente */}
      <Card className="w-full md:w-1/2 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">QR-Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs für verschiedene Einstellungskategorien */}
          <Tabs className="w-full">
            <TabsList className="dark:border-gray-700">
              <TabsTrigger 
                active={activeTab === 'templates'} 
                onClick={() => setActiveTab('templates')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FileCode className="w-4 h-4 mr-2" />
                Vorlagen
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'content'} 
                onClick={() => setActiveTab('content')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <Image className="w-4 h-4 mr-2" />
                Inhalt
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'design'} 
                onClick={() => setActiveTab('design')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <Palette className="w-4 h-4 mr-2" />
                Design
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
                className="dark:text-gray-300 dark:hover:text-gray-100"
              >
                <Settings className="w-4 h-4 mr-2" />
                Einstellungen
              </TabsTrigger>
            </TabsList>
            
            {/* Templates Tab */}
            <TabsContent active={activeTab === 'templates'}>
              <div className="space-y-4 pt-4">
                <QRCodeTemplates onSelectTemplate={handleSelectTemplate} />
                <div className="pt-2 mt-2 border-t dark:border-gray-700">
                  <p className="text-sm text-muted-foreground dark:text-gray-400 italic">
                    Tipp: Nach der Auswahl einer Vorlage kannst Du den Inhalt im "Inhalt"-Tab anpassen.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Inhalt Tab */}
            <TabsContent active={activeTab === 'content'}>
              <div className="space-y-4 pt-4">
                {activeTemplateId ? (
                  // Strukturierte Formularfelder für Templates
                  <TemplateFormFields 
                    templateId={activeTemplateId} 
                    initialContent={text}
                    onContentChange={handleContentChangeFromFields}
                  />
                ) : (
                  // Allgemeines Textfeld für freien Text
                  <div className="space-y-2">
                    <Label htmlFor="text" className="dark:text-gray-200">Text oder URL</Label>
                    <Input 
                      id="text" 
                      value={text} 
                      onChange={(e) => setText(e.target.value)} 
                      placeholder="https://example.com"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                    />
                  </div>
                )}
                
                {activeTemplateId && (
                  <div className="pt-2 mt-4 border-t dark:border-gray-700">
                    <Button 
                      variant="outline" 
                      className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600" 
                      onClick={() => {
                        setActiveTemplateId(''); // Template-Modus zurücksetzen
                      }}
                    > 
                      Zurück zum Freitext-Modus
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Design Tab */}
            <TabsContent active={activeTab === 'design'}>
              <div className="space-y-6 pt-4">
                {/* Farbschema-Auswahl */}
                <ColorSchemeSelector onSelectScheme={handleSelectColorScheme} />
                
                {/* Manuelle Farbeinstellungen */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium mb-4 dark:text-gray-200">Individuelle Farbeinstellungen</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fgColor" className="dark:text-gray-200">Vordergrundfarbe</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="fgColor" 
                          type="color" 
                          value={fgColor} 
                          onChange={(e) => setFgColor(e.target.value)} 
                          className="w-12 h-10 p-1 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <Input 
                          value={fgColor} 
                          onChange={(e) => setFgColor(e.target.value)} 
                          className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bgColor" className="dark:text-gray-200">Hintergrundfarbe</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="bgColor" 
                          type="color" 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)} 
                          className="w-12 h-10 p-1 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <Input 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)} 
                          className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Einstellungen Tab */}
            <TabsContent active={activeTab === 'settings'}>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="size" className="dark:text-gray-200">Größe: {size}px</Label>
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
                
                <div className="pt-2">
                  <Button onClick={generateQRCode} className="w-full" disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Aktualisieren
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Download-Optionen - immer sichtbar */}
          <div className="pt-4 border-t mt-4 dark:border-gray-700">
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
          </div>
          
          {/* Fehlermeldungen und Erfolgsmeldungen */}
          {error && (
            <div className="p-3 rounded bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="p-3 rounded bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm">
              {successMessage}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Vorschau */}
      <Card className="w-full md:w-1/2 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Vorschau</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-64">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
            </div>
          ) : (
            <>
              <div 
                ref={svgRef} 
                className="flex items-center justify-center p-4 rounded border border-gray-200 dark:border-gray-700 w-full overflow-hidden"
                style={{ 
                  backgroundColor: bgColor,
                  minHeight: `${Math.max(208, size)}px` // Ensures container grows with QR code size
                }}
              >
                {!qrInitialized && <p className="text-gray-400 dark:text-gray-500">QR-Code wird geladen...</p>}
              </div>
              
              {/* Enhanced Error Correction Level Card */}
              <div className="w-full mt-3">
                <div className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-5 h-5 ${
                        errorCorrectionLevel === 'L' ? 'text-red-500' :     
                        errorCorrectionLevel === 'M' ? 'text-yellow-500' :  
                        errorCorrectionLevel === 'Q' ? 'text-green-400' :   
                        'text-green-700'                                   
                      }`} />
                      <span className="font-medium text-sm dark:text-gray-200">Fehlerkorrektur Level {errorCorrectionLevel}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      errorCorrectionLevel === 'L' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                      errorCorrectionLevel === 'M' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                      errorCorrectionLevel === 'Q' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                      'bg-green-200 text-green-900 dark:bg-green-900/70 dark:text-green-300'
                    }`}>  
                      {errorCorrectionLevel === 'L' ? '7%' :
                      errorCorrectionLevel === 'M' ? '15%' :
                      errorCorrectionLevel === 'Q' ? '25%' : '30%'}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                    {errorCorrectionLevel === 'L' ? 'Geringere Fehlerkorrektur, ideal für saubere Umgebungen.' :
                    errorCorrectionLevel === 'M' ? 'Ausgewogene Fehlerkorrektur für allgemeine Anwendungen.' :
                    errorCorrectionLevel === 'Q' ? 'Verbesserte Fehlerkorrektur, gut für Außenbereiche.' :
                    'Höchste Fehlerkorrektur, ideal wenn der QR-Code beschädigt werden könnte.'}
                  </p>
                  <div className="flex mt-2 gap-1">
                    {['L', 'M', 'Q', 'H'].map(level => (
                      <button
                        key={level}
                        className={`text-xs px-2 py-0.5 rounded transition-colors ${
                          level === errorCorrectionLevel 
                            ? 'bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground font-medium' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setErrorCorrectionLevel(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
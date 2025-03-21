import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Download, RefreshCw, Settings, Palette, Move, Image, FileCode } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import ColorSchemeSelector from './ColorSchemeSelector';
import QRCodeTemplates from './QRCodeTemplates';
import TemplateFormFields from './TemplateFormFields';

// QRCode-Bibliothek vorab importieren, um Ladeprobleme zu vermeiden
import QRCode from 'qrcode';

/**
 * QR-Code Generator Komponente
 * 
 * Erlaubt es Benutzern, QR-Codes zu erstellen mit verschiedenen Vorlagen,
 * anpassbaren Farben, Größen und weiteren Optionen.
 */
const QRCodeGenerator = () => {
  // States für alle Einstellungen
  const [text, setText] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(200);
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

  // QR-Code rendern - Vereinfachte Version ohne Eckenradius
  const renderQRCodeWithRoundedCorners = (dataUrl) => {
    if (!svgRef.current) return;
    
    // Container leeren
    svgRef.current.innerHTML = '';
    
    // Einfach das Bild anzeigen
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    svgRef.current.appendChild(img);
    
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
  }, [text, fgColor, bgColor, size, qrInitialized]);
  
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
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>QR-Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs für verschiedene Einstellungskategorien */}
          <Tabs className="w-full">
            <TabsList>
              <TabsTrigger 
                active={activeTab === 'templates'} 
                onClick={() => setActiveTab('templates')}
              >
                <FileCode className="w-4 h-4 mr-2" />
                Vorlagen
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'content'} 
                onClick={() => setActiveTab('content')}
              >
                <Image className="w-4 h-4 mr-2" />
                Inhalt
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'design'} 
                onClick={() => setActiveTab('design')}
              >
                <Palette className="w-4 h-4 mr-2" />
                Design
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Einstellungen
              </TabsTrigger>
            </TabsList>
            
            {/* Templates Tab */}
            <TabsContent active={activeTab === 'templates'}>
              <div className="space-y-4 pt-4">
                <QRCodeTemplates onSelectTemplate={handleSelectTemplate} />
                <div className="pt-2 mt-2 border-t">
                  <p className="text-sm text-muted-foreground italic">
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
                    <Label htmlFor="text">Text oder URL</Label>
                    <Input 
                      id="text" 
                      value={text} 
                      onChange={(e) => setText(e.target.value)} 
                      placeholder="https://example.com"
                    />
                  </div>
                )}
                
                {activeTemplateId && (
                  <div className="pt-2 mt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full" 
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
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-4">Individuelle Farbeinstellungen</h3>
                  <div className="space-y-4">
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
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Einstellungen Tab */}
            <TabsContent active={activeTab === 'settings'}>
              <div className="space-y-4 pt-4">
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
          <div className="pt-4 border-t mt-4">
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
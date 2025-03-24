// src/components/qr-code/TabbedExportPanel.jsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Image, FileText, Printer, 
  Code, File, Copy 
} from 'lucide-react';

/**
 * Tabbed panel for QR code export options
 * Organizes formats by category with improved beta tag readability
 */
const TabbedExportPanel = ({ onExport, disabled }) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('raster');

  return (
    <div className="p-3 border rounded-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3">
        <h3 className="text-sm font-medium dark:text-gray-200">Export QR Code</h3>
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b dark:border-gray-700 mb-3">
        <button
          type="button"
          className={`pb-2 px-3 text-sm ${
            activeTab === 'raster' 
              ? 'border-b-2 border-primary font-medium dark:border-primary dark:text-white' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('raster')}
        >
          Raster
        </button>
        <button
          type="button"
          className={`pb-2 px-3 text-sm ${
            activeTab === 'vector' 
              ? 'border-b-2 border-primary font-medium dark:border-primary dark:text-white' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('vector')}
        >
          Vector
        </button>
        <button
          type="button"
          className={`pb-2 px-3 text-sm ${
            activeTab === 'web' 
              ? 'border-b-2 border-primary font-medium dark:border-primary dark:text-white' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('web')}
        >
          Web
        </button>
      </div>
      
      {/* Raster formats tab */}
      {activeTab === 'raster' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => onExport('png')} 
              disabled={disabled}
              className="flex-1"
            >
              <Image className="w-4 h-4 mr-2" />
              PNG
            </Button>
            
            <Button 
              onClick={() => onExport('jpeg')} 
              disabled={disabled}
              className="flex-1"
            >
              <Image className="w-4 h-4 mr-2" />
              JPEG
            </Button>
          </div>
          
          <Button 
            onClick={() => onExport('webp')} 
            disabled={disabled}
            className="relative"
          >
            <Image className="w-4 h-4 mr-2" />
            WebP
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">Beta</span>
          </Button>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <p>Raster formats are ideal for digital use and social media sharing.</p>
          </div>
        </div>
      )}
      
      {/* Vector formats tab */}
      {activeTab === 'vector' && (
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => onExport('svg')} 
            disabled={disabled}
          >
            <FileText className="w-4 h-4 mr-2" />
            SVG
          </Button>
          
          <Button 
            onClick={() => onExport('pdf')} 
            disabled={disabled}
            className="relative"
          >
            <Printer className="w-4 h-4 mr-2" />
            PDF
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">Beta</span>
          </Button>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <p>Vector formats maintain quality at any size, perfect for printing and professional use.</p>
          </div>
        </div>
      )}
      
      {/* Web formats tab */}
      {activeTab === 'web' && (
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => onExport('html')} 
            disabled={disabled}
          >
            <Code className="w-4 h-4 mr-2" />
            HTML Snippet
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => onExport('dataurl')} 
              disabled={disabled}
            >
              <File className="w-4 h-4 mr-2" />
              Data URL
            </Button>
            
            <Button 
              onClick={() => onExport('clipboard')} 
              disabled={disabled}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <p>Web formats are designed for embedding in websites and applications.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabbedExportPanel;
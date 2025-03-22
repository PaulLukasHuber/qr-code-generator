import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Label } from './label';
import { Button } from './button';
import { Input } from './input';
import { Calendar, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Erweiterter CustomDateTimePicker
 * 
 * Ein angepasster Datum- und Uhrzeitauswähler mit:
 * - Hierarchischer Monat/Jahr-Navigation
 * - Direkter Texteingabe von Datum und Zeit
 * - Vollständig angepasstem Design
 * - Unterstützung für Dark Mode
 * 
 * @param {Object} props - Die Komponenten-Props
 * @param {string} props.id - ID des Elements
 * @param {string} props.label - Beschriftung
 * @param {string} props.value - ISO-8601-Wert (z.B. '20250325T100000Z')
 * @param {Function} props.onChange - Callback bei Änderungen
 * @param {string} props.className - Zusätzliche CSS-Klassen
 * @param {string} props.helperText - Hilfetext unter dem Input
 */
const CustomDateTimePicker = ({ 
  id, 
  label, 
  value, 
  onChange, 
  className, 
  helperText
}) => {
  // Formatierte Werte für die Anzeige
  const [displayValue, setDisplayValue] = useState('');
  
  // Zustände für die Dropdown-Anzeige
  const [showPicker, setShowPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('date'); // 'date' oder 'time'
  const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'
  
  // Refs für Klicks außerhalb
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  
  // Aktuelle Datums- und Zeitobjekte
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Kalender-Zustand
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [yearsRange, setYearsRange] = useState([]);
  
  // Uhrzeit-Werte
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  
  // Deutsche Formatierung für Datum/Zeit
  const dateFormatter = new Intl.DateTimeFormat('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  });
  
  const timeFormatter = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Konvertiere ISO-String zu Datum/Zeit beim Laden
  useEffect(() => {
    if (value) {
      const date = parseISOToDate(value);
      if (date) {
        setSelectedDate(date);
        updateDisplayValues(date);
        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());
      }
    } else {
      // Standardwerte für heute setzen
      const today = new Date();
      setSelectedDate(today);
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
      setDisplayValue('');
    }
  }, [value]);
  
  // Aktualisiere den Kalender, wenn sich Monat oder Jahr ändern
  useEffect(() => {
    switch (viewMode) {
      case 'days':
        generateCalendarDays(currentYear, currentMonth);
        break;
      case 'months':
        // Keine zusätzliche Aktion notwendig für Monatsansicht
        break;
      case 'years':
        generateYearsRange(currentYear);
        break;
    }
  }, [currentMonth, currentYear, viewMode]);
  
  // Handler für Klicks außerhalb des Pickers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && 
          !pickerRef.current.contains(event.target) && 
          inputRef.current && 
          !inputRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Formatiere Datum für Anzeige
  const updateDisplayValues = (date) => {
    if (!date) {
      setDisplayValue('');
      return;
    }
    
    const dateStr = dateFormatter.format(date);
    const timeStr = timeFormatter.format(date);
    
    setDisplayValue(`${dateStr} um ${timeStr}`);
    setHours(date.getHours().toString().padStart(2, '0'));
    setMinutes(date.getMinutes().toString().padStart(2, '0'));
  };
  
  // Generiere Jahre für Jahresansicht
  const generateYearsRange = (centerYear) => {
    const startYear = centerYear - 6;
    const years = [];
    
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }
    
    setYearsRange(years);
  };
  
  // Generiere Kalender-Tage für den angezeigten Monat
  const generateCalendarDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay() || 7; // 0 = Sonntag, wir wollen 7
    
    const days = [];
    
    // Tage vom vorherigen Monat
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i > 0; i--) {
      days.push({
        day: prevMonthDays - i + 1,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }
    
    // Tage des aktuellen Monats
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
      });
    }
    
    // Tage des nächsten Monats
    const remainingDays = 42 - days.length; // 6 Wochen * 7 Tage = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false
      });
    }
    
    setCalendarDays(days);
  };
  
  // Navigiere durch Jahre und Monate
  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };
  
  const changeYear = (increment) => {
    setCurrentYear(currentYear + increment);
  };
  
  // Wähle einen Tag aus
  const selectDay = (day) => {
    const newDate = new Date(day.year, day.month, day.day);
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    
    setSelectedDate(newDate);
    updateDisplayValues(newDate);
    // Wir bleiben im Picker, wechseln aber zur Zeitauswahl
    setActiveTab('time');
  };
  
  // Wähle einen Monat aus
  const selectMonth = (month) => {
    setCurrentMonth(month);
    setViewMode('days');
  };
  
  // Wähle ein Jahr aus
  const selectYear = (year) => {
    setCurrentYear(year);
    setViewMode('months');
  };
  
  // Aktualisiere die Stunden
  const updateHours = (e) => {
    const val = e.target.value;
    if (/^\d{0,2}$/.test(val)) {
      const numVal = parseInt(val, 10);
      if (!isNaN(numVal) && numVal >= 0 && numVal <= 23) {
        setHours(val.padStart(2, '0'));
        updateSelectedDateTime(val, minutes);
      }
    }
  };
  
  // Aktualisiere die Minuten
  const updateMinutes = (e) => {
    const val = e.target.value;
    if (/^\d{0,2}$/.test(val)) {
      const numVal = parseInt(val, 10);
      if (!isNaN(numVal) && numVal >= 0 && numVal <= 59) {
        setMinutes(val.padStart(2, '0'));
        updateSelectedDateTime(hours, val);
      }
    }
  };
  
  // Aktualisiere das ausgewählte Datum/Uhrzeit
  const updateSelectedDateTime = (h, m) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(parseInt(h, 10));
    newDate.setMinutes(parseInt(m, 10));
    
    setSelectedDate(newDate);
    updateDisplayValues(newDate);
  };
  
  // Bestätige die Auswahl und schließe den Picker
  const confirmSelection = () => {
    // Formatiere das Datum im ISO-Format für QR-Codes
    const isoValue = formatDateToISO(selectedDate);
    onChange(isoValue);
    setShowPicker(false);
  };
  
  // Einige vordefinierte Uhrzeiten für schnelle Auswahl
  const quickTimeOptions = [
    { label: '9:00', hours: '09', minutes: '00' },
    { label: '12:00', hours: '12', minutes: '00' },
    { label: '15:00', hours: '15', minutes: '00' },
    { label: '18:00', hours: '18', minutes: '00' },
    { label: '20:00', hours: '20', minutes: '00' }
  ];
  
  // Schnell-Auswahl einer Zeit
  const selectQuickTime = (option) => {
    setHours(option.hours);
    setMinutes(option.minutes);
    updateSelectedDateTime(option.hours, option.minutes);
  };
  
  // Handler für direkte Texteingabe
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Versuche, die Eingabe zu interpretieren
    try {
      // Typische deutsche Datums-/Zeitformate: "23.04.2025 um 14:30" oder "23.04.2025 14:30"
      // Extrahiere Datum und Zeit
      const dateTimePattern = /(\d{1,2})[.,/](\d{1,2})[.,/](\d{4})(?:\s+(?:um\s+)?(\d{1,2})[:.h](\d{1,2}))?/;
      const match = inputValue.match(dateTimePattern);
      
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // 0-indexiert
        const year = parseInt(match[3], 10);
        const hour = match[4] ? parseInt(match[4], 10) : 0;
        const minute = match[5] ? parseInt(match[5], 10) : 0;
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
            day > 0 && day <= 31 && month >= 0 && month <= 11 && 
            year >= 1000 && year <= 9999 &&
            hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
          
          const date = new Date(year, month, day, hour, minute);
          
          // Überprüfe auf gültiges Datum (berücksichtigt z.B. 30./31. je nach Monat)
          if (!isNaN(date.getTime())) {
            setSelectedDate(date);
            setCurrentMonth(month);
            setCurrentYear(year);
            setHours(hour.toString().padStart(2, '0'));
            setMinutes(minute.toString().padStart(2, '0'));
            
            // Aktualisiere ISO-Wert
            const isoValue = formatDateToISO(date);
            onChange(isoValue);
          }
        }
      }
    } catch (error) {
      console.error("Fehler beim Parsen der Datumseingabe:", error);
      // Bei Fehler Eingabe nicht zurücksetzen, um Benutzerkorrektur zu ermöglichen
    }
  };
  
  // Hilfsfunktionen für Datums-/Zeitformate
  
  // ISO-Wert zu Datumsobjekt
  const parseISOToDate = (isoString) => {
    try {
      if (!isoString) return new Date();
      
      // Typisches Format: 20250325T100000Z
      const cleanStr = isoString.replace('Z', '');
      
      const year = parseInt(cleanStr.substring(0, 4), 10);
      const month = parseInt(cleanStr.substring(4, 6), 10) - 1; // 0-indexiert
      const day = parseInt(cleanStr.substring(6, 8), 10);
      const hour = parseInt(cleanStr.substring(9, 11), 10) || 0;
      const minute = parseInt(cleanStr.substring(11, 13), 10) || 0;
      
      return new Date(year, month, day, hour, minute);
    } catch (error) {
      console.error("Fehler beim Parsen des ISO-Datums:", error);
      return new Date();
    }
  };
  
  // Datumsobjekt zu ISO-Format
  const formatDateToISO = (date) => {
    try {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}${month}${day}T${hour}${minute}00Z`;
    } catch (error) {
      console.error("Fehler beim Formatieren zum ISO-Format:", error);
      return '';
    }
  };
  
  // Wochentage für Kalender-Kopf
  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  
  // Monatsnamen
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  
  const monthNamesShort = [
    'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
  ];
  
  // Prüfe, ob ein Datum der heutige Tag ist
  const isToday = (day) => {
    const today = new Date();
    return day.day === today.getDate() && 
           day.month === today.getMonth() && 
           day.year === today.getFullYear();
  };
  
  // Prüfe, ob ein Datum ausgewählt ist
  const isSelected = (day) => {
    return day.day === selectedDate.getDate() && 
           day.month === selectedDate.getMonth() && 
           day.year === selectedDate.getFullYear();
  };
  
  return (
    <div className="space-y-2 relative">
      {label && <Label htmlFor={id} className="dark:text-gray-200">{label}</Label>}
      
      {/* Anzeige des ausgewählten Datums - jetzt als editierbares Eingabefeld */}
      <div 
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 dark:border-gray-600",
          className
        )}
      >
        <div className="relative flex-1 flex items-center">
          <Input
            ref={inputRef}
            type="text"
            id={id}
            value={displayValue}
            onChange={handleInputChange}
            placeholder="TT.MM.JJJJ HH:MM"
            className="h-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            onFocus={() => setShowPicker(true)}
          />
          <button
            type="button"
            className="absolute right-3 hover:text-primary dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setShowPicker(!showPicker)}
          >
            <Calendar className="h-4 w-4 opacity-50" />
          </button>
        </div>
        {displayValue && (
          <button
            type="button"
            className="px-3 border-l border-input dark:border-gray-600 flex items-center hover:bg-muted dark:hover:bg-gray-700"
            onClick={() => {
              onChange('');
              setDisplayValue('');
            }}
          >
            <X className="h-4 w-4 dark:text-gray-400" />
          </button>
        )}
      </div>
      
      {helperText && (
        <p className="text-xs text-muted-foreground dark:text-gray-400">{helperText}</p>
      )}
      
      {/* Datum/Zeit-Picker Dropdown */}
      {showPicker && (
        <div 
          ref={pickerRef}
          className="absolute z-50 mt-1 bg-background dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg p-3 w-full sm:w-96"
        >
          {/* Tabs */}
          <div className="flex border-b dark:border-gray-700 mb-2">
            <button
              type="button"
              className={`pb-2 px-3 ${activeTab === 'date' ? 'border-b-2 border-primary font-medium dark:text-white' : 'text-muted-foreground dark:text-gray-400'}`}
              onClick={() => setActiveTab('date')}
            >
              Datum
            </button>
            <button
              type="button"
              className={`pb-2 px-3 ${activeTab === 'time' ? 'border-b-2 border-primary font-medium dark:text-white' : 'text-muted-foreground dark:text-gray-400'}`}
              onClick={() => setActiveTab('time')}
            >
              Uhrzeit
            </button>
          </div>
          
          {/* Datum-Tab */}
          {activeTab === 'date' && (
            <div>
              {/* Tagesansicht */}
              {viewMode === 'days' && (
                <>
                  {/* Monat/Jahr-Navigation */}
                  <div className="flex justify-between items-center mb-2">
                    <button
                      type="button"
                      className="p-1 hover:bg-muted dark:hover:bg-gray-700 dark:text-gray-300 rounded-md"
                      onClick={() => changeMonth(-1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {/* Klickbarer Monat/Jahr-Header */}
                    <button
                      type="button"
                      className="font-medium hover:text-primary dark:text-gray-200 dark:hover:text-primary"
                      onClick={() => setViewMode('months')}
                    >
                      {monthNames[currentMonth]} {currentYear}
                    </button>
                    
                    <button
                      type="button"
                      className="p-1 hover:bg-muted dark:hover:bg-gray-700 dark:text-gray-300 rounded-md"
                      onClick={() => changeMonth(1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Wochentage */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {weekdays.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-muted-foreground dark:text-gray-400 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Kalendertage */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        className={cn(
                          "w-full aspect-square flex items-center justify-center text-sm rounded-full hover:bg-muted dark:hover:bg-gray-700",
                          !day.isCurrentMonth && "text-muted-foreground opacity-50",
                          isToday(day) && "border border-primary",
                          isSelected(day) && "bg-primary text-primary-foreground dark:text-white hover:bg-primary/90",
                          day.isCurrentMonth && !isSelected(day) && "dark:text-gray-300"
                        )}
                        onClick={() => selectDay(day)}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {/* Monatsansicht */}
              {viewMode === 'months' && (
                <>
                  {/* Jahr-Navigation */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      className="p-1 hover:bg-muted dark:hover:bg-gray-700 dark:text-gray-300 rounded-md"
                      onClick={() => changeYear(-1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {/* Klickbares Jahr */}
                    <button
                      type="button"
                      className="font-medium hover:text-primary dark:text-gray-200 dark:hover:text-primary"
                      onClick={() => setViewMode('years')}
                    >
                      {currentYear}
                    </button>
                    
                    <button
                      type="button"
                      className="p-1 hover:bg-muted dark:hover:bg-gray-700 dark:text-gray-300 rounded-md"
                      onClick={() => changeYear(1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Monate */}
                  <div className="grid grid-cols-3 gap-2">
                    {monthNamesShort.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        className={cn(
                          "py-2 rounded-md hover:bg-muted dark:hover:bg-gray-700 text-sm dark:text-gray-300",
                          currentMonth === index && selectedDate.getFullYear() === currentYear && "bg-primary text-primary-foreground dark:text-white hover:bg-primary/90"
                        )}
                        onClick={() => selectMonth(index)}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {/* Jahresansicht */}
              {viewMode === 'years' && (
                <>
                  {/* Jahresbereich-Navigation */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      className="p-1 hover:bg-muted dark:hover:bg-gray-700 dark:text-gray-300 rounded-md"
                      onClick={() => setCurrentYear(currentYear - 12)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <span className="font-medium dark:text-gray-200">
                      {yearsRange[0]} - {yearsRange[yearsRange.length - 1]}
                    </span>
                    
                    <button
                      type="button"
                      className="p-1 hover:bg-muted dark:hover:bg-gray-700 dark:text-gray-300 rounded-md"
                      onClick={() => setCurrentYear(currentYear + 12)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Jahre */}
                  <div className="grid grid-cols-3 gap-2">
                    {yearsRange.map((year) => (
                      <button
                        key={year}
                        type="button"
                        className={cn(
                          "py-2 rounded-md hover:bg-muted dark:hover:bg-gray-700 text-sm dark:text-gray-300",
                          selectedDate.getFullYear() === year && "bg-primary text-primary-foreground dark:text-white hover:bg-primary/90"
                        )}
                        onClick={() => selectYear(year)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Zeit-Tab */}
          {activeTab === 'time' && (
            <div>
              {/* Stunden/Minuten-Einstellung */}
              <div className="flex justify-center items-center mb-4 space-x-2">
                <Input
                  type="text"
                  value={hours}
                  onChange={updateHours}
                  className="w-16 text-center text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  maxLength={2}
                />
                <span className="text-xl dark:text-gray-200">:</span>
                <Input
                  type="text"
                  value={minutes}
                  onChange={updateMinutes}
                  className="w-16 text-center text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  maxLength={2}
                />
              </div>
              
              {/* Schnellauswahl für häufige Zeiten */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {quickTimeOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    className={cn(
                      "p-2 text-sm border rounded-md hover:bg-muted dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300",
                      hours === option.hours && minutes === option.minutes && "bg-primary text-primary-foreground dark:text-white hover:bg-primary/90"
                    )}
                    onClick={() => selectQuickTime(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Aktionsschaltflächen */}
          <div className="flex justify-end space-x-2 mt-4 pt-2 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPicker(false)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Abbrechen
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={confirmSelection}
            >
              Übernehmen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { CustomDateTimePicker };
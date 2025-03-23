import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Label } from './label';
import { Button } from './button';
import { Input } from './input';
import { Calendar, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Enhanced CustomDateTimePicker
 * 
 * A customized date and time picker with:
 * - Hierarchical month/year navigation
 * - Direct text input for date and time
 * - Fully customized design
 * - Support for dark mode
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Element ID
 * @param {string} props.label - Label text
 * @param {string} props.value - ISO-8601 value (e.g. '20250325T100000Z')
 * @param {Function} props.onChange - Callback on changes
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.helperText - Helper text below the input
 */
const CustomDateTimePicker = ({ 
  id, 
  label, 
  value, 
  onChange, 
  className, 
  helperText
}) => {
  // Formatted values for display
  const [displayValue, setDisplayValue] = useState('');
  
  // States for dropdown display
  const [showPicker, setShowPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('date'); // 'date' or 'time'
  const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'
  
  // Refs for handling clicks outside
  const pickerRef = useRef(null);
  const inputRef = useRef(null);
  
  // Current date and time objects
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Calendar state
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [yearsRange, setYearsRange] = useState([]);
  
  // Time values
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  
  // German formatting for date/time
  const dateFormatter = new Intl.DateTimeFormat('en-US', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  });
  
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Convert ISO string to date/time on load
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
      // Set default values for today
      const today = new Date();
      setSelectedDate(today);
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
      setDisplayValue('');
    }
  }, [value]);
  
  // Update calendar when month or year changes
  useEffect(() => {
    switch (viewMode) {
      case 'days':
        generateCalendarDays(currentYear, currentMonth);
        break;
      case 'months':
        // No additional action needed for month view
        break;
      case 'years':
        generateYearsRange(currentYear);
        break;
    }
  }, [currentMonth, currentYear, viewMode]);
  
  // Handler for clicks outside the picker
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
  
  // Format date for display
  const updateDisplayValues = (date) => {
    if (!date) {
      setDisplayValue('');
      return;
    }
    
    const dateStr = dateFormatter.format(date);
    const timeStr = timeFormatter.format(date);
    
    setDisplayValue(`${dateStr} at ${timeStr}`);
    setHours(date.getHours().toString().padStart(2, '0'));
    setMinutes(date.getMinutes().toString().padStart(2, '0'));
  };
  
  // Generate years for year view
  const generateYearsRange = (centerYear) => {
    const startYear = centerYear - 6;
    const years = [];
    
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }
    
    setYearsRange(years);
  };
  
  // Generate calendar days for the displayed month
  const generateCalendarDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay() || 7; // 0 = Sunday, we want 7
    
    const days = [];
    
    // Days from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i > 0; i--) {
      days.push({
        day: prevMonthDays - i + 1,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }
    
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
      });
    }
    
    // Days of next month
    const remainingDays = 42 - days.length; // 6 weeks * 7 days = 42
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
  
  // Navigate through years and months
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
  
  // Select a day
  const selectDay = (day) => {
    const newDate = new Date(day.year, day.month, day.day);
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    
    setSelectedDate(newDate);
    updateDisplayValues(newDate);
    // Stay in the picker but switch to time selection
    setActiveTab('time');
  };
  
  // Select a month
  const selectMonth = (month) => {
    setCurrentMonth(month);
    setViewMode('days');
  };
  
  // Select a year
  const selectYear = (year) => {
    setCurrentYear(year);
    setViewMode('months');
  };
  
  // Update hours
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
  
  // Update minutes
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
  
  // Update the selected date/time
  const updateSelectedDateTime = (h, m) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(parseInt(h, 10));
    newDate.setMinutes(parseInt(m, 10));
    
    setSelectedDate(newDate);
    updateDisplayValues(newDate);
  };
  
  // Confirm selection and close picker
  const confirmSelection = () => {
    // Format date in ISO format for QR codes
    const isoValue = formatDateToISO(selectedDate);
    onChange(isoValue);
    setShowPicker(false);
  };
  
  // Some predefined times for quick selection
  const quickTimeOptions = [
    { label: '9:00', hours: '09', minutes: '00' },
    { label: '12:00', hours: '12', minutes: '00' },
    { label: '15:00', hours: '15', minutes: '00' },
    { label: '18:00', hours: '18', minutes: '00' },
    { label: '20:00', hours: '20', minutes: '00' }
  ];
  
  // Quick select a time
  const selectQuickTime = (option) => {
    setHours(option.hours);
    setMinutes(option.minutes);
    updateSelectedDateTime(option.hours, option.minutes);
  };
  
  // Handler for direct text input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Try to interpret the input
    try {
      // Typical date/time formats: "04/23/2025 at 2:30 PM" or "04/23/2025 14:30"
      // Extract date and time
      const dateTimePattern = /(\d{1,2})[.,/](\d{1,2})[.,/](\d{4})(?:\s+(?:at\s+)?(\d{1,2})[:.h](\d{1,2}))?/;
      const match = inputValue.match(dateTimePattern);
      
      if (match) {
        const month = parseInt(match[1], 10) - 1; // 0-indexed
        const day = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);
        const hour = match[4] ? parseInt(match[4], 10) : 0;
        const minute = match[5] ? parseInt(match[5], 10) : 0;
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
            day > 0 && day <= 31 && month >= 0 && month <= 11 && 
            year >= 1000 && year <= 9999 &&
            hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
          
          const date = new Date(year, month, day, hour, minute);
          
          // Check for valid date (considers e.g. 30/31 depending on month)
          if (!isNaN(date.getTime())) {
            setSelectedDate(date);
            setCurrentMonth(month);
            setCurrentYear(year);
            setHours(hour.toString().padStart(2, '0'));
            setMinutes(minute.toString().padStart(2, '0'));
            
            // Update ISO value
            const isoValue = formatDateToISO(date);
            onChange(isoValue);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing date input:", error);
      // Don't reset input on error to allow user correction
    }
  };
  
  // Helper functions for date/time formats
  
  // ISO value to date object
  const parseISOToDate = (isoString) => {
    try {
      if (!isoString) return new Date();
      
      // Typical format: 20250325T100000Z
      const cleanStr = isoString.replace('Z', '');
      
      const year = parseInt(cleanStr.substring(0, 4), 10);
      const month = parseInt(cleanStr.substring(4, 6), 10) - 1; // 0-indexed
      const day = parseInt(cleanStr.substring(6, 8), 10);
      const hour = parseInt(cleanStr.substring(9, 11), 10) || 0;
      const minute = parseInt(cleanStr.substring(11, 13), 10) || 0;
      
      return new Date(year, month, day, hour, minute);
    } catch (error) {
      console.error("Error parsing ISO date:", error);
      return new Date();
    }
  };
  
  // Date object to ISO format
  const formatDateToISO = (date) => {
    try {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}${month}${day}T${hour}${minute}00Z`;
    } catch (error) {
      console.error("Error formatting to ISO format:", error);
      return '';
    }
  };
  
  // Weekdays for calendar header
  const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Check if a date is today
  const isToday = (day) => {
    const today = new Date();
    return day.day === today.getDate() && 
           day.month === today.getMonth() && 
           day.year === today.getFullYear();
  };
  
  // Check if a date is selected
  const isSelected = (day) => {
    return day.day === selectedDate.getDate() && 
           day.month === selectedDate.getMonth() && 
           day.year === selectedDate.getFullYear();
  };
  
  return (
    <div className="space-y-2 relative">
      {label && <Label htmlFor={id} className="dark:text-gray-200">{label}</Label>}
      
      {/* Display selected date - now as editable input field */}
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
            placeholder="MM/DD/YYYY HH:MM"
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
      
      {/* Date/Time picker dropdown */}
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
              Date
            </button>
            <button
              type="button"
              className={`pb-2 px-3 ${activeTab === 'time' ? 'border-b-2 border-primary font-medium dark:text-white' : 'text-muted-foreground dark:text-gray-400'}`}
              onClick={() => setActiveTab('time')}
            >
              Time
            </button>
          </div>
          
          {/* Date tab */}
          {activeTab === 'date' && (
            <div>
              {/* Day view */}
              {viewMode === 'days' && (
                <>
                  {/* Month/Year navigation */}
                  <div className="flex justify-between items-center mb-2">
                    <button
                      type="button"
                      className="p-1 hover:bg-muted dark:hover:bg-gray-700 dark:text-gray-300 rounded-md"
                      onClick={() => changeMonth(-1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {/* Clickable month/year header */}
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
                  
                  {/* Weekdays */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {weekdays.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-muted-foreground dark:text-gray-400 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar days */}
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
              
              {/* Month view */}
              {viewMode === 'months' && (
                <>
                  {/* Year navigation */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      className="p-1 hover:bg-muted dark:hover:bg-gray-700 dark:text-gray-300 rounded-md"
                      onClick={() => changeYear(-1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {/* Clickable year */}
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
                  
                  {/* Months */}
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
              
              {/* Year view */}
              {viewMode === 'years' && (
                <>
                  {/* Year range navigation */}
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
                  
                  {/* Years */}
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
          
          {/* Time tab */}
          {activeTab === 'time' && (
            <div>
              {/* Hours/minutes setting */}
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
              
              {/* Quick selection for common times */}
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
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-2 mt-4 pt-2 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPicker(false)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={confirmSelection}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { CustomDateTimePicker };


import React, { useState, useEffect, useRef } from "react";
import calendarImage from '../assets/home1.jpg'; 
import bgImage from '../assets/tullu.png';


const ETH_MONTHS = [
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Pagumen",
];


const ETH_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


const SCHOOL_EVENTS = {
  
  September: {
    2: "Class assignment",
    5: "Start 1st semester regular class",
    12: "Broadcasting courses start"
  },
 
};


const HOLIDAYS = {
  September: {
    1: "New Year",
    17: 'Finding of the cross',
    
  },

};


const DETAILS = {
  // School Events Details
  "Class assignment": " On September 02/2018 Class assignment of students will be conducted. rights and obligations of students will be discussed",
  "Start 1st semester regular class": "On September 05/2018 The first day of 1st semester regular classes starts.",
  "Broadcasting courses start": "On September 12/2018 1st semester radio broadcasting courses will begin",
  "First Semester Final Exam": "Comprehensive examination marking the end of the first semester.",
  "Second Semester Begins": "Start of the second semester of the academic year.",
  "National Exam": "National level examination for primary and secondary school students.",
  
  // Holidays Details
  "New Year": "The beginning of a new year in the Ethiopian calendar and comes after the long rainy season, symbolizing renewal, hope, and a fresh start month.",
  "Finding of the cross": "The Finding of the Cross, known in Ethiopia as Meskel, is an important religious and cultural holiday celebrated by Ethiopians",
  "Epiphany": "Commemoration of the baptism of Jesus Christ (Timket).",
  "Mawlid": "Birthday of the Prophet Muhammad.",
  "Adwa Victory Day": "Commemorates the Ethiopian victory at the Battle of Adwa in 1896.",
  "Easter Friday": "Good Friday - commemorates the crucifixion of Jesus Christ.",
  "Easter Sunday": "Celebration of the resurrection of Jesus Christ.",
  "Labour Day": "International Workers' Day celebrating labor and workers.",
  "Downfall of Derg": "Commemorates the overthrow of the Derg regime in 1991.",
  "Eid al-Fitr": "Islamic holiday marking the end of Ramadan.",
  "Eid al-Adha": "Islamic Festival of Sacrifice.",
  
  // Regular School Day
  "School": "Regular school day with normal classes and activities.",
  "Weekend": "Saturday and Sunday - no school activities."
};


function isLeapYearEC(year) {
  return year % 4 === 3;
}

// Days in Ethiopian month
function daysInMonth(month, year) {
  if (month === "Pagumen") return isLeapYearEC(year) ? 6 : 5;
  return 30;
}


 

function getMeskerem1Weekday(year) {
  const referenceYear = 2018;
  const referenceWeekdayIndex = 3; // Thursday

  let dayShift = 0;

  if (year > referenceYear) {
    for (let y = referenceYear; y < year; y++) {
      dayShift += isLeapYearEC(y) ? 366 : 365;
    }
  } else if (year < referenceYear) {
    for (let y = year; y < referenceYear; y++) {
      dayShift -= isLeapYearEC(y) ? 366 : 365;
    }
  }

  return ((referenceWeekdayIndex + dayShift) % 7 + 7) % 7;
}

function getMonthStartWeekday(monthIndex, year) {
  let daysPassed = 0;
  for (let i = 0; i < monthIndex; i++) {
    daysPassed += daysInMonth(ETH_MONTHS[i], year);
  }
  return (getMeskerem1Weekday(year) + daysPassed) % 7;
}

// Check if day is weekend (Saturday or Sunday)
function isWeekend(weekdayIndex) {
  return weekdayIndex === 5 || weekdayIndex === 6; // Sat=5, Sun=6
}

// ===============================
// COMPONENT
// ===============================
export default function EthiopianSchoolCalendar() {
  const [currentYear, setCurrentYear] = useState(2018);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const calendarRef = useRef(null);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Month navigation
  const handlePrevMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentMonthIndex === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonthIndex(ETH_MONTHS.length - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentMonthIndex === ETH_MONTHS.length - 1) {
      setCurrentYear(currentYear + 1);
      setCurrentMonthIndex(0);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  // Show details popup
  const handleDayClick = (day, schoolEvent, holiday, isWeekendDay) => {
    const title = schoolEvent || holiday || (isWeekendDay ? "Weekend" : "School");
    const description = DETAILS[title] || "No additional information available.";
    const type = schoolEvent ? "school-event" : holiday ? "holiday" : isWeekendDay ? "weekend" : "school";
    
    setDetailData({
      day,
      month: ETH_MONTHS[currentMonthIndex],
      year: currentYear,
      title,
      description,
      type
    });
    setShowDetails(true);
  };

  // Close details popup
  const handleCloseDetails = () => {
    setShowDetails(false);
    setDetailData(null);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    const touchStartX = e.touches[0].clientX;
    
    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const swipeThreshold = 50;
      
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left - go to next month
        if (currentMonthIndex === ETH_MONTHS.length - 1) {
          setCurrentYear(currentYear + 1);
          setCurrentMonthIndex(0);
        } else {
          setCurrentMonthIndex(currentMonthIndex + 1);
        }
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right - go to previous month
        if (currentMonthIndex === 0) {
          setCurrentYear(currentYear - 1);
          setCurrentMonthIndex(ETH_MONTHS.length - 1);
        } else {
          setCurrentMonthIndex(currentMonthIndex - 1);
        }
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  const currentMonth = ETH_MONTHS[currentMonthIndex];
  const totalDays = daysInMonth(currentMonth, currentYear);
  const startWeekday = getMonthStartWeekday(currentMonthIndex, currentYear);

  // Responsive values
  const dayCellHeight = isMobile ? "min-h-[55px]" : "min-h-[70px]";
  const dayFontSize = isMobile ? "text-sm" : "text-base";
  const eventFontSize = isMobile ? "text-[8px]" : "text-[10px]";
  const schoolFontSize = isMobile ? "text-[7px]" : "text-[9px]";
  const headerFontSize = isMobile ? "text-lg" : "text-2xl";
  const monthHeaderFontSize = isMobile ? "text-base" : "text-xl";
  const buttonPadding = isMobile ? "px-3 py-2 text-sm" : "px-4 py-2 text-base";
  const buttonHeight = isMobile ? "h-10" : "h-12";
  const gridGap = isMobile ? "gap-0.5" : "gap-1";
  const cellPadding = isMobile ? "p-0.5" : "p-1";

  return (
    <>
     <div className="relative w-full h-[340px] md:h-92 overflow-hidden">
        {/* Background Image Container */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // Ensure image covers the area on all devices
            width: '100%',
            height: '100%',
            minHeight: '260px'
          }}
        >
          {/* Mobile-specific fallback */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden bg-fixed"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-900/70 to-purple-900/80 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl mt-8 md:mt-16 font-extrabold mb-3 tracking-wide drop-shadow-lg">
              Tuludimtu School Calendar
            </h1>

            {/* Underline */}
            <div className="mx-auto mb-4 h-1 w-32 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>

            <p className="text-lg md:text-2xl text-gray-200 drop-shadow">
              Academic Year 2018
            </p>
          </div>
        </div>
      </div>

      <div 
        className="min-h-screen bg-gray-50 p-2 md:p-4 select-none"
        onTouchStart={handleTouchStart}
        ref={calendarRef}
      >

    

        <div className="max-w-full md:max-w-4xl mx-auto mt-24">
          {/* Header with Month Navigation */}


          
          <div className="text-center mb-3 md:mb-4">
            <h1 className={`${headerFontSize} font-bold text-gray-800 mb-2`}>
              {/* {isMobile ? "Ethiopian Calendar" : "Ethiopian Academic Calendar"} */}
            </h1>
            
            <div className="flex items-center justify-between mb-3 md:mb-4 px-2 md:px-0">
              <button
                onClick={handlePrevMonth}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                className={`${buttonPadding} ${buttonHeight} bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 font-semibold transition-colors flex items-center justify-center min-w-[80px] md:min-w-[100px] touch-manipulation`}
              >
                <span className="flex items-center">
                  <span className="mr-1">←</span>
                  {!isMobile && "Prev"}
                </span>
              </button>
              
              <div className="text-center mx-2 flex-1">
                <div className={`${monthHeaderFontSize} font-bold text-blue-800`}>
                  {currentMonth}
                </div>
                <div className="text-xs md:text-sm text-gray-600 mt-0.5">
                  {currentYear} E.C.
                </div>
              </div>
              
              <button
                onClick={handleNextMonth}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                className={`${buttonPadding} ${buttonHeight} bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 font-semibold transition-colors flex items-center justify-center min-w-[80px] md:min-w-[100px] touch-manipulation`}
              >
                <span className="flex items-center">
                  {!isMobile && "Next"}
                  <span className="ml-1">→</span>
                </span>
              </button>
            </div>
            
            {/* Swipe hint for mobile */}
            {/* {isMobile && (
              <div className="text-xs text-gray-500 mb-2">
                Swipe left/right to navigate • Click/Tap day for details
              </div>
            )} */}
          </div>

          {/* Single Calendar - Responsive */}
          <div className="border border-blue-200 rounded-lg bg-white shadow overflow-hidden">
            {/* Month Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-2 md:py-3">
              <div className="text-center">
                <h2 className={`${isMobile ? "text-sm" : "text-lg"} font-bold mb-0.5`}>{currentMonth}</h2>
                <p className={`${isMobile ? "text-xs" : "text-sm"} opacity-90`}>
                  {isMobile ? `Year ${currentYear}` : `Ethiopian Calendar • Year ${currentYear} E.C.`}
                </p>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className={`grid grid-cols-7 ${isMobile ? "text-xs" : "text-sm"} font-bold text-gray-700 bg-gray-100 py-1`}>
              {ETH_WEEKDAYS.map((day) => (
                <div key={day} className="text-center py-0.5">
                  {isMobile ? day.charAt(0) : day}
                </div>
              ))}
            </div>

            {/* Calendar Grid - Responsive */}
            <div className={`grid grid-cols-7 ${gridGap} p-1 md:p-2`}>
              {/* Empty cells for alignment */}
              {Array.from({ length: startWeekday }).map((_, i) => (
                <div key={`empty-${i}`} className={dayCellHeight} />
              ))}

              {/* Days */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const weekdayIndex = (startWeekday + i) % 7;
                const isWeekendDay = isWeekend(weekdayIndex);
                const schoolEvent = SCHOOL_EVENTS[currentMonth]?.[day];
                const holiday = HOLIDAYS[currentMonth]?.[day];
                const isHoliday = holiday && !schoolEvent;
                const showSchoolText = !schoolEvent && !holiday && !isWeekendDay;

                return (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day, schoolEvent, holiday, isWeekendDay)}
                    className={`${dayCellHeight} border rounded ${cellPadding} cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 ${
                      isWeekendDay
                        ? "bg-gray-100 border-gray-300"
                        : isHoliday
                        ? "bg-red-50 border-red-300"
                        : schoolEvent
                        ? "bg-yellow-100 border-yellow-400"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      {/* Day Number */}
                      <div className="text-center mb-0.5">
                        <span className={`${dayFontSize} font-bold ${
                          isWeekendDay ? "text-gray-500" :
                          isHoliday ? "text-red-700" : 
                          schoolEvent ? "text-blue-800" : 
                          "text-gray-800"
                        }`}>
                          {day}
                        </span>
                      </div>
                      
                      {/* Events or School Text */}
                      <div className="flex-grow flex flex-col justify-center overflow-hidden">
                        {schoolEvent &&  (
                          <div className="mb-0.5">
                            <div className={`${eventFontSize} font-semibold text-blue-900 leading-tight truncate`}>
                              {isMobile ? schoolEvent.split(' ')[0] : schoolEvent }
                              
                            </div>
                          </div>
                        )}
                        
                        {holiday && (
                          <div>
                            <div className={`${eventFontSize} font-semibold text-red-700 leading-tight truncate`}>
                              {isMobile ? holiday.split(' ')[0] : holiday}
                            </div>
                          </div>
                        )}

                        {/* Show "School" text for regular school days */}


                        {/* {showSchoolText && (
                          <div className="text-center">
                            <div className={`${schoolFontSize} font-medium text-green-700 bg-green-50 py-0.5 rounded`}>
                              School
                            </div>
                          </div>
                        )} */}

                        {/* Show "Weekend" text for weekends without events */}
                        {isWeekendDay && !schoolEvent && !holiday && (
                          <div className="text-center">
                            <div className={`${schoolFontSize} font-medium text-gray-500`}>
                              {isMobile ? "End" : "Weekend"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Month Info Footer */}
            <div className="bg-gray-50 border-t border-gray-200 py-1 px-2">
              <div className="flex justify-between items-center text-gray-600 text-xs">
                <div className="truncate">
                  <span className="font-semibold">M:</span> {isMobile ? currentMonth.substring(0, 3) : currentMonth}
                </div>
                <div>
                  <span className="font-semibold">Y:</span> {currentYear}
                </div>
                <div>
                  <span className="font-semibold">D:</span> {totalDays}
                </div>
              </div>
            </div>
          </div>

          {/* Legend - Responsive */}
          <div className="mt-3 p-2 bg-white rounded-lg border border-gray-300">
            
            <div className="grid grid-cols-2 gap-1 md:gap-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-400 rounded-sm"></div>
                <div>
                  <span className="text-xs font-semibold text-gray-700">
                    Event
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-50 border border-red-300 rounded-sm"></div>
                <div>
                  <span className="text-xs font-semibold text-gray-700">Holiday</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-50 border border-green-300 rounded-sm"></div>
                <div>
                  <span className="text-xs font-semibold text-gray-700">
                    School
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm"></div>
                <div>
                  <span className="text-xs font-semibold text-gray-700">
                    End
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Info */}
          <div className="mt-2 text-center text-gray-500 text-xs">
            <p>
              {isMobile ? 
                `${currentMonth.substring(0, 3)} • ${currentYear} E.C. • ${currentMonthIndex + 1}/${ETH_MONTHS.length}` : 
                `${currentMonth} • Year ${currentYear} E.C. • Page ${currentMonthIndex + 1} of ${ETH_MONTHS.length}`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Details Popup Modal */}
      {showDetails && detailData && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseDetails}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden ${
              detailData.type === 'school-event' ? 'border-l-4 border-yellow-400' :
              detailData.type === 'holiday' ? 'border-l-4 border-red-400' :
              detailData.type === 'weekend' ? 'border-l-4 border-gray-400' :
              'border-l-4 border-green-400'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`
              px-6 py-4 text-white
              ${detailData.type === 'school-event' ? 'bg-yellow-500' :
                detailData.type === 'holiday' ? 'bg-red-500' :
                detailData.type === 'weekend' ? 'bg-gray-500' :
                'bg-green-500'}
            `}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {detailData.title}
                </h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 text-sm opacity-90">
                {detailData.month} {detailData.day}, {detailData.year} E.C.
                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                  {detailData.type === 'school-event' ? 'School Event' :
                   detailData.type === 'holiday' ? 'Holiday' :
                   detailData.type === 'weekend' ? 'Weekend' : 'School Day'}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {detailData.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Date Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Ethiopian Date</div>
                    <div className="font-semibold">{detailData.month} {detailData.day}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Year</div>
                    <div className="font-semibold">{detailData.year} E.C.</div>
                  </div>
                </div>
              </div>

              {detailData.type === 'school-event' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <div className="text-blue-500 mr-2">📚</div>
                    <div>
                      <div className="font-semibold text-blue-700">Academic Note</div>
                      <div className="text-sm text-blue-600">This is an official school event affecting academic schedules.</div>
                    </div>
                  </div>
                </div>
              )}

              {detailData.type === 'holiday' && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="text-red-500 mr-2">🎉</div>
                    <div>
                      <div className="font-semibold text-red-700">Holiday Note</div>
                      <div className="text-sm text-red-600">No school activities on this day.</div>
                    </div>
                  </div>
                </div>
              )}

              {detailData.type === 'school' && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="text-green-500 mr-2">🏫</div>
                    <div>
                      <div className="font-semibold text-green-700">Regular School Day</div>
                      <div className="text-sm text-green-600">Normal classes and activities as per schedule.</div>
                    </div>
                  </div>
                </div>
              )}

              {detailData.type === 'weekend' && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="text-gray-500 mr-2">🌅</div>
                    <div>
                      <div className="font-semibold text-gray-700">Weekend</div>
                      <div className="text-sm text-gray-600">Regular weekend - no school activities.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={handleCloseDetails}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
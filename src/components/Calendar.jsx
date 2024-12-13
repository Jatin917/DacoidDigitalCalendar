/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  PlusCircle 
} from 'lucide-react';
import {
  format,
} from "date-fns";
import { addDays, addMonths, endOfMonth, endOfWeek, isSameDay, isWeekend, startOfMonth, startOfWeek, subMonths } from "../utils/dateUtils";
import AddEventModal from "./addEventModal";

const Calendar = ({events, onAddEvent, selectedDate, setSelectedDate}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear()); 
  const [isEventModalOpen, setEventModal] = useState(false);
  
  const isSameMonth = (date) =>{
      return (
          date && date.getMonth() === currentMonth.getMonth()
      )
  }
  
  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const downloadAsJSON = (data) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "exported-events.json";
    link.click();
  
    URL.revokeObjectURL(url);
  };
  const exportEvents = () =>{
    const currMonth = currentMonth.getMonth();
    const dates = Object.keys(events);
    console.log(dates);
    const exportedArr = [];
    dates.forEach((e)=>{
      const date = new Date(e);
      console.log(date.getMonth(), e);
      if(date.getMonth()===currMonth){
        exportedArr.push({date:e, events:events[e]});
      }
    });
    console.log(exportedArr);
    downloadAsJSON(exportedArr);
  }
  const generateCalendar = () => {
    const dates = [];
    let day = startDate;

    while (day <= endDate) {
      dates.push(day);
      day = addDays(day, 1);
    }

    return dates;
  };
  const handlePrevMonth = () => {
    if (selectedDate) {
      if (selectedDate.getDate() === 1) {
        const prevMonthLastDay = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          0
        );
        setSelectedDate(prevMonthLastDay);
      }
      else setSelectedDate(null);
    }
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    if (selectedDate) {
      const lastDayOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      ).getDate();
  
      if (selectedDate.getDate() === lastDayOfMonth) {
        const nextMonthFirstDay = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          1
        );
        setSelectedDate(nextMonthFirstDay);
      }
      else setSelectedDate(null);
    }
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  const goToFunction = (month, year) => {
    const d = new Date();
    d.setFullYear(year, month-1);
    setCurrentMonth(d);
    setIsModalOpen(false);
  }

  const calendarDays = generateCalendar();

  const handleEventModalOpen = () =>{
    setEventModal(true);
  }

  const onCloseEventModal = () =>{
    setEventModal(false);
  }

  const getDayColor = (date) => {
    if (isSameDay(date, new Date())) return 'bg-blue-500 text-white font-bold';
    if (isSameDay(date, selectedDate)) return 'bg-blue-400 text-white';
    if (!isSameMonth(date)) return 'text-gray-400';
    if (isWeekend(date)) return 'bg-blue-50';
    return 'bg-white hover:bg-blue-50';
  };

  return (
    <div className="p-2 sm:p-4 w-full md:w-3/4 lg:w-2/3 xl:w-3/4 h-screen mx-auto bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 pb-2 sm:pb-4 border-b">
        <Button 
          onClick={handlePrevMonth} 
          variant="outline" 
          className="p-1 sm:p-2 rounded-full hover:bg-blue-50"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </Button>
        
        {/* Month and Year */}
        <div className="text-center flex flex-col items-center">
          <div 
            className="flex items-center cursor-pointer hover:bg-blue-50 p-1 sm:p-2 rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <CalendarIcon className="mr-1 sm:mr-2 text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-base sm:text-xl font-bold text-blue-800">
              {format(currentMonth, "MMMM yyyy")}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {`Current Date: ${format(new Date(), "MMMM dd, yyyy")}`}
          </p>
        </div>
  
        <div className="flex space-x-1 sm:space-x-2">
          <Button 
            onClick={exportEvents} 
            variant="outline" 
            className="p-1 sm:p-2 rounded-full hover:bg-blue-50 text-xs sm:text-sm"
          >
            Export
          </Button>
          <Button 
            onClick={handleNextMonth} 
            variant="outline" 
            className="p-1 sm:p-2 rounded-full hover:bg-blue-50"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </Button>
        </div>
      </div>
  
      {/* Calendar Grid */}
      <div className="flex-grow grid grid-cols-7 gap-1 sm:gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div 
            key={day} 
            className="text-center font-bold text-blue-800 bg-blue-50 rounded-md p-1 sm:p-2 text-xs sm:text-base"
          >
            {day}
          </div>
        ))}
  
        {/* Render Calendar Days */}
        {calendarDays.map((date, index) => (
          <div
            key={index}
            className={`
              p-1 sm:p-2 
              text-center 
              rounded-lg 
              cursor-pointer 
              transition-all 
              duration-200 
              flex 
              items-center 
              justify-center 
              text-xs sm:text-base
              ${getDayColor(date)}
            `}
            onClick={() => {
              handleDateClick(date);
            }}
            onDoubleClick={()=>handleEventModalOpen()}
          >
            <span className="relative">
              {format(date, "d")}
              {isSameDay(date, new Date()) && (
                <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-1 h-1 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Add Event Button */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
        <Button 
          onClick={handleEventModalOpen}
          className="bg-blue-500 text-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-blue-600"
        >
          <PlusCircle className="w-4 h-4 sm:w-6 sm:h-6" />
        </Button>
      </div>

      {/* Existing Modals - No changes */}
      {/* Modal for selecting new month and year */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-72 sm:w-96 border border-blue-100">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-blue-800 flex items-center">
              <CalendarIcon className="mr-1 sm:mr-2 text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
              Go to Month & Year
            </h3>
            <div className="flex mb-2 sm:mb-4 space-x-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="p-1 sm:p-2 border rounded-md w-1/2 text-blue-800 text-xs sm:text-base focus:ring-2 focus:ring-blue-200"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {format(new Date(2024, month - 1), "MMMM")}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="p-1 sm:p-2 border rounded-md w-1/2 text-blue-800 text-xs sm:text-base focus:ring-2 focus:ring-blue-200"
                min="1900"
                max="2100"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => goToFunction(selectedMonth, selectedYear)}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs sm:text-base"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding an event */}
      {isEventModalOpen && (
        <AddEventModal 
          onClose={onCloseEventModal} 
          onAddEvent={onAddEvent} 
        />
      )}
    </div>
  );
};
export default Calendar

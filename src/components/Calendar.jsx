
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import {
  format,
} from "date-fns";
import { addDays, addMonths, endOfMonth, endOfWeek, isSameDay, isWeekend, startOfMonth, startOfWeek, subMonths } from "../utils/dateUtils";
import AddEventModal from "./addEventModal";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
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
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
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

  const onAddEvent = (event) =>{
    const date = selectedDate.toDateString();
    event = {...event, date};
    let events = JSON.parse(localStorage.getItem("events")) || {};
    if(!events[date]){
      events[date] = [];
    }
    events[date].push(event);
    localStorage.setItem("events", JSON.stringify(events));
  }

  useEffect(() => {
    setSelectedDate(null);
  }, [currentMonth, setSelectedDate]);

  return (
    <div className="p-4 w-3/4 h-screen mx-auto border rounded-md flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevMonth} variant="outline">
          Prev
        </Button>
        
        {/* Month and Year */}
        <div className="text-center">
          <a 
            className="text-lg font-bold text-white cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            {format(currentMonth, "MMMM yyyy")}
          </a>
          {/* Current date */}
          <p className="text-sm text-gray-500">{`Current Date: ${format(new Date(), "MMMM dd, yyyy")}`}</p>
        </div>
  
        <Button onClick={handleNextMonth} variant="outline">
          Next
        </Button>
      </div>
  
      {/* Calendar Grid */}
      <div className="flex-grow grid grid-cols-7 gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className={`text-center font-bold w-full h-full rounded-md ${day === 'Sun' || day === 'Sat' ? 'bg-blue-200' : 'bg-gray-50'}`}>
            {day}
          </div>
        ))}
  
        {/* Render Calendar Days */}
        {/* You will need to calculate `calendarDays` here. */}
        {calendarDays.map((date, index) => (
          <div
            key={index}
            className={`p-2 text-center rounded cursor-pointer hover:bg-gray-200 flex-grow
              ${isSameDay(date, new Date()) && 'bg-blue-200'}
              ${isSameDay(date, selectedDate) && 'bg-blue-500 text-black'}
              ${isWeekend(date) ? 'bg-blue-200' : 'bg-white'}
              ${!isSameMonth(date) && 'opacity-[0.65]'}
              ${date.toDateString() === new Date().toDateString() && 'bg-blue-400'}`}
            onClick={() =>(
              handleDateClick(date),
              handleEventModalOpen()
            )
            }
          >
            {format(date, "d")}
          </div>
        ))}
      </div>

      {/* Modal for selecting new month and year */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Go to Month & Year</h3>
            <div className="flex mb-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="p-2 border rounded-md w-1/2"
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
                className="p-2 border rounded-md w-1/2 ml-2"
                min="1900"
                max="2100"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => goToFunction(selectedMonth, selectedYear)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for adding an event */}
      {
        isEventModalOpen && <AddEventModal onClose={onCloseEventModal} onAddEvent={onAddEvent} />
      }
    </div>
  );
};

// export default Calendar;
export default Calendar;

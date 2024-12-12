
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import {
  format,
} from "date-fns";
import { addDays, addMonths, endOfMonth, endOfWeek, isSameDay, isWeekend, startOfMonth, startOfWeek, subMonths } from "../utils/dateUtils";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
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

  const calendarDays = generateCalendar();

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
        <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
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
  
        {calendarDays.map((date, index) => (
          <div
            key={index}
            className={cn(
              "p-2 text-center rounded cursor-pointer hover:bg-gray-200 flex-grow",
              isSameDay(date, new Date()) && "bg-blue-200",
              isSameDay(date, selectedDate) && "bg-blue-500 text-black",
              isWeekend(date) ? "bg-blue-200" : "bg-white",
              !isSameMonth(date) && "opacity-[0.65]"
            )}
            onClick={() => handleDateClick(date)}
          >
            {format(date, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

// export default Calendar;
export default Calendar;

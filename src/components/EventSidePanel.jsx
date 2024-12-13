/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { getEventColor } from "../utils/dateUtils";
import { Clock, CalendarClock, MoreHorizontal, Search } from 'lucide-react';
import EventList from "./EventList";

const EventSidePanel = ({selectedDate, events, setEvents }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextEvent, setNextEvent] = useState(null);
  const [searchItem, setSearchItem] = useState('');

  const updateEventList = () => {
    if (searchItem.trim() === '') {
      return events;
    }
    const filtered = Object.keys(events).reduce((acc, date) => {
      const filteredEvents = events[date].filter(event =>
        event.eventName.toLowerCase().includes(searchItem.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchItem.toLowerCase()))
      );
      if (filteredEvents.length > 0) {
        acc[date] = filteredEvents;
      }
      return acc;
    }, {});
    return filtered;
  };
  
  const [filteredEvents, setFilteredEvents] = useState(events);
  
  useEffect(() => {
    const intervalid = setTimeout(()=>{
      const updatedEvents = updateEventList();
      console.log(updatedEvents);
      setFilteredEvents(updatedEvents);
    }, 300);
    return ()=>clearInterval(intervalid);
  }, [searchItem, events]); 
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Helper function to create a full date from time strings
  const getFullDateTime = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
  };

  // Memoize sorted events
  const sortedEvents = useMemo(() => {
    if (!selectedDate || !filteredEvents[selectedDate.toDateString()]) return [];
    return [...filteredEvents[selectedDate.toDateString()]].sort((a, b) => {
      const startA = getFullDateTime(selectedDate, a.startTime);
      const startB = getFullDateTime(selectedDate, b.startTime);
      return startA - startB;
    });
  }, [selectedDate, filteredEvents]);
  // console.log(events);
  // Find the next event
  useEffect(() => {
    const upcomingEvent = sortedEvents.find(event => getFullDateTime(selectedDate, event.startTime) > currentTime);
    setNextEvent(upcomingEvent);
  }, [currentTime, sortedEvents, selectedDate, events]);

  // Helper to format time
  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Calculate event duration in hours and minutes
  const calculateDuration = (startTime, endTime) => {
    const start = getFullDateTime(selectedDate, startTime);
    const end = getFullDateTime(selectedDate, endTime);
    const diffInMs = end - start;
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="side-panel p-2 sm:p-4 w-full md:w-1/4 bg-white shadow-lg border-l border-gray-200 min-h-screen relative">
      {/* Search Bar */}
      <div className="search-bar mb-2 sm:mb-4 relative">
        <input 
          onChange={(e)=>setSearchItem(e.target.value)}
          type="text" 
          placeholder="Search events..." 
          className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1 sm:py-2 text-xs sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      </div>

      {/* Up next section */}
      <div className="up-next mb-4 sm:mb-6 border-b pb-2 sm:pb-4">
        {nextEvent ? (
          <div className="bg-blue-500 text-white rounded-lg p-2 sm:p-4 shadow-md">
            <div className="flex items-center mb-1 sm:mb-2">
              <CalendarClock className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-xs sm:text-base">Up Next</span>
            </div>
            <div className="event-details">
              <p className="text-xs sm:text-sm opacity-90">
                {formatTime(getFullDateTime(selectedDate, nextEvent.startTime))}
              </p>
              <p className="text-sm sm:text-lg font-bold truncate">
                {nextEvent.eventName}
              </p>
              <p className="text-xs sm:text-sm opacity-80">
                Duration: {calculateDuration(nextEvent.startTime, nextEvent.endTime)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center text-xs sm:text-base">No upcoming events</p>
        )}
      </div>
      
      <EventList 
        setEvents={setEvents} 
        events={events} 
        sortedEvents={sortedEvents} 
        selectedDate={selectedDate} 
        currentTime={currentTime} 
        formatTime={formatTime} 
        getFullDateTime={getFullDateTime} 
        calculateDuration={calculateDuration} 
      />
    </div>
  );
};

export default EventSidePanel;

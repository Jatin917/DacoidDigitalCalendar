/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { getEventColor } from "../utils/dateUtils";
import { Clock, CalendarClock, MoreHorizontal } from 'lucide-react';
import EventList from "./EventList";

const EventSidePanel = ({selectedDate, events, setEvents }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextEvent, setNextEvent] = useState(null);

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Helper function to create a full date from time strings
  const getFullDateTime = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
  };

  // Memoize sorted events
  const sortedEvents = useMemo(() => {
    if (!selectedDate || !events[selectedDate.toDateString()]) return [];
    return [...events[selectedDate.toDateString()]].sort((a, b) => {
      const startA = getFullDateTime(selectedDate, a.startTime);
      const startB = getFullDateTime(selectedDate, b.startTime);
      return startA - startB;
    });
  }, [selectedDate, events]);
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
    <div className="side-panel p-4 w-1/4 bg-white shadow-lg border-l border-gray-200 min-h-screen relative">
      {/* Up next section */}
      <div className="up-next mb-6 border-b pb-4">
        {nextEvent ? (
          <div className="bg-blue-500 text-white rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-2">
              <CalendarClock className="mr-2" />
              <span className="font-semibold">Up Next</span>
            </div>
            <div className="event-details">
              <p className="text-sm opacity-90">{formatTime(getFullDateTime(selectedDate, nextEvent.startTime))}</p>
              <p className="text-lg font-bold">{nextEvent.eventName}</p>
              <p className="text-sm opacity-80">
                Duration: {calculateDuration(nextEvent.startTime, nextEvent.endTime)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No upcoming events</p>
        )}
      </div>

      {/* List of events
      <div className="event-list space-y-4">
  {sortedEvents.map((event, index) => {
    const eventTime = getFullDateTime(selectedDate, event.startTime);
    const isUpcoming = eventTime > currentTime;
    const eventColor = getEventColor(isUpcoming);

    return (
      index < 4 && (
        <div
          key={index}
          className={`
            event-item 
            ${eventColor.background} 
            ${eventColor.text} 
            ${eventColor.border}
            border 
            rounded-lg 
            p-3 
            transition-all 
            hover:shadow-md
            hover:scale-[1.02]
          `}
        >
          <div className="flex justify-between items-center">
            <div className="event-time font-medium">{formatTime(eventTime)}</div>
            {isUpcoming && (
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                Upcoming
              </span>
            )}
          </div>
          <div className="event-name text-lg font-semibold mt-1">{event.eventName}</div>
          <div className="event-duration text-sm opacity-70 mt-1">
            {calculateDuration(event.startTime, event.endTime)}
          </div>
        </div>
      )
    );
  })}

  {sortedEvents.length > 4 && (
    <div 
      className="
        more-events-indicator 
        flex 
        items-center 
        justify-between 
        bg-blue-50 
        text-blue-800 
        p-3 
        rounded-lg 
        cursor-pointer 
        hover:bg-blue-100 
        transition-colors
      "
    >
      <div className="flex items-center">
        <MoreHorizontal className="mr-2" />
        <span className="font-medium">
          {sortedEvents.length - 4} More Event{sortedEvents.length - 4 !== 1 ? 's' : ''}
        </span>
      </div>
      <span className="text-sm opacity-70">View All</span>
    </div>
  )}
</div> */}
<EventList setEvents={setEvents} events={events} sortedEvents={sortedEvents} selectedDate={selectedDate} currentTime={currentTime} formatTime={formatTime} getFullDateTime={getFullDateTime} calculateDuration={calculateDuration} />
    </div>
  );
};

export default EventSidePanel;

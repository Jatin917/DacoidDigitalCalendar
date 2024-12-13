/* eslint-disable react/prop-types */
import React, { useDebugValue, useEffect, useState } from 'react';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';

const EventList = ({setEvents, events, sortedEvents, selectedDate, currentTime, formatTime, getFullDateTime, calculateDuration }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getEventColor = (isUpcoming) => {
    const colorVariants = [
      { background: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
      { background: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
      { background: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
      { background: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
      { background: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
    ];

    return isUpcoming
      ? colorVariants[Math.floor(Math.random() * colorVariants.length)]
      : { background: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' };
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDeleteEvent = (event) => {
  
    const date = event.date;
    const updatedEvents = {...events};
    if (updatedEvents[date]) {
      const updatedEventsOfDate = events[date].filter(
        (e) =>
          e.eventName !== event.eventName ||
          e.startTime !== event.startTime ||
          e.endTime !== event.endTime
      );
  
      if (updatedEventsOfDate.length === 0) {
        delete updatedEvents[date];
      }
      else{
        updatedEvents[date] = updatedEventsOfDate;
      }
      console.log(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } else {
      console.log("No events found for the specified date.");
    }
  };
  

  const handleSaveEvent = (updatedEvent) => {
    const date = updatedEvent.date;
    const id = updatedEvent.id;
    const updatedEvents = {...events};
    if (updatedEvents[date]) {
      updatedEvents[date] = updatedEvents[date].map((event) =>
        event.id === id ? updatedEvent : event
      );
    }
    setEvents(updatedEvents);
    console.log('Saving updated event:', updatedEvents);
    setIsEditModalOpen(false);
  };

  return (
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
                cursor-pointer
              `}
              onClick={() => handleEditEvent(event)}
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

      {isEditModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Event</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                    handleDeleteEvent(selectedEvent)
                    setIsEditModalOpen(false)
                }
                }
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Event Name"
              value={selectedEvent.eventName}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, eventName: e.target.value })
              }
            />
            <div className="flex space-x-4 mb-4">
              <input
                type="time"
                className="w-1/2 p-2 border rounded-md"
                placeholder="Start Time"
                value={selectedEvent.startTime}
                readOnly
              />
              <input
                type="time"
                className="w-1/2 p-2 border rounded-md"
                placeholder="End Time"
                value={selectedEvent.endTime}
                readOnly
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => handleSaveEvent(selectedEvent)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
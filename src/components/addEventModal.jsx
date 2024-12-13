/* eslint-disable react/prop-types */
import { useState } from 'react';


const AddEventModal = ({ onClose, onAddEvent }) => {
  const [eventName, setEventName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // console.log(new Date(endTime), new Date(startTime));
    const s = new Date();
    const e = new Date();
    s.setHours(startTime.split(':')[0]);
    s.setMinutes(startTime.split(':')[1]);
    e.setHours(endTime.split(':')[0]);
    e.setMinutes(endTime.split(':')[1]);
    if(e<=s){
        alert('End time must be greater than or equal to start time!');
        return;
    }
    if (eventName && startTime && endTime) {
      const newEvent = {
        eventName,
        startTime,
        endTime,
        description,
      };
      onAddEvent({...newEvent, id:Date.now()});
      resetForm();
      onClose();
    } else {
      alert("Event name, start time, and end time are required!");
    }
  };

  const resetForm = () => {
    setEventName('');
    setStartTime('');
    setEndTime('');
    setDescription('');
  };
  return (
    (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-xl font-bold mb-4">Add Event</h3>
          
          {/* Event Name */}
          <div className="mb-4">
            <label htmlFor="eventName" className="block text-sm font-semibold mb-2">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="p-2 border rounded-md w-full"
              placeholder="Enter event name"
            />
          </div>

          {/* Start Time */}
          <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-semibold mb-2">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
          </div>

          {/* End Time */}
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-semibold mb-2">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              min={startTime + ":00"}
              onChange={(e) => setEndTime(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
          </div>

          {/* Description (Optional) */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-semibold mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border rounded-md w-full"
              placeholder="Enter event description"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddEventModal;

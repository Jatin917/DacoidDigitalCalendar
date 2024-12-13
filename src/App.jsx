import { useEffect, useMemo, useState } from "react";
import Calendar from "./components/Calendar"
import EventSidePanel from "./components/EventSidePanel"

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  useEffect(()=>{
    const storedEvents = JSON.parse(localStorage.getItem("events")) || {};
    setEvents(storedEvents);
  },[selectedDate])
  const onAddEvent = (event) => {
    const date = selectedDate.toDateString();
    event = { ...event, date };
    const updatedEvents = { ...events };
    if (!updatedEvents[date]) {
      updatedEvents[date] = [];
    }
    updatedEvents[date].push(event);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };
  return (
<div className="bg-black flex flex-col md:flex-row min-h-screen">
      <Calendar 
        className="w-full md:w-3/4 lg:w-2/3 xl:w-3/4" 
        events={events} 
        onAddEvent={onAddEvent} 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
      />
      <EventSidePanel 
        className="w-full md:w-1/4 lg:w-1/3 xl:w-1/4" 
        setEvents={setEvents} 
        events={events} 
        onAddEvent={onAddEvent} 
        selectedDate={selectedDate} 
      />
    </div>
  )
}

export default App
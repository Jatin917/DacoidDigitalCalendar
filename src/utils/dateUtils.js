import { useRecoilValue } from "recoil";
import { monthAtom } from "../state/atoms/dateAtom";

export const startOfMonth = (date) =>{
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDate;
  }
export const endOfMonth = (date) => {
    const endDate = new Date(date.getFullYear(), date.getMonth()+1, 0);
    return endDate;
  }
export const startOfWeek = (date, weekStartsOn = 1) => {
    const dayOfWeek = date.getDay();
    const diff = (dayOfWeek - weekStartsOn + 7) % 7;
    const startOfWeekVal = new Date(date);
    startOfWeekVal.setDate(date.getDate() - diff); // Subtract the difference
    startOfWeekVal.setHours(0, 0, 0, 0); // Reset time to midnight
    const val = new Date(startOfWeekVal);
    return val;
}
export   const endOfWeek = (date, weekStartsOn = 1) => {
    const dayOfWeek = date.getDay();
    const diff = (7- dayOfWeek + weekStartsOn) % 7;
    const endOfWeekVal = new Date(date);
    endOfWeekVal.setDate(date.getDate() + diff - 1); // Subtract the difference
    endOfWeekVal.setHours(23, 59, 59, 999); // Reset time to midnight
    const val = new Date(endOfWeekVal);
    return val;
}
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
export const addMonths = (date, months) => {
  const d = new Date(date);
  const currentMonth = d.getMonth();
  d.setMonth(currentMonth + months);
  return d;
};
export const subMonths = (date, months) => {
  const d = new Date(date);
  const currentMonth = d.getMonth();
  d.setMonth(currentMonth - months);
  return d;
};
export const isSameDay = (date1, date2) => {
  return (
    date1 && date2 && date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
export const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  export const getEventColor = (isUpcoming) => {
    const colorVariants = [
      { background: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
      { background: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
      { background: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
      { background: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
      { background: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' }
    ];
  
    return isUpcoming 
      ? colorVariants[Math.floor(Math.random() * colorVariants.length)] 
      : { background: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' };
  };
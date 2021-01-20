import React from "react";
import DayListItem from "./DayListItem";

export default function DayList({days, setDays}) {
  const day = days.map(day=> {
    return (
      <ul>
        <DayListItem 
          name={day.name} 
          spots={day.spots} 
          selected={day.name === day}
          setDay={setDays}  />
        </ul>
    );
  });

  return day;
}


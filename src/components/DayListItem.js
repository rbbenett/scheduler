import React from "react";
import "components/DayListItem.scss";

let classNames = require('classnames');

export default function DayListItem({name, days, setDays, spots, selected}) { 
  let dayListItemClass = classNames('day-list__item', {
    'day-list__item--selected': selected,
    'day-list__item--full': spots === 0
  });
  
  const formatSpots = (spots) => {
    if (spots === 0) {
      return 'no spots remaining'
    } else if (spots === 1) {
      return '1 spot remaining'
    } else {
      return `${spots} spots remaining`
    }
  }

  return (
    <li className={dayListItemClass} onClick={() => setDays(name)}>
      <h2 className="text--regular">{name}</h2>
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
};


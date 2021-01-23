import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  function getDay(day) {
    const daysOfTheWeek = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4
    }
    return daysOfTheWeek[day]
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      setState(prev => (
        {...prev, 
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
        }
      ));
    });
  }, []);

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const dayOfTheWeek = getDay(state.day)
    let daySpots = {
      ...state.days[dayOfTheWeek],
      spots: state.days[dayOfTheWeek]
    }
    if (!state.appointments[id].interview) {
      daySpots = {
        ...state.days[dayOfTheWeek],
        spots: state.days[dayOfTheWeek].spots - 1
      }
    } else {
      daySpots = {
        ...state.days[dayOfTheWeek],
        spots: state.days[dayOfTheWeek.spots]
      }
    }

    let spots = state.days
    spots[dayOfTheWeek] = daySpots;
    return axios.put(
      `/api/appointments/${id}`,
      { interview }
      )
      .then(() => {
        setState({
          ...state,
          appointments,
          spots
        });
    })
  };

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const dayOfTheWeek = getDay(state.day)
    const daySpots = {
      ...state.days[dayOfTheWeek],
      spots: state.days[dayOfTheWeek].spots + 1
      }
      let spots = state.days
      spots[dayOfTheWeek] = daySpots;
    

    return axios.delete(
      `/api/appointments/${id}`,
      { interview }
      )
      .then(() => {
        setState({
          ...state,
          appointments,
          spots
        });
      })
  };
  
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
} 
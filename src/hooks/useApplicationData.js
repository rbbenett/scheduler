import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "../reducer/application.js";

export default function useApplicationData() {
    const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  
  const setDay = day => dispatch({ type: SET_DAY, value: day });

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
    let daysURL = '/api/days';
    let appointmentsURL = '/api/appointments';
    let interviewersURL = '/api/interviewers';

    const promiseDays = axios.get(daysURL);
    const promiseApps = axios.get(appointmentsURL);
    const promiseInts = axios.get(interviewersURL);

    Promise.all(
     [promiseDays, promiseApps, promiseInts]
    ).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, value: all });
    });
  }, []);

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
    return axios
    .put(`/api/appointments/${id}`,
      { interview }
      )
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
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
    

    return axios
    .delete(`/api/appointments/${id}`,
      { interview }
      )
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
      })
  };
  
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
} 
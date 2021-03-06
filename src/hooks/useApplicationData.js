import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  UPDATE_SPOTS,
} from "../reducers/application.js";


export default function useApplicationData() {
    const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  
  const setDay = day => dispatch({ type: SET_DAY, value: day });

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

   return axios
    .put(`/api/appointments/${id}`,
      { interview }
      )
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
    })
      .then(() => {
        dispatch({type: UPDATE_SPOTS});
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

    return axios
      .delete(`/api/appointments/${id}`,
        { interview }
        )
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
      })
      .then(() => {
        dispatch({type: UPDATE_SPOTS});
      })
    };
  
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
} 
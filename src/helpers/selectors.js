export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.filter((appointment) => {
    return appointment.name === day
  })
  if(filteredDays.length === 0) {
    return [];
  }
  const appointments = filteredDays[0].appointments.map((appointment) => {
    return state.appointments[appointment]
  })
  return appointments;
}

export function getInterviewersForDay(state, day) {
  const filteredDays = state.days.filter((eachDay) => {
    return eachDay.name === day;
  })
  if(filteredDays.length === 0) {
    return [];
  }
  const interviewers = filteredDays[0].interviewers.map((interviewerId) => {
    return state.interviewers[interviewerId]
  })
  return interviewers;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const newInterview = {
    ...interview,
    interviewer: {...state.interviewers[interview.interviewer] }
  }
  return newInterview;
}
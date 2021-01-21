export function getAppointmentsForDay(state, day) {
  if (!state.days) {
    return [];
  }
  const filteredDays = state.days.filter(appointment => appointment.name === day)[0];
  if(!filteredDays) {
    return [];
  }
  let result = [];
  for (let id of filteredDays.appointments) {
    const appointmentObj = state.appointments[id];
    result.push(appointmentObj);
  }
  return result;
}

export function getInterview(state, interview) {
  
  if (interview) {
    return {
      student: interview.student,
      interviewer: {
        id: interview.interviewer,
        name: state.interviewers[interview.interviewer].name,
        avatar: state.interviewers[interview.interviewer].avatar
      }
    }
  } else {
    return null;
  }
}
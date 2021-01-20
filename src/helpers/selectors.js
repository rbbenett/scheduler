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
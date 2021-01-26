import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";



export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const EDIT = "EDIT"
  const CONFIRM = "CONFIRM";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function add() {
    transition(CREATE);
  }

  function cancel() {
    back();
  }

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING, true);
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
  }

  function destroy() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={add} />}
        {mode === CREATE && (
          <Form
          interviewers={props.interviewers}
          onCancel={cancel}
          onSave={save}
          />
        )}
        {mode === EDIT && (
          <Form
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onSave={save}
            onCancel={() => back()}
          />
        )}
        {mode === SAVING && (
          <Status
            message="Saving"
          />
        )}
        {mode === DELETING && (
          <Status
            message="Deleting"
          />
        )}
        {mode === CONFIRM && (
          <Confirm
            message="Are you sure you would like to delete?"
            onCancel={() => back()}
            onConfirm={destroy}
          />
        )}
        {mode === SHOW && props.interview && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onEdit={() => transition(EDIT)}
            onDelete={() => transition(CONFIRM)}
          />
        )}
        {mode === ERROR_DELETE && (
          <Error 
          message="Error Deleting Appointment" 
          onClose={() => back()} 
          />
        )}
        {mode === ERROR_SAVE && (
          <Error
          message="Error Saving Appointment" 
          onClose={() => back()} />
           )}
    </article>
  )
   
 
}
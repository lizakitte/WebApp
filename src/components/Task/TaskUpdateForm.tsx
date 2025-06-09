import { useNavigate, useParams } from "react-router";
import { featureTasksPath } from "../../lib/pathsNames";
import { FormEvent, useContext, useState } from "react";
import TaskContext from "../../lib/TaskContext";
import FeatureContext from "../../lib/FeatureContext";
import { database, Task, User } from "../../lib/data";
import Modal from "../Modal";

export default function TaskUpdateForm() { // want to do another view with button for updating to enable the inputs
  const navigate = useNavigate();
  const params = useParams();
  
  const { dispatch: taskDispatch } = useContext(TaskContext);
  const { state: featureState } = useContext(FeatureContext);

  const nameInputName = "taskName";
  const descrInputName = "taskDescription";
  const priorityInputName = "taskPriority";
  const timeInputName = "taskEstimatedTime";
  const ownerInputName = "taskOwner";
  const addInputName = "taskAddDate";
  const startInputName = "taskStartDate";
  const endInputName = "taskEndDate";
  const stateInputName = "taskState";

  const task = database.getById<Task>("task", params.taskId!)!;

  const [styleSuccess, setStyleSuccess] = useState<React.CSSProperties>({});

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement | undefined;
    if (!form) {
      throw new Error("Why is the form undefined?");
    }

    const formElements = form.elements;

    const fnameInput = formElements.namedItem(
      nameInputName
    ) as HTMLInputElement | null;
    if (!fnameInput) {
      throw new Error("An input is null!");
    }

    const descrInput = formElements.namedItem(
      descrInputName
    ) as HTMLInputElement | null;
    if (!descrInput) {
      throw new Error("An input is null!");
    }

    const priorityInput = formElements.namedItem(
      priorityInputName
    ) as HTMLInputElement;

    const timeInput = formElements.namedItem(
      timeInputName
    ) as HTMLInputElement | null;
    if (!timeInput) {
      throw new Error("An input is null!");
    }

    const ownerInput = formElements.namedItem(
      ownerInputName
    ) as HTMLInputElement;

    const startDateInput = formElements.namedItem(startInputName) as HTMLInputElement;
    const endDateInput = formElements.namedItem(endInputName) as HTMLInputElement;
    const stateInput = formElements.namedItem(stateInputName) as HTMLInputElement;


    const fname = fnameInput.value;
    const descr = descrInput.value;
    const priority = priorityInput.value;
    const estTime = timeInput.value;
    let ownerId: string | undefined = ownerInput.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const state = stateInput.value;

    if (priority !== "low" && priority !== "medium" && priority !== "high") {
      throw new Error("Unknown priority!");
    }

     if (state !== "todo" && state !== "doing" && state !== "done") {
      throw new Error("Unknown feature state!");
    }

    if (ownerId === "Not chosen") {
      ownerId = undefined;
    }

    if (featureState.activeFeature === null) {
      throw new Error("No feature is chosen as active!");
    }

    taskDispatch({
      id: task.id,
      type: "updateTask",
      name: fname,
      description: descr,
      priority,
      featureId: featureState.activeFeature.id,
      estimatedTime: estTime,
      state,
      startDate,
      endDate,
      ownerId,
    });
    setStyleSuccess({ display: "block" });
  }

  return (
    <div>
      <a onClick={() => navigate(featureTasksPath)}>
        &larr; Back to all tasks
      </a>
      <form onSubmit={onSubmit}>
        <h1>Update Task</h1>
        <label htmlFor={nameInputName}>Name</label>
        <input
          type="text"
          id={nameInputName}
          name={nameInputName}
          value={task.name}
        ></input>
        <label htmlFor={descrInputName}>Description</label>
        <textarea
          id={descrInputName}
          name={descrInputName}
          value={task.description}
        ></textarea>
        <label htmlFor={priorityInputName}>Priority</label>
        <select id={priorityInputName} name={priorityInputName}>
          <option selected={task.priority === "low"} value="low">Low</option>
          <option selected={task.priority === "medium"} value="medium">Medium</option>
          <option selected={task.priority === "high"} value="high">High</option>
        </select>
        <label htmlFor={timeInputName}>Estimated time</label>
        <input
          type="text"
          id={timeInputName}
          name={timeInputName}
          value={task.estimatedTime}
        ></input>
        <label htmlFor={stateInputName}>State</label>
        <select id={stateInputName} name={stateInputName}>
          <option selected={task.state === "todo"} value="todo">To do</option>
          <option selected={task.state === "doing"} value="doing">In progress</option>
          <option selected={task.state === "done"} value="done">Done</option>
        </select>
        <label htmlFor={ownerInputName}>Assignee</label>
        <select id={ownerInputName} name={ownerInputName}>
          <option selected={task.ownerId === undefined} value="Not chosen">Not chosen</option>
          {database
            .getAll<User>("user")
            .filter(
              (user) => user.role === "developer" || user.role === "devops"
            )
            .map((user) => {
              return (
                <option selected={task.ownerId === user.id} value={user.id}>
                  {user.name} {user.surname}
                </option>
              );
            })}
        </select>
        <label htmlFor={addInputName}>Add date</label>
        <input disabled
          type="date"
          id={addInputName}
          name={addInputName}
          value={task.addDate}
        ></input>
        <label htmlFor={startInputName}>Start date</label>
        <input 
          type="date"
          id={startInputName}
          name={startInputName}
          value={task.startDate}
          min={task.addDate}
        ></input>
        <label htmlFor={endInputName}>End date</label>
        <input 
          type="date"
          id={endInputName}
          name={endInputName}
          value={task.endDate}
          min={task.startDate}
        ></input>
        <input
          type="submit"
          className="formSubmitButton"
          value="Submit"
        ></input>
      </form>
      <Modal
        style={styleSuccess}
        setStyle={setStyleSuccess}
        onClose={() => navigate(featureTasksPath)}
      >
        <p>Update was successfull!</p>
      </Modal>
    </div>
  );
}
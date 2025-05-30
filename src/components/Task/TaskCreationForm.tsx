import { useNavigate } from "react-router";
import { featureTasksPath } from "../../lib/pathsNames";
import { FormEvent, useContext } from "react";
import TaskContext from "../../lib/TaskContext";
import FeatureContext from "../../lib/FeatureContext";

export default function TaskCreationForm() {
  const navigate = useNavigate();
  const { dispatch: taskDispatch } = useContext(TaskContext);
  const { state: featureState } = useContext(FeatureContext);

  const nameInputName = "taskName";
  const descrInputName = "taskDescription";
  const priorityInputName = "taskPriority";
  const timeInputName = "taskEstimatedTime";

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

    const fname = fnameInput.value;
    const descr = descrInput.value;
    const priority = priorityInput.value;
    const estTime = timeInput.value;

    if (priority !== "low" && priority !== "medium" && priority !== "high") {
      throw new Error("Unknown priority!");
    }

    if (featureState.activeFeature === null) {
      throw new Error("No feature is chosen as active!");
    }

    taskDispatch({
      type: "createTask",
      name: fname,
      description: descr,
      priority,
      featureId: featureState.activeFeature.id,
      estimatedTime: estTime,
      state: "todo",
      addDate: new Date().toISOString().split("T")[0],
      ownerId: undefined,
    });

    fnameInput.value = "";
    descrInput.value = "";
    timeInput.value = "";
    navigate(featureTasksPath);
  }

  return (
    <div>
      <a onClick={() => navigate(featureTasksPath)}>
        &larr; Back to all tasks
      </a>
      <form onSubmit={onSubmit}>
        <h1>Create New Task</h1>
        <label htmlFor={nameInputName}>Name</label>
        <input
          type="text"
          id={nameInputName}
          name={nameInputName}
          placeholder="Enter name..."
        ></input>
        <label htmlFor={descrInputName}>Description</label>
        <textarea
          id={descrInputName}
          name={descrInputName}
          placeholder="Enter description..."
        ></textarea>
        <label htmlFor={priorityInputName}>Priority</label>
        <select id={priorityInputName} name={priorityInputName}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label htmlFor={timeInputName}>Estimated time</label>
        <input
          type="text"
          id={timeInputName}
          name={timeInputName}
          placeholder="Enter estimated time..."
        ></input>
        <input
          type="submit"
          className="formSubmitButton"
          value="Submit"
        ></input>
      </form>
    </div>
  );
}

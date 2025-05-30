import { useNavigate, useParams } from "react-router";
import { featureTasksPath, updateTaskPathId } from "../../lib/pathsNames";
import { database, Task, User } from "../../lib/data";

export default function TaskUpdateForm() {
  const navigate = useNavigate();
  const params = useParams();

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

  return (
    <div>
      <a onClick={() => navigate(featureTasksPath)}>
        &larr; Back to all tasks
      </a>
      <button
        className="formUpdateButton"
        onClick={() => navigate(`${updateTaskPathId}/${task.id}`)}
      >
        Update
      </button>
      <form>
        <h1>Task details</h1>
        <label htmlFor={nameInputName}>Name</label>
        <input
          disabled
          type="text"
          id={nameInputName}
          name={nameInputName}
          value={task.name}
        ></input>
        <label htmlFor={descrInputName}>Description</label>
        <textarea disabled
          id={descrInputName}
          name={descrInputName}
          value={task.description}
        ></textarea>
        <label htmlFor={priorityInputName}>Priority</label>
        <select disabled id={priorityInputName} name={priorityInputName}>
          <option selected={task.priority === "low"} value="low">
            Low
          </option>
          <option selected={task.priority === "medium"} value="medium">
            Medium
          </option>
          <option selected={task.priority === "high"} value="high">
            High
          </option>
        </select>
        <label htmlFor={timeInputName}>Estimated time</label>
        <input disabled
          type="text"
          id={timeInputName}
          name={timeInputName}
          value={task.estimatedTime}
        ></input>
        <label htmlFor={stateInputName}>State</label>
        <select disabled id={stateInputName} name={stateInputName}>
          <option selected={task.state === "todo"} value="todo">
            To do
          </option>
          <option selected={task.state === "doing"} value="doing">
            In progress
          </option>
          <option selected={task.state === "done"} value="done">
            Done
          </option>
        </select>
        <label htmlFor={ownerInputName}>Assignee</label>
        <select disabled id={ownerInputName} name={ownerInputName}>
          <option selected={task.ownerId === undefined} value="Not chosen">
            Not chosen
          </option>
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
        <input
          disabled
          type="date"
          id={addInputName}
          name={addInputName}
          value={task.addDate}
        ></input>
        <label htmlFor={startInputName}>Start date</label>
        <input disabled
          type="date"
          id={startInputName}
          name={startInputName}
          value={task.startDate}
          min={task.addDate}
        ></input>
        <label htmlFor={endInputName}>End date</label>
        <input disabled
          type="date"
          id={endInputName}
          name={endInputName}
          value={task.endDate}
          min={task.startDate}
        ></input>
      </form>
    </div>
  );
}

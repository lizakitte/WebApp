import { useNavigate, useParams } from "react-router-dom";
import { database, Feature, Task, User } from "../../lib/data";
import { updateTaskDisabledPathId } from "../../lib/pathsNames";
import { useState } from "react";
import TaskDeleteForm from "./TaskDeleteForm";

function TaskDetails({ taskId }: { taskId?: string }) {
  const params = useParams();
  const navigate = useNavigate();
    const [deleteFeatureId, setDeleteFeatureId] = useState<string | null>(null);

  if (taskId === undefined) {
    taskId = params.taskId;
    if (taskId === undefined) throw new Error("Could not get the task id");
  }

  const task = database.getById<Task>("task", taskId);
  if (task === null) {
    throw new Error("Why task null?");
  }

  const feature = database.getById<Feature>("feature", task.featureId);
  if (feature === null) {
    throw new Error("Why feature null?");
  }

  let owner: string;
  if (task.ownerId !== undefined) {
    owner = database.getById<User>("user", task.ownerId)?.name ?? "No owner"
  } else {
    owner = "No owner";
  }

  // let priorityClass = "task";
  // switch (task.priority) {
  //   case "high":
  //     priorityClass = "taskHighPriority";
  //     break;
  //   case "medium":
  //     priorityClass = "taskMediumPriority";
  //     break;
  //   case "low":
  //     priorityClass = "taskLowPriority";
  //     break;
  //   default:
  //     break;
  // }

  return (
    <div className="task">
      {deleteFeatureId && <TaskDeleteForm taskId={deleteFeatureId}></TaskDeleteForm>}
      <h3>{task.name}</h3>
      <p>
        <span style={{ fontWeight: "bold" }}>Description: </span>
        {task.description}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Feature: </span> {feature?.name}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Start date: </span>
        {task.startDate}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Owner: </span>
        {owner}
      </p>
      <button
        className="formSubmitButton"
        onClick={() => navigate(`${updateTaskDisabledPathId}/${task.id}`)}
      >
        View more or update
      </button>
      <button
        className="formDeleteButton"
        onClick={() => setDeleteFeatureId(task.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default TaskDetails;

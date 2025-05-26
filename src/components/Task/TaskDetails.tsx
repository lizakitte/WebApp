import { useNavigate, useParams } from "react-router-dom";
import { database, Feature, Task, User } from "../../lib/data";

function TaskDetails({ taskId }: { taskId?: string }) {
  const params = useParams();
  // const navigate = useNavigate();
  //   const [deleteFeatureId, setDeleteFeatureId] = useState<string | null>(null);

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

  const owner =
    database.getById<User>("user", task.ownerId)?.name ?? "No owner";

  let priorityClass = "task";
  switch (task.priority) {
    case "high":
      priorityClass = "taskHighPriority";
      break;
    case "medium":
      priorityClass = "taskMediumPriority";
      break;
    case "low":
      priorityClass = "taskfeatureLowPriority";
      break;
    default:
      break;
  }

  return (
    <div className="task">
      {/* {deleteFeatureId && <FDeleteForm featureId={deleteFeatureId}></FDeleteForm>} */}
      {/* <a onClick={() => navigate(projectFeaturesPath)}>&larr; Back to all features 🦛🦛</a>
            <h1>Feature details:</h1> */}
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
      {/* <button
        className="formUpdateButton"
        onClick={() => navigate(`${updateFeaturePathId}/${task.id}`)}
      >
        Update
      </button>
      <button
        className="formDeleteButton"
        onClick={() => setDeleteFeatureId(task.id)}
      >
        Delete
      </button> */}
    </div>
  );
}

export default TaskDetails;

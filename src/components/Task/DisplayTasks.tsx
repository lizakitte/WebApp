import { useContext } from "react";
import FeatureContext from "../../lib/FeatureContext";
import TaskContext from "../../lib/TaskContext";
import { useNavigate } from "react-router";
import { createTaskPath, projectFeaturesPath } from "../../lib/pathsNames";
import TaskDetails from "./TaskDetails";

export default function DisplayTasks() {
  const navigate = useNavigate();
  const { state: taskState } = useContext(TaskContext);
  const { state: featureState } = useContext(FeatureContext);

  const tasks = taskState.tasks.filter(
    (task) => task.featureId === featureState.activeFeature?.id
  );
  const allTasksToDo = tasks.filter((task) => task.state == "todo");
  const allTasksDoing = tasks.filter((task) => task.state == "doing");
  const allTasksDone = tasks.filter((task) => task.state == "done");

  return (
    <div>
      <a onClick={() => navigate(projectFeaturesPath)}>&larr; Back to features</a>
      <div>
        <button
          className="formSubmitButton"
          onClick={() => navigate(createTaskPath)}
        >
          Add new
        </button>
        <h1>Here are the tasks for the feature:</h1>

        <table>
          <thead>
            <tr>
              <th className="featureToDo">TODO</th>
              <th className="featureDoing">IN PROGRESS</th>
              <th className="featureDone">DONE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{verticalAlign: "top"}}>
                {allTasksToDo.map((task) => (
                  <TaskDetails taskId={task.id} />
                ))}
              </td>
              <td style={{verticalAlign: "top"}}>
                {allTasksDoing.map((task) => (
                  <TaskDetails taskId={task.id} />
                ))}
              </td>
              <td style={{verticalAlign: "top"}}>
                {allTasksDone.map((task) => (
                  <TaskDetails taskId={task.id} />
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
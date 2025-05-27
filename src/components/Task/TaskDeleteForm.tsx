import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { database, Task } from "../../lib/data";
import { useContext, useState } from "react";
import { featureTasksPath } from "../../lib/pathsNames";
import TaskContext from "../../lib/TaskContext";

function TaskDeleteForm({ taskId }: { taskId: string }) {
  const { dispatch } = useContext(TaskContext);
  const navigate = useNavigate();

  const task = database.getById<Task>("task", taskId)!;

  const [styleQuestion, setStyleQuestion] = useState<React.CSSProperties>({
    display: "block",
  });
  const [styleSuccess, setStyleSuccess] = useState<React.CSSProperties>({});

  function onDelete() {
    setStyleQuestion({ display: "none" });
    dispatch({ type: "deleteTask", id: taskId })
    setStyleSuccess({ display: "block" });
  }

  return (
    <div>
      <Modal style={styleQuestion} setStyle={setStyleQuestion}>
        <p>Do you really want to delete this task:</p>
        <p>
          {task?.name} &#40;{task?.description}&#41;?
        </p>
        <button className="formDeleteButton" onClick={onDelete}>
          Delete
        </button>
        <button
          className="formUpdateButton"
          onClick={() => setStyleQuestion({ display: "none" })}
        >
          Cancel
        </button>
      </Modal>

      <Modal
        style={styleSuccess}
        setStyle={setStyleSuccess}
        onClose={() => navigate(featureTasksPath)}
      >
        <p>Delete was successfull!</p>
      </Modal>
    </div>
  );
}

export default TaskDeleteForm;

import { database } from "../lib/data";
import "../styles/formStyle.css";
import Modal from "./Modal";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function DeleteForm({ projectId }: { projectId: string }) {
  const navigate = useNavigate();
  // const params = useParams();
  const project = database.getById(projectId);

  const [styleQuestion, setStyleQuestion] = useState<React.CSSProperties>({});
  const [styleSuccess, setStyleSuccess] = useState<React.CSSProperties>({});
  const [styleFail, setStyleFail] = useState<React.CSSProperties>({});

  useEffect(() => {
    setStyleQuestion({ display: "block" });
  }, []);

  function onDelete() {
    setStyleQuestion({display: "none"});
    if (database.deleteById(projectId)) {
      setStyleSuccess({ display: "block" });
    } else {
      setStyleFail({ display: "block" });
    }
  }

  return (
    <>
      {/* on close - cancel, on submit - delete and open modal success or fail */}
      <Modal style={styleQuestion} setStyle={setStyleQuestion}>
        <p>Do you really want to delete this record:</p>
        <p>
          {project?.name} &#40;{project?.description}&#41;?
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

      {/* on close - update the display data */}
      <Modal
        style={styleSuccess}
        setStyle={setStyleSuccess}
        onClose={() => navigate("/")}
      >
        <p>Delete was successfull!</p>
      </Modal>

      <Modal
        style={styleFail}
        setStyle={setStyleFail}
        onClose={() => navigate("/")}
      >
        <p>Sorry! Could not delete.</p>
      </Modal>
    </>
  );
}

export default DeleteForm;

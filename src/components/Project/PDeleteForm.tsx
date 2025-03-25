import { database, Project } from "../../lib/data";
import { homePagePath } from "../../lib/pathsNames";
import "../../styles/formStyle.css";
import Modal from "../Modal";
import React, { useState } from "react";
import { useNavigate } from "react-router";

function PDeleteForm({ projectId }: { projectId: string }) {
  const navigate = useNavigate();
  // const params = useParams();
  const project = database.getById<Project>("project", projectId);

  const [styleQuestion, setStyleQuestion] = useState<React.CSSProperties>({display: "block"});
  const [styleSuccess, setStyleSuccess] = useState<React.CSSProperties>({});
  const [styleFail, setStyleFail] = useState<React.CSSProperties>({});

  function onDelete() {
    setStyleQuestion({display: "none"});
    if (database.deleteById<Project>("project", projectId)) {
      setStyleSuccess({ display: "block" });
    } else {
      setStyleFail({ display: "block" });
    }
  }

  return (
    <>
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

      <Modal
        style={styleSuccess}
        setStyle={setStyleSuccess}
        onClose={() => navigate(homePagePath)}
      >
        <p>Delete was successfull!</p>
      </Modal>

      <Modal
        style={styleFail}
        setStyle={setStyleFail}
        onClose={() => navigate(homePagePath)}
      >
        <p>Sorry! Could not delete.</p>
      </Modal>
    </>
  );
}

export default PDeleteForm;

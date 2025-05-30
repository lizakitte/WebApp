import { useNavigate, useParams } from "react-router";
import "../../styles/formStyle.css";
import { database, Project } from "../../lib/data";
import React, { FormEvent, useContext, useState } from "react";
import Modal from "../Modal";
import { homePagePath } from "../../lib/pathsNames";
import ProjectContext from "../../lib/ProjectContext";

function PUpdateForm() {
  const navigate = useNavigate();
  const { dispatch } = useContext(ProjectContext);

  const params = useParams();
  const project = database.getById<Project>("project", params.id!)!;
  const nameInputName = "projectName";
  const descrInputName = "projectDescription";

  const [styleSuccess, setStyleSuccess] = useState<React.CSSProperties>({});

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement | undefined;
    if (!form) {
      throw new Error("Why is the form undefined?");
    }

    const formElements = form.elements;

    const pnameInput = formElements.namedItem(
      nameInputName
    ) as HTMLInputElement | null;
    if (!pnameInput) {
      throw new Error("An input is null!");
    }

    const descrInput = formElements.namedItem(
      descrInputName
    ) as HTMLInputElement | null;
    if (!descrInput) {
      throw new Error("An input is null!");
    }

    const pname = pnameInput.value;
    const descr = descrInput.value;

    dispatch({
      type: "updateProject",
      id: project.id,
      name: pname,
      description: descr,
    })
    setStyleSuccess({ display: "block" });
  }

  return (
    <>
      <a onClick={() => navigate(homePagePath)}>&larr; Back to all</a>
      <form onSubmit={onSubmit}>
        <h1>
          Update the {project.name} &#40;{project.description}&#41;?
        </h1>
        <label htmlFor={nameInputName}>Name</label>
        <input
          type="text"
          id={nameInputName}
          name={nameInputName}
          defaultValue={project.name}
        ></input>
        <label htmlFor={descrInputName}>Description</label>
        <textarea
          id={descrInputName}
          name={descrInputName}
          defaultValue={project.description}
        ></textarea>
        <input
          type="submit"
          className="formUpdateButton"
          value="Submit"
        ></input>
      </form>
      <Modal style={styleSuccess} setStyle={setStyleSuccess} onClose={() => navigate(homePagePath)}>
        <p>Update was successfull!</p>
      </Modal>
    </>
  );
}

export default PUpdateForm;

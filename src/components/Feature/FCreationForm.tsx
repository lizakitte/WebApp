import { FormEvent, useContext } from "react";
import "../../styles/formStyle.css";
import { useNavigate } from "react-router";
import ProjectContext from "../../lib/ProjectContext";
import { projectFeaturesPath } from "../../lib/pathsNames";
import FeatureContext from "../../lib/FeatureContext";

function FCreationForm() {
  const navigate = useNavigate();
  const { state: projectState } = useContext(ProjectContext);
  const { dispatch: featureDispatch } = useContext(FeatureContext);

  const nameInputName = "featureName";
  const descrInputName = "featureDescription";
  const priorityInputName = "featurePriority";

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

    const fname = fnameInput.value;
    const descr = descrInput.value;
    const priority = priorityInput.value;

    if(priority !== "low" && priority !== "medium" && priority !== "high") {
        throw new Error("Unknown priority!");
    }

    if(projectState.activeProject === undefined) {
        throw new Error("No project is chosen as active!");
    }

    featureDispatch({
      type: "createFeature",
      name: fname,
      description: descr,
      priority,
      projectId: projectState.activeProject!.id,
      startDate: new Date().toISOString().split("T")[0],
      state: "todo",
  });

    fnameInput.value = "";
    descrInput.value = "";
    navigate(projectFeaturesPath);
  }

  return (
    <>
      <a onClick={() => navigate(projectFeaturesPath)}>&larr; Back to all features</a>
      <form onSubmit={onSubmit}>
        <h1>Create New Feature</h1>
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
        <input
          type="submit"
          className="formSubmitButton"
          value="Submit"
        ></input>
      </form>
    </>
  );
}

export default FCreationForm;

import { useNavigate, useParams } from "react-router-dom";
import { database, Feature } from "../../lib/data";
import { FormEvent, useContext, useState } from "react";
import { loginPagePath, projectFeaturesPath } from "../../lib/pathsNames";
import Modal from "../Modal";
import FeatureContext from "../../lib/FeatureContext";
import UserContext from "../../lib/UserContext";

function FUpdateForm() {
  const navigate = useNavigate();

  const { dispatch } = useContext(FeatureContext);
  const { state: userState } = useContext(UserContext);

  const params = useParams();
  const feature = database.getById<Feature>("feature", params.featureId!)!;
  const nameInputName = "featureName";
  const descrInputName = "featureDescription";
  // const ownerInputName = "featureOwner";
  const priorityInputName = "featurePriority";
  const startDateInputName = "featureStartDate";
  const stateInputName = "featureState";

  const [styleSuccess, setStyleSuccess] = useState<React.CSSProperties>({});

  if (userState.activeUser === undefined) {
    navigate(loginPagePath);
    return;
  }

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

    const stateInput = formElements.namedItem(
      stateInputName
    ) as HTMLInputElement;

    const fname = fnameInput.value;
    const descr = descrInput.value;
    const priority = priorityInput.value;
    const state = stateInput.value;

    if (priority !== "low" && priority !== "medium" && priority !== "high") {
      throw new Error("Unknown priority!");
    }

    if (state !== "todo" && state !== "doing" && state !== "done") {
      throw new Error("Unknown feature state!");
    }

    dispatch({
      type: "updateFeature",
      id: feature.id,
      name: fname,
      description: descr,
      priority,
      state,
    });
    setStyleSuccess({ display: "block" });
  }
  return (
    <div>
      <a onClick={() => navigate(projectFeaturesPath)}>&larr; Back to all</a>
      {(userState.activeUser.role === "admin") ? (

      <div>
        <form onSubmit={onSubmit}>
          <h1>
            Update the {feature.name} &#40;{feature.description}&#41;?
          </h1>
          <label htmlFor={nameInputName}>Name</label>
          <input
            type="text"
            id={nameInputName}
            name={nameInputName}
            defaultValue={feature.name}
          ></input>
          <label htmlFor={descrInputName}>Description</label>
          <textarea
            id={descrInputName}
            name={descrInputName}
            defaultValue={feature.description}
          ></textarea>
          {/* <label htmlFor={ownerInputName}>Owner</label>
        <input
          type="text"
          id={ownerInputName}
          name={ownerInputName}
          defaultValue={feature.ownerId}
        ></input> */}
          <label htmlFor={priorityInputName}>Priority</label>
          <select id={priorityInputName} name={priorityInputName}>
            <option selected={feature.priority === "low"} value="low">
              Low
            </option>
            <option selected={feature.priority === "medium"} value="medium">
              Medium
            </option>
            <option selected={feature.priority === "high"} value="high">
              High
            </option>
          </select>
          <label htmlFor={startDateInputName}>Start date</label>
          <input
            disabled
            type="text"
            id={startDateInputName}
            name={startDateInputName}
            defaultValue={feature.startDate}
          ></input>
          <label htmlFor={stateInputName}>State</label>
          <select id={stateInputName} name={stateInputName}>
            <option selected={feature.state === "todo"} value="todo">
              To do
            </option>
            <option selected={feature.state === "doing"} value="doing">
              In progress
            </option>
            <option selected={feature.state === "done"} value="done">
              Done
            </option>
          </select>
          <input
            type="submit"
            className="formUpdateButton"
            value="Submit"
          ></input>
        </form>
        <Modal
          style={styleSuccess}
          setStyle={setStyleSuccess}
          onClose={() => navigate(projectFeaturesPath)}
        >
          <p>Update was successfull!</p>
        </Modal>
      </div>
      ) : (<h2>Can't reach</h2>)}
    </div>
  );
}

export default FUpdateForm;

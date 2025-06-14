import { useNavigate, useParams } from "react-router-dom";
import { database, Feature } from "../../lib/data";
import {
  featureTasksPath,
  loginPagePath,
  updateFeaturePathId,
} from "../../lib/pathsNames";
import { useContext, useState } from "react";
import FDeleteForm from "./FDeleteForm";
import FeatureContext from "../../lib/FeatureContext";
import UserContext from "../../lib/UserContext";

function FeatureDetails({ featureId }: { featureId?: string }) {
  const params = useParams();
  const navigate = useNavigate();

  const { dispatch } = useContext(FeatureContext);
  const { state: userState } = useContext(UserContext);

  const [deleteFeatureId, setDeleteFeatureId] = useState<string | null>(null);

  if (userState.activeUser === undefined) {
    navigate(loginPagePath);
    return;
  }

  if (featureId === undefined) {
    featureId = params.featureId;
    if (featureId === undefined)
      throw new Error("Could not get the feature id");
  }

  const feature = database.getById<Feature>("feature", featureId);
  if (feature === null) {
    throw new Error("Why feature null?");
  }

  let priorityClass = "feature";
  switch (feature.priority) {
    case "high":
      priorityClass = "featureHighPriority";
      break;
    case "medium":
      priorityClass = "featureMediumPriority";
      break;
    case "low":
      priorityClass = "featureLowPriority";
      break;
    default:
      break;
  }

  return (
    <div className="feature">
      {deleteFeatureId && (
        <FDeleteForm featureId={deleteFeatureId}></FDeleteForm>
      )}

      <h3>{feature.name}</h3>
      <p>
        <span style={{ fontWeight: "bold" }}>Description:</span>{" "}
        {feature.description}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Owner:</span> {feature.ownerId}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Priority:</span>
        <span className={priorityClass}> {feature.priority}</span>
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Start date:</span>{" "}
        {feature.startDate}
      </p>
      {userState.activeUser.role === "admin" ? (
        <button
          className="formUpdateButton"
          onClick={() => navigate(`${updateFeaturePathId}/${feature.id}`)}
        >
          Update
        </button>
      ) : (
        <></>
      )}
      {userState.activeUser.role === "admin" ? (
        <button
          className="formDeleteButton"
          onClick={() => setDeleteFeatureId(feature.id)}
        >
          Delete
        </button>
      ) : (
        <></>
      )}
      <button
        className="formSubmitButton"
        onClick={() => {
          dispatch({
            type: "activeFeatureChanged",
            feature,
          });
          navigate(featureTasksPath);
        }}
      >
        View Tasks
      </button>
    </div>
  );
}

export default FeatureDetails;

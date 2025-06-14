import { useNavigate } from "react-router";
import ProjectContext from "../../lib/ProjectContext";
import { useContext } from "react";
import { createFeaturePath, homePagePath, loginPagePath } from "../../lib/pathsNames";
import FeatureDetails from "./FeatureDetails";
import FeatureContext from "../../lib/FeatureContext";
import UserContext from "../../lib/UserContext";

function DisplayFeatures() {
  const navigate = useNavigate();
  const { state: projectState } = useContext(ProjectContext);
  const { state: featureState } = useContext(FeatureContext);
  const { state: userState } = useContext(UserContext);

  const features = featureState.features.filter(
    (feature) => feature.projectId === projectState.activeProject?.id
  );
  const allFeaturesToDo = features.filter((feature) => feature.state == "todo");
  const allFeaturesDoing = features.filter(
    (feature) => feature.state == "doing"
  );
  const allFeaturesDone = features.filter((feature) => feature.state == "done");

  if (userState.activeUser === undefined) {
    navigate(loginPagePath);
    return;
  }

  return (
    <div>
      <a onClick={() => navigate(homePagePath)}>&larr; Back to projects </a>
      <div>
        {(userState.activeUser.role === "admin") ? (
        <button
          className="formSubmitButton"
          onClick={() => navigate(createFeaturePath)}
        >
          Add new
        </button>

        ) : (<></>)}
        <h1>Here are the features for the project: </h1>

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
              <td style={{ verticalAlign: "top" }}>
                {allFeaturesToDo.map((feature) => (
                  <FeatureDetails featureId={feature.id} />
                ))}
              </td>
              <td style={{ verticalAlign: "top" }}>
                {allFeaturesDoing.map((feature) => (
                  <FeatureDetails featureId={feature.id} />
                ))}
              </td>
              <td style={{ verticalAlign: "top" }}>
                {allFeaturesDone.map((feature) => (
                  <FeatureDetails featureId={feature.id} />
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplayFeatures;

import { useNavigate } from "react-router";
import { database } from "../../lib/data";
import ProjectContext from "../../lib/ProjectContext";
import { useContext, useState } from "react";
import FDeleteForm from "./FDeleteForm";
import { createFeaturePath, featureDetailsPathId, homePagePath, updateFeaturePathId } from "../../lib/pathsNames";

function DisplayFeatures() {
  
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ProjectContext);
  
  const data = database.getAllFeaturesByProject(state.activeProject?.id);

  const [deleteFeatureId, setDeleteFeatureId] = useState<string | null>(null);

  return (
    <div>
      <a onClick={() => navigate(homePagePath)}>&larr; Back to projects 🦛🦛</a>
      <div>
        {deleteFeatureId && <FDeleteForm featureId={deleteFeatureId} />}
        <button
          className="formSubmitButton"
          onClick={() => navigate(createFeaturePath)}
        >
          Add new
        </button>
        <h1>Here are the features for the project: 🦛</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((feature) => {
              let featureStateStyle;
              switch (feature.state) {
                case "todo":
                  featureStateStyle = "featureToDo";
                  break;
                case "doing":
                  featureStateStyle = "featureDoing";
                  break;
                case "done":
                  featureStateStyle = "featureDone";
                  break;
                default:
                  break;
              }
              return (
                <tr className={featureStateStyle}>
                  <td style={{cursor: "pointer"}} onClick={() => navigate(`${featureDetailsPathId}/${feature.id}`)}>{feature.name}</td>
                  <td style={{cursor: "pointer"}} onClick={() => navigate(`${featureDetailsPathId}/${feature.id}`)}>{feature.description}</td>
                  <td>
                    <button
                      className="formUpdateButton"
                      onClick={() => navigate(`${updateFeaturePathId}/${feature.id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="formDeleteButton"
                      onClick={() => setDeleteFeatureId(feature.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="formSubmitButton"
                      onClick={() => navigate(`${featureDetailsPathId}/${feature.id}`)}
                    >
                      See more
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DisplayFeatures;

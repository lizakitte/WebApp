import { useNavigate } from "react-router";
import PDeleteForm from "./PDeleteForm";
import { useContext, useState } from "react";
import ProjectContext from "../../lib/ProjectContext";
import "../../index.css";
import { createProjectPath, projectFeaturesPath, updateProjectPathId } from "../../lib/pathsNames";

function DisplayProjects() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ProjectContext);

  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  return (
    <div>
      {deleteProjectId && <PDeleteForm projectId={deleteProjectId} />}
      <button className="formSubmitButton" onClick={() => navigate(createProjectPath)}>
        Add new
      </button>
      <h1>Here is your data: </h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.projects.map((project) => {
            return (
              <tr>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>
                  <button
                    className="formUpdateButton"
                    onClick={() => navigate(`${updateProjectPathId}/${project.id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="formDeleteButton"
                    onClick={() => setDeleteProjectId(project.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="formSubmitButton"
                    onClick={() => {
                      dispatch({
                        type: "activeProjectChanged",
                        project,
                      });
                      navigate(projectFeaturesPath)
                    }
                    }
                  >
                    Select
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayProjects;

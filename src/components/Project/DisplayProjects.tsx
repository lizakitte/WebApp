import { useNavigate } from "react-router";
import PDeleteForm from "./PDeleteForm";
import { useContext, useState } from "react";
import ProjectContext from "../../lib/ProjectContext";
import "../../index.css";
import { createProjectPath, loginPagePath, projectFeaturesPath, updateProjectPathId } from "../../lib/pathsNames";
import UserContext from "../../lib/UserContext";

function DisplayProjects() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ProjectContext);
  const { state: userState } = useContext(UserContext);

  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  if(userState.activeUser === undefined) {
    navigate(loginPagePath);
    return;
  }

  return (
    <div>
      {deleteProjectId && <PDeleteForm projectId={deleteProjectId} />}
      {(userState.activeUser.role === "admin") ? (<button className="formSubmitButton" onClick={() => navigate(createProjectPath)}>
        Add new
      </button>) : (<></>)}
      
      <h1>Here are your projects: </h1>
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
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>

                  {(userState.activeUser?.role === "admin") ? (<button
                    className="formUpdateButton"
                    onClick={() => navigate(`${updateProjectPathId}/${project.id}`)}
                  >
                    Update
                  </button>) : (<></>)}

                  {(userState.activeUser?.role === "admin") ? (<button
                    className="formDeleteButton"
                    onClick={() => setDeleteProjectId(project.id)}
                  >
                    Delete
                  </button>) : (<></>)}
                  
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

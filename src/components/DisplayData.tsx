import { useNavigate } from "react-router";
import { database } from "../lib/data";
import DeleteForm from "./DeleteForm";
import { useState } from "react";

function DisplayData() {
  const data = database.getAll();

  const navigate = useNavigate();

  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  return (
    <div>
      {deleteProjectId && <DeleteForm projectId={deleteProjectId} />}
      <button className="formSubmitButton" onClick={() => navigate("/create")}>
        Add new
      </button>
      <h1>Here is your data: 🦛</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((project) => {
            return (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>
                  <button
                    className="formUpdateButton"
                    onClick={() => navigate(`/update/${project.id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="formDeleteButton"
                    onClick={() => setDeleteProjectId(project.id)}
                  >
                    Delete
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

export default DisplayData;

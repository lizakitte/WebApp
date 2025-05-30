import { FormEvent, useContext } from "react";
import "../../styles/formStyle.css"
import { useNavigate } from "react-router";
import { homePagePath } from "../../lib/pathsNames";
import ProjectContext from "../../lib/ProjectContext";

function PCreationForm() {
    const navigate = useNavigate();
    const { dispatch } = useContext(ProjectContext);

    const nameInputName = "projectName";
    const descrInputName = "projectDescription"

    function onSubmit(event: FormEvent) {
        event.preventDefault();

        const form = event.target as HTMLFormElement | undefined;
        if (!form) {
            throw new Error("Why is the form undefined?");
        }

        const formElements = form.elements;

        const pnameInput = formElements.namedItem(nameInputName) as HTMLInputElement | null;
        if (!pnameInput) {
            throw new Error("An input is null!");
        }

        const descrInput = formElements.namedItem(descrInputName) as HTMLInputElement | null;
        if (!descrInput) {
            throw new Error("An input is null!");
        }

        const pname = pnameInput.value;
        const descr = descrInput.value;

        dispatch({
            type: "createProject",
            name: pname,
            description: descr
        })

        pnameInput.value = "";
        descrInput.value = "";
        navigate(homePagePath);
    }

    return ( 
        <>
            <a onClick={() => navigate(homePagePath)}>&larr; Back to all projects</a>
            <form onSubmit={onSubmit}>
                <h1>Create New Project</h1>
                <label htmlFor={nameInputName}>Name</label>
                <input type="text" id={nameInputName} name={nameInputName} placeholder="Enter name..."></input>
                <label htmlFor={descrInputName}>Description</label>
                <textarea id={descrInputName} name={descrInputName} placeholder="Enter description..."></textarea>
                <input type="submit" className="formSubmitButton" value="Submit"></input>
            </form>
        </>
     );
}

export default PCreationForm;
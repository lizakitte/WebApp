import React, { createContext } from "react";
import { ProjectAction, ProjectState } from "./data";

export type ProjectContextState = {
    state: ProjectState,
    dispatch: React.ActionDispatch<[action: ProjectAction]>;
};

const ProjectContext = createContext<ProjectContextState>(null!);

export default ProjectContext;
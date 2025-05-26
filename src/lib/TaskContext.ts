import React, { createContext } from "react";
import { TaskAction, TaskState } from "./data";

export type TaskContextState = {
    state: TaskState;   
    dispatch: React.ActionDispatch<[action: TaskAction]>;
};

const TaskContext = createContext<TaskContextState>(null!);

export default TaskContext;
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import DisplayProjects from "./components/Project/DisplayProjects.tsx";
import PCreationForm from "./components/Project/PCreationForm.tsx";
import PUpdateForm from "./components/Project/PUpdateForm.tsx";
import FCreationForm from "./components/Feature/FCreationForm.tsx";
import UserContext from "./lib/UserContext.ts";
import { useReducer } from "react";
import {
  featureReducer,
  getInitialFeaturesState,
  getInitialProjectState,
  getInitialTaskState,
  getInitialUserState,
  projectReducer,
  taskReducer,
  userReducer,
} from "./lib/data.ts";
import Header from "./components/Header.tsx";
import ProjectContext from "./lib/ProjectContext.ts";
import DisplayFeatures from "./components/Feature/DisplayFeatures.tsx";
import FUpdateForm from "./components/Feature/FUpdateForm.tsx";
import FeatureDetails from "./components/Feature/FeatureDetails.tsx";
import {
  createFeaturePath,
  createProjectPath,
  createTaskPath,
  featureDetailsPathId,
  featureTasksPath,
  homePagePath,
  projectFeaturesPath,
  taskDeletePathId,
  taskDetailsPathId,
  updateFeaturePathId,
  updateProjectPathId,
  updateTaskDisabledPathId,
  updateTaskPathId,
} from "./lib/pathsNames.ts";
import FeatureContext from "./lib/FeatureContext.ts";
import TaskContext from "./lib/TaskContext.ts";
import DisplayTasks from "./components/Task/DisplayTasks.tsx";
import TaskCreationForm from "./components/Task/TaskCreationForm.tsx";
import TaskUpdateForm from "./components/Task/TaskUpdateForm.tsx";
import TaskDeleteForm from "./components/Task/TaskDeleteForm.tsx";
import TaskDetails from "./components/Task/TaskDetails.tsx";
import TaskUpdateDisabled from "./components/Task/TaskUpdateDisabled.tsx";

function App() {
  const [userState, userDispatch] = useReducer(
    userReducer,
    getInitialUserState()
  );
  const [projectState, projectDispatch] = useReducer(
    projectReducer,
    getInitialProjectState()
  );
  const [featureState, featureDispatch] = useReducer(
    featureReducer,
    getInitialFeaturesState()
  );
  const [taskState, taskDispatch] = useReducer(
    taskReducer,
    getInitialTaskState()
  );

  return (
    <UserContext.Provider value={{ state: userState, dispatch: userDispatch }}>
      <ProjectContext.Provider
        value={{ state: projectState, dispatch: projectDispatch }}
      >
        <FeatureContext.Provider
          value={{ state: featureState, dispatch: featureDispatch }}
        >
          <TaskContext.Provider
            value={{ state: taskState, dispatch: taskDispatch }}
          >
            <Header />
            <BrowserRouter>
              <Routes>
                <Route path={homePagePath} element={<DisplayProjects />} />
                <Route path={createProjectPath} element={<PCreationForm />} />
                <Route
                  path={`${updateProjectPathId}/:id`}
                  element={<PUpdateForm />}
                />

                <Route
                  path={projectFeaturesPath}
                  element={<DisplayFeatures />}
                />
                <Route path={createFeaturePath} element={<FCreationForm />} />
                <Route
                  path={`${updateFeaturePathId}/:featureId`}
                  element={<FUpdateForm />}
                />
                <Route
                  path={`${featureDetailsPathId}/:featureId`}
                  element={<FeatureDetails />}
                />

                <Route path={featureTasksPath} element={<DisplayTasks />} />
                <Route path={createTaskPath} element={<TaskCreationForm />} />
                <Route
                  path={`${updateTaskPathId}/:taskId`}
                  element={<TaskUpdateForm />}
                />
                <Route
                  path={`${updateTaskDisabledPathId}/:taskId`}
                  element={<TaskUpdateDisabled />}
                />
                <Route
                  path={`${taskDeletePathId}/:taskId`}
                  element={<TaskDeleteForm />}
                />
                <Route
                  path={`${taskDetailsPathId}/:taskId`}
                  element={<TaskDetails />}
                />
              </Routes>
            </BrowserRouter>
          </TaskContext.Provider>
        </FeatureContext.Provider>
      </ProjectContext.Provider>
    </UserContext.Provider>
  );
}

export default App;

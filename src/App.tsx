import "./App.css";
import { Route, Routes, useNavigate } from "react-router";
import DisplayProjects from "./components/Project/DisplayProjects.tsx";
import PCreationForm from "./components/Project/PCreationForm.tsx";
import PUpdateForm from "./components/Project/PUpdateForm.tsx";
import FCreationForm from "./components/Feature/FCreationForm.tsx";
import UserContext from "./lib/UserContext.ts";
import { useReducer, useEffect } from "react";
import {
  featureReducer,
  getInitialFeaturesState,
  getInitialProjectState,
  getInitialTaskState,
  getInitialUserState,
  projectReducer,
  taskReducer,
  userReducer,
  database,
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
  taskDetailsPathId,
  updateFeaturePathId,
  updateProjectPathId,
  updateTaskDisabledPathId,
  updateTaskPathId,
  loginPagePath,
} from "./lib/pathsNames.ts";
import FeatureContext from "./lib/FeatureContext.ts";
import TaskContext from "./lib/TaskContext.ts";
import DisplayTasks from "./components/Task/DisplayTasks.tsx";
import TaskCreationForm from "./components/Task/TaskCreationForm.tsx";
import TaskUpdateForm from "./components/Task/TaskUpdateForm.tsx";
import TaskDetails from "./components/Task/TaskDetails.tsx";
import TaskUpdateDisabled from "./components/Task/TaskUpdateDisabled.tsx";
import LoginForm from "./components/LoginForm.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

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

  const navigate = useNavigate();

  useEffect(() => {
    if (!userState.activeUser) {
      navigate(loginPagePath);
    } else {
      database.refreshUserTokenIfNeeded();
    }
  }, [userState.activeUser]);

  return (
    <GoogleOAuthProvider clientId="587637613591-ijs7fl2k881v6fisqk31vc7uj92ej9jq.apps.googleusercontent.com">
      <UserContext.Provider
        value={{ state: userState, dispatch: userDispatch }}
      >
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
              <Routes>
                <Route path={loginPagePath} element={<LoginForm />} />
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
                {/* <Route
                path={`${taskDeletePathId}/:taskId`}
                element={<TaskDeleteForm />}
              /> */}
                <Route
                  path={`${taskDetailsPathId}/:taskId`}
                  element={<TaskDetails />}
                />
              </Routes>
            </TaskContext.Provider>
          </FeatureContext.Provider>
        </ProjectContext.Provider>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;

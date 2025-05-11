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
  getInitialUserState,
  projectReducer,
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
  featureDetailsPathId,
  homePagePath,
  projectFeaturesPath,
  updateFeaturePathId,
  updateProjectPathId,
} from "./lib/pathsNames.ts";
import FeatureContext from "./lib/FeatureContext.ts";

function App() {
  const [userState, userDispatch] = useReducer(
    userReducer,
    getInitialUserState()
  );
  const [projectState, projectDispatch] = useReducer(
    projectReducer,
    getInitialProjectState()
  );
  const [featureState, featureDispatch] = useReducer(featureReducer, getInitialFeaturesState());

  return (
    <UserContext.Provider value={{ state: userState, dispatch: userDispatch }}>
      <ProjectContext.Provider
        value={{ state: projectState, dispatch: projectDispatch }}
      >
        <FeatureContext.Provider value={{ state: featureState, dispatch: featureDispatch }}>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path={homePagePath} element={<DisplayProjects />} />
            <Route path={createProjectPath} element={<PCreationForm />} />
            <Route
              path={`${updateProjectPathId}/:id`}
              element={<PUpdateForm />}
            />

            <Route path={projectFeaturesPath} element={<DisplayFeatures />} />
            <Route path={createFeaturePath} element={<FCreationForm />} />
            <Route
              path={`${updateFeaturePathId}/:featureId`}
              element={<FUpdateForm />}
            />
            <Route
              path={`${featureDetailsPathId}/:featureId`}
              element={<FeatureDetails />}
            />
          </Routes>
        </BrowserRouter>
        </FeatureContext.Provider>
      </ProjectContext.Provider>
    </UserContext.Provider>
  );
}

export default App;

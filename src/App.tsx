import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import DisplayProjects from "./components/Project/DisplayProjects.tsx";
import PCreationForm from "./components/Project/PCreationForm.tsx";
import PUpdateForm from "./components/Project/PUpdateForm.tsx";
import FCreationForm from "./components/Feature/FCreationForm.tsx";
import UserContext from "./lib/UserContext.ts";
import { useReducer } from "react";
import { initialProjectState, initialUserState, projectReducer, userReducer } from "./lib/data.ts";
import Header from "./components/Header.tsx";
import ProjectContext from "./lib/ProjectContext.ts";
import DisplayFeatures from "./components/Feature/DisplayFeatures.tsx";
import FUpdateForm from "./components/Feature/FUpdateForm.tsx";
import FeatureDetails from "./components/Feature/FeatureDetails.tsx";
import { createFeaturePath, createProjectPath, featureDetailsPathId, homePagePath, projectFeaturesPath, updateFeaturePathId, updateProjectPathId } from "./lib/pathsNames.ts";

function App() {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);
  const [projectState, projectDispatch] = useReducer(projectReducer, initialProjectState);

  return (
    <UserContext.Provider value={{ state: userState, dispatch: userDispatch }}>
    <ProjectContext.Provider value={{ state: projectState, dispatch: projectDispatch }}>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path={homePagePath} element={<DisplayProjects />} />
          <Route path={createProjectPath} element={<PCreationForm />} />
          <Route path={`${updateProjectPathId}/:id`} element={<PUpdateForm />} />

          <Route path={projectFeaturesPath} element={<DisplayFeatures/>}/>
          <Route path={createFeaturePath} element={<FCreationForm/>}/>
          <Route path={`${updateFeaturePathId}/:featureId`} element={<FUpdateForm/>}/>
          <Route path={`${featureDetailsPathId}/:featureId`} element={<FeatureDetails/>}/>
        </Routes>
      </BrowserRouter>
      </ProjectContext.Provider>
    </UserContext.Provider>
  );
}

export default App;

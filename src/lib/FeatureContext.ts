import React, { createContext } from "react";
import { FeatureAction, FeaturesState } from "./data";

export type FeatureContextState = {
    state: FeaturesState;   
    dispatch: React.ActionDispatch<[action: FeatureAction]>;
};

const FeatureContext = createContext<FeatureContextState>(null!);

export default FeatureContext;
import React, { createContext } from "react";
import { UserAction, UserState } from "./data";

export type UserContextState = {
    state: UserState,
    dispatch: React.ActionDispatch<[action: UserAction]>;
};

const UserContext = createContext<UserContextState>(null!);

export default UserContext;
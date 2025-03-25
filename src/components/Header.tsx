import { useContext } from "react";
import UserContext from "../lib/UserContext";

export default function Header() {
    const { state } = useContext(UserContext);
    return (
        <div>
            Currently logged in as {state.activeUser.name} {state.activeUser.surname}
        </div>
    );
}
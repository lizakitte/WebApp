import { useContext } from "react";
import UserContext from "../lib/UserContext";

export default function Header() {
  const { state, dispatch } = useContext(UserContext);

  return (
    <div>
      {state.activeUser ? (
        <>
          <p>
            Currently logged in as {state.activeUser.name}{" "}
            {state.activeUser.surname}
          </p>
          <button
            onClick={() => {
              dispatch({ type: "userLoggedOut", user: state.activeUser! });
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

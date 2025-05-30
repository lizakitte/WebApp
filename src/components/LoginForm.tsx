import { FormEvent, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { homePagePath } from "../lib/pathsNames";
import { database, UserCredentials, LoginParams } from "../lib/data";
import Modal from "./Modal.tsx";
import UserContext from "../lib/UserContext";
import "../styles/formStyle.css";

type GoogleCredentials = {
  given_name: string;
  family_name: string;
  sub: string;
};

function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    // @ts-expect-error window
    window.signInWithGoogle = async function (data: any) {
      const googleCreds = parseJwt(data.credential) as GoogleCredentials;

      for (const user of state.users) {
        if (
          user.name === googleCreds.given_name &&
          user.surname === googleCreds.family_name &&
          user.googleId === googleCreds.sub
        ) {
          const credentials = await database.loginUser({
            name: user.name,
            surname: user.surname,
            password: "",
            googleId: googleCreds.sub,
          });

          if (!credentials)
            throw new Error("Unreachable: credentials undefined");
          dispatch({
            type: "userLoggedIn",
            credentials,
          });

          return navigate(homePagePath);
        }
      }

      const credentials = await database.registerUser({
        name: googleCreds.given_name,
        surname: googleCreds.family_name,
        password: "",
        googleId: googleCreds.sub,
      });

      if (!credentials) throw new Error("Unreachable: credentials undefined");
      dispatch({
        type: "userLoggedIn",
        credentials,
      });
      
      navigate(homePagePath);
    };
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement | undefined;
    if (!form) {
      throw new Error("Why is the form undefined?");
    }

    const nativeEvent = event.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLInputElement;
    const submitterName = submitter.value;

    const formElements = form.elements;

    const nameInput = formElements.namedItem("name") as HTMLInputElement | null;
    if (!nameInput) {
      throw new Error("An input is null!");
    }

    const surnameInput = formElements.namedItem(
      "surname"
    ) as HTMLInputElement | null;
    if (!surnameInput) {
      throw new Error("An input is null!");
    }

    const passwordInput = formElements.namedItem(
      "password"
    ) as HTMLInputElement | null;
    if (!passwordInput) {
      throw new Error("An input is null!");
    }

    let callback: (params: LoginParams) => Promise<UserCredentials | undefined>;
    if (submitterName === "Login") {
      callback = database.loginUser.bind(database);
    } else if (submitterName === "Register") {
      callback = database.registerUser.bind(database);
    } else {
      throw new Error(`Unknown form submitter '${submitterName}'`);
    }

    const loggedUser = await callback({
      name: nameInput.value,
      surname: surnameInput.value,
      password: passwordInput.value,
    });

    if (!loggedUser) {
      setModalStyle({ display: "block" });
    } else {
      dispatch({
        type: "userLoggedIn",
        credentials: loggedUser,
      });
      navigate(homePagePath);
    }
  }

  return (
    <>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        {["name", "surname", "password"].map((input) => {
          const readableInputName = input[0].toUpperCase() + input.substring(1);
          return (
            <div>
              <label>{readableInputName}</label>
              <input id={input} type={input} name={input} />
            </div>
          );
        })}
        <input className="formSubmitButton" type="submit" value="Login" />
        <input className="formSubmitButton" type="submit" value="Register" />
        
        <div
          id="g_id_onload"
          data-client_id="587637613591-ijs7fl2k881v6fisqk31vc7uj92ej9jq.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="signInWithGoogle"
          data-auto_select="true"
          data-itp_support="true"
        ></div>

        <div
          className="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>
      </form>
      <Modal style={modalStyle} setStyle={setModalStyle}>
        ERROR: wrong credentials
      </Modal>
    </>
  );
}

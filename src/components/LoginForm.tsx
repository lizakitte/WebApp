import { FormEvent, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { homePagePath } from "../lib/pathsNames";
import { database, UserCredentials, LoginParams } from "../lib/data";
import Modal from "./Modal.tsx";
import UserContext from "../lib/UserContext";
import "../styles/formStyle.css";
import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

type GoogleCredentials = {
  given_name: string;
  family_name: string;
  sub: string;
  email: string;
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

  async function signInWithGoogle(data: CredentialResponse) {
    const googleCreds = parseJwt(data.credential!) as GoogleCredentials;

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

        if (!credentials) throw new Error("Unreachable: credentials undefined");
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
      email: googleCreds.email,
    });

    if (!credentials) throw new Error("Unreachable: credentials undefined");
    dispatch({
      type: "userLoggedIn",
      credentials,
    });

    navigate(homePagePath);
  }

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

        <GoogleLogin
          onSuccess={signInWithGoogle}
          onError={() => console.error("Google login failed")}
        ></GoogleLogin>
      </form>
      <Modal style={modalStyle} setStyle={setModalStyle}>
        ERROR: wrong credentials
      </Modal>
    </>
  );
}

import { FormEvent, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { homePagePath } from "../lib/pathsNames";
import { database, UserCredentials } from "../lib/data";
import Modal from "./Modal.tsx";
import UserContext from "../lib/UserContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const { dispatch } = useContext(UserContext);

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

    const nameInput = formElements.namedItem(
      "name"
    ) as HTMLInputElement | null;
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
      <p>Login</p>
      <form onSubmit={onSubmit}>
        {["name", "surname", "password"].map((input) => {
          const readableInputName = input[0].toUpperCase() + input.substring(1);
          return (
            <div>
              <input id={input} type={input} name={input} />
              <label>{readableInputName}</label>
            </div>
          );
        })}
        <input type="submit" value="Login"/>
        <input type="submit" value="Register"/>
      </form>
      <Modal style={modalStyle} setStyle={setModalStyle}>
                                                           ERROR: wrong credentials
      </Modal>
    </>
  );
}

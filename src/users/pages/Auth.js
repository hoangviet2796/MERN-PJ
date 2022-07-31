import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/Loading/ErrorModal";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./Auth.css";
import { useForm } from "../../shared/hooks/useForm";
import { useHttp } from "../../shared/hooks/useHttp";
import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/components/UIElements/Card/Card";

function Auth() {
  const auth = useContext(AuthContext);
  const [isSignIn, setIsSignIn] = useState(false);

  const { isLoading, error, sendRequest, errorHandler } = useHttp();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const signInMode = () => {
    setFormData(
      { ...formState.inputs, name: { value: undefined, isValid: true } },
      formState.inputs.email.isValid && formState.inputs.password.isValid
    );
    setIsSignIn(true);
  };
  const signUpMode = () => {
    setFormData(
      {
        ...formState.inputs,
        name: {
          value: "",
          isValid: false,
        },
      },
      false
    );
    setIsSignIn(false);
  };

  const signUpHandler = async (event) => {
    event.preventDefault();
    try {
      const data = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/signup",
        "POST",
        JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(data.userId, data.token);
    } catch (err) {}
  };

  const signInHandler = async (event) => {
    event.preventDefault();
    try {
      const data = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/login",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(data.userId, data.token);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="wrapper">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="center">
          <Button inverse={isSignIn} onClick={signUpMode}>
            SIGN UP
          </Button>
          <Button inverse={!isSignIn} onClick={signInMode}>
            SIGN IN
          </Button>
        </div>
        <form
          className="auth-form"
          onSubmit={isSignIn ? signInHandler : signUpHandler}
        >
          {!isSignIn && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid name."
              onInput={inputHandler}
            />
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password (at least 6 characters)."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isSignIn ? "SIGN IN" : "SIGN UP"}
          </Button>
        </form>
      </Card>
    </>
  );
}

export default Auth;

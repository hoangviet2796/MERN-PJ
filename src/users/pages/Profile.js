import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input/Input";
import Card from "../../shared/components/UIElements/Card/Card";
import Button from "../../shared/components/FormElements/Button/Button";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/Loading/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";
import { AuthContext } from "../../shared/context/auth-context";
import { VALIDATOR_REQUIRE } from "../../shared/utils/validators";
import "./Auth.css";
import { useForm } from "../../shared/hooks/useForm";
import { useHttp } from "../../shared/hooks/useHttp";

function Profile() {
  const auth = useContext(AuthContext);
  const [identiedUser, setIdentiedUser] = useState();
  const { isLoading, error, sendRequest, errorHandler } = useHttp();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: true,
      },
    },
    true
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`
        );
        setIdentiedUser(data.user);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, auth.userId]);

  useEffect(() => {
    if (identiedUser) {
      setFormData(
        {
          name: {
            value: identiedUser.name,
            isValid: true,
          },
          image: {
            value: null,
            isValid: true,
          },
        },
        true
      );
    }
  }, [setFormData, identiedUser]);

  const history = useHistory();
  const updateUserHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs.image.value);
    const formData = new FormData();
    formData.append("name", formState.inputs.name.value);
    if (formState.inputs.image.value)
      formData.append("image", formState.inputs.image.value);
    console.log(formData);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`,
        "PATCH",
        formData
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (!formState.inputs.name.value) {
    return (
      <div className="center">
        <Card>
          <h2>Nothing</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <form className="auth-form" onSubmit={updateUserHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="name"
          element="input"
          type="text"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          value={formState.inputs.name.value}
          valid={formState.inputs.name.isValid}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please choose valid file (*.jpg, *.png, *.jpeg)"
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE
        </Button>
      </form>
    </>
  );
}

export default Profile;

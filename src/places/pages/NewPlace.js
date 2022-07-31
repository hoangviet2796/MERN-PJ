import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/Loading/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/utils/validators";
import "./Place.css";
import { useForm } from "../../shared/hooks/useForm";
import { useHttp } from "../../shared/hooks/useHttp";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, errorHandler } = useHttp();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      lat: {
        value: "",
        isValid: false,
      },
      lng: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("address", formState.inputs.address.value);
    formData.append("lat", formState.inputs.lat.value);
    formData.append("lng", formState.inputs.lng.value);
    formData.append("creator", auth.userId);
    formData.append("image", formState.inputs.image.value);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/${auth.userId}/places`);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      <form className="place-form" onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="textarea"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please choose valid file (*.jpg, *.png, *.jpeg)"
        />
        <Input
          id="lat"
          element="input"
          label="Latitude"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Latitude."
          onInput={inputHandler}
        />
        <Input
          id="lng"
          element="input"
          label="Longitude"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid Longitude."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;

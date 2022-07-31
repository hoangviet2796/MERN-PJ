import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input/Input";
import Card from "../../shared/components/UIElements/Card/Card";
import Button from "../../shared/components/FormElements/Button/Button";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/Loading/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";
import { AuthContext } from "../../shared/context/auth-context";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/utils/validators";
import "./Place.css";
import { useForm } from "../../shared/hooks/useForm";
import { useHttp } from "../../shared/hooks/useHttp";

function UpdatePlace() {
  const auth = useContext(AuthContext);
  const placeId = useParams().placeId;
  const [identiedPlace, setIdentiedPlace] = useState();
  const { isLoading, error, sendRequest, errorHandler } = useHttp();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: true,
      },
      description: {
        value: "",
        isValid: true,
      },
      address: {
        value: "",
        isValid: true,
      },
      image: {
        value: null,
        isValid: true,
      },
    },
    true
  );

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setIdentiedPlace(data.place);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, placeId]);

  useEffect(() => {
    if (identiedPlace) {
      setFormData(
        {
          title: {
            value: identiedPlace.title,
            isValid: true,
          },
          description: {
            value: identiedPlace.description,
            isValid: true,
          },
          address: {
            value: identiedPlace.address,
            isValid: true,
          },
          image: {
            value: identiedPlace.image,
            isValid: true,
          },
        },
        true
      );
    }
  }, [setFormData, identiedPlace]);

  const history = useHistory();
  const updatePlaceHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("address", formState.inputs.address.value);
    formData.append("image", formState.inputs.image.value);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/${auth.userId}/places`);
    } catch (err) {}
  };

  if (!formState.inputs.title.value) {
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
      <form className="place-form" onSubmit={updatePlaceHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          value={formState.inputs.title.value}
          valid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
          value={formState.inputs.description.value}
          valid={formState.inputs.description.isValid}
        />
        <Input
          id="address"
          element="textarea"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
          value={formState.inputs.address.value}
          valid={formState.inputs.address.isValid}
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

export default UpdatePlace;

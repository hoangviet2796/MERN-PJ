import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/Loading/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import { useHttp } from "../../shared/hooks/useHttp";
export const PLACE = [];
function UserPlace() {
  const userID = useParams().userId;
  const [places, setPlaces] = useState();
  const { isLoading, error, sendRequest, errorHandler } = useHttp();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userID}`
        );
        setPlaces(data.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userID]);
  const deletePlacehandler = (pid) => {
    setPlaces((prev) => prev.filter((p) => p.id !== pid));
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && !!places && (
        <PlaceList items={places} onDelete={deletePlacehandler} />
      )}
    </>
  );
}

export default UserPlace;

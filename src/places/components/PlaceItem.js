import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card/Card";
import Button from "../../shared/components/FormElements/Button/Button";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import Map from "../../shared/components/UIElements/Map/Map";
import ErrorModal from "../../shared/components/UIElements/Loading/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttp } from "../../shared/hooks/useHttp";
import "./PlaceItem.css";
import { useHistory } from "react-router-dom";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, errorHandler } = useHttp();
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const closeDeleteModalHandler = () => setShowDeleteModal(false);
  const openDeleteModalHandler = () => setShowDeleteModal(true);
  const history = useHistory();
  const confirmDeleteHandler = async () => {
    try {
      setShowDeleteModal(false);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/${auth.userId}/places`);
    } catch (err) {}
    props.onDelete(props.id);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        onCancel={closeDeleteModalHandler}
        header={`Delete`}
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={closeDeleteModalHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>Are you sure want to delete this place?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <Button danger onClick={openDeleteModalHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;

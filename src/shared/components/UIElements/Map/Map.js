import React, { useRef } from "react";

import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBMY-ytjTKALmIg2vDcvdnTj0IwTmQSjp8&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `300px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center}>
    {props.isMarkerShown && <Marker position={props.center} />}
  </GoogleMap>
));

function Map(props) {
  const mapRef = useRef();

  return (
    <div ref={mapRef} className={`map ${props.className}`}>
      <MyMapComponent isMarkerShown center={props.center} zoom={props.zoom} />
    </div>
  );
}

export default Map;

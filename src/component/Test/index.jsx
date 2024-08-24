import "mapbox-gl/dist/mapbox-gl.css";

import React, { useState, useEffect } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";

const MapComponent = () => {
   const [viewState, setViewState] = useState({
      longitude: 105.854444,
      latitude: 21.028511,
      zoom: 12,
   });

   const [currentLocation, setCurrentLocation] = useState(null);

   useEffect(() => {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const { latitude, longitude } = position.coords;
               setCurrentLocation({ latitude, longitude });
               setViewState({
                  ...viewState,
                  latitude,
                  longitude,
                  zoom: 15, // Zoom gần vào vị trí hiện tại
               });
            },
            (error) => {
               console.error("Error getting location: ", error);
            }
         );
      }
   }, []);

   return (
      <Map
         {...viewState}
         // style={{ width: "100%", height: "500px" }}
         mapStyle="mapbox://styles/mapbox/streets-v11"
         mapboxAccessToken={import.meta.env.VITE_MAPBOX_KEY}
         onMove={(evt) => setViewState(evt.viewState)}
      >
         {currentLocation && (
            <Marker longitude={currentLocation.longitude} latitude={currentLocation.latitude} color="red" />
         )}
         <NavigationControl position="top-right" />
      </Map>
   );
};

export default MapComponent;

// src/components/Map.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import customIconUrl from "leaflet/dist/images/marker-icon.png";
import customIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import customIconShadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix for marker icons not showing correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl: customIconRetinaUrl,
   iconUrl: customIconUrl,
   shadowUrl: customIconShadowUrl,
});

const LocationMarker = () => {
   const [position, setPosition] = useState(null);
   const map = useMap();

   useEffect(() => {
      if (navigator.geolocation) {
         const watchId = navigator.geolocation.watchPosition((pos) => {
            console.log(pos);
            const { latitude, longitude } = pos.coords;
            const newPosition = [latitude, longitude];
            setPosition(newPosition);
            map.setView(newPosition, map.getZoom());
         });

         return () => {
            navigator.geolocation.clearWatch(watchId);
         };
      }
   }, [map]);

   return position === null ? null : (
      <Marker position={position}>
         <Popup>You are here</Popup>
      </Marker>
   );
};

const Map = () => {
   const initialPosition = [51.505, -0.09];

   return (
      <MapContainer center={initialPosition} zoom={13} style={{ height: "100vh", width: "100vw" }}>
         <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
         />
         <LocationMarker />
      </MapContainer>
   );
};

export default Map;

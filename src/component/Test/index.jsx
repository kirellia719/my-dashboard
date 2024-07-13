import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapPlaceholder = () => {
   return (
      <div
         style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0f0f0",
         }}
      >
         <p>Loading map...</p>
      </div>
   );
};

const CustomMap = () => {
   const [isMapReady, setIsMapReady] = useState(false);

   // Fake a loading state for demo purposes
   useEffect(() => {
      const timer = setTimeout(() => {
         setIsMapReady(true);
      }, 2000); // Simulate a 2 seconds loading time

      return () => clearTimeout(timer);
   }, []);

   return (
      <>
         {!isMapReady && <MapPlaceholder />}
         {isMapReady && (
            <MapContainer
               center={[51.505, -0.09]}
               zoom={13}
               style={{ height: "100vh", width: "100%" }}
               whenReady={() => setIsMapReady(true)}
            >
               <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               />
            </MapContainer>
         )}
      </>
   );
};

export default CustomMap;

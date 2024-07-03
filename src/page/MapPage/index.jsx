// MapPage.jsx
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapPage = () => {
   useEffect(() => {
      const map = L.map("map").setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (position) => {
               const { latitude, longitude } = position.coords;
               map.setView([latitude, longitude], 15);
               L.marker([latitude, longitude]).addTo(map);
            },
            (error) => console.log(error),
            {
               enableHighAccuracy: true,
               timeout: 5000,
               maximumAge: 0,
            }
         );
      }
   }, []);

   return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default MapPage;

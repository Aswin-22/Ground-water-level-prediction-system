import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  ZoomControl,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import loc from "../assets/locicon.png";

// Child component to handle map flyTo user location
const FlyToUserLocation = ({ userLoc }) => {
  const map = useMap(); // This hook works because it's inside MapContainer

  useEffect(() => {
    if (userLoc) {
      map.flyTo(userLoc, 13); // Fly to user location with zoom level 13
    }
  }, [userLoc, map]);

  return null; // No need to render anything, it's just for the side-effect
};

const MapElement = ({ userLoc }) => {
  const markers = userLoc
    ? [
        {
          geocode: userLoc,
        },
      ]
    : [];

  const customIcon = new Icon({
    iconUrl: loc,
    iconSize: [38, 38],
  });

  return (
    <div className="map-box">
      <MapContainer
        center={[17.6868, 83.2185]}
        zoom={5}
        zoomControl={false}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomleft" />

        <MarkerClusterGroup>
          {markers.length > 0 &&
            markers.map((marker, index) => (
              <Marker key={index} position={marker.geocode} icon={customIcon}>
                <Popup>User Location</Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>

        {/* Component to fly to the user's location */}
        <FlyToUserLocation userLoc={userLoc} />
      </MapContainer>

      {!userLoc && <p>No user location available</p>}
    </div>
  );
};

export default MapElement;

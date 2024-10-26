import React, { useState } from "react";
import MapElement from "./MapElement";
import Form from "./form";

function MapPage({setMapPosition }) {
  const [userLoc, setUserLoc] = useState();

  return (
    <div>
      <MapElement userLoc={userLoc} />
      <Form setUserLoc={setUserLoc} setMapPosition={setMapPosition} />
    </div>
  );
}

export default MapPage;

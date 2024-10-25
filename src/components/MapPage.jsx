import React, { useState } from "react";
import MapElement from "./MapElement";
import Form from "./Form";

function MapPage() {
  const [userLoc, setUserLoc] = useState();

  return (
    <div>
      <MapElement userLoc={userLoc} />
      <Form setUserLoc={setUserLoc} />
    </div>
  );
}

export default MapPage;

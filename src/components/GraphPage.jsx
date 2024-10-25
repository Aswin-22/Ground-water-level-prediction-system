import React, { useState } from "react";
import GraphComp from "./GraphComp";
import GraphForm from "./GraphForm";

function GraphPage() {
  const [graphData, setGraphData] = useState(null);

  return (
    <div>
      <GraphForm setGraphData={setGraphData} />
      <GraphComp graphData={graphData} />
    </div>
  );
}

export default GraphPage;

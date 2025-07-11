import React from "react";
import useCanvasCursor from "../hooks/useCanvasCursor";

const CursorTrail = () => {
  useCanvasCursor();

  return (
    <canvas
      id="canvas"
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
    ></canvas>
  );
};

export default CursorTrail;

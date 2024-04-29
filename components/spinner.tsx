import React from "react";

interface SpinnerProps {
  size: "xs" | "sm" | "md" | "lg";
}

function Spinner({ size }: SpinnerProps) {
  return <span className={`loading loading-spinner loading-${size}`}></span>;
}

export default Spinner;

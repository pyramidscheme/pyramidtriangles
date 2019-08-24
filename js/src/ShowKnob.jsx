import React from "react";
import HsvKnob from "./HsvKnob";
import ValueKnob from "./ValueKnob";

// Component for adjusting a show's knobs (settings). Defers to specific type component implementation.
export default function ShowKnob(props) {
  const { type } = props;
  switch (type) {
    case "HSVKnob":
      return <HsvKnob {...props} />;
    case "ValueKnob":
      return <ValueKnob {...props} />;
    default:
      throw new Error(`Unrecognized knob type ${type}`);
  }
}

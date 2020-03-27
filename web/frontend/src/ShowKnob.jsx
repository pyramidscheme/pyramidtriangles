import React from "react";
import HsvKnob from "./HsvKnob";
import ValueKnob from "./ValueKnob";

// Component for adjusting a show's knobs (settings). Defers to specific type component implementation.
export default function ShowKnob({show, type, name, value, onChange}) {
  switch (type) {
    case 'HSVKnob':
      return <HsvKnob name={name} value={value} onChange={onChange} />;
    case 'ValueKnob':
      return <ValueKnob name={name} value={value} onChange={onChange} />;
    default:
      throw new Error(`Unrecognized knob (${show},${name}) of type ${type}`);
  }
}
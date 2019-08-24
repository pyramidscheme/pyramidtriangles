// Adapted from https://gist.github.com/xpansive/1337890#file-annotated-js
export const hsv2hsl = (hue, sat, val) => {
  return [
    hue,

    // Saturation is very different between the two color spaces
    // If (2-sat)*val < 1 set it to sat*val/((2-sat)*val)
    // Otherwise sat*val/(2-(2-sat)*val)
    // Conditional is not operating with hue, it is reassigned!
    (sat * val) / ((hue = (2.0 - sat) * val) < 1.0 ? hue : 2.0 - hue),

    hue / 2.0, // Lightness is (2-sat)*val/2
  ].map((v) => (v ? v : 0.0));
};

export const hsl2hsv = (hue, sat, light) => {
  sat *= light < 0.5 ? light : 1.0 - light;
  return [hue, (2.0 * sat) / (light + sat), light + sat].map((v) =>
    v ? v : 0.0
  );
};

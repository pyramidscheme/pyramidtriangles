import React, { useState } from "react";
import { Card, CardContent, makeStyles, Typography } from "@material-ui/core";
import { ChromePicker } from "react-color";
import { hsl2hsv, hsv2hsl } from "./hsl2hsv";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: 280,
    margin: theme.spacing(1),
  },
  title: {
    alignItems: 'left',
  },
  picker: {
    marginTop: theme.spacing(1),
  },
}));

export default function HsvKnob({name, value, onChange}) {
  const classes = useStyles();

  // Unfortunately the picker uses HSL so we convert before/after.
  const def = value.default;
  const [h, s, l] = hsv2hsl(def.h, def.s, def.v);
  const [pickerColor, setPickerColor] = useState({
    h: h * 360.0,
    s: s,
    l: l,
  });

  const [backgroundColor, setBackgroundColor] = useState(`hsl(${h*360.0},${s*100}%,${l*100}%)`);

  const onChangeComplete = async (color) => {
    // color.hsl has hue in [0,360], saturation in [0,1], luminosity in [0,1]

    // Creating a new object to avoid getting extra parameters like alpha.
    const colorHSL = {h: color.hsl.h, s: color.hsl.s, l: color.hsl.l,};
    setPickerColor(colorHSL); // Needed for some reason to update selector cursor.
    setBackgroundColor(`hsl(${colorHSL.h},${colorHSL.s*100}%,${colorHSL.l*100}%)`);

    const [h, s, v] = hsl2hsv(colorHSL.h / 360.0, colorHSL.s, colorHSL.l);
    await onChange({h: h, s: s, v: v});
  };

  return (
    <Card className={classes.root} style={{ backgroundColor: backgroundColor}}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          {name}
        </Typography>

        <ChromePicker
          className={classes.picker}
          disableAlpha
          color={pickerColor}
          onChangeComplete={onChangeComplete}
        />
      </CardContent>
    </Card>
  );
}
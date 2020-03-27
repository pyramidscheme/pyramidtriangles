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
    setPickerColor(color.hsl);
    setBackgroundColor(color.hex);
    const [h, s, v] = hsl2hsv(pickerColor.h / 360.0, pickerColor.s, pickerColor.l);
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
import {createMuiTheme} from "@material-ui/core";
import {purple, teal} from "@material-ui/core/colors";

export const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: teal,
    type: 'dark',
  },
  status: {
    danger: 'orange',
  },
});
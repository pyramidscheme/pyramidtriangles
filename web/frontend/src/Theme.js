import { createMuiTheme } from "@material-ui/core";
import { blue, purple } from "@material-ui/core/colors";

const darkGray = "#202124";

// Global theme options for app.
export const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: blue,
    type: "dark",
  },
  status: {
    danger: "orange",
  },
  background: darkGray,
});

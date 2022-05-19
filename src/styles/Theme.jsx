import { createTheme } from "@mui/material";
import { blue, blueGrey, green, red, grey } from "@mui/material/colors";

const theme = createTheme({
  //   typography: {
  //     fontFamily: "'Poppins', sans-serif",
  //     fontSize: 14,
  //     fontWeightLight: 300,
  //     fontWeightRegular: 400,
  //     fontWeightMedium: 500,
  //   },
  components: {
    MuiInputBase: {
      defaultProps: {
        sx: {
          borderRadius: "16px",
          height: "48px",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        color: "info",
        InputLabelProps: {
          sx: {
            fontSize: "16px",
          },
        },
      },
    },
    // MuiButton: {
    //   defaultProps: {
    //     size: "large",
    //     variant: "contained",
    //     sx: {
    //       borderRadius: "20px",
    //     },
    //   },
    // },
    MuiSelect: {
      defaultProps: {
        color: "info",
      },
    },
    MuiInputLabel: {
      defaultProps: {
        color: "info",
      },
    },
    MuiRadio: {
      defaultProps: {
        color: "black",
      },
    },
    MuiFormLabel: {
      defaultProps: {
        color: "black",
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: "black",
      },
    },
    // MuiAppBar: {
    //   defaultProps: {
    //     sx: {
    //       backgroundColor: blue[200],
    //     },
    //   },
    // },
  },
  palette: {
    grey: {
      main: blueGrey[100],
      light: blueGrey[50],
      dark: blueGrey[400],
    },
    sky: {
      main: blue[200],
      light: blue[100],
      dark: blue[400],
    },
    danger: {
      main: red["A700"],
    },
    success: {
      main: green[500],
    },
    black: {
      main: grey[900],
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;

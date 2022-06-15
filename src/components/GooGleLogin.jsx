import * as React from "react";
import { GoogleLogin } from "react-google-login";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import theme from "../styles/Theme";

const GooGleLogin = () => {
  const googleRespnse = (response) => {
    console.log(response);
  };

  return (
    <GoogleLogin
      clientId="833753391426-depr9r5jhotuhn2tipfm7v3kp2e4d521.apps.googleusercontent.com"
      render={(renderProps) => (
        <Button
          sx={{ my: 1.5 }}
          startIcon={<FcGoogle />}
          fullWidth
          variant="contained"
          size="large"
          color="google"
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          Continue with google
        </Button>
      )}
      buttonText="Login"
      onSuccess={googleRespnse}
      onFailure={googleRespnse}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GooGleLogin;

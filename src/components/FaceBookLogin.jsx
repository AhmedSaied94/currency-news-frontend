import * as React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import { Button } from "@mui/material";

const FaceBookLogin = () => {
  const facebookResponse = (response) => {
    console.log(response);
  };

  return (
    <FacebookLogin
      appId="1186825595425140"
      autoLoad={true}
      fields="name,email,picture"
      scope="public_profile,user_friends"
      callback={facebookResponse}
      // icon={<FacebookOutlinedIcon />}
      render={(renderProps) => (
        <Button
          startIcon={<FacebookOutlinedIcon />}
          sx={{ my: 1.5 }}
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          onClick={renderProps.onClick}
        >
          Continue with facebook
        </Button>
      )}
    />
  );
};

export default FaceBookLogin;

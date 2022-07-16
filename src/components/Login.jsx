import * as React from "react";
import PropTypes from "prop-types";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import theme from "../styles/Theme";
import FaceBookLogin from "./FaceBookLogin";
import GooGleLogin from "./GooGleLogin";
import { connect } from "react-redux";
import { axiosInstance } from "../Axios";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import Store from "../Store";
import { authInfo } from "../slices/Constants";
import { setBases, setMetals } from "../slices/AllCurrencies";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            left: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Login = (props) => {
  const Theme = useTheme();
  const fullScreen = useMediaQuery(Theme.breakpoints.down("sm"));
  const [loginData, setLoginData] = React.useState({ email: "", password: "" });
  const [cookies, setCookie] = useCookies(["currency_news"]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const handleLoginData = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const onFinish = () => {
    setLoading(true);
    const data = JSON.stringify({
      username: loginData.email.toLowerCase(),
      password: loginData.password,
      client_id: props.client_id,
      client_secret: props.client_secret,
      grant_type: "password",
    });
    axiosInstance
      .post("account/auth/token/", data)
      .then((res) => {
        const date = new Date();
        setCookie("tokens", res.data, {
          expires: date.setSeconds(date.getSeconds + res.data.expires_in),
          path: "/",
        });
        Store.dispatch(setBases({ baseCurrencies: null }));
        Store.dispatch(setMetals({ metals: null }));
        window.location.reload();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response);
        error.response.data.error_description ===
          "Invalid credentials given." &&
          enqueueSnackbar("invalid email or password", "error");
      });
  };

  return (
    <div>
      <BootstrapDialog
        onClose={() =>
          Store.dispatch(authInfo({ com: "login", state: "close" }))
        }
        aria-labelledby="customized-dialog-title"
        open={props.login}
        fullScreen={fullScreen}
        sx={{
          direction: "rtl",
          "& .MuiDialog-paper": {
            // minWidth: "500px",
            backgroundColor: theme.palette.grey.light,
          },
        }}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() =>
            Store.dispatch(authInfo({ com: "login", state: "close" }))
          }
        >
          تسجيل الدخول
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              px: 4,
              py: 2,
              "& .MuiTextField-root": {
                my: 1.5,
                width: "100%",
              },
            }}
            noValidate={false}
            autoComplete="off"
          >
            <TextField
              fullWidth
              name="email"
              label="البريد الالكتروني"
              value={loginData.email}
              required
              type="email"
              color="sky"
              onChange={handleLoginData}
            />
            <TextField
              fullWidth
              name="password"
              label="كلمة المرور"
              value={loginData.password}
              onChange={handleLoginData}
              required
              type="password"
              color="sky"
              size="normal"
            />
            <Typography
              sx={{
                width: "100%",
                mt: -1,
                ml: 1,
                "&:hover": { cursor: "pointer" },
              }}
              textAlign="start"
              variant="subtitle2"
              onClick={() => {
                Store.dispatch(authInfo({ com: "login", state: "close" }));
                Store.dispatch(authInfo({ com: "reset", state: "open" }));
              }}
            >
              هل نسيت كلمة المرور؟
            </Typography>
            <LoadingButton
              color="sky"
              size="large"
              sx={{ my: 1.5 }}
              variant="contained"
              onClick={onFinish}
              loading={loading}
              fullWidth
            >
              تسجيل الدخول
            </LoadingButton>
            <Typography
              sx={{
                "&:hover": {
                  textDecorationLine: "underline",
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                Store.dispatch(authInfo({ com: "login", state: "close" }));
                Store.dispatch(authInfo({ com: "signup", state: "open" }));
              }}
              variant="subtitle2"
            >
              ليس لديك حساب؟ قم بالتسجيل الان
            </Typography>
            <Typography variant="h6">او</Typography>
            <FaceBookLogin />
            <GooGleLogin />
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { client_id, client_secret, login } = state.constants;
  return {
    client_id,
    client_secret,
    login,
  };
};

export default connect(mapStateToProps, { authInfo, setBases, setMetals })(
  Login
);

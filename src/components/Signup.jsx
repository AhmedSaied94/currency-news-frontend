import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
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
import { useSnackbar } from "notistack";
import { axiosInstance } from "../Axios";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
import Store from "../Store";
import { authInfo } from "../slices/Constants";

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

const Signup = (props) => {
  const Theme = useTheme();
  const fullScreen = useMediaQuery(Theme.breakpoints.down("sm"));
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    fullname: "",
  });
  const [cookies, setCookie] = useCookies(["currency_news"]);
  const { enqueueSnackbar } = useSnackbar();

  const handleData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onFinish = () => {
    setLoading(true);
    if (!data.email || !data.fullname || !data.username || !data.password) {
      enqueueSnackbar("Please fill the requierd fields", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
      setLoading(false);
      return;
    }
    if (data.password !== data.password2) {
      enqueueSnackbar("passwords are not matching", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
      setLoading(false);
      return;
    }

    axiosInstance
      .post(
        "account/signup/",
        JSON.stringify({ ...data, home_currency: props.geoData.currency })
      )
      .then((res) => {
        const date = new Date();
        setCookie("tokens", res.data, {
          expires: date.setSeconds(date.getSeconds + res.data.expires_in),
          path: "/",
        });
        window.location.href = "/";
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
        for (const key in error.response.data) {
          enqueueSnackbar(
            key === "password"
              ? error.response.data[key][0].substring(
                  2,
                  error.response.data[key][0].length - 2
                )
              : error.response.data[key][0],
            {
              variant: "error",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
            }
          );
        }
      });
  };

  return (
    <Box>
      <BootstrapDialog
        onClose={() =>
          Store.dispatch(authInfo({ com: "signup", state: "close" }))
        }
        aria-labelledby="customized-dialog-title"
        open={props.signup}
        fullScreen={fullScreen}
        sx={{
          direction: "rtl",
          "& .MuiDialog-container": {
            overflowY: "auto",
          },
          "& .MuiDialog-paper": {
            // minWidth: "500px",
            backgroundColor: theme.palette.grey.light,
            overflowY: "unset",
            marginTop: "14rem",
            maxHeight: "none",
          },
        }}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() =>
            Store.dispatch(authInfo({ com: "signup", state: "close" }))
          }
        >
          حساب جديد
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
              name="username"
              value={data.username}
              label="اسم المستخدم"
              required
              color="sky"
              onChange={handleData}
              //   margin="normal"
            />
            <TextField
              fullWidth
              name="email"
              value={data.email}
              label="البريد الالكتروني"
              required
              type="email"
              color="sky"
              onChange={handleData}

              //   margin="normal"
            />
            <TextField
              fullWidth
              name="fullname"
              value={data.fullname}
              label="الاسم بالكامل"
              required
              color="sky"
              onChange={handleData}

              //   margin="normal"
            />
            <TextField
              fullWidth
              name="password"
              value={data.password}
              label="كلمة المرور"
              required
              type="password"
              color="sky"
              size="normal"
              onChange={handleData}

              //   size="small"
              //   margin="normal"
            />
            <TextField
              fullWidth
              name="password2"
              value={data.password2}
              label="تاكيد كلمة المرور"
              required
              type="password"
              color="sky"
              size="normal"
              onChange={handleData}

              //   size="small"
              //   margin="normal"
            />
            <LoadingButton
              color="sky"
              size="large"
              sx={{ my: 1.5 }}
              fullWidth
              variant="contained"
              loading={loading}
              onClick={onFinish}
            >
              سجل الان
            </LoadingButton>
            <Typography variant="h6">او</Typography>
            <FaceBookLogin />
            <GooGleLogin />
            <Typography
              sx={{
                "&:hover": {
                  textDecorationLine: "underline",
                  cursor: "pointer",
                },
              }}
              onClick={() => {
                Store.dispatch(authInfo({ com: "signup", state: "close" }));
                Store.dispatch(authInfo({ com: "login", state: "open" }));
              }}
              variant="subtitle2"
            >
              لديك حساب بالفعل؟ سجل الدخول من هنا
            </Typography>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { signup, geoData } = state.constants;
  return {
    signup,
    geoData,
  };
};

export default connect(mapStateToProps, { authInfo })(Signup);

import * as React from "react";
import PropTypes from "prop-types";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogActions } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Button, TextField, Badge, Avatar } from "@mui/material";
import { Box } from "@mui/system";
import theme from "../styles/Theme";
import { connect } from "react-redux";
import { axiosInstance } from "../Axios";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import Store from "../Store";
import { authInfo } from "../slices/Constants";
import { BsCheckLg } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: "16px 24px",
    maxWidth: 400,
  },
  "& .MuiDialogActions-root": {
    padding: "16px 24px",
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, py: 2, px: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
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

const ResetPassword = (props) => {
  const [email, setEmail] = React.useState("");
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const [resetView, setResetView] = React.useState(true);

  React.useEffect(() => {
    if (props.authedUser) setEmail(props.authedUser.email);
  }, [props]);

  const onReset = async () => {
    const res = await axiosInstance.post(
      "account/password-reset-request/",
      JSON.stringify({
        email,
        redirect_url: "http://38.242.255.43/reset-password",
      })
    );
    setResetView(false);
  };

  return (
    <Box>
      <BootstrapDialog
        onClose={() =>
          Store.dispatch(authInfo({ com: "reset", state: "close" }))
        }
        aria-labelledby="customized-dialog-title"
        open={props.reset}
        fullScreen={fullScreen}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() =>
            Store.dispatch(authInfo({ com: "reset", state: "close" }))
          }
        >
          {resetView ? "Reset Password" : ""}
        </BootstrapDialogTitle>
        {resetView ? (
          <>
            <DialogContent>
              <Typography
                sx={{ color: theme.palette.grey.dark }}
                variant="subtitle2"
                component="p"
              >
                You will receive an email with instructions on how to reset your
                password in a few minutes. You can also set a new password if
                you’ve never set one before.
              </Typography>
              <Box
                sx={{
                  my: 3,
                  "& .MuiTextField-root": {
                    width: "100%",
                    // mt: 4,
                  },
                  "& .Mui-disabled": {
                    background:
                      "linear-gradient(rgb(248, 250, 253) 0%, rgba(248, 250, 253, 0) 413px);",
                    "&:hover": {
                      cursor: "not-allowed",
                    },
                  },
                }}
              >
                <Typography sx={{ fontWeight: 500 }} variant="caption">
                  Email
                </Typography>
                <TextField
                  type="email"
                  name="email"
                  value={email}
                  required
                  color="primary"
                  disabled={props.authedUser ? true : false}
                  onChange={(e) => setEmail(e.target.value)}
                  //   margin="normal"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  onReset().catch((err) => {
                    enqueueSnackbar(err.response.data, {
                      variant: "error",
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center",
                      },
                    });
                  });
                }}
                disabled={email === "" ? true : false}
                sx={{ textTransform: "capitalize", py: 1 }}
                variant="contained"
                fullWidth
              >
                Reset password
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                  "& .MuiBadge-badge": {
                    right: 4,
                    top: 41,
                    width: 28,
                    height: 28,
                    borderRadius: 5,
                    border: "3px solid #fff",
                    color: "#fff",
                    backgroundColor: "#16c784",
                  },
                }}
              >
                <Badge color="success" badgeContent={<BsCheckLg />}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.grey.light,
                      width: 50,
                      height: 50,
                    }}
                  >
                    <MdEmail
                      style={{
                        fontSize: "22px",
                        color: theme.palette.grey.dark,
                      }}
                    />
                  </Avatar>
                </Badge>
              </Box>
              <Box
                sx={{
                  "& .MuiTypography-root": {
                    textAlign: "center",
                  },
                }}
              >
                <Typography sx={{ fontWeight: 700 }} variant="h5">
                  Check your email
                </Typography>
                <Typography
                  sx={{ fontWeight: 500, color: theme.palette.grey.dark }}
                  variant="subtitle2"
                  component="p"
                >
                  An email has been sent to{" "}
                  <Typography
                    sx={{ color: "#000", fontWeight: 700 }}
                    variant="subtitle1"
                    component="span"
                  >
                    {email}
                  </Typography>{" "}
                  with instructions to reset your password.
                </Typography>
                <Typography sx={{ fontWeight: 300, mt: 3 }} variant="subtitle2">
                  * If the email doesn’t show up soon, check your spam folder or
                  make sure you enter the email you used for registration.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  Store.dispatch(authInfo({ com: "reset", state: "close" }));
                  setResetView(true);
                }}
                sx={{ textTransform: "capitalize", py: 1 }}
                variant="contained"
                fullWidth
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </BootstrapDialog>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { authedUser } = state.user;
  const { reset, host } = state.constants;
  return { authedUser, reset, host };
};

export default connect(mapStateToProps, { authInfo })(ResetPassword);

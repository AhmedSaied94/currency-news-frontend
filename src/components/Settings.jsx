import React from "react";
import { Box } from "@mui/system/";
import { Avatar, Button, TextField, Typography, Input } from "@mui/material";
import theme from "../styles/Theme";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { useMediaQuery } from "@mui/material";
import Store from "../Store";
import { connect } from "react-redux";
import { axiosFetchInstance } from "../Axios";
import { authInfo } from "../slices/Constants";
import { login } from "../slices/AuthedUser";

const Settings = ({ authedUser, host }) => {
  const { enqueueSnackbar } = useSnackbar();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));
  const mobile = useMediaQuery(theme.breakpoints.up(768));
  const small = useMediaQuery(theme.breakpoints.up("sm"));
  const [cookies] = useCookies(["currency_news"]);
  const [data, setData] = React.useState({
    username: "",
    fullname: "",
    email: "",
    profile_pic: "",
    file: "",
  });

  React.useEffect(() => {
    if (authedUser) {
      setData({
        username: authedUser.username,
        fullname: authedUser.fullname,
        email: authedUser.email,
        profile_pic: host + authedUser.profile_pic,
        file: "",
      });
    }
  }, [authedUser]);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      enqueueSnackbar("You can only upload JPG/PNG file!", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
      return false;
    }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      enqueueSnackbar("Image must smaller than 1MB!", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    console.log(e);
    const file = e.target.files[0];
    if (beforeUpload(file)) {
      const reader = new FileReader();
      const url = reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        setData({ ...data, file, profile_pic: reader.result });
      };
    }
  };

  const onFinish = async () => {
    const form = new FormData();

    form.append("username", data.username);
    form.append("fullname", data.fullname);

    if (data.file !== "") form.append("profile_pic", data.file, data.file.name);
    const res = await axiosFetchInstance(cookies.tokens).patch(
      "account/update-profile/",
      form
    );
    console.log(res.data);
    Store.dispatch(
      login({
        ...authedUser,
        username: data.username,
        fullname: data.fullname,
        profile_pic: res.data.profile_pic,
      })
    );
    enqueueSnackbar("Your account updated successfully", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
  };

  return (
    <Box
      sx={{
        background: mobile
          ? "linear-gradient(rgb(248, 250, 253) 0%, rgba(248, 250, 253, 0) 413px);"
          : "",
        px: matches ? 21 : 0,
        py: mobile ? 6 : 0,
        "& .MuiButtonBase-root": {
          textTransform: "capitalize",
          width: "fit-content",
          py: 1,
          px: 3,
        },
      }}
    >
      <Box
        sx={{
          borderRadius: 2,
          border: matches ? `1px solid ${theme.palette.grey.light}` : "",
          borderTop: !matches ? `1px solid ${theme.palette.grey.light}` : "",
          borderBottom: !matches ? `1px solid ${theme.palette.grey.light}` : "",
        }}
      >
        <Box
          sx={{
            borderBottom: `1px solid ${theme.palette.grey.light}`,
            p: mobile ? 4 : 2,
          }}
        >
          <Typography
            sx={{ fontWeight: 700 }}
            variant={mobile ? "h5" : "h6"}
            component="h6"
          >
            Account Settings
          </Typography>
        </Box>
        <Box sx={{ px: mobile ? 4 : 2, py: mobile ? 4 : 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ width: 60, height: 60 }} src={data.profile_pic} />
            <Box sx={{ mx: 2 }}>
              <label htmlFor="contained-button-file">
                <Input
                  sx={{ display: "none" }}
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={handleUpload}
                />
                <Button variant="contained" component="span">
                  Change Avatar
                </Button>
              </label>
            </Box>
          </Box>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "left",
              // px: mobile ? 4 : 2,
              // py: mobile ? 4 : 3,
              "& .MuiTextField-root": {
                width: 360,
                // mt: 4,
              },
              "& .MuiTypography-caption": {
                fontWeight: 500,
                mb: 0.5,
                display: "block",
              },
              "& .Mui-disabled": {
                background:
                  "linear-gradient(rgb(248, 250, 253) 0%, rgba(248, 250, 253, 0) 413px);",
                "&:hover": {
                  cursor: "not-allowed",
                },
              },
            }}
            noValidate={false}
            autoComplete="off"
          >
            <Box sx={{ mt: 3 }}>
              <Typography variant="caption">Full Name</Typography>
              <TextField
                name="fullname"
                value={data.fullname}
                required
                color="primary"
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="caption">Username</Typography>
              <TextField
                name="username"
                value={data.username}
                required
                color="primary"
                helperText="* Username can only be changed once per 7 days"
                onChange={handleChange}
                //   margin="normal"
              />
            </Box>{" "}
            <Box sx={{ mt: 3 }}>
              <Typography variant="caption">Email</Typography>
              <TextField name="email" value={data.email} disabled />
            </Box>
            <Button
              onClick={() => {
                onFinish().catch((err) => {
                  console.log(err.response);
                  const data = err.response.data;
                  for (const key in data) {
                    enqueueSnackbar(`${key}: ${data[key][0]}`, {
                      variant: "error",
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "center",
                      },
                    });
                  }
                });
              }}
              disabled={
                authedUser &&
                authedUser.username === data.username &&
                authedUser.fullname === data.fullname &&
                data.file === ""
                  ? true
                  : false
              }
              sx={{ my: 4, width: "fit-content" }}
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.grey.light}`,
            px: mobile ? 4 : 2,
            py: 3,
            display: "flex",
            flexDirection: small ? "row" : "column",
            alighItems: small ? "center" : "flex-start",
            justifyContent: small ? "space-between" : "center",
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 500 }} variant="subtitle1">
              Password
            </Typography>
            <Typography
              sx={{ fontWeight: 100, color: theme.palette.grey.dark }}
              variant="subtitle2"
            >
              Set a unique password to protect your personal account.
            </Typography>
          </Box>
          <Button
            onClick={() =>
              Store.dispatch(authInfo({ com: "reset", state: "open" }))
            }
            sx={{ mt: small ? 0 : 2 }}
            color="black"
            variant="outlined"
          >
            Change Password
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { authedUser } = state.user;
  const { host } = state.constants;
  return { authedUser, host };
};

export default connect(mapStateToProps, { authInfo, login })(Settings);

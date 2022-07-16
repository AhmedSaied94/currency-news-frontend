import React from "react";
import { Box } from "@mui/system/";
import { Avatar, Button, TextField, Typography, Input } from "@mui/material";
import theme from "../styles/Theme";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { useMediaQuery } from "@mui/material";
import { connect } from "react-redux";
import { authInfo } from "../slices/Constants";
import { axiosInstance } from "../Axios";
import { Link, useLocation } from "react-router-dom";
import QueryString from "query-string";
const ResetConfirm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));
  const mobile = useMediaQuery(theme.breakpoints.up(768));
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [reseted, setReseted] = React.useState("valid");
  const location = useLocation();
  const query = QueryString.parse(location.search);

  React.useEffect(() => {
    if (query.token_valid === "true") setReseted("valid");
    else setReseted("invalid");
  }, []);

  const onReset = async () => {
    const res = await axiosInstance.put(
      "account/password-reset-confirm/",
      JSON.stringify({
        password,
        uid64: query.uid64,
        token: query.token,
      })
    );
    setReseted("done");
  };
  return (
    <Box
      sx={{
        direction: "rtl",
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
            اعد تعيين كلمة المرور
          </Typography>
        </Box>
        {reseted === "valid" ? (
          <Box
            component="form"
            sx={{
              px: mobile ? 4 : 2,
              py: mobile ? 4 : 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "left",
              // px: mobile ? 4 : 2,
              // py: mobile ? 4 : 3,
              "& .MuiTextField-root": {
                width: useMediaQuery(theme.breakpoints.up(390)) ? 360 : "100%",
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
              <Typography variant="caption">كلمة المرور</Typography>
              <TextField
                name="password"
                type="password"
                value={password}
                required
                color="primary"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="caption">تاكيد كلمة المرور</Typography>
              <TextField
                name="password2"
                type="password"
                value={password2}
                required
                color="primary"
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Box>
            <Button
              onClick={() => {
                onReset().catch((err) => {
                  console.log(err.response);
                  const data = err.response.data;
                  if (data.detail === "link has been expired") {
                    setReseted("invalid");
                    return;
                  }
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
                !password ||
                password.length < 8 ||
                !password2 ||
                password !== password2
                  ? true
                  : false
              }
              sx={{ my: 4, width: "fit-content" }}
              variant="contained"
            >
              تغيير كلمة المرور
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              px: mobile ? 4 : 2,
              py: mobile ? 4 : 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& a": {
                textDecoration: "none",
              },
            }}
          >
            <Typography
              textAlign="center"
              sx={{
                fonWeight: 500,
                width: useMediaQuery(theme.breakpoints.up(240)) ? 210 : "auto",
                mb: 3,
              }}
              variant="subtitle1"
              component="p"
            >
              {reseted === "done"
                ? "لقد قمت باعادة تعيين كلمة المرور الخاصة بك بنجاح اعد تسجيل الدخول باستخدام كلمة المرور الجديدة"
                : "انتهت صلاحية الرابط من فضلك اعد عملية اعادة التعيين مرة اخرى"}
            </Typography>
            <Link to="/">
              <Button variant="contained">الذهاب الى الرئيسية</Button>
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResetConfirm;

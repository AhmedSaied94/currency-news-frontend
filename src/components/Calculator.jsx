import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box } from "@mui/system";
import theme from "../styles/Theme";
import { connect } from "react-redux";
import { axiosInstance } from "../Axios";
import { useCookies } from "react-cookie";
import Store from "../Store";
import { authInfo } from "../slices/Constants";
import {
  Select,
  MenuItem,
  InputLabel,
  TextField,
  DialogActions,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: "16px 24px",
    // maxWidth: "90%",
  },
  "& .MuiDialogActions-root": {
    padding: useMediaQuery(theme.breakpoints.up("sm"))
      ? "16px 24px"
      : "16px 12px",
  },
  "& .MuiDialog-paper": {
    maxWidth: useMediaQuery(theme.breakpoints.up("sm")) ? "90%" : "none",
    padding: useMediaQuery(theme.breakpoints.up("sm")) ? 8 : 0,
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

const Calculator = ({ sympols, calculator }) => {
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    first_currency: "",
    second_currency: "",
    amount: "",
  });
  const [result, setResult] = React.useState(0);

  const onCalc = async () => {
    setLoading(true);
    const res = await axiosInstance.post("calculator/", JSON.stringify(data));
    setResult(res.data.result);
    setLoading(false);
  };

  return (
    <Box>
      <BootstrapDialog
        sx={{ direction: "rtl" }}
        onClose={() =>
          Store.dispatch(authInfo({ com: "calculator", state: "close" }))
        }
        aria-labelledby="customized-dialog-title"
        open={calculator}
        fullScreen={fullScreen}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() =>
            Store.dispatch(authInfo({ com: "calculator", state: "close" }))
          }
        >
          حاسبة العملة
        </BootstrapDialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: useMediaQuery(theme.breakpoints.up("sm"))
                ? "center"
                : "flex-start",
              "& .MuiTextField-root": {
                minWidth: useMediaQuery(theme.breakpoints.up("sm"))
                  ? 360
                  : "100%",
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

              "& .MuiSelect-outlined": {
                width: useMediaQuery(theme.breakpoints.up("sm")) ? 360 : "100%",
                boxSizing: "border-box",
              },
              "& .MuiBox-root": {
                width: "100%",
              },
              "& .MuiInputBase-root": {
                width: useMediaQuery(theme.breakpoints.up("sm")) ? 360 : "100%",
              },
            }}
            noValidate={false}
            autoComplete="off"
          >
            <Box sx={{ mt: 3 }}>
              {/* <Typography variant="caption">Base currency</Typography> */}
              <InputLabel id="demo-simple-select-label">
                العملة الاساس
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="calcSelect"
                value={data.first_currency}
                // label="العملة الاساس"
                color="primary"
                onChange={(e) =>
                  setData({ ...data, first_currency: e.target.value })
                }
              >
                {sympols.length > 0 &&
                  sympols.map((cur) => {
                    return (
                      <MenuItem key={cur.sympol} value={cur.sympol}>
                        {cur.ar_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </Box>
            <Box sx={{ mt: 3 }}>
              {/* <Typography variant="caption">Home currency</Typography> */}
              <InputLabel id="demo-simple-select-label2">
                العملة المحلية
              </InputLabel>
              <Select
                labelId="demo-simple-select-label2"
                id="calcSelect2"
                value={data.second_currency}
                // label="العملة المحلية"
                color="primary"
                onChange={(e) =>
                  setData({ ...data, second_currency: e.target.value })
                }
              >
                {sympols.length > 0 &&
                  sympols.map((cur) => {
                    return (
                      <MenuItem key={cur.sympol} value={cur.sympol}>
                        {cur.ar_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </Box>
            <Box sx={{ mt: 3 }}>
              <InputLabel id="demo-simple-select-label">القيمة</InputLabel>
              <TextField
                name="amount"
                value={data.amount}
                type="number"
                required
                color="primary"
                onChange={(e) => setData({ ...data, amount: e.target.value })}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <InputLabel id="demo-simple-select-label">الناتج</InputLabel>
              <TextField
                name="result"
                value={result}
                disabled
                color="primary"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={() => {
              onCalc().catch((err) => {
                console.log(err.response.data);
                setLoading(false);
              });
            }}
            disabled={
              data.first_currency === "" ||
              data.second_currency === "" ||
              data.amount <= 0 ||
              data.first_currency === data.second_currency
                ? true
                : false
            }
            size="large"
            fullWidth
            variant="contained"
            loading={loading}
          >
            احسب
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { sympols, calculator } = state.constants;
  return { calculator, sympols };
};

export default connect(mapStateToProps)(Calculator);

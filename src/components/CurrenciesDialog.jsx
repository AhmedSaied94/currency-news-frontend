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
import { axiosFetchInstance } from "../Axios";
import { useCookies } from "react-cookie";
import Store from "../Store";
import { authInfo, geoInfo } from "../slices/Constants";
import { login } from "../slices/AuthedUser";
import { setBases, setMetals } from "../slices/AllCurrencies";

import CurrencyCard from "./CurrencyCard";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: "16px 24px",
    // maxWidth: "90%",
  },
  "& .MuiDialogActions-root": {
    padding: "16px 24px",
  },
  "& .MuiDialog-paper": {
    maxWidth: "90%",
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

const CurrenciesDialog = ({ changeCur, sympols, authedUser }) => {
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [cookies] = useCookies(["currency_news"]);

  const onChangeCur = async (cur) => {
    const country = cur.sympol.substring(0, 2);
    if (!authedUser) {
      Store.dispatch(geoInfo({ country, currency: cur.sympol }));
    } else {
      const res = await axiosFetchInstance(cookies.tokens).patch(
        "account/update-profile/",
        JSON.stringify({ home_currency: cur.id, country })
      );
      Store.dispatch(
        login({ ...authedUser, home_currency: cur.sympol, country })
      );
    }
    Store.dispatch(setBases({ baseCurrencies: null }));
    Store.dispatch(setMetals({ metals: null }));
    Store.dispatch(authInfo({ com: "changeCur", state: "close" }));
    window.location.reload();
  };

  return (
    <Box>
      <BootstrapDialog
        onClose={() =>
          Store.dispatch(authInfo({ com: "changeCur", state: "close" }))
        }
        aria-labelledby="customized-dialog-title"
        open={changeCur}
        fullScreen={fullScreen}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() =>
            Store.dispatch(authInfo({ com: "changeCur", state: "close" }))
          }
        ></BootstrapDialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "stretch",
              justifyContent: "space-evenly",
            }}
          >
            {sympols.map((cur) => {
              return (
                <Box
                  onClick={() => {
                    onChangeCur(cur).catch((err) => console.log(err.response));
                  }}
                  key={cur.id}
                >
                  <CurrencyCard sympol={cur} />
                </Box>
              );
            })}
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { changeCur, sympols } = state.constants;
  const { authedUser } = state.user;
  return { changeCur, sympols, authedUser };
};

export default connect(mapStateToProps, { authInfo, login })(CurrenciesDialog);

import React from "react";
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
import { RiSearchLine } from "react-icons/ri";
import { InputBase } from "@mui/material";
import CurrencyCard from "./CurrencyCard";
import { axiosInstance } from "../Axios";
import { Link } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  //   paddingTop: "2px",
  //   paddingBottom: "2px",
  //   backgroundColor: theme.palette.grey.light,
  //   "&:hover": {
  //     backgroundColor: theme.palette.grey.main,
  //   },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  minHeight: 50,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    width: "100%",
  },
  "& .MuiInputBase-root": {
    width: "100%",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(0, 1),
    color: theme.palette.grey.dark,
    fontWeight: 700,
    fontSize: "1.1em",
    minHeight: 50,
    height: "100%",
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));

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
    minWidth: useMediaQuery(theme.breakpoints.up("sm")) ? "600px" : "none",
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        py: 1,
        px: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      {...other}
    >
      <IconButton>
        <RiSearchLine />
      </IconButton>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            // position: "absolute",
            // left: 8,
            // top: 8,
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

const SearchDialog = ({ search }) => {
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [cookies] = useCookies(["currency_news"]);
  const [searchValue, setSearchValue] = React.useState("");
  const [result, setResult] = React.useState([]);

  const onChangeSearch = async (e) => {
    setSearchValue(e.target.value);
    const res = await axiosInstance.get(`/search?cur=${e.target.value}`);
    setResult(res.data);
  };

  return (
    <Box>
      <BootstrapDialog
        sx={{ direction: "rtl" }}
        onClose={() => {
          setSearchValue("");
          Store.dispatch(authInfo({ com: "search", state: "close" }));
        }}
        aria-labelledby="customized-dialog-title"
        open={search}
        fullScreen={fullScreen}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => {
            setSearchValue("");
            Store.dispatch(authInfo({ com: "search", state: "close" }));
          }}
        >
          <Search>
            <StyledInputBase
              placeholder="البحث..."
              inputProps={{ "aria-label": "search" }}
              value={searchValue}
              onChange={(e) => {
                onChangeSearch(e).catch((err) => {
                  console.log(err);
                });
              }}
            />
          </Search>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              direction: "rtl",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "stretch",
              justifyContent: "center",
              padding: "2rem 0",
              "& a": {
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  color: "inherit",
                  textDecoration: "none",
                },
              },
            }}
          >
            {result.map((cur) => {
              return (
                <Link
                  onClick={() => {
                    setSearchValue("");
                    Store.dispatch(authInfo({ com: "search", state: "close" }));
                  }}
                  to={`/currency?sympol=${cur.sympol}`}
                  key={cur.id}
                >
                  <CurrencyCard sympol={cur} />
                </Link>
              );
            })}
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { search } = state.constants;
  return { search };
};

export default connect(mapStateToProps, { authInfo })(SearchDialog);

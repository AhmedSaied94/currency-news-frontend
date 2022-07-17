import * as React from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Currency from "./pages/Currency";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import theme from "./styles/Theme";
import Store from "./Store";
import { connect } from "react-redux";
import { login } from "./slices/AuthedUser";
import { axiosFetchInstance, handleUnauthorized } from "./Axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import axios from "axios";
import { geoInfo, sympols } from "./slices/Constants";
import { setPaperCurs, setBases, setMetals } from "./slices/AllCurrencies";
import Currencies from "./pages/Currencies";
import Logout from "./components/Logout";
import News from "./pages/News";
import Settings from "./components/Settings";
import ResetPassword from "./components/ResetPassword";
import ResetConfirm from "./components/ResetConfirm";
import CurrenciesDialog from "./components/CurrenciesDialog";
import Calculator from "./components/Calculator";
import SearchDialog from "./components/SearchDialog";
import { useMediaQuery } from "@mui/material";
function App({ authedUser, geoData }) {
  const [cookies, setCookie, removeCookie] = useCookies(["currency_news"]);
  const [signCom, setSignCom] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const largeScreens = useMediaQuery(theme.breakpoints.up("xl"));

  React.useEffect(() => {
    const userGeo = async () => {
      const res = await axios.get("https://ipapi.co/json/");
      const { country, currency } = res.data;
      Store.dispatch(geoInfo({ country, currency }));
      fetchBases(res.data.currency).catch(
        (error) =>
          error.response.status === 401 &&
          handleUnauthorized(error, enqueueSnackbar)
      );
      fetchMetals(res.data.currency).catch(
        (err) =>
          error.response.status === 401 &&
          handleUnauthorized(error, enqueueSnackbar)
      );
    };

    const fetchBases = async (homeCur) => {
      const basesRes = await axiosFetchInstance(cookies.tokens).get(
        `all-currencies/Base_Currency/?home=${homeCur}`
      );
      console.log(basesRes.data);
      Store.dispatch(setBases({ basesCurrencies: basesRes.data }));
    };
    const fetchMetals = async (homeCur) => {
      const metalsRes = await axiosFetchInstance(cookies.tokens).get(
        `all-currencies/Metals/?home=${homeCur}`
      );
      console.log(metalsRes.data);
      Store.dispatch(setMetals({ metals: metalsRes.data }));
    };
    const fetchSympols = async () => {
      const allSim = await axiosFetchInstance(cookies.tokens).get(
        "all-sympols/"
      );
      Store.dispatch(sympols({ sympols: allSim.data }));
    };

    if (cookies.tokens) {
      axiosFetchInstance(cookies.tokens)
        .get("account/dashboard/")
        .then((res) => {
          console.log(res.data);
          Store.dispatch(login(res.data));
          fetchBases(res.data.home_currency).catch(
            (error) =>
              error.response.status === 401 &&
              handleUnauthorized(error, enqueueSnackbar)
          );
          fetchMetals(res.data.home_currency).catch(
            (err) =>
              error.response.status === 401 &&
              handleUnauthorized(error, enqueueSnackbar)
          );
        })

        .catch((err) => {
          console.log(err.response.data);
          if (error.response.status === 401)
            handleUnauthorized(error, enqueueSnackbar);
          else Store.dispatch(login(null));
        });
    } else if (geoData.currency) {
      Store.dispatch(login(null));
      fetchBases(geoData.currency).catch(
        (error) =>
          error.response.status === 401 &&
          handleUnauthorized(error, enqueueSnackbar)
      );
      fetchMetals(geoData.currency).catch(
        (err) =>
          error.response.status === 401 &&
          handleUnauthorized(error, enqueueSnackbar)
      );
    } else {
      Store.dispatch(login(null));
      userGeo().catch((err) => console.log(err.response.data));
    }
    fetchSympols().catch(
      (err) =>
        error.response.status === 401 &&
        handleUnauthorized(error, enqueueSnackbar)
    );

    // fetchAll().catch((err) => console.log(err.response.data));

    const fetchInterval = setInterval(() => {
      fetchBases(geoData.currency).catch((err) =>
        console.log(err.response.data)
      );
      fetchMetals(geoData.currency).catch((err) =>
        console.log(err.response.data)
      );
      // fetchAll().catch((err) => console.log(err.response.data));
    }, 900000);
    return clearInterval(fetchInterval);
  }, []);

  return (
    <div className="App">
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {geoData.currency && <Navbar />}
          <div style={largeScreens ? { padding: "0 5rem" } : {}}>
            <Login />
            <Signup />
            <ResetPassword />
            <CurrenciesDialog />
            <Calculator />
            <SearchDialog />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/currency" element={<Currency />} />
              <Route path="/currencies" element={<Currencies />} />
              <Route path="/news/*" element={<News />} />
              <Route
                path="/logout"
                element={<Logout path={window.location.href} />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reset-password" element={<ResetConfirm />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    authedUser: state.authedUser,
    geoData: state.constants.geoData,
  };
};

export default connect(mapStateToProps, {
  login,
  setPaperCurs,
  setBases,
  setMetals,
  geoInfo,
  sympols,
})(App);

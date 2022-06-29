import * as React from "react";

import { Grid, Typography, Avatar, Chip, IconButton } from "@mui/material";

import { Breadcrumbs } from "@mui/material";
import { Box } from "@mui/system";
import theme from "../styles/Theme";
import Area from "../components/Area";
import CurLowHigh from "../components/CurLowHigh";
import { Link } from "@mui/material";
import QueryString from "query-string";
import { useLocation } from "react-router-dom";
import Store from "../Store";
import { connect } from "react-redux";
import { setCurrency } from "../slices/AllCurrencies";
import { axiosFetchInstance } from "../Axios";
import { useCookies } from "react-cookie";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tweets from "../components/Tweets";
import NewsSection from "../components/NewsSection";
import CurrencyHeader from "../components/CurrencyHeader";
import BasesChips from "../components/BasesChips";

const Currency = ({ currency, geoData, authedUser }) => {
  const location = useLocation();
  const query = QueryString.parse(location.search);
  const [cookies] = useCookies(["currency_news"]);
  const [base, setBase] = React.useState("USD");
  const [days, setDays] = React.useState({});
  // const [homeValue, setHomeValue] = React.useState("");

  React.useEffect(() => {
    const fetchCurrency = async (sympol) => {
      const res = await axiosFetchInstance(cookies.tokens).get(
        `currency-details/${sympol}/?home=${geoData.currency}&base=${base}`
      );
      // setHomeValue(
      //   res.data.currency_type === "Base_Currency"
      //     ? res.data.home_value
      //     : res.data.home_value[base]
      // );
      const arr = {};
      res.data.news.map((news, inx) => {
        arr[news.date] = inx;
      });
      setDays(arr);

      Store.dispatch(setCurrency({ currency: res.data }));
    };

    fetchCurrency(query.sympol).catch((err) => console.log(err));

    return () => Store.dispatch(setCurrency({ currency: null }));
  }, [query.sympol, base]);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Home
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/currencies">
      Currencies
    </Link>,
    <Typography
      sx={{ fontSize: "1em", fontWeight: 500 }}
      key="3"
      color="text.primary"
    >
      {currency && currency.sympol}
    </Typography>,
  ];

  return (
    <>
      {currency ? (
        <Box>
          <Box
            sx={{
              backgroundColor: "#f8fafd",
              py: 3,
              px: 2,
            }}
          >
            <Breadcrumbs
              sx={{ fontSize: "0.8em", fontWeight: 500 }}
              separator=">"
            >
              {breadcrumbs}
            </Breadcrumbs>
            <CurrencyHeader base={base} currency={currency} />
          </Box>

          {currency.currency_type === 'Normal Currency' && (
            <BasesChips base={base} currency={currency} setBase={setBase} />
          )}
          <Grid sx={{ p: 2 }} container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ my: 3, px: 2 }} textAlign="left">
                <Typography variant="h6">
                  {currency.currency_type !== 'Normal Currency'?
                    {currency.sympol} To {authedUser? authedUser.home_currency : geoData.currency}
                  :
                  {base} To {currency.sympol} Chart
                }
                </Typography>
              </Box>
              <Area />
            </Grid>
            <Grid sx={{ alignSelf: "center" }} item xs={12} md={4}>
              <Box sx={{ my: 3 }} textAlign="left">
                <CurLowHigh />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <NewsSection currency={currency} days={days} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ my: 2, px: 2 }} textAlign="left">
                <Typography variant="h6">Last Tweets</Typography>
              </Box>
              <Tweets tweets={currency.tweets} />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Stack sx={{ width: "100%", height: "100%", p: 5 }} spacing={1}>
          <Skeleton variant="text" />
          <Skeleton variant="circular" width={100} height={100} />
          <Skeleton variant="rectangular" sx={{ width: "100%" }} height={500} />
        </Stack>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { currency } = state.allCurrencies;
  const { geoData } = state.constants;
  const {authedUser} = state.user
  return { currency, geoData, authedUser };
};

export default connect(mapStateToProps, { setCurrency })(Currency);

import React from "react";
import { Box } from "@mui/material";
import { Typography, Chip, Avatar, IconButton } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import theme from "../styles/Theme";
import { connect } from "react-redux";
import Store from "../Store";
import { handleWatchlist } from "../slices/AuthedUser";
import { useCookies } from "react-cookie";
import { axiosFetchInstance } from "../Axios";
import { authInfo } from "../slices/Constants";

const CurrencyHeader = ({ currency, homeValue, base, authedUser }) => {
  const [cookies] = useCookies(["currency_news"]);

  const handleFav = async (id) => {
    if (!authedUser) {
      Store.dispatch(authInfo({ com: "login", state: "open" }));
      return;
    }
    const oper = authedUser.favorites.includes(id) ? "remove" : "add";
    const res = await axiosFetchInstance(cookies.tokens).post(
      "handle-favorites/",
      { oper, id }
    );
    Store.dispatch(handleWatchlist({ oper, id }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Avatar
          src={
            currency.currency_type !== "Metals"
              ? `https://countryflagsapi.com/svg/${currency.sympol
                  .substring(0, 2)
                  .toLowerCase()}`
              : currency.name === "Silver"
              ? "/silver.png"
              : `/${currency.name.toLowerCase()}.jpg`
          }
        />
        <Typography sx={{ mx: 2, fontWeight: 500 }} component="h6" variant="h4">
          {currency.ar_name}
        </Typography>
        <Chip
          sx={{
            borderRadius: "5px",
            backgroundColor: theme.palette.grey.light,
            py: 1.5,
            fontWeight: 500,
            fontSize: "0.8em",
            color: theme.palette.grey.dark,
            m: 1,
          }}
          size="small"
          label={currency.sympol}
        />
        <IconButton
          sx={{
            mx: 1,
            border: `1px solid ${theme.palette.grey.main}`,
            borderRadius: "10px",
            fontSize: "1em",
          }}
          onClick={() =>
            handleFav(currency.id).catch((err) => console.log(err.respone))
          }
        >
          {authedUser && authedUser.favorites.includes(currency.id) ? (
            <StarIcon sx={{ fontSize: "1em" }} color="warning" />
          ) : (
            <StarBorderIcon
              sx={{ fontSize: "1em", color: theme.palette.grey.main }}
            />
          )}
        </IconButton>
      </Box>
      <Box>
        <Typography
          textAlign="left"
          sx={{
            fontSize: "0.8em",
            color: theme.palette.grey.dark,
            fontWeight: 400,
          }}
        >
          {currency.ar_name} ({currency.sympol})
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <Typography
            textAlign="right"
            sx={{ mx: 2, fontWeight: 500 }}
            component="h6"
            variant="h4"
          >
            {currency.currency_type !== "Normal Currency"
              ? currency.home_value
              : `${base} = ${currency.home_value}`}
          </Typography>
          <Chip
            sx={{
              borderRadius: "5px",
              py: 1.5,
              fontWeight: 500,
              fontSize: "0.8em",
              color: "#fff",
              backgroundColor:
                currency.home_value.substring(0, 5) -
                  currency.close_price.substring(0, 6) >
                0
                  ? theme.palette.up
                  : theme.palette.down,
            }}
            size="large"
            label={
              Math.round(
                ((currency.home_value.substring(
                  0,
                  currency.home_value.length - 4
                ) -
                  currency.close_price.substring(
                    0,
                    currency.close_price.length - 4
                  )) /
                  currency.close_price.substring(
                    0,
                    currency.close_price.length - 4
                  ) +
                  Number.EPSILON) *
                  1000
              ) /
                1000 +
              "%"
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { authedUser } = state.user;
  return { authedUser };
};

export default connect(mapStateToProps, { handleWatchlist, authInfo })(
  CurrencyHeader
);

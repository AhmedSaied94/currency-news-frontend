import React from "react";
import Store from "../Store";
import { geoInfo, authInfo } from "../slices/Constants";
import { login } from "../slices/AuthedUser";
import { setMetals, setBases } from "../slices/AllCurrencies";
import { connect } from "react-redux";
import { Stack, Chip, Avatar } from "@mui/material";
import { axiosFetchInstance } from "../Axios";
import { useCookies } from "react-cookie";
import { GoPlus } from "react-icons/go";
const ar_curs_sympols = [
  "EGP",
  "AED",
  "IQD",
  "BHD",
  "QAR",
  "OMR",
  "KWD",
  "JOD",
  "LBP",
  "LYD",
  "DZD",
  "MAD",
  "SAR",
  "YER",
  "TRY",
  "SDG",
  "TND",
];

const HomeChips = ({ authedUser, sympols }) => {
  const [cookies] = useCookies(["currency_news"]);
  const onChangeCur = async (cur) => {
    const country = cur.substring(0, 2);
    if (!authedUser) {
      Store.dispatch(geoInfo({ country, currency: cur }));
    } else {
      const res = await axiosFetchInstance(cookies.tokens).patch(
        "account/update-profile/",
        JSON.stringify({
          home_currency: sympols.find((cr) => cr.sympol === cur).id,
          country,
        })
      );
      Store.dispatch(login({ ...authedUser, home_currency: cur, country }));
    }
    Store.dispatch(setBases({ baseCurrencies: null }));
    Store.dispatch(setMetals({ metals: null }));
    window.location.reload();
  };
  return (
    <>
      {sympols.length > 0 && (
        <Stack
          sx={{
            direction: "ltr",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            my: 2,
          }}
          direction="row"
          spacing={2}
        >
          {ar_curs_sympols.map((cur) => {
            return (
              <Chip
                key={cur}
                avatar={
                  <Avatar
                    alt={cur}
                    src={`https://countryflagsapi.com/svg/${cur
                      .substring(0, 2)
                      .toLowerCase()}`}
                  />
                }
                sx={{ my: 1 }}
                onClick={() =>
                  onChangeCur(cur).catch((err) => {
                    console.log(err);
                  })
                }
                label={sympols.find((cr) => cr.sympol === cur).ar_name}
                variant="outlined"
                clickable
              />
            );
          })}
          <Chip
            icon={<GoPlus />}
            label="المزيد"
            sx={{ my: 1 }}
            onClick={() =>
              Store.dispatch(authInfo({ com: "changeCur", state: "open" }))
            }
            variant="outlined"
            clickable
          />
        </Stack>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { authedUser } = state.user;
  const { sympols } = state.constants;
  return { sympols, authedUser };
};

export default connect(mapStateToProps, { geoInfo, setBases, setMetals })(
  HomeChips
);

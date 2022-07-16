import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Sparklines, SparklinesSpots, SparklinesLine } from "react-sparklines";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import theme from "../styles/Theme";
import { connect } from "react-redux";
import { AiOutlineFall, AiOutlineRise } from "react-icons/ai";
import { handleWatchlist } from "../slices/AuthedUser";
import Store from "../Store";
import { useCookies } from "react-cookie";
import { axiosFetchInstance } from "../Axios";
import { authInfo } from "../slices/Constants";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import HomeChips from "./HomeChips";

const Metals = ({ type, authedUser, geoData, metals }) => {
  const [cookies] = useCookies(["currency_news"]);
  const [rows, setRows] = React.useState({
    GoldRows: [],
    SilverRows: [],
    OtherRows: [],
  });

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

  const renderPerc = (value) => {
    const color = value.value > 0 ? theme.palette.up : theme.palette.down;

    return (
      <>
        {value.value > 0 ? (
          <AiOutlineRise
            style={{ marginRight: "0.5rem" }}
            size={25}
            color={color}
          />
        ) : (
          <AiOutlineFall
            style={{ marginRight: "0.5rem" }}
            size={25}
            color={color}
          />
        )}
        {`${Math.abs(value.value)} %`}
      </>
    );
  };

  React.useEffect(() => {
    const Rows = {
      GoldRows: [],
      SilverRows: [],
      OtherRows: [],
    };
    const carats = {
      Gold: [
        "24 carat",
        "21 carat",
        "18 carat",
        "14 carat",
        "5G ingot",
        "100 G ingot",
        "250 G ingot",
        "1 Kg ingot",
        "ounce",
      ],
      Silver: ["999 carat", "925 carat", "800 carat", "ounce"],
    };
    const arCarats = {
      Gold: {
        "24 carat": "عيار 24",
        "21 carat": "عيار 21",
        "18 carat": "عيار 18",
        "14 carat": "عيار 14",
        "5G ingot": "سبيكة 5جم",
        "100 G ingot": "سبيكة 100جم",
        "250 G ingot": "سبيكة 250جم",
        "1 Kg ingot": "سبيكة 1كجم",
        ounce: "اوقية",
      },
      Silver: {
        "999 carat": "عيار 999",
        "925 carat": "عيار 925",
        "800 carat": "عيار 800",
        ounce: "اوقية",
      },
    };
    let counter = 1;
    const sympol =
      authedUser && authedUser.home_currency
        ? authedUser.home_currency
        : geoData.currency;

    const calcValues = (carat, price, type) => {
      let value = 0;
      if (type === "gold")
        value =
          carat === "ounce"
            ? price
            : carat.indexOf("Kg") > 0
            ? (price / 31.1) * 1000
            : carat.indexOf("ingot") > 0
            ? (carat
                .split("")
                .filter((n) => !isNaN(n))
                .join("") *
                price) /
              31.1
            : (price / 31.1 / 24) * carat.substring(0, 2);
      else if (type === "silver")
        value =
          carat.substring(0, 3) == 999
            ? price / 31.1
            : carat.substring(0, 3) == 925
            ? price / 33.6
            : carat.substring(0, 3) == 800
            ? price / 38.85
            : price;
      return value;
    };
    if (metals) {
      for (const metal of metals) {
        if (metal.name === "Gold" || metal.name === "Silver") {
          for (const carat of carats[metal.name]) {
            let current = 0;
            let close = 0;
            let arrayName = "";
            if (metal.name == "Gold") {
              current = calcValues(carat, metal.home_value, "gold");
              close = calcValues(carat, metal.close_price, "gold");
              arrayName = "GoldRows";
            } else if (metal.name === "Silver") {
              current = calcValues(carat, metal.home_value, "silver");
              close = calcValues(carat, metal.close_price, "silver");
              arrayName = "SilverRows";
            }
            Rows[arrayName].push({
              "#": carats[metal.name].indexOf(carat) + 1,
              id: metal.id + carat,
              carat: {
                carat: arCarats[metal.name][carat],
                name: metal.ar_name,
                sympol: metal.sympol,
              },
              price: `${
                Math.round((current + Number.EPSILON) * 100) / 100
              } ${sympol}`,
              sellPrice: `${
                Math.round(
                  (current + metal.profit_margin + Number.EPSILON) * 100
                ) / 100
              } ${sympol}`,
              "24h":
                Math.round(
                  (((current - close) / close) * 100 + Number.EPSILON) * 100
                ) / 100,
              "7d": 1.5,
              lastClose: `${
                Math.round((close + Number.EPSILON) * 100) / 100
              } ${sympol}`,
              // last7chart: metal.last7graph,
              last7chart: [200, 240, 120, 320, 415, 380, 230],

              addtofav: metal.id,
            });
          }
        } else {
          Rows.OtherRows.push({
            "#": counter,
            id: metal.id,
            carat: { carat: "", name: metal.ar_name, sympol: metal.sympol },
            price:
              Math.round((metal.home_value / 31.1 + Number.EPSILON) * 100) /
                100 +
              ` ${sympol}`,
            sellPrice:
              Math.round(
                (metal.home_value / 31.1 +
                  metal.profit_margin +
                  Number.EPSILON) *
                  100
              ) /
                100 +
              ` ${sympol}`,
            "24h":
              Math.round(
                (((metal.home_value - metal.close_price) / metal.close_price) *
                  100 +
                  Number.EPSILON) *
                  100
              ) / 100,
            "7d": 0.5,
            lastClose: `${
              Math.round((metal.close_price + Number.EPSILON) * 100) / 100
            } ${sympol}`,
            // last7chart: metal.last7graph,
            last7chart: [200, 240, 120, 320, 415, 380, 190],

            addtofav: metal.id,
          });
          counter++;
        }
      }
      setRows(Rows);
    }
  }, [metals]);

  const columns = [
    {
      field: "addtofav",
      width: 10,
      headerName: "",
      align: "center",
      renderCell: (id) => {
        let oper =
          authedUser && authedUser.favorites.includes(id.value)
            ? "remove"
            : "add";
        return (
          <IconButton
            onClick={() => {
              handleFav(id.value).catch((err) => console.log(err.respone));
            }}
          >
            {authedUser && authedUser.favorites.includes(id.value) ? (
              <StarIcon sx={{ fontSize: "0.7em" }} color="warning" />
            ) : (
              <StarBorderIcon sx={{ fontSize: "0.7em" }} />
            )}
          </IconButton>
        );
      },
    },
    {
      field: "#",
      headerName: "#",
      width: 10,
      align: "left",
      headerAlign: "left",
      cellClassName: "normalCell",
    },
    {
      field: "carat",
      headerName: "العيار",
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (values) => {
        const metalName = values.value.name;
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
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
            <Link to={`/currency?sympol=${values.value.sympol}`}>
              {" "}
              <Avatar
                sx={{ width: 30, height: 30 }}
                src={
                  metalName === "Gold"
                    ? "/gold.jpg"
                    : metalName === "Silver"
                    ? "/silver.png"
                    : metalName === "Palladium"
                    ? "/palladium.jpg"
                    : "/platinum.jpg"
                }
              />
            </Link>
            <Link to={`/currency?sympol=${values.value.sympol}`}>
              {" "}
              <p
                style={{
                  margin: "0 0.5rem",
                }}
              >
                {values.value.carat !== "اوقية"
                  ? `${values.value.name} ${values.value.carat}`
                  : `${values.value.carat} ${values.value.name}`}
              </p>
            </Link>
            <Link to={`/currency?sympol=${values.value.sympol}`}>
              {" "}
              <h4 style={{ color: theme.palette.grey.dark }}>
                {values.value.sympol}
              </h4>
            </Link>
          </Box>
        );
      },
    },
    {
      field: "price",
      headerName: "السعر",
      width: 136,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sellPrice",
      headerName: "سعر البيع",
      width: 136,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "lastClose",
      headerName: "سعر الاغلاق",
      width: 136,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "24h",
      headerName: "متوسط الامس",
      width: 136,
      align: "center",
      headerAlign: "center",
      renderCell: renderPerc,
    },
    {
      field: "7d",
      headerName: "متوسطع الاسبوع",
      width: 136,
      align: "center",
      headerAlign: "center",
      renderCell: renderPerc,
    },
    {
      field: "last7chart",
      headerName: "الحركة البيانية لاخر اسبوع",
      width: 280,
      align: "center",
      headerAlign: "center",
      renderCell: (values) => {
        const color =
          values.value[values.value.length - 1] >= values.value[0]
            ? theme.palette.up
            : theme.palette.down;
        return (
          <Sparklines
            style={{ width: "100%", height: "100%", padding: "5px" }}
            data={values.value}
          >
            <SparklinesLine style={{ strokeWidth: 1.5 }} color={color} />
            {/* <SparklinesSpots
              size={2}
              style={{ strokeWidth: 3, stroke: { color }, fill: "white" }}
            /> */}
          </Sparklines>
        );
      },
    },
  ];
  return (
    <>
      {metals &&
        metals.map((metal, inx) => {
          if (metal.name === "Gold" || metal.name === "Silver") {
            return (
              <div
                key={inx}
                style={{
                  height: metal.name === "Gold" ? 800 : 400,
                  margin: "1rem",
                  marginTop: "10rem",
                  direction: "rtl",
                }}
              >
                <HomeChips />
                <DataGrid
                  rowHeight={80}
                  rows={metal.name === "Gold" ? rows.GoldRows : rows.SilverRows}
                  columns={columns}
                  pageSize={metal.name === "Gold" ? 9 : 4}
                  rowsPerPageOptions={metal.name === "Gold" ? [9] : [4]}
                />
              </div>
            );
          }
        })}
      {metals && (
        <div
          style={{
            height: 240,
            margin: "1rem",
            direction: "rtl",
            marginTop: "10rem",
          }}
        >
          <HomeChips />
          <DataGrid
            rowHeight={80}
            rows={rows.OtherRows}
            columns={columns}
            pageSize={2}
            rowsPerPageOptions={[2]}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { authedUser } = state.user;
  const { geoData } = state.constants;
  const { metals } = state.allCurrencies;

  return { authedUser, geoData, metals };
};

export default connect(mapStateToProps, { handleWatchlist })(Metals);

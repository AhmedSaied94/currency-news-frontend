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
        "44 carat",
        "5G ingot",
        "100 G ingot",
        "250 G ingot",
        "1 Kg ingot",
        "ounce",
      ],
      Silver: ["999 carat", "925 carat", "800 carat", "ounce"],
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
              carat: carat,
              price: `${
                Math.round((current + Number.EPSILON) * 100) / 100
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
            carat: metal.name,
            price:
              Math.round((metal.home_value / 31.1 + Number.EPSILON) * 100) /
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
      width: 5,
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
      width: 15,
      align: "left",
      headerAlign: "left",
      cellClassName: "normalCell",
    },
    {
      field: "carat",
      headerName: "carat",
      width: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Price",
      width: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "lastClose",
      headerName: "Last Close",
      width: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "24h",
      headerName: "24h",
      width: 170,
      align: "center",
      headerAlign: "center",
      renderCell: renderPerc,
    },
    {
      field: "7d",
      headerName: "7d",
      width: 170,
      align: "center",
      headerAlign: "center",
      renderCell: renderPerc,
    },
    {
      field: "last7chart",
      headerName: "Last 7 Chart",
      width: 310,
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
                }}
              >
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
        <div style={{ height: 240, margin: "1rem" }}>
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

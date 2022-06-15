import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Sparklines, SparklinesSpots, SparklinesLine } from "react-sparklines";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import theme from "../styles/Theme";
import { connect } from "react-redux";
import { Avatar } from "@mui/material";
import { AiOutlineFall, AiOutlineRise } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";
import { handleWatchlist } from "../slices/AuthedUser";
import Store from "../Store";
import { useCookies } from "react-cookie";
import { axiosFetchInstance } from "../Axios";
import { authInfo } from "../slices/Constants";

const BasesTable = ({ bases, authedUser, geoData }) => {
  const [fav, setFav] = React.useState(false);
  const [rows, setRows] = React.useState([]);
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

  const renderPerc = (value) => {
    const color = value.value > 0 ? theme.palette.up : theme.palette.down;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
        <p style={{ color }}>{`${Math.abs(value.value)} %`}</p>
      </div>
    );
  };

  React.useEffect(() => {
    const rows = [];
    const sympol =
      authedUser && authedUser.home_currency
        ? authedUser.home_currency
        : geoData.currency;
    if (bases) {
      for (const base of bases) {
        const h24 =
          ((base.home_value - base.close_price) / base.close_price) * 100;
        rows.push({
          "#": bases.indexOf(base),
          id: base.id,
          name: { name: base.name, sympol: base.sympol },
          price: `${
            Math.round((base.home_value + Number.EPSILON) * 100) / 100
          } ${sympol}`,
          "24h": Math.round((h24 + Number.EPSILON) * 100) / 100,
          "7d": -2.5,
          lastClose: `${
            Math.round((base.close_price + Number.EPSILON) * 100) / 100
          } ${sympol}`,
          // last7chart: base.last7graph,
          last7chart: [200, 240, 120, 320, 415, 380, 190],
          addtofav: base.id,
        });
      }
    }
    setRows(rows);
  }, [bases]);

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
      field: "name",
      headerName: "Name",
      width: 250,
      align: "left",
      headerAlign: "left",
      renderCell: (values) => {
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
                src={`https://countryflagsapi.com/svg/${values.value.sympol
                  .substring(0, 2)
                  .toLowerCase()}`}
              />
            </Link>
            <Link to={`/currency?sympol=${values.value.sympol}`}>
              {" "}
              <p
                style={{
                  margin: "0 0.5rem",
                }}
              >
                {values.value.name}
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
              style={{ strokeWidth: 1, stroke: color, fill: "white" }}
            /> */}
          </Sparklines>
        );
      },
    },
  ];
  return (
    <div style={{ height: 1040, margin: "1rem" }}>
      <DataGrid
        rowHeight={80}
        rows={rows}
        columns={columns}
        pageSize={12}
        rowsPerPageOptions={[12]}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { basesCurrencies } = state.allCurrencies;
  const { authedUser } = state.user;
  const { geoData } = state.constants;
  console.log(geoData);
  return { bases: basesCurrencies, authedUser, geoData };
};

export default connect(mapStateToProps, { handleWatchlist, authInfo })(
  BasesTable
);

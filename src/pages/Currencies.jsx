import * as React from "react";
import CurrencyCard from "../components/CurrencyCard";
import { connect } from "react-redux";
import { handleWatchlist } from "../slices/AuthedUser";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const Currencies = ({ sympols }) => {
  return (
    <Box
      sx={{
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
      {sympols.map((sympol, indx) => {
        return (
          <Link key={indx} to={`/currency?sympol=${sympol.sympol}`}>
            <CurrencyCard sympol={sympol} />
          </Link>
        );
      })}
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { sympols } = state.constants;
  return { sympols };
};

export default connect(mapStateToProps, { handleWatchlist })(Currencies);

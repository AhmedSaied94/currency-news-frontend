import React from "react";
import { Box } from "@mui/material";
import { Chip } from "@mui/material";
import theme from "../styles/Theme";
import { connect } from "react-redux";

const BasesChips = ({ setBase, currency, base, bases }) => {
  return (
    <Box sx={{ m: 1 }}>
      {bases &&
        bases
          .filter((base) => base.currency_type !== "Metals")
          .map((cur) => {
            return (
              <Chip
                key={cur.id}
                sx={{
                  borderRadius: "5px",
                  backgroundColor:
                    base === cur.sympol
                      ? theme.palette.primary.main
                      : theme.palette.grey.light,
                  py: 1.5,
                  fontWeight: 500,
                  fontSize: "0.8em",
                  color: base === cur.sympol ? "#fff" : theme.palette.grey.dark,
                  m: 1,
                }}
                clickable
                onClick={() => setBase(cur.sympol)}
                size="small"
                label={cur.ar_name}
              />
            );
          })}
    </Box>
  );
};

const mapStateToProps = (state) => {
  const { basesCurrencies } = state.allCurrencies;
  return { bases: basesCurrencies };
};

export default connect(mapStateToProps)(BasesChips);

import * as React from "react";
import { Box } from "@mui/system";
import {
  ListItem,
  List,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";

const CurLowHigh = ({ currency }) => {
  return (
    <List
      sx={{
        width: "100%",
        // maxWidth: 360,
        bgcolor: "background.paper",
        "& .MuiTypography-root": {
          fontWeight: 500,
          lineHeight: 1,
        },
        "& .MuiListItem-root": {
          py: 2,
        },
      }}
    >
      <Divider component="li" />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ListItem>
          <ListItemText
            primary={currency.close_price}
            secondary="Prev. close"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            sx={{ textAlign: "right" }}
            primary={currency.open_price}
            secondary="Open"
          />
        </ListItem>
      </Box>
      <Divider component="li" />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ListItem>
          <ListItemText
            primary={currency.day_low_high.low}
            secondary="Day low"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            sx={{ textAlign: "right" }}
            primary={currency.day_low_high.high}
            secondary="Day high"
          />
        </ListItem>
      </Box>
      <Divider component="li" />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ListItem>
          <ListItemText
            primary={currency.last7_low_high.low}
            secondary="Week low"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            sx={{ textAlign: "right" }}
            primary={currency.last7_low_high.high}
            secondary="Week high"
          />
        </ListItem>
      </Box>
    </List>
  );
};

const mapStateToProps = (state) => {
  const { currency } = state.allCurrencies;
  return { currency };
};

export default connect(mapStateToProps)(CurLowHigh);

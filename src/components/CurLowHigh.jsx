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
            secondary="سعر اغلاق امس"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            sx={{ textAlign: "left" }}
            primary={currency.open_price}
            secondary="سعر افتتاح امس"
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
            secondary="اقل قيمة خلال اليوم"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            sx={{ textAlign: "left" }}
            primary={currency.day_low_high.high}
            secondary="اعلى قيمة خلال اليوم"
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
            secondary="اقل قيمة خلال الاسبوع"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            sx={{ textAlign: "left" }}
            primary={currency.last7_low_high.high}
            secondary="اعلى قيمة خلال الاسبوع"
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

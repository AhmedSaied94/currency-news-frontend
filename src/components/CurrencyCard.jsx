import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { Avatar, useMediaQuery } from "@mui/material";
import theme from "../styles/Theme";

const CurrencyCard = ({ sympol }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: useMediaQuery(theme.breakpoints.up("sm")) ? 300 : 180,
        m: 1,
        backgroundColor: "#fff",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: theme.palette.grey.main,
          transform: "scale(1.05)",
          borderRadius: "10px",
        },
        transition: "all linear 0.2s",
      }}
    >
      <Card
        sx={{
          width: "100%",
          p: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "inherit",
          height: "100%",
          boxShadow: "none",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "inherit",
            borderRadius: "10px",
          },
        }}
      >
        <Avatar
          sx={{ width: 25, height: 25, mt: 1 }}
          src={`https://countryflagsapi.com/svg/${sympol.sympol
            .substring(0, 2)
            .toLowerCase()}`}
        />
        {/* <CardMedia
        component="img"
        sx={{ width: 100, m: 2 }}
        image="https://picsum.photos/200"
        alt="Live from space album cover"
      /> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <CardContent
            sx={{
              flex: "1 0 auto",
              padding: "0 1rem !important",
              textAlign: "right",
            }}
          >
            <Typography component="div" variant="subtitle2">
              {sympol.sympol}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component="div"
            >
              {sympol.ar_name}
            </Typography>
            {/* <IconButton aria-label="previous">
              <FavoriteRoundedIcon />
            </IconButton> */}
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default CurrencyCard;

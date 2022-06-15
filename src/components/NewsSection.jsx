import React from "react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { connect } from "react-redux";
import theme from "../styles/Theme";
import { Link } from "react-router-dom";

const NewsSection = ({ currency, days }) => {
  return (
    <Box
      sx={{
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
      {Object.keys(days).map((day) => {
        return (
          <Box key={day} sx={{ my: 3, pr: 1 }}>
            <Typography
              textAlign="center"
              sx={{ color: theme.palette.grey.dark }}
              variant="subtitle2"
            >
              {day}
            </Typography>
            {currency.news.map((news) => {
              if (news.date === day)
                return (
                  <Link
                    key={news.id}
                    to={`/news/${news.id}/${news.header.split(" ").join("_")}`}
                  >
                    <Box
                      sx={{
                        my: 2,
                        p: 3,
                        border: `1px solid ${theme.palette.grey.main}`,
                        borderRadius: 5,
                      }}
                    >
                      <Typography
                        sx={{ marginBottom: 2 }}
                        color="primary"
                        component="h2"
                        variant="h4"
                      >
                        {news.header}
                      </Typography>
                      <Typography component="p" variant="subtitle1">
                        {news.body1}
                      </Typography>
                    </Box>
                  </Link>
                );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default NewsSection;
